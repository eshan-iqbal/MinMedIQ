# 🏥 MinMedIQ Pharmacy Management System

A comprehensive pharmacy management system built with Next.js, featuring user management, inventory tracking, billing, and customer management.

## 🌐 Live Application

**MinMind Landing Page:** [https://minmediq.vercel.app/](https://minmediq.vercel.app/)
**MinMedIQ Application:** [https://minmediq.vercel.app/login](https://minmediq.vercel.app/login)

## 🚀 Features

- ✅ **MinMind Branding** - Professional company landing page
- ✅ **User Authentication** - JWT-based login system
- ✅ **Role-Based Access** - Admin, Chemist, and Drugist roles
- ✅ **Inventory Management** - Track medicines with pill/strip support
- ✅ **Billing System** - Generate bills with customer details
- ✅ **Customer Management** - Store and manage customer information
- ✅ **User Management** - Admin can create and manage users
- ✅ **Subscription System** - Unlimited plans (6 months/1 year)
- ✅ **Real-time Data** - Live updates and real-time clock
- ✅ **Bill Generation** - Print-friendly bill format
- ✅ **Pill-based Billing** - Sell individual pills from strips

## 🛠️ Technology Stack

- **Frontend:** Next.js 15, React 18, TypeScript
- **Styling:** Tailwind CSS, Shadcn/ui components
- **Database:** MongoDB Atlas
- **Authentication:** JWT tokens
- **Deployment:** Vercel
- **State Management:** React Context API

## 📋 Quick Start

### **For Users:**
1. Visit [https://minmediq.vercel.app/](https://minmediq.vercel.app/) to learn about MinMind
2. Click "Access MinMedIQ" to go to the application
3. Contact your administrator for login credentials
4. Start managing your pharmacy!

### **For Developers:**
1. Clone the repository
2. Install dependencies: `npm install`
3. Set up environment variables
4. Run development server: `npm run dev`
5. Deploy to Vercel: `npm run deploy`

## 🔧 Environment Variables

Create a `.env.local` file with:
```
MONGODB_URI=your_mongodb_connection_string
```

## 📊 Database Collections

- **users** - User accounts and authentication
- **inventory** - Medicine stock and details
- **customers** - Customer information
- **bills** - Generated bills and transactions
- **subscriptions** - Subscription plans and user assignments

## 🎯 User Roles

- **Admin:** Full access to all features, can manage users
- **Chemist:** Can manage inventory and billing
- **Drugist:** Can perform billing and view inventory

## 🚀 Deployment

The application is automatically deployed to Vercel and accessible at:
**https://minmediq.vercel.app/**

## 📞 Support

For support or questions, please refer to the application documentation or contact the development team.

---

**🎉 MinMedIQ - Streamlining Pharmacy Management!**
