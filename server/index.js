require('dotenv').config();
const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

// Database configuration
const dbConfig = {
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'restaurant_management',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
};

// Create MySQL connection pool for better performance
const pool = mysql.createPool(dbConfig).promise();

// Test database connection
async function testConnection() {
  try {
    const connection = await pool.getConnection();
    console.log('Successfully connected to MySQL database');
    console.log('Database config:', {
      host: dbConfig.host,
      user: dbConfig.user,
      database: dbConfig.database
    });
    
    // Create tables
    await createTables(connection);
    
    connection.release();
  } catch (error) {
    console.error('Error connecting to MySQL:', error);
    console.error('Please ensure MySQL is running and the database exists');
    process.exit(1);
  }
}

// Create required tables
async function createTables(connection) {
  try {
    // Create database if it doesn't exist
    await connection.query(`CREATE DATABASE IF NOT EXISTS ${dbConfig.database}`);
    await connection.query(`USE ${dbConfig.database}`);
    console.log('Database created or already exists');

    // Create menu_items table
    await connection.query(`
      CREATE TABLE IF NOT EXISTS menu_items (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        description TEXT,
        price DECIMAL(10,2) NOT NULL,
        category VARCHAR(50) NOT NULL,
        is_available BOOLEAN DEFAULT true,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      )
    `);
    console.log('Menu items table ready');

    // Create orders table
    await connection.query(`
      CREATE TABLE IF NOT EXISTS orders (
        id INT AUTO_INCREMENT PRIMARY KEY,
        table_number INT NOT NULL,
        status VARCHAR(50) NOT NULL DEFAULT 'pending',
        total_amount DECIMAL(10,2) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      )
    `);
    console.log('Orders table ready');

    // Create order_items table
    await connection.query(`
      CREATE TABLE IF NOT EXISTS order_items (
        id INT AUTO_INCREMENT PRIMARY KEY,
        order_id INT NOT NULL,
        menu_item_id INT NOT NULL,
        quantity INT NOT NULL,
        price DECIMAL(10,2) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE,
        FOREIGN KEY (menu_item_id) REFERENCES menu_items(id)
      )
    `);
    console.log('Order items table ready');
  } catch (error) {
    console.error('Error creating tables:', error);
    throw error;
  }
}

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    error: 'Something went wrong!',
    message: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

// Menu Items endpoints
app.get('/api/menu-items', async (req, res, next) => {
  try {
    const [items] = await pool.query('SELECT * FROM menu_items ORDER BY category, name');
    res.json(items);
  } catch (error) {
    next(error);
  }
});

app.post('/api/menu-items', async (req, res, next) => {
  const { name, description, price, category, is_available } = req.body;
  
  try {
    const [result] = await pool.query(
      'INSERT INTO menu_items (name, description, price, category, is_available) VALUES (?, ?, ?, ?, ?)',
      [name, description, price, category, is_available]
    );
    
    const [item] = await pool.query('SELECT * FROM menu_items WHERE id = ?', [result.insertId]);
    res.status(201).json(item[0]);
  } catch (error) {
    next(error);
  }
});

app.put('/api/menu-items/:id', async (req, res, next) => {
  const { id } = req.params;
  const { name, description, price, category, is_available } = req.body;
  
  try {
    await pool.query(
      'UPDATE menu_items SET name = ?, description = ?, price = ?, category = ?, is_available = ? WHERE id = ?',
      [name, description, price, category, is_available, id]
    );
    
    const [item] = await pool.query('SELECT * FROM menu_items WHERE id = ?', [id]);
    if (item.length === 0) {
      return res.status(404).json({ error: 'Menu item not found' });
    }
    res.json(item[0]);
  } catch (error) {
    next(error);
  }
});

app.delete('/api/menu-items/:id', async (req, res, next) => {
  const { id } = req.params;
  
  try {
    const [result] = await pool.query('DELETE FROM menu_items WHERE id = ?', [id]);
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Menu item not found' });
    }
    res.status(204).send();
  } catch (error) {
    next(error);
  }
});

// Orders endpoints
app.get('/api/orders', async (req, res, next) => {
  try {
    const [orders] = await pool.query(`
      SELECT o.*, oi.id as item_id, oi.menu_item_id, oi.quantity, oi.price, mi.name
      FROM orders o
      LEFT JOIN order_items oi ON o.id = oi.order_id
      LEFT JOIN menu_items mi ON oi.menu_item_id = mi.id
      ORDER BY o.created_at DESC
    `);

    const groupedOrders = orders.reduce((acc, row) => {
      if (!acc[row.id]) {
        acc[row.id] = {
          id: row.id,
          table_number: row.table_number,
          status: row.status,
          total_amount: row.total_amount,
          created_at: row.created_at,
          updated_at: row.updated_at,
          items: []
        };
      }
      
      if (row.item_id) {
        acc[row.id].items.push({
          id: row.item_id,
          menu_item_id: row.menu_item_id,
          name: row.name,
          quantity: row.quantity,
          price: row.price
        });
      }
      
      return acc;
    }, {});

    res.json(Object.values(groupedOrders));
  } catch (error) {
    next(error);
  }
});

