# YO-POS

**Premium Offline-First Point of Sale System for Retail Stores**

YO-POS is a modern, offline-first stock management and point-of-sale application designed for retail stores. Built as a monorepo, it provides a complete solution for inventory management, transactions, and thermal printing capabilities.

## 🚀 Features

### Core Functionality
- **Modern Authentication UI**: Secure login and user management system
- **Product Scanning & Management**: 
  - Scan items to add product details (price, title, notes)
  - Quick product lookup and editing
- **Bulk Stock Operations**:
  - Bulk scan for stock updates
  - Keypress + action button workflow for efficient data entry
- **Transaction Processing**:
  - Scan items to create transactions
  - Automatic stock reduction upon transaction completion
  - Backend API integration for transaction processing
- **Thermal Printer Support**: 
  - Receipt printing capabilities
  - Integration with thermal printers for transaction receipts

### Architecture Highlights
- **Offline-First**: Designed to work seamlessly without internet connectivity
- **Monorepo Structure**: All services organized in a single repository
- **Modern Tech Stack**: Leveraging latest frameworks and tools

## 🛠️ Tech Stack

### Frontend
- **Vue 3**: Progressive JavaScript framework for building user interfaces
- **Element UI**: Vue 3 component library for beautiful, responsive UI

### Backend
- **Node.js**: JavaScript runtime for server-side operations
- **Sequelize ORM**: Database management and migrations
- **MySQL**: Relational database for data persistence

### Print Service
- **Node.js Print Service**: Dedicated backend service for thermal printer integration

## 📁 Monorepo Structure

```
yo-pos/
├── packages/
│   ├── frontend/          # Vue 3 + Element UI application
│   ├── backend/           # Node.js API server with Sequelize
│   └── print-service/     # Node.js thermal printer service
├── docs/                  # Documentation
├── scripts/               # Build and deployment scripts
└── README.md             # This file
```

## 🏗️ Installation

### Prerequisites
- Node.js (v16 or higher)
- MySQL (v8.0 or higher) - *(for backend, when implemented)*
- npm or yarn package manager
- USB thermal printer (ESC/POS compatible) - *(for print service)*
- PM2 (optional, for production deployment)

### Setup Steps

#### Print Service (Available Now)
1. Clone the repository
```bash
git clone https://github.com/yogithesymbian/yo-pos.git
cd yo-pos/packages/print-service
```

2. Install dependencies
```bash
npm install
```

3. Run the service
```bash
# Development mode with auto-reload
npm run dev

# Production mode
npm start

# Using PM2 (recommended for production)
pm2 start ecosystem.config.js
```

For detailed setup instructions, see [Print Service README](packages/print-service/README.md).

#### Other Services
> **Note**: Frontend and backend implementation will be added in future iterations.

## 🎯 Usage

### Print Service
The print service provides REST API endpoints for printing receipts:

- **Health Check**: `GET http://localhost:3001/health`
- **Print Receipt**: `POST http://localhost:3001/print`
- **Test Print**: `POST http://localhost:3001/print/test`

Example usage:
```bash
curl -X POST http://localhost:3001/print \
  -H "Content-Type: application/json" \
  -d '{
    "items": [
      {"name": "Product A", "qty": 2, "price": 10000},
      {"name": "Product B", "qty": 1, "price": 15000}
    ],
    "total": 35000,
    "storeName": "My Store",
    "transactionId": "TRX-001"
  }'
```

For complete API documentation, see [Print Service README](packages/print-service/README.md).

### Other Features
> **Note**: Frontend and backend usage instructions will be detailed once implementation is complete.

### Quick Start
- Access the authentication interface
- Scan products to add to inventory
- Process transactions with barcode scanning
- Print receipts using thermal printer

## 🔮 Future Roadmap

### Upcoming Features
- **Agentic AI Integration**: Intelligent automation and assistance features
- Advanced analytics and reporting
- Multi-store synchronization
- Cloud backup capabilities
- Mobile companion app

## 📝 Development Status

This project is under active development. The codebase structure and implementation are being developed incrementally.

### Current Phase: Implementation
- ✅ Project structure defined
- ✅ Technical stack selected
- ✅ **Print Service**: Fully implemented and tested
  - REST API with Express.js
  - ESC/POS thermal printer integration
  - PM2 process management configuration
  - Comprehensive documentation
- ⏳ Frontend (Vue 3 + Element UI) - Planned
- ⏳ Backend API (Node.js + Sequelize) - Planned
- ⏳ Agentic AI architecture design - Planned

## 🤝 Contributing

Contributions are welcome! Please read our contributing guidelines before submitting pull requests.

## 📄 License

This project is private and proprietary.

## 👤 Author

**Yogi the Symbian**

---

*YO-POS: Empowering offline retail with modern technology*
