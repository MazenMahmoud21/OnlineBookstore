-- Online Bookstore Seed Data
-- MS SQL Server Compatible

USE OnlineBookstore;
GO

-- Clear existing data (in correct order)
DELETE FROM CartItems;
DELETE FROM ShoppingCarts;
DELETE FROM CustomerOrderItems;
DELETE FROM CustomerOrders;
DELETE FROM PublisherOrderItems;
DELETE FROM PublisherOrders;
DELETE FROM BookAuthors;
DELETE FROM Authors;
DELETE FROM Books;
DELETE FROM Categories;
DELETE FROM Publishers;
DELETE FROM RefreshTokens;
DELETE FROM Users;
GO

-- Reset Identity Seeds
DBCC CHECKIDENT ('Users', RESEED, 0);
DBCC CHECKIDENT ('Publishers', RESEED, 0);
DBCC CHECKIDENT ('Categories', RESEED, 0);
DBCC CHECKIDENT ('Authors', RESEED, 0);
DBCC CHECKIDENT ('PublisherOrders', RESEED, 0);
DBCC CHECKIDENT ('PublisherOrderItems', RESEED, 0);
DBCC CHECKIDENT ('CustomerOrders', RESEED, 0);
DBCC CHECKIDENT ('CustomerOrderItems', RESEED, 0);
DBCC CHECKIDENT ('ShoppingCarts', RESEED, 0);
DBCC CHECKIDENT ('CartItems', RESEED, 0);
GO

-- =============================================================
-- Insert Users (Admin and Customers)
-- Password: 'password123' hashed with bcrypt
-- =============================================================
INSERT INTO Users (Username, PasswordHash, Role, FirstName, LastName, Email, Phone, ShippingAddress) VALUES
('admin', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'Admin', 'Admin', 'User', 'admin@bookstore.com', '555-0100', '123 Admin St, City, State 12345'),
('johndoe', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'Customer', 'John', 'Doe', 'john.doe@email.com', '555-0101', '456 Oak Ave, Springfield, IL 62701'),
('janedoe', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'Customer', 'Jane', 'Doe', 'jane.doe@email.com', '555-0102', '789 Maple Dr, Chicago, IL 60601'),
('mikebrown', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'Customer', 'Mike', 'Brown', 'mike.brown@email.com', '555-0103', '321 Pine Rd, Boston, MA 02101'),
('sarahwilson', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'Customer', 'Sarah', 'Wilson', 'sarah.wilson@email.com', '555-0104', '654 Elm St, Seattle, WA 98101'),
('davidlee', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'Customer', 'David', 'Lee', 'david.lee@email.com', '555-0105', '987 Cedar Ln, Austin, TX 78701');
GO

-- =============================================================
-- Insert Publishers
-- =============================================================
INSERT INTO Publishers (Name, Address, Phone) VALUES
('Penguin Random House', '1745 Broadway, New York, NY 10019', '212-782-9000'),
('HarperCollins', '195 Broadway, New York, NY 10007', '212-207-7000'),
('Simon & Schuster', '1230 Avenue of the Americas, New York, NY 10020', '212-698-7000'),
('Macmillan Publishers', '120 Broadway, New York, NY 10271', '646-307-5151'),
('Hachette Book Group', '1290 Avenue of the Americas, New York, NY 10104', '212-364-1100'),
('Oxford University Press', '198 Madison Avenue, New York, NY 10016', '212-726-6000'),
('Cambridge University Press', '1 Liberty Plaza, New York, NY 10006', '212-337-5000'),
('Wiley', '111 River Street, Hoboken, NJ 07030', '201-748-6000'),
('Springer Nature', '1 New York Plaza, New York, NY 10004', '212-460-1500'),
('Elsevier', '230 Park Avenue, New York, NY 10169', '212-633-3730');
GO

-- =============================================================
-- Insert Categories
-- =============================================================
INSERT INTO Categories (CategoryName) VALUES
('Science'),
('Art'),
('Religion'),
('History'),
('Geography');
GO

