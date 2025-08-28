const { getDb } = require("../config/database");

const Produto = {
  listarProdutos: async () => {
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
  },

  buscarProdutoPorId: async (id) => {
    const pool = getDb();
    const query = `
      SELECT p.*, e.quantidade_disponivel, e.quantidade_minima, e.localizacao
      FROM produtos p 
      LEFT JOIN estoque e ON p.id_produto = e.id_produto 
      WHERE p.id_produto = ? AND p.ativo = 1
    `;
    const [rows] = await pool.execute(query, [id]);
    return rows[0];
  },

  criarProduto: async (produto) => {
    const pool = getDb();
    const { nome_produto, descricao, preco, categoria, marca } = produto;
    const query = `
      INSERT INTO produtos (nome_produto, descricao, preco, categoria, marca)
      VALUES (?, ?, ?, ?, ?)
    `;
    const [result] = await pool.execute(query, [nome_produto, descricao, preco, categoria, marca]);
    const newProductId = result.insertId;

    // Criar registro de estoque para o novo produto
    const estoqueQuery = `
      INSERT INTO estoque (id_produto, quantidade_disponivel, quantidade_minima, localizacao)
      VALUES (?, 0, 5, 'Setor A')
    `;
    await pool.execute(estoqueQuery, [newProductId]);
    
    return result;
  },

  atualizarProduto: async (id, produto) => {
    const pool = getDb();
    const { nome_produto, descricao, preco, categoria, marca, ativo } = produto;
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
  },

  deletarProduto: async (id) => {
    const pool = getDb();
    const query = 'UPDATE produtos SET ativo = 0 WHERE id_produto = ?';
    const [result] = await pool.execute(query, [id]);
    return result;
  },

  buscarPorCategoria: async (categoria) => {
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
};

module.exports = Produto;


