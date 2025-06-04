const mysql = require('mysql2/promise');

async function createAll() {
  const connection = await mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'root',
    port: 3307
  });

  // Criação do banco de dados
  await connection.query(`
    CREATE DATABASE IF NOT EXISTS restaurant_manager
    CHARACTER SET utf8mb4
    COLLATE utf8mb4_unicode_ci;
  `);
  await connection.query('USE restaurant_manager;');

  // Criação das tabelas
  await connection.query(`
    CREATE TABLE IF NOT EXISTS funcionario (
      id INT AUTO_INCREMENT PRIMARY KEY,
      nome VARCHAR(100) NOT NULL,
      email VARCHAR(100) NOT NULL UNIQUE,
      senha VARCHAR(255) NOT NULL,
      cargo ENUM('GERENTE', 'GARCOM', 'COZINHEIRO', 'CAIXA', 'RECEPCIONISTA') NOT NULL,
      data_contratacao DATETIME DEFAULT CURRENT_TIMESTAMP,
      ativo BOOLEAN DEFAULT TRUE,
      ultimo_acesso DATETIME,
      CONSTRAINT chk_email CHECK (email LIKE '%@%.%')
    ) ENGINE=InnoDB;
  `);

  await connection.query(`
    CREATE TABLE IF NOT EXISTS mesa (
      id INT AUTO_INCREMENT PRIMARY KEY,
      numero INT NOT NULL UNIQUE,
      capacidade INT NOT NULL,
      status ENUM('LIVRE', 'OCUPADA', 'RESERVADA') DEFAULT 'LIVRE',
      ultima_atualizacao DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
      CONSTRAINT chk_capacidade CHECK (capacidade > 0)
    ) ENGINE=InnoDB;
  `);

  await connection.query(`
    CREATE TABLE IF NOT EXISTS reserva (
      id INT AUTO_INCREMENT PRIMARY KEY,
      mesa_id INT NOT NULL,
      cliente VARCHAR(100) NOT NULL,
      telefone VARCHAR(20) NOT NULL,
      data_hora DATETIME NOT NULL,
      num_pessoas INT NOT NULL,
      status ENUM('PENDENTE', 'CONFIRMADA', 'CANCELADA', 'CONCLUIDA') DEFAULT 'PENDENTE',
      FOREIGN KEY (mesa_id) REFERENCES mesa(id),
      CONSTRAINT chk_num_pessoas CHECK (num_pessoas > 0)
    ) ENGINE=InnoDB;
  `);

  await connection.query(`
    CREATE TABLE IF NOT EXISTS categoria_produto (
      id INT AUTO_INCREMENT PRIMARY KEY,
      nome VARCHAR(50) NOT NULL UNIQUE,
      descricao VARCHAR(100),
      ativo BOOLEAN DEFAULT TRUE
    ) ENGINE=InnoDB;
  `);

  await connection.query(`
    CREATE TABLE IF NOT EXISTS produto (
      id INT AUTO_INCREMENT PRIMARY KEY,
      categoria_id INT NOT NULL,
      nome VARCHAR(100) NOT NULL,
      descricao TEXT,
      preco DECIMAL(10,2) NOT NULL,
      disponivel BOOLEAN DEFAULT TRUE,
      imagem_url VARCHAR(255),
      tempo_preparo INT DEFAULT 15,
      FOREIGN KEY (categoria_id) REFERENCES categoria_produto(id),
      CONSTRAINT chk_preco CHECK (preco > 0),
      CONSTRAINT chk_tempo_preparo CHECK (tempo_preparo > 0)
    ) ENGINE=InnoDB;
  `);

  await connection.query(`
    CREATE TABLE IF NOT EXISTS pedido (
      id INT AUTO_INCREMENT PRIMARY KEY,
      mesa_id INT,
      funcionario_id INT NOT NULL,
      tipo ENUM('LOCAL', 'DELIVERY', 'TAKEOUT') DEFAULT 'LOCAL',
      status ENUM('NOVO', 'PREPARANDO', 'PRONTO', 'ENTREGUE', 'CANCELADO') DEFAULT 'NOVO',
      data_hora DATETIME DEFAULT CURRENT_TIMESTAMP,
      valor_total DECIMAL(10,2) DEFAULT 0.00,
      observacoes TEXT,
      FOREIGN KEY (mesa_id) REFERENCES mesa(id),
      FOREIGN KEY (funcionario_id) REFERENCES funcionario(id)
    ) ENGINE=InnoDB;
  `);

  await connection.query(`
    CREATE TABLE IF NOT EXISTS item_pedido (
      pedido_id INT,
      produto_id INT,
      quantidade INT NOT NULL,
      preco_unitario DECIMAL(10,2) NOT NULL,
      observacoes TEXT,
      status ENUM('PENDENTE', 'PREPARANDO', 'PRONTO', 'ENTREGUE', 'CANCELADO') DEFAULT 'PENDENTE',
      PRIMARY KEY (pedido_id, produto_id),
      FOREIGN KEY (pedido_id) REFERENCES pedido(id) ON DELETE CASCADE,
      FOREIGN KEY (produto_id) REFERENCES produto(id),
      CONSTRAINT chk_quantidade CHECK (quantidade > 0),
      CONSTRAINT chk_preco_unitario CHECK (preco_unitario > 0)
    ) ENGINE=InnoDB;
  `);

  await connection.query(`
    CREATE TABLE IF NOT EXISTS pagamento (
      id INT AUTO_INCREMENT PRIMARY KEY,
      pedido_id INT NOT NULL,
      forma_pagamento ENUM('DINHEIRO', 'CARTAO_CREDITO', 'CARTAO_DEBITO', 'PIX') NOT NULL,
      valor DECIMAL(10,2) NOT NULL,
      data_hora DATETIME DEFAULT CURRENT_TIMESTAMP,
      funcionario_id INT NOT NULL,
      FOREIGN KEY (pedido_id) REFERENCES pedido(id),
      FOREIGN KEY (funcionario_id) REFERENCES funcionario(id),
      CONSTRAINT chk_valor CHECK (valor > 0)
    ) ENGINE=InnoDB;
  `);

  // Inserts iniciais
  await connection.query(`
    INSERT IGNORE INTO categoria_produto (nome, descricao, ativo) VALUES
      ('Entradas', 'Aperitivos e petiscos', TRUE),
      ('Pratos Principais', 'Pratos principais do cardápio', TRUE),
      ('Sobremesas', 'Sobremesas e doces', TRUE),
      ('Bebidas', 'Bebidas não alcoólicas', TRUE),
      ('Bebidas Alcoólicas', 'Cervejas, vinhos e drinks', TRUE);
  `);

  await connection.query(`
    INSERT IGNORE INTO mesa (numero, capacidade) VALUES
      (1, 2), (2, 2), (3, 4), (4, 4),
      (5, 4), (6, 6), (7, 6), (8, 8);
  `);

  // Índices
  try { await connection.query('CREATE INDEX idx_pedido_funcionario ON pedido(funcionario_id);'); } catch(e) {}
  try { await connection.query('CREATE INDEX idx_pedido_mesa ON pedido(mesa_id);'); } catch(e) {}
  try { await connection.query('CREATE INDEX idx_pedido_status ON pedido(status);'); } catch(e) {}
  try { await connection.query('CREATE INDEX idx_reserva_data ON reserva(data_hora);'); } catch(e) {}
  try { await connection.query('CREATE INDEX idx_produto_categoria ON produto(categoria_id);'); } catch(e) {}
  try { await connection.query('CREATE INDEX idx_pagamento_pedido ON pagamento(pedido_id);'); } catch(e) {}

  console.log('Banco, tabelas, índices e dados iniciais criados com sucesso!');
  await connection.end();
}

createAll().catch(err => {
  console.error('Erro ao criar estrutura do banco:', err);
  process.exit(1);
}); 