-- =============================================================
-- Insert Authors
-- =============================================================
INSERT INTO Authors (Name) VALUES
('Stephen Hawking'),
('Carl Sagan'),
('Richard Dawkins'),
('Neil deGrasse Tyson'),
('E.H. Gombrich'),
('Karen Armstrong'),
('Yuval Noah Harari'),
('Jared Diamond'),
('David McCullough'),
('Doris Kearns Goodwin'),
('Simon Winchester'),
('Bill Bryson'),
('Mary Beard'),
('Howard Zinn'),
('Walter Isaacson'),
('Malcolm Gladwell'),
('Temple Grandin'),
('Oliver Sacks'),
('Michio Kaku'),
('Brian Greene');
GO

-- =============================================================
-- Insert Books
-- =============================================================
INSERT INTO Books (ISBN, Title, PublisherID, PublicationYear, SellingPrice, CategoryID, QuantityInStock, ReorderThreshold) VALUES
-- Science Books
('978-0553380163', 'A Brief History of Time', 1, 1988, 18.00, 1, 45, 10),
('978-0345539434', 'Cosmos', 1, 1980, 17.00, 1, 60, 15),
('978-0618056736', 'The Selfish Gene', 2, 1976, 16.00, 1, 30, 10),
('978-0393609394', 'Astrophysics for People in a Hurry', 3, 2017, 15.00, 1, 75, 20),
('978-0307275066', 'A Short History of Nearly Everything', 4, 2003, 18.00, 1, 55, 15),
('978-0393350395', 'The Elegant Universe', 3, 1999, 17.99, 1, 40, 10),
('978-0385533218', 'The Future of the Mind', 5, 2014, 17.00, 1, 35, 10),
('978-0544272996', 'The Gene', 4, 2016, 18.00, 1, 28, 8),

-- Art Books
('978-0714832470', 'The Story of Art', 6, 1950, 39.95, 2, 25, 8),
('978-0500238783', 'Ways of Seeing', 6, 1972, 14.95, 2, 38, 10),
('978-0714847030', 'Art: A World History', 6, 2003, 35.00, 2, 20, 5),
('978-0500287163', 'The Art Book', 6, 1994, 24.95, 2, 42, 12),

-- Religion Books
('978-0060855888', 'A History of God', 2, 1993, 18.99, 3, 32, 10),
('978-0345409836', 'The Case for God', 2, 2009, 17.00, 3, 48, 12),
('978-0061571282', 'The Great Transformation', 2, 2006, 17.99, 3, 22, 8),

-- History Books
('978-0062316110', 'Sapiens', 2, 2014, 22.99, 4, 100, 25),
('978-0062316172', 'Homo Deus', 2, 2017, 22.99, 4, 65, 15),
('978-0393317558', 'Guns, Germs, and Steel', 3, 1997, 18.95, 4, 52, 12),
('978-0743223133', 'John Adams', 3, 2001, 22.00, 4, 30, 8),
('978-0684824901', 'Truman', 3, 1992, 25.00, 4, 18, 5),
('978-0060838584', 'Team of Rivals', 3, 2005, 21.99, 4, 45, 10),
('978-0060838676', 'SPQR: A History of Ancient Rome', 4, 2015, 18.00, 4, 38, 10),
('978-0060528427', 'A Peoples History of the United States', 2, 1980, 19.99, 4, 28, 8),

-- Geography Books
('978-0060838720', 'The Map That Changed the World', 2, 2001, 16.99, 5, 33, 10),
('978-0767908184', 'A Walk in the Woods', 4, 1998, 15.99, 5, 55, 15),
('978-0062413413', 'The Geography of Genius', 3, 2016, 16.99, 5, 24, 8);
GO

