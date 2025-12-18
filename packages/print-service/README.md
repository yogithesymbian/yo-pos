# YO-POS Print Service

A dedicated Node.js service for handling thermal printer operations in the YO-POS system. This service provides REST API endpoints for printing transaction receipts using ESC/POS compatible thermal printers via USB connection.

## 🚀 Features

- **REST API**: Simple HTTP endpoints for print operations
- **USB Thermal Printer Support**: ESC/POS compatible printers
- **Graceful Degradation**: Mock mode when printer hardware is unavailable
- **Process Management**: PM2 ecosystem configuration for production deployment
- **Comprehensive Logging**: Detailed logging for debugging and monitoring
- **Error Handling**: Robust error handling and recovery
- **Health Checks**: Built-in health check endpoint for monitoring

## 📋 Prerequisites

- Node.js v16.0.0 or higher
- USB thermal printer (ESC/POS compatible)
- PM2 (optional, for production deployment)

### Supported Printers

Any ESC/POS compatible thermal printer should work, including:
- Epson TM series
- Star Micronics
- Citizen
- Bixolon
- And many others

## 🔧 Installation

### 1. Install Dependencies

```bash
cd packages/print-service
npm install
```

### 2. Install PM2 (Optional, for production)

```bash
npm install -g pm2
```

### 3. Setup Printer Permissions (Linux)

On Linux systems, you may need to add your user to the `lp` group:

```bash
sudo usermod -a -G lp $USER
```

For USB printer access, you may also need udev rules. Create `/etc/udev/rules.d/99-usb-printer.rules`:

```
SUBSYSTEM=="usb", ATTR{idVendor}=="04b8", MODE="0666"
```

Replace `04b8` with your printer's vendor ID (find it using `lsusb`).

## 🏃 Running the Service

### Development Mode

With auto-reload on file changes:

```bash
npm run dev
```

### Production Mode

Standard start:

```bash
npm start
```

### Using PM2 (Recommended for Production)

Start the service:

```bash
npm run pm2:start
# or directly: pm2 start ecosystem.config.js
```

Other PM2 commands:

```bash
npm run pm2:stop      # Stop the service
npm run pm2:restart   # Restart the service
npm run pm2:logs      # View logs
pm2 monit             # Monitor service
pm2 list              # List all services
```

## 📡 API Endpoints

### Health Check

Check if the service is running and printer is available.

**Endpoint:** `GET /health`

**Response:**
```json
{
  "status": "ok",
  "service": "yo-pos-print-service",
  "version": "1.0.0",
  "printerAvailable": true,
  "timestamp": "2025-12-18T15:00:00.000Z"
}
```

### Print Receipt

Print a transaction receipt.

**Endpoint:** `POST /print`

**Request Body:**
```json
{
  "items": [
    {
      "name": "Product A",
      "qty": 2,
      "price": 10000
    },
    {
      "name": "Product B",
      "qty": 1,
      "price": 15000
    }
  ],
  "total": 35000,
  "storeName": "My Store",
  "transactionId": "TRX-001",
  "cashier": "John Doe"
}
```

**Request Parameters:**

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| items | Array | Yes | Array of transaction items |
| items[].name | String | Yes | Item name |
| items[].qty | Number | Yes | Item quantity |
| items[].price | Number/String | Yes | Item price |
| total | Number/String | Yes | Transaction total amount |
| storeName | String | No | Store name (default: "TOKO DEMO") |
| transactionId | String | No | Transaction identifier |
| cashier | String | No | Cashier name |

**Success Response:**
```json
{
  "success": true,
  "message": "Receipt printed successfully",
  "transactionId": "TRX-001"
}
```

**Error Response:**
```json
{
  "success": false,
  "error": "Error message"
}
```

### Test Print

Print a test receipt to verify printer connectivity.

**Endpoint:** `POST /print/test`

**Response:**
```json
{
  "success": true,
  "message": "Test receipt printed successfully"
}
```

## 🧪 Testing

### Using cURL

Health check:
```bash
curl http://localhost:3001/health
```

Test print:
```bash
curl -X POST http://localhost:3001/print/test
```

Print receipt:
```bash
curl -X POST http://localhost:3001/print \
  -H "Content-Type: application/json" \
  -d '{
    "items": [
      {"name": "Item A", "qty": 2, "price": 10000},
      {"name": "Item B", "qty": 1, "price": 15000}
    ],
    "total": 35000,
    "storeName": "Test Store",
    "transactionId": "TEST-001"
  }'
```

