
const { getDb } = require("../config/database");

/**
 * Model para gerenciamento de pedidos
 * Responsável por todas as operações relacionadas aos pedidos no banco de dados
 */
class PedidoModel {
  /**
   * Lista todos os pedidos com informações do cliente
   * @returns {Promise<Array>} Array de pedidos
   */
  static async listarPedidos() {
    const pool = getDb();
    const query = `
      SELECT p.*, c.nome_cliente, c.email 
      FROM pedidos p 
      INNER JOIN clientes c ON p.id_cliente = c.id_cliente 
      ORDER BY p.data_pedido DESC
    `;
    const [rows] = await pool.execute(query);
    return rows;
  }

  /**
   * Busca um pedido específico por ID com seus itens
   * @param {number} id - ID do pedido
   * @returns {Promise<Object|null>} Pedido com itens ou null
   */
  static async buscarPedidoPorId(id) {
    const pool = getDb();
    
    // Buscar dados do pedido
    const pedidoQuery = `
      SELECT p.*, c.nome_cliente, c.email, c.telefone 
      FROM pedidos p 
      INNER JOIN clientes c ON p.id_cliente = c.id_cliente 
      WHERE p.id_pedido = ?
    `;
    const [pedidos] = await pool.execute(pedidoQuery, [id]);
    const pedido = pedidos[0];
    
    if (!pedido) return null;
    
    // Buscar itens do pedido
    const itensQuery = `
      SELECT v.*, pr.nome_produto, pr.categoria, pr.marca 
      FROM vendas v 
      INNER JOIN produtos pr ON v.id_produto = pr.id_produto 
      WHERE v.id_pedido = ?
    `;
    const [itens] = await pool.execute(itensQuery, [id]);
    
    return { ...pedido, itens };
  }

  /**
   * Cria um novo pedido
   * @param {Object} pedido - Dados do pedido
   * @returns {Promise<Object>} Resultado da inserção
   */
  static async criarPedido({ id_cliente, valor_total, endereco_entrega, forma_pagamento }) {
    const pool = getDb();
    const query = `
      INSERT INTO pedidos (id_cliente, valor_total, endereco_entrega, forma_pagamento) 
      VALUES (?, ?, ?, ?)
    `;
    const [result] = await pool.execute(query, [id_cliente, valor_total, endereco_entrega, forma_pagamento]);
    return result;
  }

  /**
   * Atualiza o status de um pedido
   * @param {number} id - ID do pedido
   * @param {string} status_pedido - Novo status
   * @returns {Promise<Object>} Resultado da atualização
   */
  static async atualizarStatusPedido(id, status_pedido) {
    const pool = getDb();
    const query = 'UPDATE pedidos SET status_pedido = ? WHERE id_pedido = ?';
    const [result] = await pool.execute(query, [status_pedido, id]);
    return result;
  }

  /**
   * Lista pedidos de um cliente específico
   * @param {number} id_cliente - ID do cliente
   * @returns {Promise<Array>} Array de pedidos do cliente
   */
  static async listarPedidosPorCliente(id_cliente) {
    const pool = getDb();
    const query = `
      SELECT p.*, c.nome_cliente, c.email 
      FROM pedidos p 
      INNER JOIN clientes c ON p.id_cliente = c.id_cliente 
      WHERE p.id_cliente = ? 
      ORDER BY p.data_pedido DESC
    `;
    const [rows] = await pool.execute(query, [id_cliente]);
    return rows;
  }

  /**
   * Verifica se um cliente existe
   * @param {number} id_cliente - ID do cliente
   * @returns {Promise<boolean>} True se o cliente existe
   */
  static async verificarClienteExiste(id_cliente) {
    const pool = getDb();
    const query = 'SELECT id_cliente FROM clientes WHERE id_cliente = ?';
    const [rows] = await pool.execute(query, [id_cliente]);
    return rows.length > 0;
  }
}

module.exports = PedidoModel;


