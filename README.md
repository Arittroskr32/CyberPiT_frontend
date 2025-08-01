# CyberPiT Frontend

React frontend application for CyberPiT Inc. cybersecurity website.

## 🚀 Tech Stack

- **React 18** with TypeScript
- **Vite** for fast development and building
- **Tailwind CSS** for styling
- **React Router** for navigation
- **Axios** for API communication
- **ESLint** for code linting

## 📁 Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── admin/          # Admin-specific components
│   └── Layout/         # Layout components (Navbar, Footer)
├── pages/              # Page components
│   ├── admin/          # Admin dashboard pages
│   └── ...             # Public pages
├── services/           # API services
├── context/            # React context providers
└── App.tsx             # Main app component
```

## 🛠️ Installation & Setup

### Prerequisites
- Node.js (v18 or higher)
- npm or yarn

### Installation

1. **Clone the repository**
```bash
git clone https://github.com/Arittroskr32/CyberPiT_frontend.git
cd CyberPiT_frontend
```

2. **Install dependencies**
```bash
npm install
```

3. **Set up environment variables**
Create a `.env` file in the root directory:
```env
VITE_API_URL=http://localhost:5001/api
NODE_ENV=development
VITE_APP_NAME=CyberPiT
VITE_APP_VERSION=1.0.0
```

4. **Start development server**
```bash
npm run dev
```

The application will be available at http://localhost:5173

## 📜 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## 🌐 Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `VITE_API_URL` | Backend API URL | `http://localhost:5001/api` |
| `VITE_APP_NAME` | Application name | `CyberPiT` |
| `VITE_APP_VERSION` | Application version | `1.0.0` |

## 🔗 Backend Repository

This frontend connects to the CyberPiT backend API. Make sure the backend server is running for full functionality.

## 📱 Features

- **Responsive Design** - Mobile-first approach
- **Admin Dashboard** - Complete admin panel for content management
- **Contact Forms** - Contact and feedback forms
- **Team Applications** - Join team application system
- **Project Showcase** - Portfolio/projects display
- **Video Management** - Hero video upload and display
- **Newsletter Subscription** - Email subscription system

## 🚀 Deployment

### Netlify
The project includes `netlify.toml` configuration for easy Netlify deployment.

### Vercel
The project includes `vercel.json` configuration for Vercel deployment.

### Manual Build
```bash
npm run build
```
This creates a `dist/` folder with production-ready files.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

MIT License - see LICENSE file for details

## 📞 Support

For support, email administrator@cyberpit.live or create an issue in this repository.
