const Cliente = require("../models/clienteModel");

// Listar todos os clientes
const listarClientes = async (req, res) => {
  try {
    const rows = await Cliente.listarClientes();
    res.json({
      success: true,
      data: rows,
      total: rows.length,
    });
  } catch (err) {
    res.status(500).json({
      error: "Erro ao buscar clientes",
      message: err.message,
    });
  }
};

// Buscar cliente por ID
const buscarClientePorId = async (req, res) => {
  const { id } = req.params;
  try {
    const row = await Cliente.buscarClientePorId(id);
    if (!row) {
      return res.status(404).json({
        error: "Cliente não encontrado",
      });
    }
    res.json({
      success: true,
      data: row,
    });
  } catch (err) {
    res.status(500).json({
      error: "Erro ao buscar cliente",
      message: err.message,
    });
  }
};

// Criar novo cliente
const criarCliente = async (req, res) => {
  const { nome_cliente, email, telefone, cpf, data_nascimento, endereco } = req.body;

  // Validações básicas
  if (!nome_cliente || !email || !cpf) {
    return res.status(400).json({
      error: "Dados obrigatórios não fornecidos",
      message: "Nome, email e CPF são obrigatórios",
    });
  }

  // Validação básica de email
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({
      error: "Email inválido",
      message: "Formato de email inválido",
    });
  }

  // Validação básica de CPF (apenas formato)
  const cpfRegex = /^\d{3}\.\d{3}\.\d{3}-\d{2}$/;
  if (!cpfRegex.test(cpf)) {
    return res.status(400).json({
      error: "CPF inválido",
      message: "CPF deve estar no formato XXX.XXX.XXX-XX",
    });
  }

  try {
    const result = await Cliente.criarCliente({ nome_cliente, email, telefone, cpf, data_nascimento, endereco });
    res.status(201).json({
      success: true,
      message: "Cliente criado com sucesso",
      data: {
        id_cliente: result.insertId,
        nome_cliente,
        email,
        telefone,
        cpf,
        data_nascimento,
        endereco,
      },
    });
  } catch (err) {
    if (err.message && err.message.includes("Duplicate entry")) {
      return res.status(409).json({
        error: "Dados duplicados",
        message: "Email ou CPF já cadastrado",
      });
    }
    res.status(500).json({
      error: "Erro ao criar cliente",
      message: err.message,
    });
  }
};

// Atualizar cliente
const atualizarCliente = async (req, res) => {
  const { id } = req.params;
  const { nome_cliente, email, telefone, cpf, data_nascimento, endereco } = req.body;

  // Validação básica de email se fornecido
  if (email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        error: "Email inválido",
        message: "Formato de email inválmo",
      });
    }
  }

  // Validação básica de CPF se fornecido
  if (cpf) {
    const cpfRegex = /^\d{3}\.\d{3}\.\d{3}-\d{2}$/;
    if (!cpfRegex.test(cpf)) {
      return res.status(400).json({
        error: "CPF inválido",
        message: "CPF deve estar no formato XXX.XXX.XXX-XX",
      });
    }
  }

  try {
    const result = await Cliente.atualizarCliente(id, { nome_cliente, email, telefone, cpf, data_nascimento, endereco });
    if (result.affectedRows === 0) {
      return res.status(404).json({
        error: "Cliente não encontrado",
      });
    }
    res.json({
      success: true,
      message: "Cliente atualizado com sucesso",
    });
  } catch (err) {
    if (err.message && err.message.includes("Duplicate entry")) {
      return res.status(409).json({
        error: "Dados duplicados",
        message: "Email ou CPF já cadastrado",
      });
    }
    res.status(500).json({
      error: "Erro ao atualizar cliente",
      message: err.message,
    });
  }
};

// Deletar cliente
const deletarCliente = async (req, res) => {
  const { id } = req.params;
  try {
    const result = await Cliente.deletarCliente(id);
    if (result.affectedRows === 0) {
      return res.status(404).json({
        error: "Cliente não encontrado",
      });
    }
    res.json({
      success: true,
      message: "Cliente removido com sucesso",
    });
  } catch (err) {
    if (err.message && err.message.includes("Cliente possui pedidos associados")) {
      return res.status(409).json({
        error: "Não é possível deletar cliente",
        message: err.message,
      });
    }
    res.status(500).json({
      error: "Erro ao deletar cliente",
      message: err.message,
    });
  }
};

// Buscar cliente por email
const buscarPorEmail = async (req, res) => {
  const { email } = req.params;
  try {
    const row = await Cliente.buscarPorEmail(email);
    if (!row) {
      return res.status(404).json({
        error: "Cliente não encontrado",
      });
    }
    res.json({
      success: true,
      data: row,
    });
  } catch (err) {
    res.status(500).json({
      error: "Erro ao buscar cliente por email",
      message: err.message,
    });
  }
};

module.exports = {
  listarClientes,
  buscarClientePorId,
  criarCliente,
  atualizarCliente,
  deletarCliente,
  buscarPorEmail,
};


