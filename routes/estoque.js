const express = require('express');
const router = express.Router();
const estoqueController = require('../controllers/estoqueController');

// GET /api/estoque - Listar todo o estoque
router.get('/', estoqueController.listarEstoque);

// GET /api/estoque/baixo - Listar produtos com estoque baixo (deve vir antes de /produto/:id_produto)
router.get('/baixo', estoqueController.listarEstoqueBaixo);

// GET /api/estoque/produto/:id_produto - Buscar estoque por produto
router.get('/produto/:id_produto', estoqueController.buscarEstoquePorProduto);

// PUT /api/estoque/produto/:id_produto - Atualizar estoque
router.put('/produto/:id_produto', estoqueController.atualizarEstoque);

// POST /api/estoque/produto/:id_produto/adicionar - Adicionar ao estoque (entrada)
router.post('/produto/:id_produto/adicionar', estoqueController.adicionarEstoque);

// POST /api/estoque/produto/:id_produto/remover - Remover do estoque (saída)
router.post('/produto/:id_produto/remover', estoqueController.removerEstoque);

module.exports = router;

