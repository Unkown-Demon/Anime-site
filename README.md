# AnimeStream - Anime Streaming Platform

A full-stack anime streaming platform built with React, Express, and MySQL. Features role-based access control, multi-language support, and a beautiful anime-style dark theme.

## 🌟 Features

### User Features
- **Browse Anime**: Discover thousands of anime titles with search and filtering
- **Anime Details**: View comprehensive information about each anime including ratings, episodes, and trailers
- **Favorites/Watchlist**: Add anime to your personal favorites list
- **Premium Features**: Access exclusive content with premium subscription
- **Multi-Language Support**: Available in English, Uzbek, and Russian

### Admin Features
- **Anime Management**: Upload, edit, and delete anime titles
- **User Management**: Manage user roles and premium subscriptions
- **Activity Logs**: Track all admin actions with detailed audit trail
- **Admin Dashboard**: Monitor platform statistics and user activity

### Authentication & Authorization
- **Manus OAuth**: Secure authentication system
- **Role-Based Access Control**: User, Admin, and Owner role 
- **Permission Management**: Granular control over admin functions

## 🛠️ Technology Stack

### Frontend
- **React 19**: Modern UI framework
- **Tailwind CSS 4**: Utility-first CSS framework
- **TypeScript**: Type-safe development
- **i18next**: Multi-language support
- **Wouter**: Lightweight routing
- **Lucide React**: Beautiful icons

### Backend
- **Express 4**: Fast and minimalist web framework
- **tRPC 11**: End-to-end typesafe APIs
- **MySQL**: Relational database
- **Drizzle ORM**: Type-safe database queries

### Development
- **Vite**: Lightning-fast build tool
- **pnpm**: Fast package manager
- **TypeScript**: Type safety

## 📋 Prerequisites

- Node.js 18+ and pnpm
- MySQL database
- GitHub account (for deployment)

## 🚀 Getting Started

### 1. Clone the Repository
```bash
git clone https://github.com/yourusername/Anime-Site.git
cd Anime-Site
```

### 2. Install Dependencies
```bash
pnpm install
```

### 3. Set Up Environment Variables
Create a `.env` file in the root directory with the following variables:
```env
DATABASE_URL=mysql://user:password@localhost:3306/animestream
JWT_SECRET=your_jwt_secret_key
VITE_APP_ID=your_app_id
OAUTH_SERVER_URL=https://api.manus.im
VITE_OAUTH_PORTAL_URL=https://oauth.manus.im
OWNER_OPEN_ID=owner_open_id
OWNER_NAME=AnimeStream Owner
VITE_APP_TITLE=AnimeStream
VITE_APP_LOGO=/logo.svg
```

### 4. Set Up Database
```bash
pnpm db:push
```

### 5. Start Development Server
```bash
pnpm dev
```

The application will be available at `http://localhost:3000`

## 📁 Project Structure

```
animestream/
├── client/                 # Frontend React application
│   ├── src/
│   │   ├── pages/         # Page components
│   │   ├── components/    # Reusable components
│   │   ├── locales/       # Language translations
│   │   ├── lib/           # Utilities and helpers
│   │   └── i18n.ts        # i18n configuration
│   └── public/            # Static assets
├── server/                # Backend Express application
│   ├── routers.ts         # tRPC procedure definitions
│   ├── db.ts              # Database queries
│   └── _core/             # Core server utilities
├── drizzle/               # Database schema and migrations
├── shared/                # Shared types and constants
└── package.json           # Project dependencies
```

## 🔐 Authentication

The platform uses Manus OAuth for secure authentication. Users can sign in using their credentials, and the system automatically:
- Creates a user account on first login
- Assigns the owner role to gtartup@gmail.com
- Manages session cookies securely

## 👥 User Roles

### Owner
- Full platform access
- All admin privileges
- Can manage other admins

### Admin
- Upload and manage anime
- Manage user roles and subscriptions
- View activity logs
- Grant/revoke premium access

### User
- Browse and view anime
- Add anime to favorites
- Access premium content (if subscribed)
- View personal profile

## 🌐 Multi-Language Support

The platform supports three languages:
- **English** (en)
- **Uzbek** (uz)
- **Russian** (ru)

Users can switch languages using the language switcher in the navigation bar.

## 📦 API Endpoints

All API endpoints are built with tRPC and follow a type-safe pattern. Key procedures include:

### Anime
- `anime.list` - Get list of anime with pagination
- `anime.detail` - Get detailed anime information
- `anime.upload` - Upload new anime (admin only)
- `anime.update` - Update anime details (admin only)
- `anime.delete` - Delete anime (admin only)

### User
- `user.getFavorites` - Get user's favorite anime
- `user.addFavorite` - Add anime to favorites
- `user.removeFavorite` - Remove anime from favorites

### Admin
- `admin.listUsers` - Get all users
- `admin.promoteToAdmin` - Promote user to admin
- `admin.demoteToUser` - Demote admin to user
- `admin.grantPremium` - Grant premium subscription
- `admin.revokePremium` - Revoke premium subscription
- `admin.getLogs` - Get activity logs

## 🎨 Design

The platform features a beautiful anime-style dark theme with:
- Custom OKLCH color palette
- Smooth animations and transitions
- Responsive design for all devices
- Accessible UI components
- Professional typography

## 🐛 Bug Reports

If you encounter any bugs or issues, please create an issue on GitHub with:
- Description of the bug
- Steps to reproduce
- Expected vs actual behavior
- Screenshots (if applicable)

## 🤝 Contributing

Contributions are welcome! Please follow these steps:
1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 👨‍💼 Owner

**Email**: gtartup@gmail.com

The user with this email automatically receives owner privileges and full platform access.

## 🔗 Links

- **Live Demo**: [Coming Soon]
- **Documentation**: [See Wiki]
- **Issue Tracker**: [GitHub Issues]

## 📞 Support

For support, please contact the project owner or create an issue on GitHub.

---

**Made with ❤️ for anime lovers worldwide**
