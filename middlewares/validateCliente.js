/**
 * Middleware de validação para dados de cliente
 * Valida campos obrigatórios e formatos esperados
 */
const validateCliente = (req, res, next) => {
  const { nome_cliente, email, cpf, telefone, data_nascimento } = req.body;

  // Validação de campos obrigatórios
  if (!nome_cliente || !email || !cpf) {
    return res.status(400).json({
      success: false,
      error: 'Dados obrigatórios não fornecidos',
      message: 'Nome, email e CPF são obrigatórios',
      fields: {
        nome_cliente: !nome_cliente ? 'Campo obrigatório' : null,
        email: !email ? 'Campo obrigatório' : null,
        cpf: !cpf ? 'Campo obrigatório' : null
      }
    });
  }

  // Validação de formato de email
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({
      success: false,
      error: 'Formato de email inválido',
      message: 'Por favor, forneça um email válido (exemplo: usuario@dominio.com)'
    });
  }

  // Validação de formato de CPF
  const cpfRegex = /^\d{3}\.\d{3}\.\d{3}-\d{2}$/;
  if (!cpfRegex.test(cpf)) {
    return res.status(400).json({
      success: false,
      error: 'Formato de CPF inválido',
      message: 'CPF deve estar no formato XXX.XXX.XXX-XX'
    });
  }

  // Validação de telefone (se fornecido)
  if (telefone) {
    const telefoneRegex = /^\(\d{2}\)\s\d{4,5}-\d{4}$/;
    if (!telefoneRegex.test(telefone)) {
      return res.status(400).json({
        success: false,
        error: 'Formato de telefone inválido',
        message: 'Telefone deve estar no formato (XX) XXXXX-XXXX ou (XX) XXXX-XXXX'
      });
    }
  }

  // Validação de data de nascimento (se fornecida)
  if (data_nascimento) {
    const dataRegex = /^\d{4}-\d{2}-\d{2}$/;
    if (!dataRegex.test(data_nascimento)) {
      return res.status(400).json({
        success: false,
        error: 'Formato de data inválido',
        message: 'Data de nascimento deve estar no formato YYYY-MM-DD'
      });
    }

    // Verificar se a data é válida e não é futura
    const dataNasc = new Date(data_nascimento);
    const hoje = new Date();
    
    if (dataNasc > hoje) {
      return res.status(400).json({
        success: false,
        error: 'Data de nascimento inválida',
        message: 'Data de nascimento não pode ser no futuro'
      });
    }

    // Verificar idade mínima (ex: 16 anos)
    const idadeMinima = new Date();
    idadeMinima.setFullYear(hoje.getFullYear() - 16);
    
    if (dataNasc > idadeMinima) {
      return res.status(400).json({
        success: false,
        error: 'Idade mínima não atendida',
        message: 'Cliente deve ter pelo menos 16 anos'
      });
    }
  }

  // Validação de tamanho dos campos
  if (nome_cliente.length < 2 || nome_cliente.length > 255) {
    return res.status(400).json({
      success: false,
      error: 'Nome inválido',
      message: 'Nome deve ter entre 2 e 255 caracteres'
    });
  }

  next();
};

/**
 * Middleware de validação para atualização de cliente (campos opcionais)
 */
const validateClienteUpdate = (req, res, next) => {
  const { email, cpf, telefone, data_nascimento } = req.body;

  // Validação de email (se fornecido)
  if (email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        success: false,
        error: 'Formato de email inválido',
        message: 'Por favor, forneça um email válido'
      });
    }
  }

  // Validação de CPF (se fornecido)
  if (cpf) {
    const cpfRegex = /^\d{3}\.\d{3}\.\d{3}-\d{2}$/;
    if (!cpfRegex.test(cpf)) {
      return res.status(400).json({
        success: false,
        error: 'Formato de CPF inválido',
        message: 'CPF deve estar no formato XXX.XXX.XXX-XX'
      });
    }
  }

  // Validação de telefone (se fornecido)
  if (telefone) {
    const telefoneRegex = /^\(\d{2}\)\s\d{4,5}-\d{4}$/;
    if (!telefoneRegex.test(telefone)) {
      return res.status(400).json({
        success: false,
        error: 'Formato de telefone inválido',
        message: 'Telefone deve estar no formato (XX) XXXXX-XXXX'
      });
    }
  }

  // Validação de data de nascimento (se fornecida)
  if (data_nascimento) {
    const dataRegex = /^\d{4}-\d{2}-\d{2}$/;
    if (!dataRegex.test(data_nascimento)) {
      return res.status(400).json({
        success: false,
        error: 'Formato de data inválido',
        message: 'Data de nascimento deve estar no formato YYYY-MM-DD'
      });
    }
  }

  next();
};

module.exports = { validateCliente, validateClienteUpdate };