-- =============================================================
-- Insert BookAuthors (Many-to-Many relationships)
-- =============================================================
INSERT INTO BookAuthors (ISBN, AuthorID) VALUES
-- Science Books
('978-0553380163', 1),  -- A Brief History of Time - Stephen Hawking
('978-0345539434', 2),  -- Cosmos - Carl Sagan
('978-0618056736', 3),  -- The Selfish Gene - Richard Dawkins
('978-0393609394', 4),  -- Astrophysics for People in a Hurry - Neil deGrasse Tyson
('978-0307275066', 12), -- A Short History of Nearly Everything - Bill Bryson
('978-0393350395', 20), -- The Elegant Universe - Brian Greene
('978-0385533218', 19), -- The Future of the Mind - Michio Kaku
('978-0544272996', 17), -- The Gene - Temple Grandin (approximation)

-- Art Books
('978-0714832470', 5),  -- The Story of Art - E.H. Gombrich
('978-0500238783', 5),  -- Ways of Seeing - E.H. Gombrich (using same author for demo)
('978-0714847030', 5),  -- Art: A World History
('978-0500287163', 5),  -- The Art Book

-- Religion Books
('978-0060855888', 6),  -- A History of God - Karen Armstrong
('978-0345409836', 6),  -- The Case for God - Karen Armstrong
('978-0061571282', 6),  -- The Great Transformation - Karen Armstrong

-- History Books
('978-0062316110', 7),  -- Sapiens - Yuval Noah Harari
('978-0062316172', 7),  -- Homo Deus - Yuval Noah Harari
('978-0393317558', 8),  -- Guns, Germs, and Steel - Jared Diamond
('978-0743223133', 9),  -- John Adams - David McCullough
('978-0684824901', 9),  -- Truman - David McCullough
('978-0060838584', 10), -- Team of Rivals - Doris Kearns Goodwin
('978-0060838676', 13), -- SPQR - Mary Beard
('978-0060528427', 14), -- A Peoples History - Howard Zinn

-- Geography Books
('978-0060838720', 11), -- The Map That Changed the World - Simon Winchester
('978-0767908184', 12), -- A Walk in the Woods - Bill Bryson
('978-0062413413', 16); -- The Geography of Genius - Malcolm Gladwell
GO

-- =============================================================
-- Insert Shopping Carts for Customers
-- =============================================================
INSERT INTO ShoppingCarts (UserID) VALUES
(2),  -- johndoe
(3),  -- janedoe
(4),  -- mikebrown
(5),  -- sarahwilson
(6);  -- davidlee
GO

-- =============================================================
-- Insert some Cart Items (sample items in carts)
-- =============================================================
INSERT INTO CartItems (CartID, ISBN, Quantity) VALUES
(1, '978-0553380163', 2),  -- johndoe has 2 copies of A Brief History of Time
(1, '978-0062316110', 1),  -- johndoe has 1 copy of Sapiens
(2, '978-0714832470', 1),  -- janedoe has 1 copy of The Story of Art
(3, '978-0060855888', 1);  -- mikebrown has 1 copy of A History of God
GO

-- =============================================================
-- Insert Sample Customer Orders (Past orders)
-- =============================================================
-- Orders from last 3 months
INSERT INTO CustomerOrders (UserID, OrderDate, TotalAmount, CreditCardLast4, CreditCardExpiry, Status) VALUES
-- Recent orders (last month)
(2, DATEADD(DAY, -5, GETDATE()), 54.99, '1234', '2026-12-31', 'Completed'),
(3, DATEADD(DAY, -7, GETDATE()), 39.95, '5678', '2025-06-30', 'Completed'),
(4, DATEADD(DAY, -10, GETDATE()), 79.94, '9012', '2027-03-31', 'Completed'),
(5, DATEADD(DAY, -15, GETDATE()), 45.98, '3456', '2026-09-30', 'Completed'),
(2, DATEADD(DAY, -20, GETDATE()), 68.97, '1234', '2026-12-31', 'Completed'),
-- Older orders (2-3 months ago)
(3, DATEADD(MONTH, -2, GETDATE()), 88.95, '5678', '2025-06-30', 'Completed'),
(6, DATEADD(MONTH, -2, DATEADD(DAY, -5, GETDATE())), 35.98, '7890', '2026-04-30', 'Completed'),
(2, DATEADD(MONTH, -3, GETDATE()), 22.99, '1234', '2026-12-31', 'Completed'),
(4, DATEADD(MONTH, -3, DATEADD(DAY, -10, GETDATE())), 56.97, '9012', '2027-03-31', 'Completed');
GO

