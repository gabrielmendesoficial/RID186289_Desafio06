const { getDb } = require("../config/database");

const Estoque = {
  listarEstoque: async () => {
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
  },

  buscarEstoquePorProduto: async (id_produto) => {
    const pool = getDb();
    const query = `
      SELECT e.*, p.nome_produto, p.categoria, p.marca, p.preco
      FROM estoque e
      INNER JOIN produtos p ON e.id_produto = p.id_produto
      WHERE e.id_produto = ? AND p.ativo = 1
    `;
    const [rows] = await pool.execute(query, [id_produto]);
    return rows[0];
  },

  atualizarEstoque: async (id_produto, estoque) => {
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
  },

  adicionarEstoque: async (id_produto, quantidade) => {
    const pool = getDb();
    const query = `
      UPDATE estoque 
      SET quantidade_disponivel = quantidade_disponivel + ?,
          data_ultima_atualizacao = CURRENT_TIMESTAMP
      WHERE id_produto = ?
    `;
    const [result] = await pool.execute(query, [quantidade, id_produto]);
    return result;
  },

  removerEstoque: async (id_produto, quantidade) => {
    const pool = getDb();
    const checkQuery = 'SELECT quantidade_disponivel FROM estoque WHERE id_produto = ?';
    const [rows] = await pool.execute(checkQuery, [id_produto]);
    const row = rows[0];

    if (!row) {
      throw new Error('Produto não encontrado');
    }
    if (row.quantidade_disponivel < quantidade) {
      throw new Error(`Apenas ${row.quantidade_disponivel} unidades disponíveis`);
    }
    const updateQuery = `
      UPDATE estoque 
      SET quantidade_disponivel = quantidade_disponivel - ?,
          data_ultima_atualizacao = CURRENT_TIMESTAMP
      WHERE id_produto = ?
    `;
    const [result] = await pool.execute(updateQuery, [quantidade, id_produto]);
    return result;
  },

  listarEstoqueBaixo: async () => {
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
};

module.exports = Estoque;


