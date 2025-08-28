const express = require('express');
const router = express.Router();
const produtosController = require('../controllers/produtosController');

// GET /api/produtos - Listar todos os produtos
router.get('/', produtosController.listarProdutos);

// GET /api/produtos/categoria/:categoria - Buscar produtos por categoria (deve vir antes de /:id)
router.get('/categoria/:categoria', produtosController.buscarPorCategoria);

// GET /api/produtos/:id - Buscar produto por ID
router.get('/:id', produtosController.buscarProdutoPorId);

// POST /api/produtos - Criar novo produto
router.post('/', produtosController.criarProduto);

// PUT /api/produtos/:id - Atualizar produto
router.put('/:id', produtosController.atualizarProduto);

// DELETE /api/produtos/:id - Deletar produto (soft delete)
router.delete('/:id', produtosController.deletarProduto);

module.exports = router;

