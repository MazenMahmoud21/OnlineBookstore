# Online Bookstore Order Processing System

A full-stack web application for managing an online bookstore with customer ordering, admin management, and automatic stock replenishment features.

## Technology Stack

- **Frontend**: Next.js 15 (React 19) with TypeScript, Tailwind CSS
- **Backend**: Node.js with Express.js
- **Database**: MS SQL Server
- **Authentication**: JWT with refresh tokens
- **Styling**: Tailwind CSS with ShadCN-style components

## Features

### Customer Features
- 📚 Browse and search books by title, category, author, or publisher
- 🛒 Shopping cart management
- 💳 Checkout with simulated payment processing
- 📦 Order history viewing
- 👤 Profile management

### Admin Features
- 📊 Dashboard with sales statistics
- 📖 Book management (CRUD operations)
- 🏢 Publisher management
- 📋 Customer order viewing
- 🚚 Publisher order management with confirm/cancel actions
- 📈 Comprehensive reports:
  - Last month sales
  - Sales by specific date
  - Top 5 customers (last 3 months)
  - Top 10 selling books (last 3 months)
  - Book replenishment count

### System Features
- ⚡ Automatic stock reorder when inventory falls below threshold
- 🔒 Trigger to prevent negative stock
- 🔐 JWT authentication with token refresh
- 📱 Responsive design for mobile and desktop

## Project Structure

```
OnlineBookstore/
├── backend/                 # Node.js Express API
│   ├── config/             # Configuration files
│   ├── controllers/        # Request handlers
│   ├── db/                 # Database connection
│   ├── middleware/         # Auth & validation middleware
│   ├── routes/             # API routes
│   ├── server.js           # Entry point
│   ├── package.json
│   └── Dockerfile
├── frontend/               # Next.js React Application
│   ├── src/
│   │   ├── app/           # App router pages
│   │   ├── components/    # React components
│   │   ├── contexts/      # React contexts
│   │   ├── hooks/         # Custom hooks
│   │   ├── lib/           # Utilities
│   │   └── types/         # TypeScript types
│   ├── package.json
│   └── Dockerfile
├── database/               # SQL Server scripts
│   ├── schema.sql         # Database schema
│   ├── triggers.sql       # Database triggers
│   ├── procs.sql          # Stored procedures
│   └── seed.sql           # Sample data
└── docker-compose.yml      # Docker configuration
```

## Getting Started

### Prerequisites
- Node.js 18+ or 20+
- MS SQL Server (or use Docker)
- npm or yarn

### Option 1: Using Docker (Recommended)

1. Start all services:
```bash
docker-compose up -d
```

2. Initialize the database:
```bash
# Connect to SQL Server and run the scripts
docker exec -it <sql-container-id> /opt/mssql-tools18/bin/sqlcmd -S localhost -U sa -P YourPassword123! -C -d master -Q "CREATE DATABASE OnlineBookstore"
# Then run schema.sql, triggers.sql, procs.sql, and seed.sql
```

3. Access the application:
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:5000
   - API Documentation: http://localhost:5000/api-docs

### Option 2: Manual Setup

#### Database Setup

1. Create a database named `OnlineBookstore` in SQL Server
2. Run the SQL scripts in order:
   - `database/schema.sql`
   - `database/triggers.sql`
   - `database/procs.sql`
   - `database/seed.sql`

#### Backend Setup

1. Navigate to the backend directory:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Create `.env` file (copy from `.env.example`):
```bash
cp .env.example .env
```

4. Update the `.env` file with your database credentials:
```env
PORT=5000
NODE_ENV=development
DB_HOST=localhost
DB_PORT=1433
DB_USER=sa
DB_PASSWORD=your_password
DB_NAME=OnlineBookstore
JWT_SECRET=your-super-secret-key
JWT_REFRESH_SECRET=your-refresh-secret-key
JWT_EXPIRES_IN=15m
JWT_REFRESH_EXPIRES_IN=7d
REORDER_QTY=50
```

5. Start the server:
```bash
npm run dev
```

#### Frontend Setup

1. Navigate to the frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Create `.env.local` file:
```bash
echo "NEXT_PUBLIC_API_URL=http://localhost:5000/api/v1" > .env.local
```

4. Start the development server:
```bash
npm run dev
```

5. Open http://localhost:3000 in your browser

