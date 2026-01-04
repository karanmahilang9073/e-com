# 🛍️ E-Commerce App Setup Guide

## ✅ Quick Start

### **Backend Setup**
```bash
cd backend
npm install
npm start
```

### **Frontend Setup**
```bash
cd frontend
npm install
npm run dev
```

---

## 👨‍💼 Admin Account Setup

### **Option 1: Admin Registration with Secret Key ✨ (RECOMMENDED)**

Create admin accounts using a secret key for security.

**Steps:**

1. **Set Admin Secret Key** (in backend `.env` or use default):
```
ADMIN_SECRET=admin123
```

2. **Go to Sign Up** page
3. **Click "Admin Registration"** toggle button
4. **Fill the form:**
   - Name
   - Email
   - Password
   - Admin Secret Key (from step 1)
5. **Submit** → Admin account created! 🔐

**What you see:**
- Purple toggle button to switch between Regular/Admin signup
- Admin secret key input field
- Purple "Create Account" button in admin mode

### **How to Create Multiple Admins:**

Simply repeat the admin registration process with the same secret key. Anyone with the key can create an admin account.

**Secure the secret key!** Store it in `.env` file (don't commit to git):
```
# .env
ADMIN_SECRET=your_secret_key_here
```

### **Admin Features:**
- ➕ Add new products
- ✏️ Edit existing products
- 🗑️ Delete products
- 📊 Manage inventory

### **Admin Panel URL:**
After login as admin: `http://localhost:3000/admin`

---

## 🔑 Regular Users

All users signing up without admin secret will be regular users with:
- 🛍️ Browse products
- 🔍 Search products
- 🛒 Add to cart
- 💳 Checkout
- 💬 No admin access

---

## 🚀 Features

✅ Authentication (Login/Signup)
✅ Admin Registration with Secret Key
✅ Product Search
✅ Shopping Cart
✅ Checkout
✅ Admin Product Management
✅ Error Handling
✅ Input Validation
✅ Toast Notifications

---

## 🐛 Troubleshooting

**Admin button not showing after login?**
- Make sure you registered with the correct admin secret key
- Check browser console for errors

**Can't add products?**
- Make sure you're logged in as admin
- Check backend console for errors

**Wrong admin secret error?**
- Check the `ADMIN_SECRET` in your `.env` file
- Default secret is: `admin123`

---

## 📝 Default Admin Secret Key

Default secret key (if not set in `.env`):
```
admin123
```

Change it in `.env` for production!

---

Enjoy! 🚀

