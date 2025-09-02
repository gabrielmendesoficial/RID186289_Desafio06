
const { getDb } = require("../config/database");

/**
 * Model para gerenciamento de estoque
 * Responsável por todas as operações relacionadas ao controle de estoque
 */
class EstoqueModel {
  /**
   * Lista todo o estoque com informações dos produtos
   * @returns {Promise<Array>} Array de estoque
   */
  static async listarEstoque() {
    const pool = getDb();
    const query = `
      SELECT e.*, p.nome_produto, p.categoria, p.marca, p.preco 
      FROM estoque e 
      INNER JOIN produtos p ON e.id_produto = p.id_produto 
      WHERE p.ativo = 1 
      ORDER BY p.nome_produto
    `;
    const [rows] = await pool.execute(query);
    return rows;
  }

  /**
   * Busca o estoque de um produto específico
   * @param {number} id_produto - ID do produto
   * @returns {Promise<Object|null>} Estoque do produto ou null
   */
  static async buscarEstoquePorProduto(id_produto) {
    const pool = getDb();
    const query = `
      SELECT e.*, p.nome_produto, p.categoria, p.marca, p.preco 
      FROM estoque e 
      INNER JOIN produtos p ON e.id_produto = p.id_produto 
      WHERE e.id_produto = ? AND p.ativo = 1
    `;
    const [rows] = await pool.execute(query, [id_produto]);
    return rows[0];
  }

  /**
   * Atualiza informações do estoque
   * @param {number} id_produto - ID do produto
   * @param {Object} estoque - Dados do estoque
   * @returns {Promise<Object>} Resultado da atualização
   */
  static async atualizarEstoque(id_produto, estoque) {
    const pool = getDb();
    const { quantidade_disponivel, quantidade_minima, localizacao } = estoque;
    const query = `
      UPDATE estoque 
      SET quantidade_disponivel = COALESCE(?, quantidade_disponivel), 
          quantidade_minima = COALESCE(?, quantidade_minima), 
          localizacao = COALESCE(?, localizacao), 
          data_ultima_atualizacao = CURRENT_TIMESTAMP 
      WHERE id_produto = ?
    `;
    const [result] = await pool.execute(query, [quantidade_disponivel, quantidade_minima, localizacao, id_produto]);
    return result;
  }

  /**
   * Adiciona quantidade ao estoque
   * @param {number} id_produto - ID do produto
   * @param {number} quantidade - Quantidade a adicionar
   * @returns {Promise<Object>} Resultado da operação
   */
  static async adicionarEstoque(id_produto, quantidade) {
    const pool = getDb();
    const query = `
      UPDATE estoque 
      SET quantidade_disponivel = quantidade_disponivel + ?, 
          data_ultima_atualizacao = CURRENT_TIMESTAMP 
      WHERE id_produto = ?
    `;
    const [result] = await pool.execute(query, [quantidade, id_produto]);
    return result;
  }

  /**
   * Remove quantidade do estoque
   * @param {number} id_produto - ID do produto
   * @param {number} quantidade - Quantidade a remover
   * @returns {Promise<Object>} Resultado da operação
   */
  static async removerEstoque(id_produto, quantidade) {
    const pool = getDb();
    const query = `
      UPDATE estoque 
      SET quantidade_disponivel = quantidade_disponivel - ?, 
          data_ultima_atualizacao = CURRENT_TIMESTAMP 
      WHERE id_produto = ? AND quantidade_disponivel >= ?
    `;
    const [result] = await pool.execute(query, [quantidade, id_produto, quantidade]);
    return result;
  }

  /**
   * Lista produtos com estoque baixo (abaixo do mínimo)
   * @returns {Promise<Array>} Array de produtos com estoque baixo
   */
  static async listarEstoqueBaixo() {
    const pool = getDb();
    const query = `
      SELECT e.*, p.nome_produto, p.categoria, p.marca, p.preco 
      FROM estoque e 
      INNER JOIN produtos p ON e.id_produto = p.id_produto 
      WHERE e.quantidade_disponivel <= e.quantidade_minima AND p.ativo = 1 
      ORDER BY e.quantidade_disponivel ASC
    `;
    const [rows] = await pool.execute(query);
    return rows;
  }

  /**
   * Verifica se há estoque suficiente para uma quantidade
   * @param {number} id_produto - ID do produto
   * @param {number} quantidade - Quantidade desejada
   * @returns {Promise<boolean>} True se há estoque suficiente
   */
  static async verificarEstoqueDisponivel(id_produto, quantidade) {
    const pool = getDb();
    const query = `
      SELECT quantidade_disponivel 
      FROM estoque 
      WHERE id_produto = ?
    `;
    const [rows] = await pool.execute(query, [id_produto]);
    if (rows.length === 0) return false;
    return rows[0].quantidade_disponivel >= quantidade;
  }
}

module.exports = EstoqueModel;