## Demo Accounts

After running the seed script, you can use these accounts:

| Role | Username | Password |
|------|----------|----------|
| Admin | admin | password123 |
| Customer | johndoe | password123 |
| Customer | janedoe | password123 |
| Customer | mikebrown | password123 |
| Customer | sarahwilson | password123 |
| Customer | davidlee | password123 |

## API Documentation

The API documentation is available at `/api-docs` when the backend server is running.

### Main Endpoints

#### Authentication
- `POST /api/v1/auth/signup` - Register new user
- `POST /api/v1/auth/login` - Login
- `POST /api/v1/auth/refresh` - Refresh token
- `POST /api/v1/auth/logout` - Logout

#### Books
- `GET /api/v1/books` - List books (with search/filter)
- `GET /api/v1/books/:isbn` - Get book details
- `POST /api/v1/books` - Create book (Admin)
- `PUT /api/v1/books/:isbn` - Update book (Admin)
- `DELETE /api/v1/books/:isbn` - Delete book (Admin)

#### Cart (Customer)
- `GET /api/v1/cart` - Get cart
- `POST /api/v1/cart/items` - Add to cart
- `PUT /api/v1/cart/items/:itemId` - Update quantity
- `DELETE /api/v1/cart/items/:itemId` - Remove item
- `POST /api/v1/cart/checkout` - Checkout

#### Orders
- `GET /api/v1/orders` - List orders
- `GET /api/v1/orders/:id` - Get order details

#### Publisher Orders (Admin)
- `GET /api/v1/publisher-orders` - List publisher orders
- `POST /api/v1/publisher-orders/:id/confirm` - Confirm order
- `POST /api/v1/publisher-orders/:id/cancel` - Cancel order

#### Reports (Admin)
- `GET /api/v1/reports/sales/previous-month` - Last month sales
- `GET /api/v1/reports/sales/by-date?date=YYYY-MM-DD` - Sales by date
- `GET /api/v1/reports/top-customers?months=3&top=5` - Top customers
- `GET /api/v1/reports/top-books?months=3&top=10` - Top selling books
- `GET /api/v1/reports/book-reorders/:isbn` - Book reorder count
- `GET /api/v1/reports/dashboard` - Dashboard summary

## Database Schema

### Main Tables
- **Users** - User accounts (Admin/Customer)
- **Books** - Book catalog
- **Authors** - Book authors
- **BookAuthors** - Many-to-many relationship
- **Publishers** - Book publishers
- **Categories** - Book categories (Science, Art, Religion, History, Geography)
- **ShoppingCarts** - Customer shopping carts
- **CartItems** - Items in shopping carts
- **CustomerOrders** - Customer purchase orders
- **CustomerOrderItems** - Items in customer orders
- **PublisherOrders** - Replenishment orders to publishers
- **PublisherOrderItems** - Items in publisher orders
- **RefreshTokens** - JWT refresh token management

### Triggers
1. **trg_PreventNegativeStock** - Prevents stock from going below zero
2. **trg_AutoReorder** - Automatically creates publisher order when stock falls below threshold

### Stored Procedures
1. **ConfirmPublisherOrder** - Confirms order and updates stock
2. **CheckoutCart** - Processes checkout, validates card, creates order
3. **GetTotalSalesByMonth** - Sales report by month
4. **GetTotalSalesByDate** - Sales report by date
5. **GetTopCustomers** - Top customers by purchases
6. **GetTopSellingBooks** - Top selling books
7. **GetTimesBookReordered** - Book replenishment count

## Demo Checklist

1. **Login as Admin** (username: admin, password: password123)
   - View dashboard statistics
   - Manage books (add, edit, delete)
   - View customer orders
   - Confirm/cancel publisher orders
   - View reports

2. **Login as Customer** (username: johndoe, password: password123)
   - Browse books
   - Add books to cart
   - Proceed to checkout
   - View order history
   - Update profile

3. **Test Auto-Reorder**
   - As admin, reduce a book's stock below its threshold
   - A new publisher order should be automatically created

## Security Notes

- Passwords are hashed using bcrypt
- JWT tokens have short expiration (15 minutes by default)
- Refresh tokens are stored server-side and can be revoked
- Credit card information is simulated; only last 4 digits are stored
- All admin endpoints require admin role verification

## License

MIT License
