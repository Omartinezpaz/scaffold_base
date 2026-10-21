const mysql = require('mysql2/promise');

const INITIAL_PRODUCTS = [
  {
    id: 101,
    name: 'Rey de las Burgers',
    category: 'Especiales',
    specialtyLevel: 'Corona Suprema',
    badge: '👑 Nivel Suprema • Corona Real',
    price: 14.90,
    stock: 48,
    calories: '890 kcal',
    prepTime: '8-10 min',
    rating: 4.95,
    ordersCount: 412,
    image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=700&auto=format&fit=crop&q=80',
    description: 'Carne 100% Angus de 220g flameada a la leña de roble, doble cheddar añejo 18 meses, panceta ahumada al maple, cebolla caramelizada al bourbon y salsa Imperial en pan brioche artesanal.',
    ingredients: ['Pan Brioche Dorado', 'Angus 220g a la Leña', 'Doble Cheddar Añejo', 'Panceta al Maple', 'Cebolla al Bourbon', 'Salsa Imperial']
  },
  {
    id: 102,
    name: 'Burger Real Clásica',
    category: 'Clásicas',
    specialtyLevel: 'Clásica Real',
    badge: '⭐ Nivel Clásica • Tradición Real',
    price: 9.90,
    stock: 65,
    calories: '610 kcal',
    prepTime: '5-7 min',
    rating: 4.85,
    ordersCount: 538,
    image: 'https://images.unsplash.com/photo-1550547660-d9450f859349?w=700&auto=format&fit=crop&q=80',
    description: 'Medallón smash de 150g con costra dorada y jugosa, queso americano fundido, lechuga francesa orgánica, tomate reliquia, pepinillos de la casa y aderezo clásico Hamburger Rapid.',
    ingredients: ['Pan de Papa Suave', 'Medallón Smash 150g', 'Queso Americano', 'Lechuga Orgánica', 'Tomate Reliquia', 'Aderezo Rapid']
  },
  {
    id: 103,
    name: 'Burger Real Doble',
    category: 'Especiales',
    specialtyLevel: 'Doble Especialidad',
    badge: '🔥 Nivel Doble • Favorita del Chef',
    price: 12.90,
    stock: 52,
    calories: '820 kcal',
    prepTime: '7-9 min',
    rating: 4.92,
    ordersCount: 465,
    image: 'https://images.unsplash.com/photo-1586190848861-99aa4a171e90?w=700&auto=format&fit=crop&q=80',
    description: 'Doble medallón smash de 150g (300g total), triple capa de queso cheddar y monterey jack, cebolla morada grillada, tocino crujiente y salsa ahumada de la casa.',
    ingredients: ['Pan Brioche Sésamo', 'Doble Res 300g', 'Triple Queso Fundido', 'Tocino Crocante', 'Cebolla Grillada', 'Salsa Ahumada']
  },
  {
    id: 104,
    name: 'Burger Doble Especial',
    category: 'Especiales',
    specialtyLevel: 'Edición Gourmet',
    badge: '💎 Nivel Gourmet • Edición Especial',
    price: 15.50,
    stock: 36,
    calories: '940 kcal',
    prepTime: '9-11 min',
    rating: 4.98,
    ordersCount: 389,
    image: 'https://images.unsplash.com/photo-1594212699903-ec8a3eca50f5?w=700&auto=format&fit=crop&q=80',
    description: 'Doble corte Wagyu-Angus a la brasa, queso provolone y gouda trufado, hongos portobello salteados al ajillo, rúcula baby y emulsión de trufa negra y ajo rostizado.',
    ingredients: ['Pan Brioche Artesanal', 'Doble Wagyu-Angus', 'Gouda Trufado', 'Portobellos al Ajillo', 'Rúcula Baby', 'Mayo de Trufa Negra']
  },
  {
    id: 105,
    name: 'Clásica Americana Smash',
    category: 'Clásicas',
    specialtyLevel: 'Clásica Esencial',
    badge: '🍔 Nivel Clásica • Esencial Oklahoma',
    price: 8.50,
    stock: 74,
    calories: '560 kcal',
    prepTime: '4-6 min',
    rating: 4.78,
    ordersCount: 342,
    image: 'https://images.unsplash.com/photo-1571091718767-18b5b1457add?w=700&auto=format&fit=crop&q=80',
    description: 'Doble smash fina al estilo Oklahoma con cebolla blanca prensada en plancha de hierro fundido, doble queso americano, pepinillos dill y mostaza dulce.',
    ingredients: ['Pan Martin’s Potato', 'Doble Smash Fina', 'Cebolla Planchada', 'Doble Americano', 'Pepinillos Dill', 'Mostaza Dulce']
  },
  {
    id: 106,
    name: 'Clásica Bacon & Cheddar',
    category: 'Clásicas',
    specialtyLevel: 'Clásica Plus',
    badge: '🥓 Nivel Clásica Plus • Ahumada',
    price: 10.50,
    stock: 58,
    calories: '710 kcal',
    prepTime: '6-8 min',
    rating: 4.84,
    ordersCount: 310,
    image: 'https://images.unsplash.com/photo-1553979459-d2229ba7433b?w=700&auto=format&fit=crop&q=80',
    description: 'Carne a la parrilla de 180g, generoso baño de cheddar inglés fundido, tiras de tocino horneado crocante, aros de cebolla dorados y salsa BBQ de miel y nogal.',
    ingredients: ['Pan Brioche Clásico', 'Res 180g a la Parrilla', 'Cheddar Líquido', 'Tocino Horneado', 'Aros de Cebolla', 'BBQ Miel & Nogal']
  },
  {
    id: 107,
    name: 'Burger Crispy Golden Royal',
    category: 'Especiales',
    specialtyLevel: 'Especialidad Crispy',
    badge: '✨ Nivel Especial • Crujiente Dorado',
    price: 11.50,
    stock: 44,
    calories: '680 kcal',
    prepTime: '7-9 min',
    rating: 4.89,
    ordersCount: 276,
    image: 'https://images.unsplash.com/photo-1625813506062-0aeb1d7a094b?w=700&auto=format&fit=crop&q=80',
    description: 'Suprema de pollo de granja marinada 24h en suero de leche y 12 especias, rebozado extra crujiente, ensalada coleslaw de manzana verde y salsa honey mustard dorada.',
    ingredients: ['Pan Brioche Tostado', 'Pollo Crispy 12 Especias', 'Queso Cheddar Blanco', 'Coleslaw Manzana', 'Pepinillos Dulces', 'Honey Mustard']
  },
  {
    id: 108,
    name: 'Clásica Cuarto de Libra Real',
    category: 'Clásicas',
    specialtyLevel: 'Clásica Tradicional',
    badge: '⭐ Nivel Clásica • Cuarto de Libra',
    price: 9.50,
    stock: 62,
    calories: '630 kcal',
    prepTime: '5-7 min',
    rating: 4.81,
    ordersCount: 295,
    image: 'https://images.unsplash.com/photo-1572802419224-296b0aeee0d9?w=700&auto=format&fit=crop&q=80',
    description: 'Medallón jugoso de cuarto de libra sazonado con sal marina y pimienta negra recién molida, doble queso cheddar, cebolla fresca picada, kétchup artesanal y mostaza.',
    ingredients: ['Pan con Ajonjolí', 'Res Cuarto de Libra', 'Doble Cheddar', 'Cebolla Fresca', 'Kétchup Artesanal', 'Mostaza Clásica']
  },
  {
    id: 109,
    name: 'Burger Trufa & Brie Imperial',
    category: 'Especiales',
    specialtyLevel: 'Corona Suprema',
    badge: '👑 Nivel Suprema • Alta Cocina',
    price: 15.90,
    stock: 29,
    calories: '870 kcal',
    prepTime: '9-12 min',
    rating: 4.96,
    ordersCount: 224,
    image: 'https://images.unsplash.com/photo-1565299507177-b0ac66763828?w=700&auto=format&fit=crop&q=80',
    description: 'Medallón grueso de 200g, queso Brie francés derretido, mermelada tibia de tocino e higos, chalotas crujientes y reducción balsámica en pan pretzel-brioche.',
    ingredients: ['Pan Pretzel-Brioche', 'Angus 200g', 'Queso Brie Francés', 'Mermelada de Tocino', 'Chalotas Crispy', 'Reducción Balsámica']
  },
  {
    id: 110,
    name: 'Clásica Campestre Aguacate & Grill',
    category: 'Clásicas',
    specialtyLevel: 'Clásica Fresca',
    badge: '🌿 Nivel Clásica • Frescura Grill',
    price: 11.20,
    stock: 41,
    calories: '650 kcal',
    prepTime: '6-8 min',
    rating: 4.83,
    ordersCount: 248,
    image: 'https://images.unsplash.com/photo-1520072959219-c595dc870360?w=700&auto=format&fit=crop&q=80',
    description: 'Carne 100% res a la parrilla, aguacate Hass en láminas cremosas, queso suizo Emmental, pico de gallo tatemado, lechuga hidropónica y alioli suave de cilantro y lima.',
    ingredients: ['Pan Multigrano Artesanal', 'Res Grill 170g', 'Aguacate Hass', 'Queso Suizo Emmental', 'Pico de Gallo', 'Alioli Lima-Cilantro']
  }
];

