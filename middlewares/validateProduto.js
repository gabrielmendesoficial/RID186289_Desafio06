/**
 * Middleware de validação para dados de produto
 * Valida campos obrigatórios, formatos e regras de negócio
 */
const validateProduto = (req, res, next) => {
  const { nome_produto, preco, categoria, marca, descricao } = req.body;

  // Validação de campos obrigatórios
  if (!nome_produto || preco === undefined || preco === null) {
    return res.status(400).json({
      success: false,
      error: 'Dados obrigatórios não fornecidos',
      message: 'Nome do produto e preço são obrigatórios',
      fields: {
        nome_produto: !nome_produto ? 'Campo obrigatório' : null,
        preco: (preco === undefined || preco === null) ? 'Campo obrigatório' : null
      }
    });
  }

  // Validação de preço
  const precoNum = parseFloat(preco);
  if (isNaN(precoNum) || precoNum <= 0) {
    return res.status(400).json({
      success: false,
      error: 'Preço inválido',
      message: 'O preço deve ser um número maior que zero',
      received: preco
    });
  }

  if (precoNum > 999999.99) {
    return res.status(400).json({
      success: false,
      error: 'Preço muito alto',
      message: 'O preço não pode exceder R$ 999.999,99'
    });
  }

  // Validação de nome do produto
  if (nome_produto.length < 2 || nome_produto.length > 255) {
    return res.status(400).json({
      success: false,
      error: 'Nome do produto inválido',
      message: 'Nome deve ter entre 2 e 255 caracteres'
    });
  }

  // Validação de categoria (se fornecida)
  if (categoria) {
    const categoriasValidas = ['Maquiagem', 'Skincare', 'Perfumes', 'Cabelos', 'Corpo', 'Unhas'];
    if (!categoriasValidas.includes(categoria)) {
      return res.status(400).json({
        success: false,
        error: 'Categoria inválida',
        message: `Categoria deve ser uma das seguintes: ${categoriasValidas.join(', ')}`,
        received: categoria
      });
    }
  }

  // Validação de marca (se fornecida)
  if (marca && (marca.length < 1 || marca.length > 100)) {
    return res.status(400).json({
      success: false,
      error: 'Marca inválida',
      message: 'Marca deve ter entre 1 e 100 caracteres'
    });
  }

  // Validação de descrição (se fornecida)
  if (descricao && descricao.length > 1000) {
    return res.status(400).json({
      success: false,
      error: 'Descrição muito longa',
      message: 'Descrição deve ter no máximo 1000 caracteres'
    });
  }

  // Normalizar o preço para 2 casas decimais
  req.body.preco = parseFloat(precoNum.toFixed(2));

  next();
};

/**
 * Middleware de validação para atualização de produto (campos opcionais)
 */
const validateProdutoUpdate = (req, res, next) => {
  const { nome_produto, preco, categoria, marca, descricao, ativo } = req.body;

  // Validação de preço (se fornecido)
  if (preco !== undefined && preco !== null) {
    const precoNum = parseFloat(preco);
    if (isNaN(precoNum) || precoNum <= 0) {
      return res.status(400).json({
        success: false,
        error: 'Preço inválido',
        message: 'O preço deve ser um número maior que zero'
      });
    }
    req.body.preco = parseFloat(precoNum.toFixed(2));
  }

  // Validação de nome (se fornecido)
  if (nome_produto && (nome_produto.length < 2 || nome_produto.length > 255)) {
    return res.status(400).json({
      success: false,
      error: 'Nome do produto inválido',
      message: 'Nome deve ter entre 2 e 255 caracteres'
    });
  }

  // Validação de categoria (se fornecida)
  if (categoria) {
    const categoriasValidas = ['Maquiagem', 'Skincare', 'Perfumes', 'Cabelos', 'Corpo', 'Unhas'];
    if (!categoriasValidas.includes(categoria)) {
      return res.status(400).json({
        success: false,
        error: 'Categoria inválida',
        message: `Categoria deve ser uma das seguintes: ${categoriasValidas.join(', ')}`
      });
    }
  }

  // Validação de status ativo (se fornecido)
  if (ativo !== undefined && ativo !== null) {
    if (![0, 1, true, false].includes(ativo)) {
      return res.status(400).json({
        success: false,
        error: 'Status inválido',
        message: 'Status ativo deve ser 0, 1, true ou false'
      });
    }
    // Converter para número
    req.body.ativo = ativo === true || ativo === 1 ? 1 : 0;
  }

  next();
};

/**
 * Middleware de validação para parâmetros de ID
 */
const validateId = (req, res, next) => {
  const { id } = req.params;
  
  if (!id || isNaN(parseInt(id)) || parseInt(id) <= 0) {
    return res.status(400).json({
      success: false,
      error: 'ID inválido',
      message: 'ID deve ser um número inteiro positivo',
      received: id
    });
  }

  // Converter para número inteiro
  req.params.id = parseInt(id);
  
  next();
};

module.exports = { 
  validateProduto, 
  validateProdutoUpdate, 
  validateId 
};
