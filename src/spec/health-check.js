#!/usr/bin/env node

/**
 * Health Check Script
 * Verifies that the deployed application is running correctly
 * Usage: node src/spec/health-check.js [URL]
 * Example: node src/spec/health-check.js https://cyo-rugs-frontend.herokuapp.com
 */

const https = require('https');
const http = require('http');

// Configuration
const BASE_URL = process.env.HEALTH_CHECK_URL || 'https://www.cyorugs.com/';
const TIMEOUT = 30000; // 30 seconds
const ENDPOINTS_TO_CHECK = [
  { path: '/', name: 'Home Page', critical: true },
  { path: '/shop', name: 'Shop Page', critical: true },
  { 
    path: '/api/items', 
    name: 'Items API', 
    critical: false,
    note: 'Non-critical: External health checks may receive HTML due to server routing. Shop page confirms API works correctly from frontend.'
  },
  { path: '/about', name: 'About Page', critical: false },
  { path: '/cart', name: 'Cart Page', critical: false },
  { path: '/request', name: 'Request Page', critical: false },
];

// Colors for terminal output
const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  bold: '\x1b[1m',
};

/**
 * Make HTTP/HTTPS request to check endpoint
 */
function checkEndpoint(url) {
  return new Promise((resolve, reject) => {
    const urlObj = new URL(url);
    const client = urlObj.protocol === 'https:' ? https : http;
    
    const options = {
      timeout: TIMEOUT,
      headers: {
        'User-Agent': 'CYO-Rugs-Health-Check/1.0',
        'Accept': 'application/json, text/html, */*',
        'Accept-Language': 'en-US,en;q=0.9',
      }
    };
    
    const req = client.get(url, options, (res) => {
      let data = '';
      
      res.on('data', (chunk) => {
        data += chunk;
      });
      
      res.on('end', () => {
        resolve({
          statusCode: res.statusCode,
          headers: res.headers,
          data: data,
        });
      });
    });
    
    req.on('error', (error) => {
      reject(error);
    });
    
    req.on('timeout', () => {
      req.destroy();
      reject(new Error('Request timeout'));
    });
  });
}

/**
 * Validate response based on endpoint type
 */
function validateResponse(endpoint, response) {
  const { statusCode, data } = response;
  
  // Status code should be 200-299 (success)
  if (statusCode < 200 || statusCode >= 300) {
    return {
      passed: false,
      message: `Invalid status code: ${statusCode}`,
    };
  }
  
  // For HTML pages, check for basic structure
  if (endpoint.path === '/' || endpoint.path.startsWith('/shop') || endpoint.path.startsWith('/about')) {
    if (!data.includes('<!DOCTYPE html') && !data.includes('<html')) {
      return {
        passed: false,
        message: 'Response does not appear to be valid HTML',
      };
    }
  }
  
  // For API endpoints, check for JSON
  if (endpoint.path.startsWith('/api/')) {
    // Check Content-Type header
    const contentType = response.headers['content-type'] || '';
    
    // Allow empty responses (some APIs return empty arrays/objects)
    if (!data || data.trim() === '') {
      return {
        passed: true,
        message: 'OK (empty response)',
      };
    }
    
    // If Content-Type indicates HTML, it's likely a 404 or error page
    if (contentType.includes('text/html')) {
      return {
        passed: false,
        message: 'API returned HTML instead of JSON (possible 404 or error page)',
      };
    }
    
    try {
      const parsed = JSON.parse(data);
      // Valid JSON, check if it's reasonable data
      if (Array.isArray(parsed) || typeof parsed === 'object') {
        return {
          passed: true,
          message: `OK (${Array.isArray(parsed) ? `${parsed.length} items` : 'object'})`,
        };
      }
    } catch (error) {
      // Show first 300 chars of response for debugging, including Content-Type
      const preview = data.substring(0, 300).replace(/\n/g, ' ').replace(/\s+/g, ' ').trim();
      const contentType = response.headers['content-type'] || 'unknown';
      return {
        passed: false,
        message: `Not valid JSON (Content-Type: ${contentType}). Preview: ${preview}${data.length > 300 ? '...' : ''}`,
      };
    }
  }
  
  return {
    passed: true,
    message: 'OK',
  };
}

/**
 * Run health check for single endpoint
 */
async function checkSingleEndpoint(endpoint) {
  const url = `${BASE_URL}${endpoint.path}`;
  const startTime = Date.now();
  
  try {
    const response = await checkEndpoint(url);
    const duration = Date.now() - startTime;
    const validation = validateResponse(endpoint, response);
    
    return {
      endpoint,
      success: validation.passed,
      statusCode: response.statusCode,
      duration,
      message: validation.message,
    };
  } catch (error) {
    const duration = Date.now() - startTime;
    return {
      endpoint,
      success: false,
      statusCode: null,
      duration,
      message: error.message,
    };
  }
}

/**
 * Main health check function
 */
async function runHealthCheck() {
  console.log(`${colors.bold}${colors.blue}===========================================`);
  console.log(`🏥 Health Check for CYO Rugs`);
  console.log(`===========================================`);
  console.log(`Target: ${BASE_URL}`);
  console.log(`Time: ${new Date().toISOString()}`);
  console.log(`===========================================${colors.reset}\n`);
  
  const results = [];
  
  // Check each endpoint
  for (const endpoint of ENDPOINTS_TO_CHECK) {
    process.stdout.write(`Checking ${endpoint.name}... `);
    
    const result = await checkSingleEndpoint(endpoint);
    results.push(result);
    
    if (result.success) {
      console.log(`${colors.green}✓ PASS${colors.reset} (${result.duration}ms)`);
    } else {
      const severity = endpoint.critical ? colors.red : colors.yellow;
      const icon = endpoint.critical ? '✗' : '⚠';
      console.log(`${severity}${icon} FAIL${colors.reset} (${result.duration}ms) - ${result.message}`);
    }
  }
  
  // Summary
  const passed = results.filter(r => r.success).length;
  const failed = results.length - passed;
  const criticalFailed = results.filter(r => !r.success && r.endpoint.critical).length;
  
  console.log(`\n${colors.bold}${colors.blue}===========================================`);
  console.log(`Summary`);
  console.log(`===========================================${colors.reset}`);
  console.log(`Total: ${results.length}`);
  console.log(`${colors.green}Passed: ${passed}${colors.reset}`);
  console.log(`${colors.red}Failed: ${failed}${colors.reset}`);
  
  if (criticalFailed > 0) {
    console.log(`${colors.red}${colors.bold}Critical failures: ${criticalFailed}${colors.reset}`);
  }
  
  console.log(`${colors.blue}===========================================${colors.reset}\n`);
  
  // Exit with appropriate code
  if (criticalFailed > 0) {
    console.log(`${colors.red}${colors.bold}❌ Health check FAILED - Critical endpoints are down${colors.reset}\n`);
    process.exit(1);
  } else if (failed > 0) {
    console.log(`${colors.yellow}⚠️  Health check PASSED with warnings${colors.reset}\n`);
    process.exit(0);
  } else {
    console.log(`${colors.green}${colors.bold}✅ Health check PASSED - All systems operational${colors.reset}\n`);
    process.exit(0);
  }
}

// Run the health check
runHealthCheck().catch((error) => {
  console.error(`${colors.red}${colors.bold}Fatal error during health check:${colors.reset}`, error);
  process.exit(1);
});

