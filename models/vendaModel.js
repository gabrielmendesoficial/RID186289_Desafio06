
const { getDb } = require("../config/database");

/**
 * Model para gerenciamento de vendas
 * Responsável por todas as operações relacionadas às vendas e relatórios
 */
class VendaModel {
  /**
   * Lista todas as vendas com informações completas
   * @returns {Promise<Array>} Array de vendas
   */
  static async listarVendas() {
    const pool = getDb();
    const query = `
      SELECT v.*, p.nome_produto, p.categoria, p.marca, 
             ped.data_pedido, ped.status_pedido, 
             c.nome_cliente, c.email 
      FROM vendas v 
      INNER JOIN produtos p ON v.id_produto = p.id_produto 
      INNER JOIN pedidos ped ON v.id_pedido = ped.id_pedido 
      INNER JOIN clientes c ON ped.id_cliente = c.id_cliente 
      ORDER BY ped.data_pedido DESC
    `;
    const [rows] = await pool.execute(query);
    return rows;
  }

  /**
   * Busca uma venda específica por ID
   * @param {number} id - ID da venda
   * @returns {Promise<Object|null>} Venda encontrada ou null
   */
  static async buscarVendaPorId(id) {
    const pool = getDb();
    const query = `
      SELECT v.*, p.nome_produto, p.categoria, p.marca, p.descricao,
             ped.data_pedido, ped.status_pedido, ped.endereco_entrega, ped.forma_pagamento,
             c.nome_cliente, c.email, c.telefone 
      FROM vendas v 
      INNER JOIN produtos p ON v.id_produto = p.id_produto 
      INNER JOIN pedidos ped ON v.id_pedido = ped.id_pedido 
      INNER JOIN clientes c ON ped.id_cliente = c.id_cliente 
      WHERE v.id_venda = ?
    `;
    const [rows] = await pool.execute(query, [id]);
    return rows[0];
  }

  /**
   * Lista vendas de um produto específico
   * @param {number} id_produto - ID do produto
   * @returns {Promise<Array>} Array de vendas do produto
   */
  static async listarVendasPorProduto(id_produto) {
    const pool = getDb();
    const query = `
      SELECT v.*, p.nome_produto, p.categoria, p.marca,
             ped.data_pedido, ped.status_pedido,
             c.nome_cliente, c.email 
      FROM vendas v 
      INNER JOIN produtos p ON v.id_produto = p.id_produto 
      INNER JOIN pedidos ped ON v.id_pedido = ped.id_pedido 
      INNER JOIN clientes c ON ped.id_cliente = c.id_cliente 
      WHERE v.id_produto = ? 
      ORDER BY ped.data_pedido DESC
    `;
    const [rows] = await pool.execute(query, [id_produto]);
    return rows;
  }

  /**
   * Lista vendas de um pedido específico
   * @param {number} id_pedido - ID do pedido
   * @returns {Promise<Array>} Array de vendas do pedido
   */
  static async listarVendasPorPedido(id_pedido) {
    const pool = getDb();
    const query = `
      SELECT v.*, p.nome_produto, p.categoria, p.marca, p.descricao 
      FROM vendas v 
      INNER JOIN produtos p ON v.id_produto = p.id_produto 
      WHERE v.id_pedido = ? 
      ORDER BY v.id_venda
    `;
    const [rows] = await pool.execute(query, [id_pedido]);
    return rows;
  }

  /**
   * Cria uma nova venda
   * @param {Object} venda - Dados da venda
   * @returns {Promise<Object>} Resultado da inserção
   */
  static async criarVenda({ id_pedido, id_produto, quantidade, preco_unitario, subtotal }) {
    const pool = getDb();
    const query = `
      INSERT INTO vendas (id_pedido, id_produto, quantidade, preco_unitario, subtotal) 
      VALUES (?, ?, ?, ?, ?)
    `;
    const [result] = await pool.execute(query, [id_pedido, id_produto, quantidade, preco_unitario, subtotal]);
    return result;
  }

  /**
   * Relatório de vendas por período
   * @param {string} data_inicio - Data de início (YYYY-MM-DD)
   * @param {string} data_fim - Data de fim (YYYY-MM-DD)
   * @returns {Promise<Array>} Relatório de vendas
   */
  static async relatorioVendasPorPeriodo(data_inicio, data_fim) {
    const pool = getDb();
    const query = `
      SELECT DATE(ped.data_pedido) as data_venda,
             COUNT(v.id_venda) as total_vendas,
             SUM(v.quantidade) as total_produtos_vendidos,
             SUM(v.subtotal) as valor_total_vendas,
             AVG(v.subtotal) as ticket_medio 
      FROM vendas v 
      INNER JOIN pedidos ped ON v.id_pedido = ped.id_pedido 
      WHERE DATE(ped.data_pedido) BETWEEN ? AND ? 
        AND ped.status_pedido != 'cancelado' 
      GROUP BY DATE(ped.data_pedido) 
      ORDER BY data_venda DESC
    `;
    const [rows] = await pool.execute(query, [data_inicio, data_fim]);
    return rows;
  }

  /**
   * Lista os produtos mais vendidos
   * @param {number} limite - Limite de resultados
   * @returns {Promise<Array>} Top produtos mais vendidos
   */
  static async topProdutosMaisVendidos(limite = 10) {
    const pool = getDb();
    const query = `
      SELECT p.id_produto, p.nome_produto, p.categoria, p.marca, p.preco,
             SUM(v.quantidade) as total_vendido,
             COUNT(v.id_venda) as numero_vendas,
             SUM(v.subtotal) as receita_total,
             AVG(v.preco_unitario) as preco_medio_venda 
      FROM vendas v 
      INNER JOIN produtos p ON v.id_produto = p.id_produto 
      INNER JOIN pedidos ped ON v.id_pedido = ped.id_pedido 
      WHERE ped.status_pedido != 'cancelado' 
      GROUP BY p.id_produto, p.nome_produto, p.categoria, p.marca, p.preco 
      ORDER BY total_vendido DESC 
      LIMIT ?
    `;
    const [rows] = await pool.execute(query, [parseInt(limite)]);
    return rows;
  }

  /**
   * Relatório de vendas por categoria
   * @returns {Promise<Array>} Vendas agrupadas por categoria
   */
  static async vendasPorCategoria() {
    const pool = getDb();
    const query = `
      SELECT p.categoria,
             COUNT(v.id_venda) as total_vendas,
             SUM(v.quantidade) as total_produtos_vendidos,
             SUM(v.subtotal) as receita_total,
             AVG(v.subtotal) as ticket_medio 
      FROM vendas v 
      INNER JOIN produtos p ON v.id_produto = p.id_produto 
      INNER JOIN pedidos ped ON v.id_pedido = ped.id_pedido 
      WHERE ped.status_pedido != 'cancelado' 
      GROUP BY p.categoria 
      ORDER BY receita_total DESC
    `;
    const [rows] = await pool.execute(query);
    return rows;
  }
}

module.exports = VendaModel;


