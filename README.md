# MinMedIQ - Pharmacy Management System

A comprehensive pharmacy billing and inventory management software with authentication and subscription features.

## Features

### 🔐 Authentication System
- JWT-based authentication
- Role-based access control (Admin, Chemist, Drugist)
- Secure password hashing with bcrypt
- Protected routes and middleware

### 💳 Subscription Management
- Multiple subscription plans (Basic, Premium, Enterprise)
- Usage tracking and limits
- Billing history
- Auto-renewal and cancellation

### 👥 User Management
- Admin-only user creation
- Role management
- User listing and editing

### 📊 Core Features
- Dashboard with analytics
- Inventory management
- Customer management
- Billing system

## Tech Stack

- **Frontend**: Next.js 15, React 18, TypeScript
- **UI**: Tailwind CSS, Radix UI, Shadcn/ui
- **Backend**: Next.js API Routes
- **Database**: MongoDB
- **Authentication**: JWT, bcrypt
- **State Management**: React Context

## Prerequisites

- Node.js 18+ 
- MongoDB database
- npm or yarn

## Setup Instructions

### 1. Clone the Repository

```bash
git clone <repository-url>
cd MinMedIQ
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Environment Configuration

Create a `.env.local` file in the root directory:

```env
# MongoDB Configuration
MONGODB_URI=mongodb://localhost:27017/minmediq
MONGODB_DB=minmediq

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key-change-in-production

# Optional: Custom port for development
PORT=9002
```

### 4. Initialize Database

Run the database initialization script to create default subscription plans and admin user:

```bash
npm run init-db
```

This will create:
- Default subscription plans (Basic, Premium, Enterprise)
- Admin user with credentials:
  - Email: `admin@minmediq.com`
  - Password: `admin123`

### 5. Start Development Server

```bash
npm run dev
```

The application will be available at `http://localhost:9002`

## Usage

### Authentication

1. **Login**: Navigate to `/login` and use the admin credentials
2. **User Management**: Admins can create and manage users at `/users`
3. **Role Management**: Only admins can create new users and assign roles

### Subscription Management

1. **View Plans**: Available subscription plans are displayed on `/subscriptions`
2. **Subscribe**: Users can subscribe to plans based on their needs
3. **Usage Tracking**: Monitor usage against plan limits
4. **Billing**: View billing history and manage payments

### User Roles

- **Admin**: Full access to all features, can create users and manage subscriptions
- **Chemist**: Access to inventory and customer management
- **Drugist**: Limited access to basic features

## API Endpoints

### Authentication
- `POST /api/auth/login` - User login
- `POST /api/auth/register` - Create new user (admin only)
- `GET /api/auth/users` - List all users (admin only)
- `PUT /api/auth/users` - Update user role (admin only)
- `DELETE /api/auth/users` - Delete user (admin only)

### Subscriptions
- `GET /api/subscriptions/plans` - List subscription plans
- `POST /api/subscriptions/plans` - Create subscription plan (admin only)
- `GET /api/subscriptions/user` - Get user subscription
- `POST /api/subscriptions/user` - Create user subscription
- `PUT /api/subscriptions/user` - Update subscription (cancel/renew)

## Database Collections

- `users` - User accounts and authentication data
- `subscription_plans` - Available subscription plans
- `user_subscriptions` - User subscription data
- `billing_history` - Payment and billing records

## Security Features

- JWT token-based authentication
- Password hashing with bcrypt
- Role-based access control
- Protected API endpoints
- Input validation and sanitization

## Development

### Available Scripts

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint
npm run typecheck    # Run TypeScript type checking
npm run init-db      # Initialize database with default data
```

### Project Structure

```
src/
├── app/                    # Next.js app directory
│   ├── (app)/             # Protected app routes
│   ├── api/               # API routes
│   └── login/             # Login page
├── components/            # Reusable components
├── contexts/             # React contexts
├── lib/                  # Utility libraries
└── scripts/              # Database scripts
```

## Production Deployment

1. Set up environment variables for production
2. Build the application: `npm run build`
3. Start the production server: `npm run start`
4. Ensure MongoDB is properly configured
5. Set up proper JWT secrets

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is licensed under the MIT License.

## Support

For support and questions, please open an issue in the repository.
