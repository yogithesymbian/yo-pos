/**
 * YO-POS Print Service
 * 
 * A dedicated Node.js service for handling thermal printer operations.
 * This service provides REST API endpoints for printing transaction receipts
 * using ESC/POS compatible thermal printers via USB connection.
 * 
 * @module print-service
 * @author Yogi the Symbian
 * @version 1.0.0
 */

const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

// ESC/POS printer libraries
// Note: These imports are wrapped in try-catch for graceful degradation
// when printer hardware is not available
let escpos;
let escposUSB;
let printerAvailable = false;

try {
  escpos = require('escpos');
  escposUSB = require('escpos-usb');
  escpos.USB = escposUSB;
  printerAvailable = true;
} catch (error) {
  console.warn('⚠️  Printer libraries not available. Running in mock mode.');
  console.warn('   To enable printing, install: npm install escpos escpos-usb');
}

// Initialize Express application
const app = express();

// Configuration
const PORT = process.env.PORT || 3001;
const NODE_ENV = process.env.NODE_ENV || 'development';

// Middleware setup
app.use(cors()); // Enable CORS for all routes
app.use(bodyParser.json()); // Parse JSON request bodies
app.use(bodyParser.urlencoded({ extended: true })); // Parse URL-encoded bodies

/**
 * Request logger middleware
 * Logs all incoming requests with timestamp, method, and path
 */
app.use((req, res, next) => {
  const timestamp = new Date().toISOString();
  console.log(`[${timestamp}] ${req.method} ${req.path}`);
  next();
});

/**
 * Health check endpoint
 * Returns service status and printer availability
 * 
 * @route GET /health
 * @returns {Object} JSON object with service status
 * @example
 * // Response:
 * {
 *   "status": "ok",
 *   "service": "yo-pos-print-service",
 *   "version": "1.0.0",
 *   "printerAvailable": true,
 *   "timestamp": "2025-12-18T15:00:00.000Z"
 * }
 */
app.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    service: 'yo-pos-print-service',
    version: '1.0.0',
    printerAvailable,
    timestamp: new Date().toISOString()
  });
});

/**
 * Print receipt endpoint
 * Processes print requests and sends formatted receipt to thermal printer
 * 
 * @route POST /print
 * @param {Object} req.body - Print request payload
 * @param {Array} req.body.items - Array of transaction items
 * @param {string} req.body.items[].name - Item name
 * @param {number} req.body.items[].qty - Item quantity
 * @param {number|string} req.body.items[].price - Item price
 * @param {number|string} req.body.total - Transaction total amount
 * @param {string} [req.body.storeName] - Optional store name (default: "TOKO DEMO")
 * @param {string} [req.body.transactionId] - Optional transaction ID
 * @param {string} [req.body.cashier] - Optional cashier name
 * @returns {Object} JSON object with print status
 * 
 * @example
 * // Request:
 * POST /print
 * {
 *   "items": [
 *     { "name": "Item A", "qty": 2, "price": 10000 },
 *     { "name": "Item B", "qty": 1, "price": 15000 }
 *   ],
 *   "total": 35000,
 *   "storeName": "My Store",
 *   "transactionId": "TRX-001",
 *   "cashier": "John Doe"
 * }
 * 
 * // Response (success):
 * {
 *   "success": true,
 *   "message": "Receipt printed successfully",
 *   "transactionId": "TRX-001"
 * }
 * 
 * // Response (error):
 * {
 *   "success": false,
 *   "error": "Error message"
 * }
 */
app.post('/print', async (req, res) => {
  // Extract request payload
  const { 
    items, 
    total, 
    storeName = 'TOKO DEMO',
    transactionId,
    cashier 
  } = req.body;

  // Validate required fields
  if (!items || !Array.isArray(items) || items.length === 0) {
    return res.status(400).json({
      success: false,
      error: 'Invalid request: items array is required and must not be empty'
    });
  }

  if (total === undefined || total === null) {
    return res.status(400).json({
      success: false,
      error: 'Invalid request: total is required'
    });
  }

  // Check if printer is available
  if (!printerAvailable) {
    console.log('📝 Mock print request received (printer not available)');
    console.log('   Items:', items);
    console.log('   Total:', total);
    
    return res.json({
      success: true,
      message: 'Mock mode: Receipt would be printed',
      mock: true,
      transactionId
    });
  }

  try {
    // Initialize USB printer device
    const device = new escpos.USB();
    const printer = new escpos.Printer(device);

    // Open device connection
    device.open(function(error) {
      if (error) {
        console.error('❌ Failed to open printer device:', error);
        return res.status(500).json({
          success: false,
          error: 'Failed to open printer device: ' + error.message
        });
      }

      try {
        // Print header
        printer
          .align('ct') // Center align
          .style('bu') // Bold and underline
          .size(2, 2) // Double size
          .text(storeName)
          .size(1, 1) // Normal size
          .style('normal')
          .text('--------------------------------');

        // Print transaction metadata if available
        if (transactionId) {
          printer
            .align('lt') // Left align
            .text(`Transaksi: ${transactionId}`);
        }

        if (cashier) {
          printer.text(`Kasir: ${cashier}`);
        }

        // Print timestamp
        const timestamp = new Date().toLocaleString('id-ID', { 
          timeZone: 'Asia/Jakarta',
          year: 'numeric',
          month: '2-digit',
          day: '2-digit',
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit'
        });
        printer.text(`Tanggal: ${timestamp}`);
        
        printer.text('--------------------------------');

        // Print items
        printer.align('lt'); // Left align
        items.forEach((item, index) => {
          // Validate item structure
          if (!item.name || item.qty === undefined || item.price === undefined) {
            console.warn(`⚠️  Skipping invalid item at index ${index}:`, item);
            return;
          }

          // Format item line with proper spacing
          const itemName = String(item.name).substring(0, 20); // Limit name length
          const qty = String(item.qty);
          const price = String(item.price);
          const itemLine = `${itemName} x${qty}`;
          const pricePadding = ' '.repeat(Math.max(1, 32 - itemLine.length - price.length));
          
          printer.text(`${itemLine}${pricePadding}${price}`);
        });

        // Print footer
        printer
          .text('--------------------------------')
          .style('bu') // Bold and underline
          .size(1, 2) // Height double
          .text(`TOTAL: Rp ${String(total)}`)
          .size(1, 1) // Normal size
          .style('normal')
          .text('--------------------------------')
          .align('ct') // Center align
          .text('Terima Kasih')
          .text('Silahkan Datang Kembali')
          .feed(3) // Feed 3 lines
          .cut() // Cut paper
          .close(); // Close connection

        console.log('✅ Receipt printed successfully');
        
        // Send success response
        res.json({
          success: true,
          message: 'Receipt printed successfully',
          transactionId
        });

      } catch (printError) {
        console.error('❌ Print error:', printError);
        
        // Attempt to close device on error
        try {
          device.close();
        } catch (closeError) {
          console.error('❌ Failed to close device:', closeError);
        }

        res.status(500).json({
          success: false,
          error: 'Print error: ' + printError.message
        });
      }
    });

  } catch (error) {
    console.error('❌ Printer initialization error:', error);
    res.status(500).json({
      success: false,
      error: 'Printer initialization error: ' + error.message
    });
  }
});

