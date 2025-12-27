# ZeroERP

A lightweight, browser-based Enterprise Resource Planning (ERP) system designed for small business operations. Built with React and Tailwind CSS.

## Features

- **Dashboard**: Real-time KPIs, sales velocity charts, and stock alerts
- **Inventory Management**: Full CRUD operations for SKUs with search and export
- **Order Management**: Track orders from multiple channels (Shopify, Amazon, B2B)
- **Purchase Orders**: Manage vendor purchase orders and receiving

## Tech Stack

- **React 18** - UI framework with hooks
- **Vite** - Fast build tool and dev server
- **Tailwind CSS** - Utility-first CSS framework
- **Lucide React** - Icon library

## Project Structure

```
src/
├── components/
│   ├── ui/           # Reusable UI components (Card, Badge, Modal, MetricCard)
│   ├── forms/        # Form components (InventoryForm, InputField)
│   └── layout/       # Layout components (Sidebar, Header, Navigation)
├── pages/            # Page components (Dashboard, Inventory, Orders, Purchasing)
├── hooks/            # Custom React hooks for state management
├── utils/            # Utility functions (export, helpers)
├── data/             # Mock data and initial state
├── styles/           # Global styles and Tailwind config
├── App.jsx           # Main application component
└── main.jsx          # Application entry point
```

## Getting Started

### Prerequisites

- Node.js 18+ installed
- npm or yarn package manager

### Installation

1. Clone the repository:
```bash
git clone https://github.com/AaronAM/ZeroERP.git
cd ZeroERP
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Open http://localhost:3000 in your browser

### Build for Production

```bash
npm run build
```

The build output will be in the `dist` directory.

## Architecture

### State Management

The application uses custom React hooks for modular state management:

- `useNavigation` - Tab navigation and mobile menu state
- `useInventory` - Inventory items, search, and CRUD operations
- `useOrders` - Sales orders and fulfillment workflow
- `usePurchaseOrders` - Purchase order management

### Component Design

Components are organized into three categories:

1. **UI Components** - Reusable, presentational components
2. **Form Components** - Form inputs and validation
3. **Layout Components** - Page structure and navigation

### Pages

Each page is a container component that:
- Receives data and callbacks via props
- Orchestrates UI components
- Handles page-specific logic

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## License

MIT License
