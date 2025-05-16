# TRXRES Web

TRXRES Web is a Vue 3 application for TRON blockchain resource management, focusing on energy resource rental and management.

## Project Architecture

### Technology Stack

- **Framework**: Vue 3 with Composition API
- **Build Tool**: Vite
- **Language**: TypeScript
- **State Management**: Pinia with persistence
- **Routing**: Vue Router
- **Styling**:
  - UnoCSS (atomic CSS framework)
  - Less
  - CSS Variables for theming
- **UI Components**:
  - Element Plus (PC)
  - Vant (Mobile)
  - Custom components
- **Internationalization**: Vue I18n (supports Chinese and English)
- **HTTP Client**: Axios
- **Blockchain Integration**:
  - TronLink wallet
  - TokenPocket wallet (tp-js-sdk)

### Project Structure

```
trxres_web/
├── public/                 # Static assets
├── src/
│   ├── api/                # API definitions and types
│   ├── assets/             # Project assets (images, SVGs)
│   ├── components/         # Reusable components
│   ├── constants/          # Constants and enums
│   ├── hooks/              # Custom Vue hooks
│   ├── i18n/               # Internationalization
│   │   └── locales/        # Language files (zh.json, en.json)
│   ├── pages/              # Page components
│   │   ├── energy/         # Archived pages for Energy management pages
│   │   ├── pc/             # New pages for PC-specific pages
│   │   └── mobile/         # New pages for Mobile-specific pages
│   ├── router/             # Vue Router configuration
│   ├── store/              # Pinia stores
│   ├── styles/             # Global styles
│   │   └── theme.css       # Theme variables
│   ├── utils/              # Utility functions
│   │   ├── http/           # HTTP request handling
│   │   └── wallet.ts       # Wallet integration
│   ├── App.vue             # Root component
│   └── main.ts             # Application entry point
├── .env.development        # Development environment variables
├── .env.production         # Production environment variables
├── vite.config.ts          # Vite configuration
├── unocss.config.ts        # UnoCSS configuration
└── tsconfig.json           # TypeScript configuration
```

## Features

- Wallet connection (TronLink and TokenPocket)
- Energy resource management
- Order creation and management
- Multi-language support (Chinese and English)
- Responsive design for both PC and mobile

## Code Style and Conventions

### Vue Components

- Uses Vue 3 Composition API with `<script lang='ts' setup>` syntax
- Component naming follows PascalCase convention
- Custom components are prefixed with "Kele" (e.g., `KeleInput`)
- Component structure follows the order: script, template, style

### TypeScript

- Strong typing with interfaces for API responses and requests
- Namespace API for all API-related types
- Enums for status codes and constants

### CSS/Styling

- CSS variables for theming (defined in `src/styles/theme.css`)
- UnoCSS for utility classes
- Custom shortcuts for common patterns:
  - `flex-center`: centered flex container
  - `flex-between`: flex with space-between
  - `flex-around`: flex with space-around
- Mobile-responsive with `postcss-px-to-viewport` for automatic conversion

### Icons and Assets

- SVG icons loaded via UnoCSS with custom collection
- Icons are used with the syntax: `i-icon:[icon-name]`
- SVG files are stored in `src/assets/svg/`

## State Management

- Uses Pinia for state management
- Persistent state with `pinia-plugin-persistedstate`
- Main stores:
  - `account`: Manages wallet connection and user account
  - `config`: Manages application configuration

## API Integration

- Axios for HTTP requests
- Centralized API definitions in `src/api/index.ts`
- Type definitions in `src/api/api.d.ts`
- Response interceptor for standardized error handling

## Wallet Integration

- Supports TronLink and TokenPocket wallets
- Wallet detection and connection in `src/utils/wallet.ts`
- Account state management in the account store

## Internationalization

- Vue I18n for multi-language support
- Language files in `src/i18n/locales/`
- Supports Chinese (zh) and English (en)
- Default language is Chinese

## Development

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## Environment Variables

- `VITE_API_URL`: API base URL
