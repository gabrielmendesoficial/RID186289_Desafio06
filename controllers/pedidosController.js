const Pedido = require("../models/pedidoModel");

// Listar todos os pedidos
const listarPedidos = async (req, res) => {
  try {
    const rows = await Pedido.listarPedidos();
    res.json({
      success: true,
      data: rows,
      total: rows.length,
    });
  } catch (err) {
    res.status(500).json({
      error: "Erro ao buscar pedidos",
      message: err.message,
    });
  }
};

// Buscar pedido por ID com itens
const buscarPedidoPorId = async (req, res) => {
  const { id } = req.params;
  try {
    const data = await Pedido.buscarPedidoPorId(id);
    if (!data) {
      return res.status(404).json({
        error: "Pedido não encontrado",
      });
    }
    res.json({
      success: true,
      data: data,
    });
  } catch (err) {
    res.status(500).json({
      error: "Erro ao buscar pedido",
      message: err.message,
    });
  }
};

// Criar novo pedido
const criarPedido = async (req, res) => {
  const { id_cliente, endereco_entrega, forma_pagamento, itens } = req.body;

  // Validações básicas
  if (!id_cliente || !itens || !Array.isArray(itens) || itens.length === 0) {
    return res.status(400).json({
      error: "Dados obrigatórios não fornecidos",
      message: "ID do cliente e itens são obrigatórios",
    });
  }

  try {
    const data = await Pedido.criarPedido({ id_cliente, endereco_entrega, forma_pagamento, itens });
    res.status(201).json({
      success: true,
      message: "Pedido criado com sucesso",
      data: data,
    });
  } catch (err) {
    if (err.message && err.message.includes("Cliente não encontrado")) {
      return res.status(404).json({
        error: "Cliente não encontrado",
        message: err.message,
      });
    }
    if (err.message && err.message.includes("Item inválido")) {
      return res.status(400).json({
        error: "Erro na validação dos itens",
        message: err.message,
      });
    }
    if (err.message && err.message.includes("Estoque insuficiente")) {
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
      error: "Erro ao criar pedido",
      message: err.message,
    });
  }
};

// Atualizar status do pedido
const atualizarStatusPedido = async (req, res) => {
  const { id } = req.params;
  const { status_pedido } = req.body;

  const statusValidos = ["pendente", "processando", "enviado", "entregue", "cancelado"];

  if (!status_pedido || !statusValidos.includes(status_pedido)) {
    return res.status(400).json({
      error: "Status inválido",
      message: `Status deve ser um dos seguintes: ${statusValidos.join(", ")}`,
    });
  }

  try {
    const result = await Pedido.atualizarStatusPedido(id, status_pedido);
    if (result.affectedRows === 0) {
      return res.status(404).json({
        error: "Pedido não encontrado",
      });
    }
    res.json({
      success: true,
      message: `Status do pedido atualizado para: ${status_pedido}`,
    });
  } catch (err) {
    res.status(500).json({
      error: "Erro ao atualizar status do pedido",
      message: err.message,
    });
  }
};

// Listar pedidos por cliente
const listarPedidosPorCliente = async (req, res) => {
  const { id_cliente } = req.params;
  try {
    const rows = await Pedido.listarPedidosPorCliente(id_cliente);
    res.json({
      success: true,
      data: rows,
      total: rows.length,
    });
  } catch (err) {
    res.status(500).json({
      error: "Erro ao buscar pedidos do cliente",
      message: err.message,
    });
  }
};

module.exports = {
  listarPedidos,
  buscarPedidoPorId,
  criarPedido,
  atualizarStatusPedido,
  listarPedidosPorCliente,
};


