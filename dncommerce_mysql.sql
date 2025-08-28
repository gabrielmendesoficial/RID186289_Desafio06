SET FOREIGN_KEY_CHECKS=0;

CREATE TABLE dncommerce.clientes (
            id_cliente INT AUTO_INCREMENT PRIMARY KEY,
            nome_cliente VARCHAR(255) NOT NULL,
            email VARCHAR(255) UNIQUE NOT NULL,
            telefone VARCHAR(20),
            cpf VARCHAR(14) UNIQUE NOT NULL,
            data_nascimento DATE,
            endereco TEXT,
            data_cadastro DATETIME DEFAULT CURRENT_TIMESTAMP
          );

INSERT INTO dncommerce.clientes (id_cliente, nome_cliente, email, telefone, cpf, data_nascimento, endereco, data_cadastro) VALUES
(1,'Ana Costa','ana.costa@email.com','(11) 99999-2222','987.654.321-02','1985-08-22','Av. Paulista, 456, São Paulo, SP','2025-08-28 09:33:49'),
(2,'Maria Silva','maria.silva@email.com','(11) 99999-1111','123.456.789-01','1990-05-15','Rua das Flores, 123, São Paulo, SP','2025-08-28 09:33:49');

CREATE TABLE dncommerce.produtos (
      id_produto INT AUTO_INCREMENT PRIMARY KEY,
      nome_produto VARCHAR(255) NOT NULL,
      descricao TEXT,
      preco DECIMAL(10,2) NOT NULL,
      categoria VARCHAR(100),
      marca VARCHAR(100),
      data_cadastro DATETIME DEFAULT CURRENT_TIMESTAMP,
      ativo TINYINT(1) DEFAULT 1
    );

INSERT INTO dncommerce.produtos (id_produto, nome_produto, descricao, preco, categoria, marca, data_cadastro, ativo) VALUES
(1,'Base Líquida Premium','Base de alta cobertura para todos os tipos de pele',89.90,'Maquiagem','BeautyPro','2025-08-28 09:33:49',1),
(2,'Batom Matte Vermelho','Batom de longa duração cor vermelho clássico',45.50,'Maquiagem','LipStyle','2025-08-28 09:33:49',1),
(3,'Sérum Vitamina C','Sérum antioxidante para cuidados com a pele',120.00,'Skincare','SkinCare+','2025-08-28 09:33:49',1),
(4,'Perfume Floral Feminino','Fragrância floral delicada para o dia a dia',180.00,'Perfumes','Essence','2025-08-28 09:33:49',1),
(5,'Base Líquida Premium','Base de alta cobertura para todos os tipos de pele',89.90,'Maquiagem','BeautyPro','2025-08-28 11:22:12',1),
(6,'Batom Matte Vermelho','Batom de longa duração cor vermelho clássico',45.50,'Maquiagem','LipStyle','2025-08-28 11:22:12',1),
(7,'Perfume Floral Feminino','Fragrância floral delicada para o dia a dia',180.00,'Perfumes','Essence','2025-08-28 11:22:12',1),
(8,'Sérum Vitamina C','Sérum antioxidante para cuidados com a pele',120.00,'Skincare','SkinCare+','2025-08-28 11:22:12',1);

CREATE TABLE dncommerce.pedidos (
      id_pedido INT AUTO_INCREMENT PRIMARY KEY,
      id_cliente INT NOT NULL,
      data_pedido DATETIME DEFAULT CURRENT_TIMESTAMP,
      status_pedido VARCHAR(20) DEFAULT 'pendente',
      valor_total DECIMAL(10,2) DEFAULT 0.00,
      endereco_entrega TEXT,
      forma_pagamento VARCHAR(50),
      FOREIGN KEY (id_cliente) REFERENCES clientes (id_cliente) ON DELETE CASCADE
);

INSERT INTO dncommerce.pedidos (id_pedido, id_cliente, data_pedido, status_pedido, valor_total, endereco_entrega, forma_pagamento) VALUES
(1,1,'2025-08-28 11:23:00','pendente',89.90,'Rua Teste, 123','Cartao');

CREATE TABLE dncommerce.vendas (
      id_venda INT AUTO_INCREMENT PRIMARY KEY,
      id_pedido INT NOT NULL,
      id_produto INT NOT NULL,
      quantidade INT NOT NULL,
      preco_unitario DECIMAL(10,2) NOT NULL,
      subtotal DECIMAL(10,2) NOT NULL,
      FOREIGN KEY (id_pedido) REFERENCES pedidos (id_pedido) ON DELETE CASCADE,
      FOREIGN KEY (id_produto) REFERENCES produtos (id_produto) ON DELETE CASCADE
);

INSERT INTO dncommerce.vendas (id_venda, id_pedido, id_produto, quantidade, preco_unitario, subtotal) VALUES
(1,1,1,1,89.90,89.90);

CREATE TABLE dncommerce.estoque (
      id_estoque INT AUTO_INCREMENT PRIMARY KEY,
      id_produto INT NOT NULL,
      quantidade_disponivel INT DEFAULT 0,
      quantidade_minima INT DEFAULT 0,
      localizacao VARCHAR(100),
      data_ultima_atualizacao DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (id_produto) REFERENCES produtos (id_produto) ON DELETE CASCADE
);

INSERT INTO dncommerce.estoque (id_estoque, id_produto, quantidade_disponivel, quantidade_minima, localizacao, data_ultima_atualizacao) VALUES
(1,1,28,5,'Setor A','2025-08-28 11:23:00'),
(2,2,47,5,'Setor A','2025-08-28 09:33:50'),
(3,3,16,5,'Setor A','2025-08-28 09:33:50'),
(4,4,107,5,'Setor A','2025-08-28 09:33:50'),
(5,1,57,5,'Setor A','2025-08-28 11:23:00'),
(6,2,43,5,'Setor A','2025-08-28 11:22:13'),
(7,6,16,5,'Setor A','2025-08-28 11:22:13'),
(8,7,89,5,'Setor A','2025-08-28 11:22:13'),
(9,8,102,5,'Setor A','2025-08-28 11:22:13'),
(10,3,90,5,'Setor A','2025-08-28 11:22:13'),
(11,4,84,5,'Setor A','2025-08-28 11:22:13'),
(12,5,16,5,'Setor A','2025-08-28 11:22:13');

SET FOREIGN_KEY_CHECKS=1;


