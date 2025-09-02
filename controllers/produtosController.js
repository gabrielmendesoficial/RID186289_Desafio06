const Produto = require("../models/produtoModel");

/**
 * Controller para gerenciamento de produtos
 * Contém todas as operações CRUD e busca por categoria
 */

/**
 * Lista todos os produtos ativos
 * @route GET /api/produtos
 */
const listarProdutos = async (req, res, next) => {
  try {
    const rows = await Produto.listarProdutos();
    
    res.status(200).json({
      success: true,
      message: 'Produtos listados com sucesso',
      data: rows,
      total: rows.length,
      timestamp: new Date().toISOString()
    });
  } catch (err) {
    next(err);
  }
};

/**
 * Busca um produto específico por ID
 * @route GET /api/produtos/:id
 */
const buscarProdutoPorId = async (req, res, next) => {
  try {
    const { id } = req.params;
    const produto = await Produto.buscarProdutoPorId(id);
    
    if (!produto) {
      return res.status(404).json({
        success: false,
        error: "Produto não encontrado",
        message: `Nenhum produto encontrado com ID ${id}`,
        timestamp: new Date().toISOString()
      });
    }
    
    res.status(200).json({
      success: true,
      message: 'Produto encontrado com sucesso',
      data: produto,
      timestamp: new Date().toISOString()
    });
  } catch (err) {
    next(err);
  }
};

/**
 * Cria um novo produto
 * @route POST /api/produtos
 */
const criarProduto = async (req, res, next) => {
  try {
    const { nome_produto, descricao, preco, categoria, marca } = req.body;

    const result = await Produto.criarProduto({ 
      nome_produto, 
      descricao, 
      preco, 
      categoria, 
      marca 
    });
    
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
        ativo: 1,
        data_cadastro: new Date().toISOString()
      },
      timestamp: new Date().toISOString()
    });
  } catch (err) {
    // Tratamento específico para erro de nome duplicado
    if (err.code === 'ER_DUP_ENTRY') {
      return res.status(409).json({
        success: false,
        error: "Produto já existe",
        message: "Já existe um produto com este nome",
        timestamp: new Date().toISOString()
      });
    }
    next(err);
  }
};

/**
 * Atualiza um produto existente
 * @route PUT /api/produtos/:id
 */
const atualizarProduto = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { nome_produto, descricao, preco, categoria, marca, ativo } = req.body;

    // Verificar se o produto existe
    const produtoExistente = await Produto.buscarProdutoPorId(id);
    if (!produtoExistente) {
      return res.status(404).json({
        success: false,
        error: "Produto não encontrado",
        message: `Nenhum produto encontrado com ID ${id}`,
        timestamp: new Date().toISOString()
      });
    }

    const result = await Produto.atualizarProduto(id, { 
      nome_produto, 
      descricao, 
      preco, 
      categoria, 
      marca, 
      ativo 
    });
    
    res.status(200).json({
      success: true,
      message: "Produto atualizado com sucesso",
      data: {
        id_produto: id,
        ...req.body
      },
      timestamp: new Date().toISOString()
    });
  } catch (err) {
    if (err.code === 'ER_DUP_ENTRY') {
      return res.status(409).json({
        success: false,
        error: "Conflito de dados",
        message: "Já existe um produto com este nome",
        timestamp: new Date().toISOString()
      });
    }
    next(err);
  }
};

/**
 * Remove um produto (soft delete)
 * @route DELETE /api/produtos/:id
 */
const deletarProduto = async (req, res, next) => {
  try {
    const { id } = req.params;
    
    // Verificar se o produto existe
    const produtoExistente = await Produto.buscarProdutoPorId(id);
    if (!produtoExistente) {
      return res.status(404).json({
        success: false,
        error: "Produto não encontrado",
        message: `Nenhum produto encontrado com ID ${id}`,
        timestamp: new Date().toISOString()
      });
    }

    await Produto.deletarProduto(id);
    
    res.status(200).json({
      success: true,
      message: "Produto removido com sucesso",
      note: "Produto desativado (soft delete) - não foi removido fisicamente",
      data: {
        id_produto: id,
        ativo: 0
      },
      timestamp: new Date().toISOString()
    });
  } catch (err) {
    next(err);
  }
};

/**
 * Busca produtos por categoria
 * @route GET /api/produtos/categoria/:categoria
 */
const buscarPorCategoria = async (req, res, next) => {
  try {
    const { categoria } = req.params;
    const rows = await Produto.buscarPorCategoria(categoria);
    
    res.status(200).json({
      success: true,
      message: `Produtos da categoria '${categoria}' listados com sucesso`,
      data: rows,
      total: rows.length,
      categoria,
      timestamp: new Date().toISOString()
    });
  } catch (err) {
    next(err);
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


