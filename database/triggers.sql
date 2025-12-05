-- Online Bookstore Triggers
-- MS SQL Server Compatible

USE OnlineBookstore;
GO

-- Drop existing triggers if they exist
IF OBJECT_ID('trg_PreventNegativeStock', 'TR') IS NOT NULL DROP TRIGGER trg_PreventNegativeStock;
IF OBJECT_ID('trg_AutoReorder', 'TR') IS NOT NULL DROP TRIGGER trg_AutoReorder;
GO

-- =============================================================
-- TRIGGER 1: Prevent Negative Stock
-- This trigger prevents any update that would result in negative stock
-- =============================================================
CREATE TRIGGER trg_PreventNegativeStock
ON Books
AFTER UPDATE
AS
BEGIN
    SET NOCOUNT ON;
    
    -- Check if any updated row has negative stock
    IF EXISTS (SELECT 1 FROM inserted WHERE QuantityInStock < 0)
    BEGIN
        RAISERROR ('Cannot reduce stock below zero. Transaction rolled back.', 16, 1);
        ROLLBACK TRANSACTION;
        RETURN;
    END
END;
GO

PRINT 'Trigger trg_PreventNegativeStock created successfully';
GO

-- =============================================================
-- TRIGGER 2: Auto-Reorder When Stock Falls Below Threshold
-- When stock changes from >= threshold to < threshold, 
-- automatically create a publisher order for that book
-- =============================================================
CREATE TRIGGER trg_AutoReorder
ON Books
AFTER UPDATE
AS
BEGIN
    SET NOCOUNT ON;
    
    DECLARE @ReorderQty INT = 50; -- Default reorder quantity
    
    -- Check each book that crossed below the threshold
    -- Only trigger when: OLD quantity >= threshold AND NEW quantity < threshold
    INSERT INTO PublisherOrders (PublisherID, OrderDate, Status, TotalAmount)
    SELECT DISTINCT
        i.PublisherID,
        GETDATE(),
        'Pending',
        i.SellingPrice * @ReorderQty
    FROM inserted i
    INNER JOIN deleted d ON i.ISBN = d.ISBN
    WHERE d.QuantityInStock >= i.ReorderThreshold
      AND i.QuantityInStock < i.ReorderThreshold
      -- Avoid duplicate pending orders for the same book
      AND NOT EXISTS (
          SELECT 1 
          FROM PublisherOrders po
          INNER JOIN PublisherOrderItems poi ON po.PubOrderID = poi.PubOrderID
          WHERE poi.ISBN = i.ISBN AND po.Status = 'Pending'
      );
    
    -- Insert order items for the newly created orders
    INSERT INTO PublisherOrderItems (PubOrderID, ISBN, Quantity, UnitPrice)
    SELECT 
        po.PubOrderID,
        i.ISBN,
        @ReorderQty,
        i.SellingPrice
    FROM inserted i
    INNER JOIN deleted d ON i.ISBN = d.ISBN
    INNER JOIN PublisherOrders po ON po.PublisherID = i.PublisherID 
        AND po.Status = 'Pending'
        AND po.OrderDate >= DATEADD(SECOND, -5, GETDATE()) -- Match recently created orders
    WHERE d.QuantityInStock >= i.ReorderThreshold
      AND i.QuantityInStock < i.ReorderThreshold
      AND NOT EXISTS (
          SELECT 1 
          FROM PublisherOrderItems poi2
          WHERE poi2.ISBN = i.ISBN AND poi2.PubOrderID = po.PubOrderID
      );
END;
GO

PRINT 'Trigger trg_AutoReorder created successfully';
GO