app.post('/api/orders', async (req, res, next) => {
  const { table_number, items } = req.body;
  
  if (!items || !Array.isArray(items) || items.length === 0) {
    return res.status(400).json({ error: 'Order must include at least one item' });
  }

  let connection;
  try {
    connection = await pool.getConnection();
    await connection.beginTransaction();

    // Calculate total amount
    const total_amount = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);

    // Create order
    const [orderResult] = await connection.query(
      'INSERT INTO orders (table_number, status, total_amount) VALUES (?, ?, ?)',
      [table_number, 'pending', total_amount]
    );

    // Create order items
    const orderItems = items.map(item => [
      orderResult.insertId,
      item.id,
      item.quantity,
      item.price
    ]);

    await connection.query(
      'INSERT INTO order_items (order_id, menu_item_id, quantity, price) VALUES ?',
      [orderItems]
    );

    await connection.commit();

    // Fetch the complete order
    const [newOrder] = await connection.query(`
      SELECT o.*, oi.id as item_id, oi.menu_item_id, oi.quantity, oi.price, mi.name
      FROM orders o
      LEFT JOIN order_items oi ON o.id = oi.order_id
      LEFT JOIN menu_items mi ON oi.menu_item_id = mi.id
      WHERE o.id = ?
    `, [orderResult.insertId]);

    const formattedOrder = {
      id: newOrder[0].id,
      table_number: newOrder[0].table_number,
      status: newOrder[0].status,
      total_amount: newOrder[0].total_amount,
      created_at: newOrder[0].created_at,
      updated_at: newOrder[0].updated_at,
      items: newOrder.map(row => ({
        id: row.item_id,
        menu_item_id: row.menu_item_id,
        name: row.name,
        quantity: row.quantity,
        price: row.price
      }))
    };

    res.status(201).json(formattedOrder);
  } catch (error) {
    if (connection) {
      await connection.rollback();
    }
    next(error);
  } finally {
    if (connection) {
      connection.release();
    }
  }
});

// Update entire order
app.put('/api/orders/:id', async (req, res, next) => {
  const { id } = req.params;
  const { table_number, status, items } = req.body;
  
  if (!items || !Array.isArray(items) || items.length === 0) {
    return res.status(400).json({ error: 'Order must include at least one item' });
  }

  let connection;
  try {
    connection = await pool.getConnection();
    await connection.beginTransaction();

    // Calculate total amount
    const total_amount = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);

    // Update order
    const [orderResult] = await connection.query(
      'UPDATE orders SET table_number = ?, status = ?, total_amount = ? WHERE id = ?',
      [table_number, status, total_amount, id]
    );

    if (orderResult.affectedRows === 0) {
      await connection.rollback();
      return res.status(404).json({ error: 'Order not found' });
    }

    // Delete existing order items
    await connection.query('DELETE FROM order_items WHERE order_id = ?', [id]);

    // Create new order items
    const orderItems = items.map(item => [
      id,
      item.id,
      item.quantity,
      item.price
    ]);

    await connection.query(
      'INSERT INTO order_items (order_id, menu_item_id, quantity, price) VALUES ?',
      [orderItems]
    );

    await connection.commit();

    // Fetch the updated order
    const [updatedOrder] = await connection.query(`
      SELECT o.*, oi.id as item_id, oi.menu_item_id, oi.quantity, oi.price, mi.name
      FROM orders o
      LEFT JOIN order_items oi ON o.id = oi.order_id
      LEFT JOIN menu_items mi ON oi.menu_item_id = mi.id
      WHERE o.id = ?
    `, [id]);

    const formattedOrder = {
      id: updatedOrder[0].id,
      table_number: updatedOrder[0].table_number,
      status: updatedOrder[0].status,
      total_amount: updatedOrder[0].total_amount,
      created_at: updatedOrder[0].created_at,
      updated_at: updatedOrder[0].updated_at,
      items: updatedOrder.map(row => ({
        id: row.item_id,
        menu_item_id: row.menu_item_id,
        name: row.name,
        quantity: row.quantity,
        price: row.price
      }))
    };

    res.json(formattedOrder);
  } catch (error) {
    if (connection) {
      await connection.rollback();
    }
    next(error);
  } finally {
    if (connection) {
      connection.release();
    }
  }
});

// Update order status
app.put('/api/orders/:id/status', async (req, res, next) => {
  const { id } = req.params;
  const { status } = req.body;
  
  try {
    const [result] = await pool.query(
      'UPDATE orders SET status = ? WHERE id = ?',
      [status, id]
    );
    
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Order not found' });
    }
    
    const [order] = await pool.query('SELECT * FROM orders WHERE id = ?', [id]);
    res.json(order[0]);
  } catch (error) {
    next(error);
  }
});

// Delete order
app.delete('/api/orders/:id', async (req, res, next) => {
  const { id } = req.params;
  
  let connection;
  try {
    connection = await pool.getConnection();
    await connection.beginTransaction();

    // Delete order items first (they have foreign key constraints)
    await connection.query('DELETE FROM order_items WHERE order_id = ?', [id]);
    
    // Delete the order
    const [result] = await connection.query('DELETE FROM orders WHERE id = ?', [id]);
    
    if (result.affectedRows === 0) {
      await connection.rollback();
      return res.status(404).json({ error: 'Order not found' });
    }

    await connection.commit();
    res.status(204).send();
  } catch (error) {
    if (connection) {
      await connection.rollback();
    }
    next(error);
  } finally {
    if (connection) {
      connection.release();
    }
  }
});

// Start server
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  testConnection();
});