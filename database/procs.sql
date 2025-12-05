-- Online Bookstore Stored Procedures
-- MS SQL Server Compatible

USE OnlineBookstore;
GO

-- Drop existing procedures if they exist
IF OBJECT_ID('ConfirmPublisherOrder', 'P') IS NOT NULL DROP PROCEDURE ConfirmPublisherOrder;
IF OBJECT_ID('CheckoutCart', 'P') IS NOT NULL DROP PROCEDURE CheckoutCart;
IF OBJECT_ID('GetTotalSalesByMonth', 'P') IS NOT NULL DROP PROCEDURE GetTotalSalesByMonth;
IF OBJECT_ID('GetTotalSalesByDate', 'P') IS NOT NULL DROP PROCEDURE GetTotalSalesByDate;
IF OBJECT_ID('GetTopCustomers', 'P') IS NOT NULL DROP PROCEDURE GetTopCustomers;
IF OBJECT_ID('GetTopSellingBooks', 'P') IS NOT NULL DROP PROCEDURE GetTopSellingBooks;
IF OBJECT_ID('GetTimesBookReordered', 'P') IS NOT NULL DROP PROCEDURE GetTimesBookReordered;
GO

-- =============================================================
-- PROCEDURE: ConfirmPublisherOrder
-- Confirms a pending publisher order and updates book stock
-- =============================================================
CREATE PROCEDURE ConfirmPublisherOrder
    @PubOrderID INT
AS
BEGIN
    SET NOCOUNT ON;
    
    BEGIN TRY
        BEGIN TRANSACTION;
        
        -- Check if order exists and is pending
        IF NOT EXISTS (SELECT 1 FROM PublisherOrders WHERE PubOrderID = @PubOrderID AND Status = 'Pending')
        BEGIN
            RAISERROR ('Order not found or not in Pending status', 16, 1);
            ROLLBACK TRANSACTION;
            RETURN;
        END
        
        -- Temporarily disable the auto-reorder trigger to prevent recursion
        -- Update stock for all items in the order
        UPDATE b
        SET b.QuantityInStock = b.QuantityInStock + poi.Quantity
        FROM Books b
        INNER JOIN PublisherOrderItems poi ON b.ISBN = poi.ISBN
        WHERE poi.PubOrderID = @PubOrderID;
        
        -- Update order status to Confirmed
        UPDATE PublisherOrders
        SET Status = 'Confirmed'
        WHERE PubOrderID = @PubOrderID;
        
        COMMIT TRANSACTION;
        
        SELECT 'Order confirmed successfully' AS Message, @PubOrderID AS OrderID;
    END TRY
    BEGIN CATCH
        IF @@TRANCOUNT > 0
            ROLLBACK TRANSACTION;
        
        DECLARE @ErrorMessage NVARCHAR(4000) = ERROR_MESSAGE();
        RAISERROR (@ErrorMessage, 16, 1);
    END CATCH
END;
GO

PRINT 'Procedure ConfirmPublisherOrder created successfully';
GO

-- =============================================================
-- PROCEDURE: CheckoutCart
-- Validates card, creates customer order, deducts stock, empties cart
-- =============================================================
CREATE PROCEDURE CheckoutCart
    @UserID INT,
    @CardNumber NVARCHAR(20),
    @CardExpiry DATE
AS
BEGIN
    SET NOCOUNT ON;
    
    DECLARE @CartID INT;
    DECLARE @TotalAmount DECIMAL(12, 2);
    DECLARE @OrderID INT;
    
    BEGIN TRY
        BEGIN TRANSACTION;
        
        -- Validate card expiry (must be in the future)
        IF @CardExpiry < CAST(GETDATE() AS DATE)
        BEGIN
            RAISERROR ('Credit card has expired', 16, 1);
            ROLLBACK TRANSACTION;
            RETURN;
        END
        
        -- Get user's cart
        SELECT @CartID = CartID FROM ShoppingCarts WHERE UserID = @UserID;
        
        IF @CartID IS NULL
        BEGIN
            RAISERROR ('Shopping cart not found', 16, 1);
            ROLLBACK TRANSACTION;
            RETURN;
        END
        
        -- Check if cart has items
        IF NOT EXISTS (SELECT 1 FROM CartItems WHERE CartID = @CartID)
        BEGIN
            RAISERROR ('Shopping cart is empty', 16, 1);
            ROLLBACK TRANSACTION;
            RETURN;
        END
        
        -- Check stock availability for all items
        IF EXISTS (
            SELECT 1 
            FROM CartItems ci
            INNER JOIN Books b ON ci.ISBN = b.ISBN
            WHERE ci.CartID = @CartID AND b.QuantityInStock < ci.Quantity
        )
        BEGIN
            RAISERROR ('Insufficient stock for one or more items', 16, 1);
            ROLLBACK TRANSACTION;
            RETURN;
        END
        
        -- Calculate total amount
        SELECT @TotalAmount = SUM(ci.Quantity * b.SellingPrice)
        FROM CartItems ci
        INNER JOIN Books b ON ci.ISBN = b.ISBN
        WHERE ci.CartID = @CartID;
        
        -- Create customer order
        INSERT INTO CustomerOrders (UserID, OrderDate, TotalAmount, CreditCardLast4, CreditCardExpiry, Status)
        VALUES (@UserID, GETDATE(), @TotalAmount, RIGHT(@CardNumber, 4), @CardExpiry, 'Completed');
        
        SET @OrderID = SCOPE_IDENTITY();
        
        -- Create order items
        INSERT INTO CustomerOrderItems (CustOrderID, ISBN, Quantity, UnitPrice)
        SELECT @OrderID, ci.ISBN, ci.Quantity, b.SellingPrice
        FROM CartItems ci
        INNER JOIN Books b ON ci.ISBN = b.ISBN
        WHERE ci.CartID = @CartID;
        
        -- Deduct stock (this may trigger auto-reorder if stock falls below threshold)
        UPDATE b
        SET b.QuantityInStock = b.QuantityInStock - ci.Quantity
        FROM Books b
        INNER JOIN CartItems ci ON b.ISBN = ci.ISBN
        WHERE ci.CartID = @CartID;
        
        -- Empty the cart
        DELETE FROM CartItems WHERE CartID = @CartID;
        
        COMMIT TRANSACTION;
        
        SELECT 'Checkout successful' AS Message, @OrderID AS OrderID, @TotalAmount AS TotalAmount;
    END TRY
    BEGIN CATCH
        IF @@TRANCOUNT > 0
            ROLLBACK TRANSACTION;
        
        DECLARE @ErrorMessage NVARCHAR(4000) = ERROR_MESSAGE();
        RAISERROR (@ErrorMessage, 16, 1);
    END CATCH