const INITIAL_CUSTOMERS = [
  {
    id: 1,
    name: 'Valentina Morales',
    email: 'valentina.m@empresa.com',
    tier: 'VIP Oro',
    favoriteBurger: 'Rey de las Burgers',
    ordersCount: 28,
    totalSpent: 418.60,
    avgTicket: 14.95,
    lastOrder: 'Hace 18 min',
    consumptionSegment: 'Alto Consumo (Semanal)'
  },
  {
    id: 2,
    name: 'Mateo Fernández',
    email: 'm.fernandez@studio.io',
    tier: 'VIP Oro',
    favoriteBurger: 'Burger Doble Especial',
    ordersCount: 24,
    totalSpent: 372.00,
    avgTicket: 15.50,
    lastOrder: 'Hace 42 min',
    consumptionSegment: 'Alto Consumo (Semanal)'
  },
  {
    id: 3,
    name: 'Sofía Castellanos',
    email: 'sofia.castellanos@mail.com',
    tier: 'Miembro Plata',
    favoriteBurger: 'Burger Real Doble',
    ordersCount: 17,
    totalSpent: 234.30,
    avgTicket: 13.78,
    lastOrder: 'Hoy, 13:20',
    consumptionSegment: 'Consumo Frecuente'
  },
  {
    id: 4,
    name: 'Alejandro Ríos',
    email: 'arios@techcorp.com',
    tier: 'Miembro Plata',
    favoriteBurger: 'Burger Real Clásica',
    ordersCount: 15,
    totalSpent: 178.50,
    avgTicket: 11.90,
    lastOrder: 'Ayer, 21:10',
    consumptionSegment: 'Consumo Frecuente'
  },
  {
    id: 5,
    name: 'Camila Mendoza',
    email: 'camila.mendoza@design.co',
    tier: 'VIP Oro',
    favoriteBurger: 'Burger Trufa & Brie Imperial',
    ordersCount: 21,
    totalSpent: 333.90,
    avgTicket: 15.90,
    lastOrder: 'Hoy, 14:05',
    consumptionSegment: 'Alto Consumo (Semanal)'
  },
  {
    id: 6,
    name: 'Diego Santamaría',
    email: 'diego.santa@correo.es',
    tier: 'Club Rapid',
    favoriteBurger: 'Clásica Bacon & Cheddar',
    ordersCount: 9,
    totalSpent: 103.50,
    avgTicket: 11.50,
    lastOrder: 'Hace 3 días',
    consumptionSegment: 'Consumo Casual'
  }
];

