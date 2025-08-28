const Venda = require("../models/vendaModel");

// Listar todas as vendas
const listarVendas = async (req, res) => {
  try {
    const rows = await Venda.listarVendas();
    res.json({
      success: true,
      data: rows,
      total: rows.length,
    });
  } catch (err) {
    res.status(500).json({
      error: "Erro ao buscar vendas",
      message: err.message,
    });
  }
};

// Buscar venda por ID
const buscarVendaPorId = async (req, res) => {
  const { id } = req.params;
  try {
    const row = await Venda.buscarVendaPorId(id);
    if (!row) {
      return res.status(404).json({
        error: "Venda não encontrada",
      });
    }
    res.json({
      success: true,
      data: row,
    });
  } catch (err) {
    res.status(500).json({
      error: "Erro ao buscar venda",
      message: err.message,
    });
  }
};

// Listar vendas por produto
const listarVendasPorProduto = async (req, res) => {
  const { id_produto } = req.params;
  try {
    const rows = await Venda.listarVendasPorProduto(id_produto);
    res.json({
      success: true,
      data: rows,
      total: rows.length,
    });
  } catch (err) {
    res.status(500).json({
      error: "Erro ao buscar vendas do produto",
      message: err.message,
    });
  }
};

// Listar vendas por pedido
const listarVendasPorPedido = async (req, res) => {
  const { id_pedido } = req.params;
  try {
    const rows = await Venda.listarVendasPorPedido(id_pedido);
    res.json({
      success: true,
      data: rows,
      total: rows.length,
    });
  } catch (err) {
    res.status(500).json({
      error: "Erro ao buscar vendas do pedido",
      message: err.message,
    });
  }
};

// Relatório de vendas por período
const relatorioVendasPorPeriodo = async (req, res) => {
  const { data_inicio, data_fim } = req.query;

  if (!data_inicio || !data_fim) {
    return res.status(400).json({
      error: "Parâmetros obrigatórios",
      message: "data_inicio e data_fim são obrigatórios (formato: YYYY-MM-DD)",
    });
  }

  try {
    const rows = await Venda.relatorioVendasPorPeriodo(data_inicio, data_fim);

    // Calcular totais gerais
    const totalGeral = rows.reduce((acc, row) => {
      acc.total_vendas += row.total_vendas;
      acc.total_produtos_vendidos += row.total_produtos_vendidos;
      acc.valor_total_vendas += row.valor_total_vendas;
      return acc;
    }, { total_vendas: 0, total_produtos_vendidos: 0, valor_total_vendas: 0 });

    res.json({
      success: true,
      data: {
        periodo: { data_inicio, data_fim },
        vendas_por_dia: rows,
        resumo_geral: {
          ...totalGeral,
          ticket_medio_geral: totalGeral.total_vendas > 0 ? totalGeral.valor_total_vendas / totalGeral.total_vendas : 0,
          dias_com_vendas: rows.length,
        },
      },
    });
  } catch (err) {
    res.status(500).json({
      error: "Erro ao gerar relatório de vendas",
      message: err.message,
    });
  }
};

// Top produtos mais vendidos
const topProdutosMaisVendidos = async (req, res) => {
  const { limite = 10 } = req.query;

  try {
    const rows = await Venda.topProdutosMaisVendidos(limite);
    res.json({
      success: true,
      data: rows,
      total: rows.length,
      limite: parseInt(limite),
    });
  } catch (err) {
    res.status(500).json({
      error: "Erro ao buscar produtos mais vendidos",
      message: err.message,
    });
  }
};

// Vendas por categoria
const vendasPorCategoria = async (req, res) => {
  try {
    const rows = await Venda.vendasPorCategoria();
    res.json({
      success: true,
      data: rows,
      total: rows.length,
    });
  } catch (err) {
    res.status(500).json({
      error: "Erro ao buscar vendas por categoria",
      message: err.message,
    });
  }
};

module.exports = {
  listarVendas,
  buscarVendaPorId,
  listarVendasPorProduto,
  listarVendasPorPedido,
  relatorioVendasPorPeriodo,
  topProdutosMaisVendidos,
  vendasPorCategoria,
};


