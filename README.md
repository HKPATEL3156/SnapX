# SnapX - Image Upload & Gallery Platform

**A beautiful, moderated gallery platform where students upload images that require admin approval before appearing in the public gallery.**

## 📸 Features

### 🎨 **Beautiful UI/UX**

- **Blue gradient backgrounds** with white elements
- **Colorful text**: Yellow, Green, Red, Pink accents
- **Smooth animations** and trans
- **Mobile-responsive** design
- **Modern glassmorphism** effects

### 👥 **User Roles**

#### **Students (Uploaders)**

- Upload images with captions and descriptions
- Add tags for better categorization
- Track upload status (Pending/Approved/Rejected)
- No registration required for uploads

#### **Admin (Moderators)**

- **Admin Credentials**:
  - Email: `admin@snapx.com`
  - Password: `admin@snapx001`
- Dashboard with statistics
- Review pending images
- Approve/Reject/Delete images
- Bulk actions support

### 🖼️ **Gallery Features**

- Grid layout displaying approved images
- Image modal with full details
- Search functionality
- Pagination
- View counters
- Tag filtering

## 🛠️ Tech Stack

### **Frontend**

- **React 19** with Vite
- **Tailwind CSS** for styling
- **React Router** for navigation
- **Framer Motion** for animations
- **React Hot Toast** for notifications
- **React Dropzone** for file uploads
- **React Icons** for beautiful icons

### **Backend**

- **Node.js** with Express
- **MongoDB** with Mongoose
- **Multer** for file uploads
- **JWT** for authentication
- **bcryptjs** for password hashing

## 📁 Project Structure

```
SnapX/
├── src/                    # Frontend React app
│   ├── components/         # Reusable components
│   │   ├── Header.jsx      # Navigation header
│   │   ├── Footer.jsx      # Footer component
│   │   ├── ImageCard.jsx   # Gallery image cards
│   │   ├── ImageModal.jsx  # Full-size image modal
│   │   └── LoadingSpinner.jsx
│   ├── pages/              # Main pages
│   │   ├── Gallery.jsx     # Public gallery
│   │   ├── Upload.jsx      # Image upload form
│   │   ├── Login.jsx       # Auth (Login/Register)
│   │   └── AdminDashboard.jsx # Admin panel
│   ├── context/
│   │   └── AuthContext.jsx # Authentication context
│   ├── services/
│   │   └── api.js          # API service functions
│   └── App.jsx             # Main app component
│
├── server/                 # Backend Node.js API
│   ├── models/             # Database models
│   │   ├── User.js         # User model
│   │   └── Image.js        # Image model
│   ├── routes/             # API routes
│   │   ├── auth.js         # Authentication routes
│   │   ├── images.js       # Image routes
│   │   └── admin.js        # Admin routes
│   ├── uploads/            # Uploaded images storage
│   ├── .env                # Environment variables
│   ├── server.js           # Main server file
│   └── package.json        # Backend dependencies
│
├── package.json            # Frontend dependencies
├── tailwind.config.js      # Tailwind configuration
├── vite.config.js          # Vite configuration
└── README.md               # This file
```

## 🚀 Getting Started

### **Prerequisites**

- Node.js (v16+)
- MongoDB Atlas account (connection string provided)

### **Installation**

1. **Clone and Setup**

```bash
cd f:\Project\Hackathon\webwizards\SnapX
```

2. **Install Frontend Dependencies**

```bash
npm install
```

3. **Install Backend Dependencies**

```bash
cd server
npm install
```

4. **Environment Setup**
   The `.env` file is already configured with:

```
MONGO_URI=mongodb+srv://snapx:snapx01@hkhub.hbvawdn.mongodb.net/SnapX?retryWrites=true&w=majority&appName=SnapX
JWT_SECRET=your-super-secret-jwt-key-for-snapx-hackathon-2025
PORT=5000
NODE_ENV=development
```

### **Running the Application**

1. **Start Backend Server**

```bash
# From the server directory
npm run dev
# or
npm start
```

2. **Start Frontend (New Terminal)**

```bash
# From the main directory
npm run dev
```

3. **Access the Application**

- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:5000
- **Admin Panel**: http://localhost:5173/admin

## 🔑 Admin Access

**Default Admin Account:**

- **Username**: `admin@snapx.com`
- **Password**: `admin@snapx001`

_This admin account is automatically created when the server starts._

## 📡 API Endpoints

### **Images**

- `POST /api/images/upload` - Upload new image
- `GET /api/images/gallery` - Get approved images
- `GET /api/images/search/:query` - Search images

### **Authentication**

- `POST /api/auth/login` - User login
- `POST /api/auth/register` - User registration
- `GET /api/auth/verify` - Verify JWT token

### **Admin**

- `GET /api/admin/dashboard` - Dashboard statistics
- `GET /api/admin/pending` - Pending images
- `POST /api/admin/approve/:id` - Approve image
- `POST /api/admin/reject/:id` - Reject image
- `DELETE /api/admin/delete/:id` - Delete image
- `POST /api/admin/bulk-action` - Bulk operations

## 🎨 Design Features

### **Color Scheme**

- **Primary**: Blue gradients (`#3b82f6` to `#8b5cf6`)
- **Success**: Green (`#10b981`)
- **Warning**: Yellow/Orange (`#f59e0b`)
- **Danger**: Red (`#ef4444`)
- **Accent**: Pink (`#ec4899`)

### **UI Components**

- **Glassmorphism** effects with backdrop blur
- **Smooth animations** with Framer Motion
- **Gradient buttons** and cards
- **Modern shadows** and hover effects
- **Responsive grid** layouts

## 🔧 Development Features

### **Image Upload**

- **Drag & drop** interface
- **File validation** (JPG, PNG, GIF, WebP)
- **Size limit**: 5MB per image
- **Preview** before upload
- **Progress feedback**

### **Gallery**

- **Masonry grid** layout
- **Infinite scroll** pagination
- **Image modal** with full details
- **Search** and **filter** capabilities
- **Mobile optimized**

### **Admin Dashboard**

- **Real-time statistics**
- **Bulk operations**
- **Image preview**
- **Status management**
- **User management**

## 🏆 Hackathon Demo Flow

1. **Student uploads** photo with caption → Status: Pending
2. **Admin logs in** → Sees pending images in dashboard
3. **Admin approves** image → Status: Approved
4. **Public gallery** refreshes → Approved photo visible
5. **Visitors browse** gallery → Beautiful grid layout

## 🔒 Security Features

- **JWT authentication** for admin access
- **File type validation** for uploads
- **File size limits** (5MB max)
- **Input sanitization** to prevent XSS
- **Password hashing** with bcrypt
- **Protected admin routes**

## 🌟 Future Enhancements

- **Email notifications** for approval/rejection
- **Advanced filtering** by tags and categories
- **Like and comment** system
- **AI content moderation**
- **Mobile app** version
- **Social media** integration

---

## 📞 Support

For any issues during the hackathon, check:

1. MongoDB connection is working
2. Both frontend and backend servers are running
3. Admin credentials are correct
4. File upload directory has proper permissions

**Made with ❤️ for the Hackathon - SnapX Team**+ Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## React Compiler

The React Compiler is not enabled on this template. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.