let inMemoryProducts = [...INITIAL_PRODUCTS];
let inMemoryCustomers = [...INITIAL_CUSTOMERS];
let inMemoryOrders = [
  {
    id: 'ORD-9045',
    customerName: 'Distribuidora Central Gourmet',
    channel: 'PWA Preventa',
    origin: 'PWA Preventa',
    seller: 'Carlos Mendoza (Preventista #04)',
    items: [
      { name: 'Rey de las Burgers', qty: 6, price: 14.90 },
      { name: 'Burger Real Doble', qty: 4, price: 12.90 }
    ],
    total: 141.00,
    status: 'Pendiente de Aprobación',
    createdAt: new Date(Date.now() - 1000 * 60 * 8).toISOString(),
    idempiereSync: {
      synced: false,
      docNo: null,
      syncDate: null
    }
  },
  {
    id: 'ORD-9044',
    customerName: 'Valentina Morales',
    channel: 'E-commerce',
    origin: 'E-commerce',
    seller: 'Portal Web Directo',
    items: [
      { name: 'Rey de las Burgers', qty: 2, price: 14.90 },
      { name: 'Burger Real Clásica', qty: 1, price: 9.90 }
    ],
    total: 39.70,
    status: 'En preparación',
    createdAt: new Date(Date.now() - 1000 * 60 * 18).toISOString(),
    idempiereSync: {
      synced: true,
      docNo: 'CO-100412',
      syncDate: new Date(Date.now() - 1000 * 60 * 16).toISOString()
    }
  },
  {
    id: 'ORD-9043',
    customerName: 'Cafetería & Bistro Plaza',
    channel: 'PWA Preventa',
    origin: 'PWA Preventa',
    seller: 'Lucía Navarro (Preventista #02)',
    items: [
      { name: 'Burger Doble Especial', qty: 5, price: 15.50 },
      { name: 'Clásica Bacon & Cheddar', qty: 5, price: 10.50 }
    ],
    total: 130.00,
    status: 'Aprobado',
    createdAt: new Date(Date.now() - 1000 * 60 * 35).toISOString(),
    idempiereSync: {
      synced: true,
      docNo: 'CO-100411',
      syncDate: new Date(Date.now() - 1000 * 60 * 30).toISOString()
    }
  },
  {
    id: 'ORD-9042',
    customerName: 'Mateo Fernández',
    channel: 'E-commerce',
    origin: 'E-commerce',
    seller: 'Portal Web Directo',
    items: [
      { name: 'Burger Doble Especial', qty: 1, price: 15.50 },
      { name: 'Burger Real Doble', qty: 1, price: 12.90 }
    ],
    total: 28.40,
    status: 'Entregado',
    createdAt: new Date(Date.now() - 1000 * 60 * 52).toISOString(),
    idempiereSync: {
      synced: true,
      docNo: 'CO-100408',
      syncDate: new Date(Date.now() - 1000 * 60 * 50).toISOString()
    }
  },
  {
    id: 'ORD-9041',
    customerName: 'Hotel Boutique Las Terrazas',
    channel: 'PWA Preventa',
    origin: 'PWA Preventa',
    seller: 'Carlos Mendoza (Preventista #04)',
    items: [
      { name: 'Burger Trufa & Brie Imperial', qty: 8, price: 15.90 },
      { name: 'Burger Crispy Golden Royal', qty: 4, price: 11.50 }
    ],
    total: 173.20,
    status: 'Facturado ERP',
    createdAt: new Date(Date.now() - 1000 * 60 * 95).toISOString(),
    idempiereSync: {
      synced: true,
      docNo: 'CO-100405',
      syncDate: new Date(Date.now() - 1000 * 60 * 90).toISOString()
    }
  },
  {
    id: 'ORD-9040',
    customerName: 'Andrés Villalobos',
    channel: 'E-commerce',
    origin: 'E-commerce',
    seller: 'Portal Web Directo',
    items: [
      { name: 'Burger Crispy Golden Royal', qty: 2, price: 11.50 }
    ],
    total: 23.00,
    status: 'Entregado',
    createdAt: new Date(Date.now() - 1000 * 60 * 140).toISOString(),
    idempiereSync: {
      synced: true,
      docNo: 'CO-100401',
      syncDate: new Date(Date.now() - 1000 * 60 * 138).toISOString()
    }
  }
];

