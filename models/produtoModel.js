
const { getDb } = require("../config/database");

/**
 * Model para gerenciamento de produtos
 * Responsável por todas as operações relacionadas aos produtos no banco de dados
 */
class ProdutoModel {
  /**
   * Lista todos os produtos ativos com informações de estoque
   * @returns {Promise<Array>} Array de produtos
   */
  static async listarProdutos() {
    const pool = getDb();
    const query = `
      SELECT p.*, e.quantidade_disponivel 
      FROM produtos p 
      LEFT JOIN estoque e ON p.id_produto = e.id_produto 
      WHERE p.ativo = 1 
      ORDER BY p.data_cadastro DESC
    `;
    const [rows] = await pool.execute(query);
    return rows;
  }

  /**
   * Busca um produto específico por ID
   * @param {number} id - ID do produto
   * @returns {Promise<Object|null>} Produto encontrado ou null
   */
  static async buscarProdutoPorId(id) {
    const pool = getDb();
    const query = `
      SELECT p.*, e.quantidade_disponivel, e.quantidade_minima, e.localizacao 
      FROM produtos p 
      LEFT JOIN estoque e ON p.id_produto = e.id_produto 
      WHERE p.id_produto = ? AND p.ativo = 1
    `;
    const [rows] = await pool.execute(query, [id]);
    return rows[0];
  }

  /**
   * Cria um novo produto
   * @param {Object} produto - Dados do produto
   * @returns {Promise<Object>} Resultado da inserção
   */
  static async criarProduto({ nome_produto, descricao, preco, categoria, marca }) {
    const pool = getDb();
    const query = `
      INSERT INTO produtos (nome_produto, descricao, preco, categoria, marca) 
      VALUES (?, ?, ?, ?, ?)
    `;
    const [result] = await pool.execute(query, [nome_produto, descricao, preco, categoria, marca]);
    return result;
  }

  /**
   * Atualiza um produto existente
   * @param {number} id - ID do produto
   * @param {Object} produto - Dados atualizados
   * @returns {Promise<Object>} Resultado da atualização
   */
  static async atualizarProduto(id, { nome_produto, descricao, preco, categoria, marca, ativo }) {
    const pool = getDb();
    const query = `
      UPDATE produtos 
      SET nome_produto = COALESCE(?, nome_produto), 
          descricao = COALESCE(?, descricao), 
          preco = COALESCE(?, preco), 
          categoria = COALESCE(?, categoria), 
          marca = COALESCE(?, marca), 
          ativo = COALESCE(?, ativo) 
      WHERE id_produto = ?
    `;
    const [result] = await pool.execute(query, [nome_produto, descricao, preco, categoria, marca, ativo, id]);
    return result;
  }

  /**
   * Remove um produto (soft delete)
   * @param {number} id - ID do produto
   * @returns {Promise<Object>} Resultado da operação
   */
  static async deletarProduto(id) {
    const pool = getDb();
    const query = 'UPDATE produtos SET ativo = 0 WHERE id_produto = ?';
    const [result] = await pool.execute(query, [id]);
    return result;
  }

  /**
   * Busca produtos por categoria
   * @param {string} categoria - Categoria dos produtos
   * @returns {Promise<Array>} Array de produtos da categoria
   */
  static async buscarPorCategoria(categoria) {
    const pool = getDb();
    const query = `
      SELECT p.*, e.quantidade_disponivel 
      FROM produtos p 
      LEFT JOIN estoque e ON p.id_produto = e.id_produto 
      WHERE p.categoria = ? AND p.ativo = 1 
      ORDER BY p.nome_produto
    `;
    const [rows] = await pool.execute(query, [categoria]);
    return rows;
  }
}

module.exports = ProdutoModel;


