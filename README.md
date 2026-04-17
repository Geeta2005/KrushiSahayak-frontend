# KrushiSahayak Frontend

A modern React-based frontend application for the KrushiSahayak farming equipment rental platform.

## Overview

KrushiSahayak is a platform that connects farmers with equipment owners, enabling easy rental of farming equipment across the country. This frontend application provides a user-friendly interface for:

- Browsing and searching for farming equipment
- Booking equipment rentals
- Managing personal profiles
- Listing equipment for rent (for equipment owners)
- Admin dashboard for platform management

## Tech Stack

- **Frontend Framework**: React 18 with TypeScript
- **Build Tool**: Vite
- **UI Components**: shadcn/ui
- **Styling**: Tailwind CSS
- **Icons**: Lucide React
- **Routing**: React Router v7
- **Forms**: React Hook Form
- **State Management**: React Hooks
- **HTTP Client**: Axios
- **Notifications**: Sonner

## Features

### User Features

- **Authentication**: User registration and login with role-based access
- **Home Page**: Hero section with equipment categories and featured listings
- **Explore Page**: Browse and search equipment with filters
- **Equipment Details**: View detailed information about equipment
- **Booking System**: Rent equipment with date selection
- **My Rentals**: View and manage rental history
- **Profile Management**: Update personal information and preferences

### Admin Features

- **Dashboard**: Overview of platform statistics
- **User Management**: View and manage all users
- **Equipment Management**: Approve and manage equipment listings
- **Rental Management**: Track all rentals
- **Revenue Analytics**: View platform revenue
- **Settings**: Configure platform settings

## Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn

### Installation

1. Clone the repository:

```bash
git clone https://github.com/Geeta2005/KrushiSahayak-frontend.git
cd KrushiSahayak-frontend
```

2. Install dependencies:

```bash
npm install
```

3. Start the development server:

```bash
npm run dev
```

4. Open your browser and navigate to `http://localhost:5173`

### Environment Variables

Create a `.env` file in the root directory:

**Development:**

```env
VITE_API_URL=http://localhost:5000/api
```

**Production (Vercel + Render):**

```env
VITE_API_URL=https://krushisahayak-backend.onrender.com/api
```

### Build for Production

```bash
npm run build
```

The built files will be in the `dist` directory.

## Project Structure

```
src/
├── app/
│   ├── components/       # Reusable components
│   │   ├── ui/          # shadcn/ui components
│   │   ├── Layout.tsx   # Main layout component
│   │   └── ...         # Other components
│   ├── pages/           # Page components
│   │   ├── Home.tsx
│   │   ├── Login.tsx
│   │   ├── Signup.tsx
│   │   ├── Explore.tsx
│   │   ├── Profile.tsx
│   │   ├── admin/       # Admin pages
│   │   └── ...
│   ├── services/        # API services
│   │   └── api.ts
│   ├── routes.tsx       # Route configuration
│   └── App.tsx          # Main app component
├── assets/              # Static assets
├── styles/              # Global styles
└── main.tsx             # Application entry point
```

## API Integration

The frontend communicates with the backend API using Axios. The API base URL is configured via the `VITE_API_URL` environment variable.

### API Endpoints

- Authentication: `/api/auth/*`
- Users: `/api/users/*`
- Equipment: `/api/equipment/*`
- Rentals: `/api/rentals/*`

## Deployment

The frontend can be deployed to various platforms:

- **Vercel**: Connect your GitHub repository for automatic deployments
- **Netlify**: Drag and drop the `dist` folder or connect Git
- **AWS S3 + CloudFront**: Static hosting with CDN
- **Docker**: Use the provided Dockerfile for containerized deployment

For detailed deployment instructions, see [DEPLOYMENT.md](./DEPLOYMENT.md)

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Commit your changes
5. Push to the branch
6. Open a Pull Request

## License

This project is licensed under the MIT License.

## Support

For support, email support@krushisahayak.com or visit our GitHub repository.