/**
 * Test print endpoint
 * Prints a test receipt without transaction data
 * Useful for testing printer connectivity and configuration
 * 
 * @route POST /print/test
 * @returns {Object} JSON object with test print status
 */
app.post('/print/test', async (req, res) => {
  if (!printerAvailable) {
    return res.json({
      success: true,
      message: 'Mock mode: Test receipt would be printed',
      mock: true
    });
  }

  try {
    const device = new escpos.USB();
    const printer = new escpos.Printer(device);

    device.open(function(error) {
      if (error) {
        console.error('❌ Failed to open printer device:', error);
        return res.status(500).json({
          success: false,
          error: 'Failed to open printer device: ' + error.message
        });
      }

      printer
        .align('ct')
        .style('bu')
        .size(2, 2)
        .text('TEST PRINT')
        .size(1, 1)
        .style('normal')
        .text('--------------------------------')
        .text('YO-POS Print Service')
        .text('Test Receipt')
        .text('--------------------------------')
        .text(new Date().toISOString())
        .text('--------------------------------')
        .text('If you can read this,')
        .text('your printer is working!')
        .feed(3)
        .cut()
        .close();

      console.log('✅ Test receipt printed successfully');
      
      res.json({
        success: true,
        message: 'Test receipt printed successfully'
      });
    });

  } catch (error) {
    console.error('❌ Test print error:', error);
    res.status(500).json({
      success: false,
      error: 'Test print error: ' + error.message
    });
  }
});

/**
 * 404 handler for undefined routes
 */
app.use((req, res) => {
  res.status(404).json({
    success: false,
    error: 'Endpoint not found',
    availableEndpoints: [
      'GET /health',
      'POST /print',
      'POST /print/test'
    ]
  });
});

/**
 * Global error handler
 * Catches all unhandled errors and returns a proper JSON response
 */
app.use((err, req, res, next) => {
  console.error('❌ Unhandled error:', err);
  
  res.status(500).json({
    success: false,
    error: 'Internal server error',
    message: NODE_ENV === 'development' ? err.message : undefined
  });
});

/**
 * Start the server
 */
const server = app.listen(PORT, () => {
  console.log('================================');
  console.log('🖨️  YO-POS Print Service');
  console.log('================================');
  console.log(`📡 Server running on port ${PORT}`);
  console.log(`🌍 Environment: ${NODE_ENV}`);
  console.log(`🖨️  Printer status: ${printerAvailable ? '✅ Available' : '⚠️  Mock Mode'}`);
  console.log('================================');
  console.log('Available endpoints:');
  console.log(`  GET  http://localhost:${PORT}/health`);
  console.log(`  POST http://localhost:${PORT}/print`);
  console.log(`  POST http://localhost:${PORT}/print/test`);
  console.log('================================');
});

/**
 * Graceful shutdown handler
 * Ensures proper cleanup when the service is terminated
 */
process.on('SIGTERM', () => {
  console.log('📴 SIGTERM received, shutting down gracefully...');
  
  server.close(() => {
    console.log('✅ Server closed');
    process.exit(0);
  });

  // Force shutdown after 10 seconds
  setTimeout(() => {
    console.error('⚠️  Forced shutdown after timeout');
    process.exit(1);
  }, 10000);
});

process.on('SIGINT', () => {
  console.log('\n📴 SIGINT received, shutting down gracefully...');
  
  server.close(() => {
    console.log('✅ Server closed');
    process.exit(0);
  });
});

/**
 * Unhandled rejection handler
 * Logs unhandled promise rejections
 */
process.on('unhandledRejection', (reason, promise) => {
  console.error('❌ Unhandled Rejection at:', promise, 'reason:', reason);
});

module.exports = app;