END;
GO

PRINT 'Procedure CheckoutCart created successfully';
GO

-- =============================================================
-- PROCEDURE: GetTotalSalesByMonth
-- Returns total sales amount for a specific month
-- =============================================================
CREATE PROCEDURE GetTotalSalesByMonth
    @Year INT,
    @Month INT
AS
BEGIN
    SET NOCOUNT ON;
    
    SELECT 
        @Year AS Year,
        @Month AS Month,
        ISNULL(SUM(TotalAmount), 0) AS TotalSales,
        COUNT(*) AS NumberOfOrders
    FROM CustomerOrders
    WHERE YEAR(OrderDate) = @Year AND MONTH(OrderDate) = @Month;
END;
GO

PRINT 'Procedure GetTotalSalesByMonth created successfully';
GO

-- =============================================================
-- PROCEDURE: GetTotalSalesByDate
-- Returns total sales amount for a specific date
-- =============================================================
CREATE PROCEDURE GetTotalSalesByDate
    @Date DATE
AS
BEGIN
    SET NOCOUNT ON;
    
    SELECT 
        @Date AS Date,
        ISNULL(SUM(TotalAmount), 0) AS TotalSales,
        COUNT(*) AS NumberOfOrders
    FROM CustomerOrders
    WHERE CAST(OrderDate AS DATE) = @Date;
END;
GO

PRINT 'Procedure GetTotalSalesByDate created successfully';
GO

-- =============================================================
-- PROCEDURE: GetTopCustomers
-- Returns top N customers by purchase amount in last X months
-- =============================================================
CREATE PROCEDURE GetTopCustomers
    @Months INT = 3,
    @TopN INT = 5
AS
BEGIN
    SET NOCOUNT ON;
    
    SELECT TOP (@TopN)
        u.UserID,
        u.Username,
        u.FirstName,
        u.LastName,
        u.Email,
        SUM(co.TotalAmount) AS TotalPurchases,
        COUNT(co.CustOrderID) AS OrderCount
    FROM Users u
    INNER JOIN CustomerOrders co ON u.UserID = co.UserID
    WHERE co.OrderDate >= DATEADD(MONTH, -@Months, GETDATE())
    GROUP BY u.UserID, u.Username, u.FirstName, u.LastName, u.Email
    ORDER BY TotalPurchases DESC;
END;
GO

PRINT 'Procedure GetTopCustomers created successfully';
GO

-- =============================================================
-- PROCEDURE: GetTopSellingBooks
-- Returns top N selling books by quantity in last X months
-- =============================================================
CREATE PROCEDURE GetTopSellingBooks
    @Months INT = 3,
    @TopN INT = 10
AS
BEGIN
    SET NOCOUNT ON;
    
    SELECT TOP (@TopN)
        b.ISBN,
        b.Title,
        p.Name AS PublisherName,
        c.CategoryName,
        SUM(coi.Quantity) AS TotalQuantitySold,
        SUM(coi.Quantity * coi.UnitPrice) AS TotalRevenue
    FROM Books b
    INNER JOIN CustomerOrderItems coi ON b.ISBN = coi.ISBN
    INNER JOIN CustomerOrders co ON coi.CustOrderID = co.CustOrderID
    INNER JOIN Publishers p ON b.PublisherID = p.PublisherID
    INNER JOIN Categories c ON b.CategoryID = c.CategoryID
    WHERE co.OrderDate >= DATEADD(MONTH, -@Months, GETDATE())
    GROUP BY b.ISBN, b.Title, p.Name, c.CategoryName
    ORDER BY TotalQuantitySold DESC;
END;
GO

PRINT 'Procedure GetTopSellingBooks created successfully';
GO

-- =============================================================
-- PROCEDURE: GetTimesBookReordered
-- Returns number of replenishment orders for a specific book
-- =============================================================
CREATE PROCEDURE GetTimesBookReordered
    @ISBN NVARCHAR(20)
AS
BEGIN
    SET NOCOUNT ON;
    
    SELECT 
        @ISBN AS ISBN,
        b.Title,
        COUNT(poi.PubOrderItemID) AS TimesReordered,
        SUM(poi.Quantity) AS TotalQuantityReordered
    FROM Books b
    LEFT JOIN PublisherOrderItems poi ON b.ISBN = poi.ISBN
    WHERE b.ISBN = @ISBN
    GROUP BY b.ISBN, b.Title;
END;
GO

PRINT 'Procedure GetTimesBookReordered created successfully';
GO

PRINT 'All stored procedures created successfully!';
GO
