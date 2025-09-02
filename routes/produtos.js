const express = require('express');
const router = express.Router();
const produtosController = require('../controllers/produtosController');
const { validateProduto, validateProdutoUpdate, validateId } = require('../middlewares/validateProduto');

/**
 * Rotas para gerenciamento de produtos
 * Todas as rotas incluem validações apropriadas
 */

// GET /api/produtos - Listar todos os produtos
router.get('/', produtosController.listarProdutos);

// GET /api/produtos/categoria/:categoria - Buscar produtos por categoria (deve vir antes de /:id)
router.get('/categoria/:categoria', produtosController.buscarPorCategoria);

// GET /api/produtos/:id - Buscar produto por ID
router.get('/:id', validateId, produtosController.buscarProdutoPorId);

// POST /api/produtos - Criar novo produto
router.post('/', validateProduto, produtosController.criarProduto);

// PUT /api/produtos/:id - Atualizar produto
router.put('/:id', validateId, validateProdutoUpdate, produtosController.atualizarProduto);

// DELETE /api/produtos/:id - Deletar produto (soft delete)
router.delete('/:id', validateId, produtosController.deletarProduto);

module.exports = router;

