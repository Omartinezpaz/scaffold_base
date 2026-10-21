const express = require('express');
const router = express.Router();
const db = require('../db');
const dns = require('dns').promises;
const os = require('os');
const net = require('net');

// Health Check Endpoint (For Dokploy Health Checks & Admin Dashboard)
router.get('/health', (req, res) => {
  const dbStatus = db.getDbStatus();
  res.json({
    status: 'healthy',
    brand: 'Hamburger Rapid Commercial v1.0',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    version: '1.0.0',
    platform: 'Hamburger Rapid Enterprise Cloud',
    database: dbStatus
  });
});

// List products (10 featured burgers + any newly added)
router.get('/products', async (req, res) => {
  try {
    const products = await db.getProducts();
    res.json({
      success: true,
      count: products.length,
      data: products
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Add new product
router.post('/products', async (req, res) => {
  try {
    const { name, category, price, stock, image, description, badge, specialtyLevel } = req.body;
    if (!name || price === undefined) {
      return res.status(400).json({ success: false, error: 'Nombre y precio son requeridos.' });
    }
    const product = await db.addProduct({ name, category, price, stock, image, description, badge, specialtyLevel });
    res.status(201).json({ success: true, message: 'Hamburguesa agregada exitosamente', data: product });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Delete product
router.delete('/products/:id', async (req, res) => {
  try {
    const { id } = req.params;
    await db.deleteProduct(id);
    res.json({ success: true, message: `Hamburguesa ${id} eliminada.` });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// List customers & consumption metrics
router.get('/customers', (req, res) => {
  try {
    const customers = db.getCustomers();
    res.json({
      success: true,
      count: customers.length,
      data: customers
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// List orders
router.get('/orders', (req, res) => {
  try {
    const orders = db.getOrders();
    res.json({
      success: true,
      count: orders.length,
      data: orders
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Create simulated order from PWA or E-commerce
router.post('/orders', (req, res) => {
  try {
    const { customerName, items, total } = req.body;
    const order = db.createOrder({ customerName, items, total });
    res.status(201).json({
      success: true,
      message: 'Orden procesada exitosamente en Hamburger Rapid',
      data: order
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Sync order to iDempiere ERP
router.post('/orders/:id/sync', (req, res) => {
  try {
    const { id } = req.params;
    const { docNo } = req.body || {};
    const updated = db.syncOrderToIdempiere(id, docNo);
    if (!updated) {
      return res.status(404).json({ success: false, error: 'Orden no encontrada' });
    }
    res.json({
      success: true,
      message: `Orden ${id} sincronizada en iDempiere ERP con documento ${updated.idempiereSync.docNo}`,
      data: updated
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Proxy for iDempiere REST API (CORS bypass)
router.post('/idempiere-proxy', async (req, res) => {
  try {
    const { targetUrl, method = 'POST', headers = {}, body } = req.body;
    if (!targetUrl) {
      return res.status(400).json({ success: false, error: 'targetUrl es requerido' });
    }

    const fetchOptions = {
      method: method.toUpperCase(),
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        ...headers
      }
    };

    if (body && ['POST', 'PUT', 'PATCH'].includes(fetchOptions.method)) {
      fetchOptions.body = typeof body === 'string' ? body : JSON.stringify(body);
    }

    const idempiereRes = await fetch(targetUrl, fetchOptions);
    const contentType = idempiereRes.headers.get('content-type') || '';
    
    let responseData;
    if (contentType.includes('application/json')) {
      responseData = await idempiereRes.json();
    } else {
      const text = await idempiereRes.text();
      try {
        responseData = JSON.parse(text);
      } catch {
        responseData = { rawResponse: text };
      }
    }

    res.status(idempiereRes.status).json(responseData);
  } catch (error) {
    console.error('Error en /api/idempiere-proxy:', error.message);
    res.status(502).json({
      success: false,
      error: `Error de conexión hacia iDempiere: ${error.message}`
    });
  }
});

// Reset initial catalog
router.post('/reset', async (req, res) => {
  try {
    await db.resetProducts();
    res.json({ success: true, message: 'Catálogo Hamburger Rapid restablecido.' });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Helper for socket testing
function checkTcpPort(host, port = 3306, timeout = 300) {
  return new Promise((resolve) => {
    const socket = new net.Socket();
    socket.setTimeout(timeout);
    socket.once('connect', () => {
      socket.destroy();
      resolve({ host, port, open: true });
    });
    socket.once('timeout', () => {
      socket.destroy();
      resolve({ host, port, open: false, reason: 'timeout' });
    });
    socket.once('error', (err) => {
      resolve({ host, port, open: false, reason: err.code || err.message });
    });
    socket.connect(port, host);
  });
}

// Diagnostic network endpoint
router.get('/debug-network', async (req, res) => {
  const hostsToTest = [
    process.env.DB_HOST,
    '172.18.0.1',
    '172.17.0.1',
    '127.0.0.1'
  ].filter(Boolean);

  const dnsResults = {};
  for (const host of hostsToTest) {
    try {
      const lookup = await dns.lookup(host);
      dnsResults[host] = { ok: true, ip: lookup.address };
    } catch (err) {
      dnsResults[host] = { ok: false, error: err.message };
    }
  }

  const candidateTargets = ['172.18.0.1', '172.17.0.1'];
  for (let i = 2; i <= 30; i++) {
    candidateTargets.push(`172.18.0.${i}`);
  }

  const portScans = await Promise.all(candidateTargets.map(ip => checkTcpPort(ip, 3306, 250)));
  const open3306 = portScans.filter(p => p.open);

  res.json({
    hostname: os.hostname(),
    interfaces: os.networkInterfaces(),
    environment: {
      DB_HOST: process.env.DB_HOST,
      DB_PORT: process.env.DB_PORT,
      DB_USER: process.env.DB_USER,
      DB_NAME: process.env.DB_NAME,
      HAS_PASSWORD: !!process.env.DB_PASSWORD,
      HAS_DATABASE_URL: !!process.env.DATABASE_URL
    },
    dns_tests: dnsResults,
    open_mysql_ports_found: open3306,
    db_status: db.getDbStatus()
  });
});

module.exports = router;
