const Estoque = require("../models/estoqueModel");

// Listar todo o estoque
const listarEstoque = async (req, res) => {
  try {
    const rows = await Estoque.listarEstoque();
    res.json({
      success: true,
      data: rows,
      total: rows.length,
    });
  } catch (err) {
    res.status(500).json({
      error: "Erro ao buscar estoque",
      message: err.message,
    });
  }
};

// Buscar estoque por produto
const buscarEstoquePorProduto = async (req, res) => {
  const { id_produto } = req.params;
  try {
    const row = await Estoque.buscarEstoquePorProduto(id_produto);
    if (!row) {
      return res.status(404).json({
        error: "Estoque não encontrado para este produto",
      });
    }
    res.json({
      success: true,
      data: row,
    });
  } catch (err) {
    res.status(500).json({
      error: "Erro ao buscar estoque do produto",
      message: err.message,
    });
  }
};

// Atualizar estoque
const atualizarEstoque = async (req, res) => {
  const { id_produto } = req.params;
  const { quantidade_disponivel, quantidade_minima, localizacao } = req.body;

  // Validações básicas
  if (quantidade_disponivel !== undefined && quantidade_disponivel < 0) {
    return res.status(400).json({
      error: "Quantidade inválida",
      message: "A quantidade disponível não pode ser negativa",
    });
  }

  if (quantidade_minima !== undefined && quantidade_minima < 0) {
    return res.status(400).json({
      error: "Quantidade mínima inválida",
      message: "A quantidade mínima não pode ser negativa",
    });
  }

  try {
    const result = await Estoque.atualizarEstoque(id_produto, { quantidade_disponivel, quantidade_minima, localizacao });
    if (result.affectedRows === 0) {
      return res.status(404).json({
        error: "Estoque não encontrado para este produto",
      });
    }
    res.json({
      success: true,
      message: "Estoque atualizado com sucesso",
    });
  } catch (err) {
    res.status(500).json({
      error: "Erro ao atualizar estoque",
      message: err.message,
    });
  }
};

// Adicionar ao estoque (entrada)
const adicionarEstoque = async (req, res) => {
  const { id_produto } = req.params;
  const { quantidade } = req.body;

  // Validações básicas
  if (!quantidade || quantidade <= 0) {
    return res.status(400).json({
      error: "Quantidade inválida",
      message: "A quantidade deve ser maior que zero",
    });
  }

  try {
    const result = await Estoque.adicionarEstoque(id_produto, quantidade);
    if (result.affectedRows === 0) {
      return res.status(404).json({
        error: "Produto não encontrado",
      });
    }
    res.json({
      success: true,
      message: `${quantidade} unidades adicionadas ao estoque`,
    });
  } catch (err) {
    res.status(500).json({
      error: "Erro ao adicionar ao estoque",
      message: err.message,
    });
  }
};

// Remover do estoque (saída)
const removerEstoque = async (req, res) => {
  const { id_produto } = req.params;
  const { quantidade } = req.body;

  // Validações básicas
  if (!quantidade || quantidade <= 0) {
    return res.status(400).json({
      error: "Quantidade inválida",
      message: "A quantidade deve ser maior que zero",
    });
  }

  try {
    await Estoque.removerEstoque(id_produto, quantidade);
    res.json({
      success: true,
      message: `${quantidade} unidades removidas do estoque`,
    });
  } catch (err) {
    if (err.message && err.message.includes("unidades disponíveis")) {
      return res.status(400).json({
        error: "Estoque insuficiente",
        message: err.message,
      });
    }
    if (err.message && err.message.includes("Produto não encontrado")) {
      return res.status(404).json({
        error: "Produto não encontrado",
        message: err.message,
      });
    }
    res.status(500).json({
      error: "Erro ao remover do estoque",
      message: err.message,
    });
  }
};

// Listar produtos com estoque baixo
const listarEstoqueBaixo = async (req, res) => {
  try {
    const rows = await Estoque.listarEstoqueBaixo();
    res.json({
      success: true,
      data: rows,
      total: rows.length,
      message: rows.length > 0 ? "Produtos com estoque baixo encontrados" : "Nenhum produto com estoque baixo",
    });
  } catch (err) {
    res.status(500).json({
      error: "Erro ao buscar produtos com estoque baixo",
      message: err.message,
    });
  }
};

module.exports = {
  listarEstoque,
  buscarEstoquePorProduto,
  atualizarEstoque,
  adicionarEstoque,
  removerEstoque,
  listarEstoqueBaixo,
};


