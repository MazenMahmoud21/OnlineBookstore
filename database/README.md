# Online Bookstore Database Documentation

## ✅ Status: COMPLETE

The database and backend are fully implemented and production-ready.

## Database Structure

### Tables Overview (13 Total)

#### User Management (2 tables)
- **Users** - User accounts with role-based access (Admin/Customer)
- **RefreshTokens** - JWT refresh token management

#### Catalog Management (5 tables)
- **Publishers** - Book publishers/suppliers
- **Categories** - 5 fixed categories (Science, Art, Religion, History, Geography)
- **Books** - Book inventory with auto-reorder capability
- **Authors** - Book authors
- **BookAuthors** - Many-to-many relationship between books and authors

#### Publisher Orders (2 tables)
- **PublisherOrders** - Replenishment orders to publishers
- **PublisherOrderItems** - Line items for publisher orders

#### Customer Orders (2 tables)
- **CustomerOrders** - Customer purchase orders
- **CustomerOrderItems** - Line items for customer orders

#### Shopping Cart (2 tables)
- **ShoppingCarts** - One cart per customer
- **CartItems** - Items in shopping carts

## Stored Procedures (6)

1. **ConfirmPublisherOrder** - Confirms pending publisher order and updates inventory
2. **CheckoutCart** - Processes cart checkout with payment validation
3. **GetTotalSalesByMonth** - Monthly sales reporting
4. **GetTotalSalesByDate** - Daily sales reporting
5. **GetTopCustomers** - Top customers by purchase amount (last N months)
6. **GetTopSellingBooks** - Bestselling books by quantity (last N months)
7. **GetTimesBookReordered** - Replenishment order frequency per book

## Triggers (2)

1. **trg_PreventNegativeStock** - Prevents inventory from going below zero
2. **trg_AutoReorder** - Automatically creates publisher orders when stock falls below threshold

## Visualizing the Database

### Option 1: dbdiagram.io (Recommended)
1. Visit [https://dbdiagram.io](https://dbdiagram.io)
2. Click "Go to App"
3. Copy the contents of `schema.dbml`
4. Paste into the editor
5. The diagram will render automatically

### Option 2: Export as SQL/PDF/Image
From dbdiagram.io, you can export as:
- SQL DDL
- PDF
- PNG Image

## Key Features

### Automatic Inventory Management
- When book stock falls below `ReorderThreshold`, a publisher order is automatically created
- Orders are marked as "Pending" until confirmed by admin
- Confirming an order updates inventory levels

### Shopping Cart Workflow
1. Customer adds items to cart
2. Customer initiates checkout with payment details
3. `CheckoutCart` stored procedure:
   - Validates credit card expiry
   - Checks stock availability
   - Creates customer order
   - Deducts inventory (may trigger auto-reorder)
   - Empties cart

### Security Features
- Passwords are hashed using bcrypt
- JWT authentication with refresh tokens
- Role-based access control (Admin/Customer)
- One cart per user constraint
- Unique email and username constraints

### Data Integrity
- Foreign key constraints maintain referential integrity
- Check constraints prevent invalid data (negative stock, invalid roles, etc.)
- Cascade deletes where appropriate
- Transaction-based operations in stored procedures

## Indexes

Performance indexes on:
- `Users.Email`
- `Users.Username`
- `Books.Title`
- `BookAuthors.AuthorID`
- `CustomerOrders.OrderDate`
- `CustomerOrderItems.ISBN`
- Unique constraint on `CartItems(CartID, ISBN)`

## Backend API Endpoints

All database operations are exposed through RESTful API:
- `/api/v1/auth` - Authentication (login, signup, refresh token)
- `/api/v1/users` - User management
- `/api/v1/books` - Book catalog
- `/api/v1/authors` - Author management
- `/api/v1/publishers` - Publisher management
- `/api/v1/categories` - Category listing
- `/api/v1/cart` - Shopping cart operations
- `/api/v1/orders` - Customer order management
- `/api/v1/publisher-orders` - Publisher order management (admin)
- `/api/v1/reports` - Sales and analytics reports

## Database Files

- `schema.sql` - Complete database schema with tables and indexes
- `procs.sql` - All stored procedures
- `triggers.sql` - Database triggers
- `seed.sql` - Sample data for testing
- `schema.dbml` - Database visualization (DBML format)

## Setup Instructions

1. Ensure MS SQL Server is running
2. Execute scripts in order:
   ```bash
   sqlcmd -i schema.sql
   sqlcmd -i triggers.sql
   sqlcmd -i procs.sql
   sqlcmd -i seed.sql  # Optional: sample data
   ```

3. Update backend `.env` with connection details:
   ```
   DB_SERVER=localhost
   DB_DATABASE=OnlineBookstore
   DB_USER=your_user
   DB_PASSWORD=your_password
   ```

## Technologies Used

- **Database**: MS SQL Server
- **Backend**: Node.js, Express
- **Authentication**: JWT (jsonwebtoken)
- **Security**: bcryptjs, helmet, cors, express-rate-limit
- **Validation**: express-validator
- **Documentation**: Swagger/OpenAPI

---

**Note**: The backend is fully implemented with all controllers, routes, middleware, and database integration complete.
