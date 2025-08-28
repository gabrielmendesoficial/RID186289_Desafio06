const Produto = require("../models/produtoModel");

// Listar todos os produtos
const listarProdutos = async (req, res) => {
  try {
    const rows = await Produto.listarProdutos();
    res.json({
      success: true,
      data: rows,
      total: rows.length,
    });
  } catch (err) {
    res.status(500).json({
      error: "Erro ao buscar produtos",
      message: err.message,
    });
  }
};

// Buscar produto por ID
const buscarProdutoPorId = async (req, res) => {
  const { id } = req.params;
  try {
    const row = await Produto.buscarProdutoPorId(id);
    if (!row) {
      return res.status(404).json({
        error: "Produto não encontrado",
      });
    }
    res.json({
      success: true,
      data: row,
    });
  } catch (err) {
    res.status(500).json({
      error: "Erro ao buscar produto",
      message: err.message,
    });
  }
};

// Criar novo produto
const criarProduto = async (req, res) => {
  const { nome_produto, descricao, preco, categoria, marca } = req.body;

  // Validações básicas
  if (!nome_produto || !preco) {
    return res.status(400).json({
      error: "Dados obrigatórios não fornecidos",
      message: "Nome do produto e preço são obrigatórios",
    });
  }

  if (preco <= 0) {
    return res.status(400).json({
      error: "Preço inválido",
      message: "O preço deve ser maior que zero",
    });
  }

  try {
    const result = await Produto.criarProduto({ nome_produto, descricao, preco, categoria, marca });
    res.status(201).json({
      success: true,
      message: "Produto criado com sucesso",
      data: {
        id_produto: result.insertId,
        nome_produto,
        descricao,
        preco,
        categoria,
        marca,
      },
    });
  } catch (err) {
    res.status(500).json({
      error: "Erro ao criar produto",
      message: err.message,
    });
  }
};

// Atualizar produto
const atualizarProduto = async (req, res) => {
  const { id } = req.params;
  const { nome_produto, descricao, preco, categoria, marca, ativo } = req.body;

  // Validações básicas
  if (preco && preco <= 0) {
    return res.status(400).json({
      error: "Preço inválido",
      message: "O preço deve ser maior que zero",
    });
  }

  try {
    const result = await Produto.atualizarProduto(id, { nome_produto, descricao, preco, categoria, marca, ativo });
    if (result.affectedRows === 0) {
      return res.status(404).json({
        error: "Produto não encontrado",
      });
    }
    res.json({
      success: true,
      message: "Produto atualizado com sucesso",
    });
  } catch (err) {
    res.status(500).json({
      error: "Erro ao atualizar produto",
      message: err.message,
    });
  }
};

// Deletar produto (soft delete)
const deletarProduto = async (req, res) => {
  const { id } = req.params;
  try {
    const result = await Produto.deletarProduto(id);
    if (result.affectedRows === 0) {
      return res.status(404).json({
        error: "Produto não encontrado",
      });
    }
    res.json({
      success: true,
      message: "Produto removido com sucesso",
    });
  } catch (err) {
    res.status(500).json({
      error: "Erro ao deletar produto",
      message: err.message,
    });
  }
};

// Buscar produtos por categoria
const buscarPorCategoria = async (req, res) => {
  const { categoria } = req.params;
  try {
    const rows = await Produto.buscarPorCategoria(categoria);
    res.json({
      success: true,
      data: rows,
      total: rows.length,
      categoria,
    });
  } catch (err) {
    res.status(500).json({
      error: "Erro ao buscar produtos por categoria",
      message: err.message,
    });
  }
};

module.exports = {
  listarProdutos,
  buscarProdutoPorId,
  criarProduto,
  atualizarProduto,
  deletarProduto,
  buscarPorCategoria,
};