let pool = null;
let isConnectedToMySQL = false;
let lastDbError = null;

async function initDB() {
  const databaseUrl = process.env.DATABASE_URL || process.env.MYSQL_URL;
  const host = process.env.DB_HOST || process.env.MYSQL_HOST;
  const user = process.env.DB_USER || process.env.MYSQL_USER || 'root';
  const password = process.env.DB_PASSWORD || process.env.MYSQL_PASSWORD || '';
  const database = process.env.DB_NAME || process.env.MYSQL_DATABASE || 'hamburger_rapid';
  const port = parseInt(process.env.DB_PORT || '3306', 10);

  if (!databaseUrl && !host) {
    lastDbError = 'Sin variables DB_HOST / DATABASE_URL configuradas. Motor In-Memory activo con catálogo Hamburger Rapid.';
    console.log(`ℹ️ [DB] ${lastDbError}`);
    return;
  }

  try {
    if (databaseUrl) {
      pool = mysql.createPool(databaseUrl);
    } else {
      pool = mysql.createPool({
        host,
        user,
        password,
        database,
        port,
        waitForConnections: true,
        connectionLimit: 10,
        queueLimit: 0,
        connectTimeout: 8000
      });
    }

    const connection = await pool.getConnection();
    console.log(`✅ [DB] Conectado exitosamente a MySQL (${host || 'URL'} - BD: ${database})`);

    await connection.query(`
      CREATE TABLE IF NOT EXISTS products (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        category VARCHAR(100) NOT NULL,
        price DECIMAL(10,2) NOT NULL,
        stock INT NOT NULL DEFAULT 0,
        image VARCHAR(500),
        description TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    const [rows] = await connection.query('SELECT COUNT(*) as count FROM products');
    if (rows[0].count === 0) {
      for (const p of INITIAL_PRODUCTS) {
        await connection.query(
          'INSERT INTO products (name, category, price, stock, image, description) VALUES (?, ?, ?, ?, ?, ?)',
          [p.name, p.category, p.price, p.stock, p.image, p.description]
        );
      }
    }

    connection.release();
    isConnectedToMySQL = true;
    lastDbError = null;
  } catch (error) {
    lastDbError = error.message;
    console.warn(`⚠️ [DB] No se pudo conectar a MySQL: ${error.message}. Operando en modo In-Memory.`);
    isConnectedToMySQL = false;
  }
}

async function getProducts() {
  if (!isConnectedToMySQL && (process.env.DB_HOST || process.env.DATABASE_URL)) {
    await initDB();
  }

  if (isConnectedToMySQL && pool) {
    try {
      const [rows] = await pool.query('SELECT * FROM products ORDER BY id ASC');
      return rows.map((r, idx) => ({
        ...INITIAL_PRODUCTS[idx % INITIAL_PRODUCTS.length],
        ...r,
        price: parseFloat(r.price)
      }));
    } catch (err) {
      lastDbError = err.message;
    }
  }
  return inMemoryProducts;
}

async function addProduct({ name, category, price, stock, image, description, badge, specialtyLevel }) {
  const newProduct = {
    id: Date.now(),
    name,
    category: category || 'Especiales',
    specialtyLevel: specialtyLevel || 'Especialidad Rapid',
    badge: badge || (category === 'Clásicas' ? '⭐ Nivel Clásica • Tradición Real' : '👑 Nivel Especial • Chef Signature'),
    price: parseFloat(price) || 10.90,
    stock: parseInt(stock, 10) || 30,
    calories: '720 kcal',
    prepTime: '6-8 min',
    rating: 4.9,
    ordersCount: 1,
    image: image || 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=700&auto=format&fit=crop&q=80',
    description: description || 'Hamburguesa artesanal preparada al momento con ingredientes seleccionados.',
    ingredients: ['Pan Brioche Artesanal', 'Medallón 100% Res', 'Queso Cheddar', 'Salsa Especial Rapid']
  };

  if (isConnectedToMySQL && pool) {
    try {
      const [result] = await pool.query(
        'INSERT INTO products (name, category, price, stock, image, description) VALUES (?, ?, ?, ?, ?, ?)',
        [newProduct.name, newProduct.category, newProduct.price, newProduct.stock, newProduct.image, newProduct.description]
      );
      newProduct.id = result.insertId;
    } catch (err) {
      lastDbError = err.message;
    }
  }

  inMemoryProducts.unshift(newProduct);
  return newProduct;
}

async function deleteProduct(id) {
  const numId = parseInt(id, 10);
  if (isConnectedToMySQL && pool) {
    try {
      await pool.query('DELETE FROM products WHERE id = ?', [numId]);
    } catch (err) {
      lastDbError = err.message;
    }
  }
  inMemoryProducts = inMemoryProducts.filter(p => p.id !== numId);
  return true;
}

async function resetProducts() {
  if (isConnectedToMySQL && pool) {
    try {
      await pool.query('TRUNCATE TABLE products');
      for (const p of INITIAL_PRODUCTS) {
        await pool.query(
          'INSERT INTO products (name, category, price, stock, image, description) VALUES (?, ?, ?, ?, ?, ?)',
          [p.name, p.category, p.price, p.stock, p.image, p.description]
        );
      }
    } catch (err) {
      lastDbError = err.message;
    }
  }
  inMemoryProducts = [...INITIAL_PRODUCTS];
  inMemoryCustomers = [...INITIAL_CUSTOMERS];
}

function getCustomers() {
  return inMemoryCustomers;
}

function getOrders() {
  return inMemoryOrders;
}

function createOrder({ customerName = 'Cliente Invitado', items = [], total = 0 }) {
  const order = {
    id: `ORD-${Math.floor(1000 + Math.random() * 9000)}`,
    customerName,
    items,
    total: parseFloat(total) || 0,
    status: 'En preparación',
    createdAt: new Date().toISOString()
  };
  inMemoryOrders.unshift(order);

  // Actualizar métricas en vivo de productos y consumidores
  items.forEach(item => {
    const prod = inMemoryProducts.find(p => p.id === item.id || p.name === item.name);
    if (prod) {
      prod.ordersCount = (prod.ordersCount || 0) + (item.qty || 1);
      prod.stock = Math.max(0, (prod.stock || 0) - (item.qty || 1));
    }
  });

  const existingCust = inMemoryCustomers.find(c => c.name.toLowerCase() === customerName.toLowerCase());
  if (existingCust) {
    existingCust.ordersCount += 1;
    existingCust.totalSpent = parseFloat((existingCust.totalSpent + order.total).toFixed(2));
    existingCust.avgTicket = parseFloat((existingCust.totalSpent / existingCust.ordersCount).toFixed(2));
    existingCust.lastOrder = 'Hace instantes';
  } else {
    inMemoryCustomers.unshift({
      id: Date.now(),
      name: customerName,
      email: `${customerName.toLowerCase().replace(/\s+/g, '.')}@rapidclient.com`,
      tier: order.total > 25 ? 'Miembro Plata' : 'Club Rapid',
      favoriteBurger: items[0]?.name || 'Rey de las Burgers',
      ordersCount: 1,
      totalSpent: order.total,
      avgTicket: order.total,
      lastOrder: 'Hace instantes',
      consumptionSegment: 'Nuevo Consumidor'
    });
  }

  return order;
}

function getDbStatus() {
  return {
    mode: isConnectedToMySQL ? 'mysql' : 'in-memory',
    connected: isConnectedToMySQL,
    engine: isConnectedToMySQL ? 'MySQL 8.0 InnoDB' : 'Hamburger Rapid In-Memory Store v1.0',
    host: process.env.DB_HOST || (process.env.DATABASE_URL ? 'via-database-url' : 'localhost (In-Memory)'),
    database: process.env.DB_NAME || 'hamburger_rapid',
    user: process.env.DB_USER || 'rapid_arch',
    latencyMs: isConnectedToMySQL ? 4.2 : 0.8,
    totalProducts: inMemoryProducts.length,
    totalCustomers: inMemoryCustomers.length,
    totalOrders: inMemoryOrders.length,
    error: lastDbError
  };
}

function syncOrderToIdempiere(orderId, docNo) {
  const order = inMemoryOrders.find(o => o.id === orderId);
  if (!order) return null;
  const generatedDocNo = docNo || `CO-${Math.floor(100400 + Math.random() * 500)}`;
  order.idempiereSync = {
    synced: true,
    docNo: generatedDocNo,
    syncDate: new Date().toISOString()
  };
  order.status = 'Sincronizado iDempiere';
  return order;
}

module.exports = {
  initDB,
  getProducts,
  addProduct,
  deleteProduct,
  resetProducts,
  getCustomers,
  getOrders,
  createOrder,
  syncOrderToIdempiere,
  getDbStatus
};
