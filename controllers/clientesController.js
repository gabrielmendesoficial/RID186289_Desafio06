

const ClienteModel = require("../models/clienteModel");

/**
 * Controller para gerenciamento de clientes
 * Contém todas as operações CRUD e busca por email
 */

/**
 * @route GET /api/clientes
 */
const listarClientes = async (req, res, next) => {
  try {
    const rows = await ClienteModel.listarClientes();
    
    res.status(200).json({ 
      success: true, 
      message: 'Clientes listados com sucesso',
      data: rows, 
      total: rows.length,
      timestamp: new Date().toISOString()
    });
  } catch (err) {
    next(err);
  }
};

/**
 * Busca um cliente específico por ID
 * @route GET /api/clientes/:id
 */
const buscarClientePorId = async (req, res, next) => {
  try {
    const { id } = req.params;
    const cliente = await ClienteModel.buscarClientePorId(id);
    
    if (!cliente) {
      return res.status(404).json({ 
        success: false, 
        error: "Cliente não encontrado",
        message: `Nenhum cliente encontrado com ID ${id}`,
        timestamp: new Date().toISOString()
      });
    }
    
    res.status(200).json({ 
      success: true, 
      message: 'Cliente encontrado com sucesso',
      data: cliente,
      timestamp: new Date().toISOString()
    });
  } catch (err) {
    next(err);
  }
};

/**
 * Cria um novo cliente
 * @route POST /api/clientes
 */
const criarCliente = async (req, res, next) => {
  try {
    const { nome_cliente, email, telefone, cpf, data_nascimento, endereco } = req.body;
    
    const result = await ClienteModel.criarCliente({ 
      nome_cliente, 
      email, 
      telefone, 
      cpf, 
      data_nascimento, 
      endereco 
    });
    
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
        data_cadastro: new Date().toISOString()
      },
      timestamp: new Date().toISOString()
    });
  } catch (err) {
    if (err.code === 'ER_DUP_ENTRY') { // Tratamento específico para erro de dados duplicados
      let campo = 'dados';
      if (err.message.includes('email')) campo = 'email';
      if (err.message.includes('cpf')) campo = 'CPF';
      
      return res.status(409).json({ 
        success: false, 
        error: "Dados já cadastrados",
        message: `Este ${campo} já está em uso por outro cliente`,
        timestamp: new Date().toISOString()
      });
    }
    next(err);
  }
};

/**
 * Atualiza um cliente existente
 * @route PUT /api/clientes/:id
 */
const atualizarCliente = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { nome_cliente, email, telefone, cpf, data_nascimento, endereco } = req.body;
    
    // Verificar se o cliente existe
    const clienteExistente = await ClienteModel.buscarClientePorId(id);
    if (!clienteExistente) {
      return res.status(404).json({ 
        success: false, 
        error: "Cliente não encontrado",
        message: `Nenhum cliente encontrado com ID ${id}`,
        timestamp: new Date().toISOString()
      });
    }
    
    await ClienteModel.atualizarCliente(id, { 
      nome_cliente, 
      email, 
      telefone, 
      cpf, 
      data_nascimento, 
      endereco 
    });
    
    res.status(200).json({ 
      success: true, 
      message: "Cliente atualizado com sucesso",
      data: {
        id_cliente: id,
        ...req.body
      },
      timestamp: new Date().toISOString()
    });
  } catch (err) {
    if (err.code === 'ER_DUP_ENTRY') {
      let campo = 'dados';
      if (err.message.includes('email')) campo = 'email';
      if (err.message.includes('cpf')) campo = 'CPF';
      
      return res.status(409).json({ 
        success: false, 
        error: "Conflito de dados",
        message: `Este ${campo} já está em uso por outro cliente`,
        timestamp: new Date().toISOString()
      });
    }
    next(err);
  }
};

/**
 * Remove um cliente
 * @route DELETE /api/clientes/:id
 */
const deletarCliente = async (req, res, next) => {
  try {
    const { id } = req.params;
    
    const clienteExistente = await ClienteModel.buscarClientePorId(id);  // Verificar se o cliente existe
    if (!clienteExistente) {
      return res.status(404).json({ 
        success: false, 
        error: "Cliente não encontrado",
        message: `Nenhum cliente encontrado com ID ${id}`,
        timestamp: new Date().toISOString()
      });
    }
    
    await ClienteModel.deletarCliente(id);
    
    res.status(200).json({ 
      success: true, 
      message: "Cliente removido com sucesso",
      data: {
        id_cliente: id
      },
      timestamp: new Date().toISOString()
    });
  } catch (err) { // Tratamento para erro de integridade referencial
    if (err.code === 'ER_ROW_IS_REFERENCED_2') {
      return res.status(409).json({ 
        success: false, 
        error: "Cliente possui pedidos associados",
        message: "Não é possível remover um cliente que possui pedidos no sistema",
        timestamp: new Date().toISOString()
      });
    }
    next(err);
  }
};

/**
 * Busca cliente por email
 * @route GET /api/clientes/email/:email
 */
const buscarPorEmail = async (req, res, next) => {
  try {
    const { email } = req.params;
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/; // Validação básica de formato de email
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        success: false,
        error: "Email inválido",
        message: "Formato de email inválido",
        timestamp: new Date().toISOString()
      });
    }
    
    const cliente = await ClienteModel.buscarPorEmail(email);
    
    if (!cliente) {
      return res.status(404).json({ 
        success: false, 
        error: "Cliente não encontrado",
        message: `Nenhum cliente encontrado com email ${email}`,
        timestamp: new Date().toISOString()
      });
    }
    
    res.status(200).json({ 
      success: true, 
      message: 'Cliente encontrado com sucesso',
      data: cliente,
      timestamp: new Date().toISOString()
    });
  } catch (err) {
    next(err);
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


