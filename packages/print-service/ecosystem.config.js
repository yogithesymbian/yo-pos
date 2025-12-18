/**
 * PM2 Ecosystem Configuration for YO-POS Print Service
 * 
 * This configuration file defines how PM2 should manage the print service process.
 * PM2 is a production process manager for Node.js applications with a built-in
 * load balancer, monitoring, and auto-restart capabilities.
 * 
 * Usage:
 *   Start:   pm2 start ecosystem.config.js
 *   Stop:    pm2 stop print-service
 *   Restart: pm2 restart print-service
 *   Monitor: pm2 monit
 *   Logs:    pm2 logs print-service
 * 
 * @see https://pm2.keymetrics.io/docs/usage/application-declaration/
 */

module.exports = {
  apps: [
    {
      /**
       * Application Configuration
       */
      name: 'print-service',
      script: './src/index.js',
      
      /**
       * Process Management
       */
      instances: 1, // Run single instance (printer access should not be shared)
      exec_mode: 'fork', // Fork mode (not cluster, as printer is a single resource)
      
      /**
       * Auto Restart Configuration
       */
      autorestart: true, // Auto restart if process crashes
      watch: false, // Disable file watching in production
      max_memory_restart: '200M', // Restart if memory usage exceeds 200MB
      
      /**
       * Error Handling
       */
      max_restarts: 10, // Maximum number of consecutive restarts
      min_uptime: '10s', // Minimum uptime before considering startup successful
      restart_delay: 4000, // Delay between restarts (4 seconds)
      
      /**
       * Environment Variables
       */
      env: {
        NODE_ENV: 'development',
        PORT: 3001
      },
      env_production: {
        NODE_ENV: 'production',
        PORT: 3001
      },
      
      /**
       * Logging Configuration
       */
      error_file: './logs/error.log', // Error log file path
      out_file: './logs/out.log', // Output log file path
      log_file: './logs/combined.log', // Combined log file path
      time: true, // Prefix logs with timestamp
      log_date_format: 'YYYY-MM-DD HH:mm:ss Z', // Log timestamp format
      merge_logs: true, // Merge logs from all instances
      
      /**
       * Advanced Options
       */
      kill_timeout: 5000, // Time to wait before force killing (5 seconds)
      listen_timeout: 3000, // Time to wait for app to be ready (3 seconds)
      shutdown_with_message: false, // Don't use process.send for shutdown
      
      /**
       * Process Monitoring
       * Uncomment to enable PM2 Plus monitoring features
       */
      // pmx: true,
      // instance_var: 'INSTANCE_ID'
    }
  ],

  /**
   * Deployment Configuration
   * 
   * This section can be used to configure PM2 deployment workflows.
   * Uncomment and configure as needed for your deployment setup.
   */
  // deploy: {
  //   production: {
  //     user: 'node',
  //     host: 'your-server.com',
  //     ref: 'origin/main',
  //     repo: 'git@github.com:yogithesymbian/yo-pos.git',
  //     path: '/var/www/yo-pos',
  //     'post-deploy': 'cd packages/print-service && npm install && pm2 reload ecosystem.config.js --env production'
  //   }
  // }
};