### Using Postman or Insomnia

1. Import the API endpoints
2. Set base URL to `http://localhost:3001`
3. Test each endpoint with sample data

## 🔍 Troubleshooting

### Printer Not Detected

**Issue:** Printer hardware not found or accessible.

**Solutions:**
1. Check USB connection
2. Verify printer is powered on
3. Check permissions (Linux): `ls -la /dev/usb/lp*`
4. Install udev rules (see Installation section)
5. Restart the service after connecting printer

### Mock Mode

**Issue:** Service runs in mock mode (printer libraries not available).

**Solution:**
```bash
npm install escpos escpos-usb
```

### Permission Denied (Linux)

**Issue:** Cannot access USB device.

**Solutions:**
1. Add user to `lp` group: `sudo usermod -a -G lp $USER`
2. Log out and log back in
3. Check udev rules
4. Try running with sudo (not recommended for production)

### Service Won't Start

**Issue:** Service fails to start.

**Solutions:**
1. Check if port 3001 is available: `lsof -i :3001`
2. Review logs: `pm2 logs print-service` or check `./logs/` directory
3. Verify Node.js version: `node --version` (should be v16+)
4. Check dependencies: `npm install`

## 📂 Project Structure

```
print-service/
├── src/
│   └── index.js           # Main service file
├── logs/                  # Log files (created at runtime)
├── ecosystem.config.js    # PM2 configuration
├── package.json           # Dependencies and scripts
├── .gitignore            # Git ignore rules
└── README.md             # This file
```

## 🔐 Security Considerations

1. **Network Security**: This service should run on localhost or internal network only
2. **Input Validation**: All endpoints validate input data
3. **Error Handling**: Sensitive error details only shown in development mode
4. **Resource Limits**: PM2 configured with memory limits and restart policies

## 🚀 Integration

### Frontend Integration (Vue/React)

```javascript
// Example: Print receipt from frontend
async function printReceipt(transaction) {
  try {
    const response = await fetch('http://localhost:3001/print', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        items: transaction.items,
        total: transaction.total,
        storeName: 'My Store',
        transactionId: transaction.id,
        cashier: transaction.cashier
      })
    });
    
    const result = await response.json();
    
    if (result.success) {
      console.log('Receipt printed successfully');
    } else {
      console.error('Print failed:', result.error);
    }
  } catch (error) {
    console.error('Network error:', error);
  }
}
```

### Backend Integration (Node.js)

```javascript
// Example: Call print service from backend
const axios = require('axios');

async function printReceipt(transactionData) {
  try {
    const response = await axios.post('http://localhost:3001/print', {
      items: transactionData.items,
      total: transactionData.total,
      storeName: process.env.STORE_NAME,
      transactionId: transactionData.id,
      cashier: transactionData.cashier
    });
    
    return response.data;
  } catch (error) {
    console.error('Print service error:', error.message);
    throw error;
  }
}
```

## 🔄 Future Enhancements

The following features are planned for future releases and are documented in the code with comments for easy integration:

- **Network Printer Support**: Currently supports USB only, network printer support can be added
- **Multiple Printer Support**: Support for multiple printer configurations
- **Print Queue**: Queue management for handling multiple print requests
- **Print Templates**: Customizable receipt templates
- **Logo Printing**: Support for printing store logos
- **Barcode/QR Code**: Generate and print barcodes or QR codes on receipts

These features are marked with `// TODO:` comments in the source code for easy identification.

## 📝 Environment Variables

| Variable | Default | Description |
|----------|---------|-------------|
| PORT | 3001 | Service port number |
| NODE_ENV | development | Environment mode (development/production) |

Create a `.env` file to customize:

```env
PORT=3001
NODE_ENV=production
```

## 📊 Monitoring

### PM2 Monitoring

View real-time monitoring:
```bash
pm2 monit
```

View service status:
```bash
pm2 status
```

View logs:
```bash
pm2 logs print-service
```

### Log Files

When running with PM2, logs are stored in:
- `./logs/error.log` - Error logs
- `./logs/out.log` - Standard output logs
- `./logs/combined.log` - Combined logs

## 🤝 Contributing

This is part of the YO-POS monorepo. Please refer to the main repository's contributing guidelines.

## 📄 License

This project is private and proprietary.

## 👤 Author

**Yogi the Symbian**

---

*Part of the YO-POS ecosystem*