-- =============================================================
-- Insert Sample Customer Order Items
-- =============================================================
INSERT INTO CustomerOrderItems (CustOrderID, ISBN, Quantity, UnitPrice) VALUES
-- Order 1 (johndoe, $54.99)
(1, '978-0553380163', 1, 18.00),
(1, '978-0345539434', 1, 17.00),
(1, '978-0393609394', 1, 15.00),

-- Order 2 (janedoe, $39.95)
(2, '978-0714832470', 1, 39.95),

-- Order 3 (mikebrown, $79.94)
(3, '978-0062316110', 2, 22.99),
(3, '978-0393317558', 1, 18.95),
(3, '978-0060838584', 1, 21.99),

-- Order 4 (sarahwilson, $45.98)
(4, '978-0062316110', 1, 22.99),
(4, '978-0062316172', 1, 22.99),

-- Order 5 (johndoe, $68.97)
(5, '978-0060855888', 1, 18.99),
(5, '978-0345409836', 1, 17.00),
(5, '978-0714832470', 1, 39.95),

-- Order 6 (janedoe, $88.95)
(6, '978-0393350395', 2, 17.99),
(6, '978-0385533218', 1, 17.00),
(6, '978-0544272996', 1, 18.00),

-- Order 7 (davidlee, $35.98)
(7, '978-0618056736', 1, 16.00),
(7, '978-0393609394', 1, 15.00),

-- Order 8 (johndoe, $22.99)
(8, '978-0062316110', 1, 22.99),

-- Order 9 (mikebrown, $56.97)
(9, '978-0060838584', 1, 21.99),
(9, '978-0500238783', 1, 14.95),
(9, '978-0060838720', 1, 16.99);
GO

-- =============================================================
-- Insert Sample Publisher Orders (Replenishment orders)
-- =============================================================
INSERT INTO PublisherOrders (PublisherID, OrderDate, Status, TotalAmount) VALUES
(1, DATEADD(DAY, -30, GETDATE()), 'Confirmed', 900.00),
(2, DATEADD(DAY, -25, GETDATE()), 'Confirmed', 850.00),
(3, DATEADD(DAY, -15, GETDATE()), 'Pending', 750.00),
(4, DATEADD(DAY, -10, GETDATE()), 'Pending', 900.00);
GO

-- =============================================================
-- Insert Sample Publisher Order Items
-- =============================================================
INSERT INTO PublisherOrderItems (PubOrderID, ISBN, Quantity, UnitPrice) VALUES
-- Order 1 (Penguin Random House, Confirmed)
(1, '978-0553380163', 50, 18.00),

-- Order 2 (HarperCollins, Confirmed)
(2, '978-0062316110', 50, 17.00),

-- Order 3 (Simon & Schuster, Pending)
(3, '978-0393609394', 50, 15.00),

-- Order 4 (Macmillan Publishers, Pending)
(4, '978-0307275066', 50, 18.00);
GO

PRINT 'Seed data inserted successfully!';
PRINT '';
PRINT 'Demo Accounts:';
PRINT '  Admin: username=admin, password=password123';
PRINT '  Customer: username=johndoe, password=password123';
PRINT '  Customer: username=janedoe, password=password123';
PRINT '  Customer: username=mikebrown, password=password123';
PRINT '  Customer: username=sarahwilson, password=password123';
PRINT '  Customer: username=davidlee, password=password123';
GO
