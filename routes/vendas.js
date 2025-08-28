const express = require('express');
const router = express.Router();
const vendasController = require('../controllers/vendasController');

// GET /api/vendas - Listar todas as vendas
router.get('/', vendasController.listarVendas);

// GET /api/vendas/produto/:id_produto - Listar vendas por produto (deve vir antes de /:id)
router.get('/produto/:id_produto', vendasController.listarVendasPorProduto);

// GET /api/vendas/pedido/:id_pedido - Listar vendas por pedido (deve vir antes de /:id)
router.get('/pedido/:id_pedido', vendasController.listarVendasPorPedido);

// GET /api/vendas/relatorio/periodo - Relatório de vendas por período (deve vir antes de /:id)
router.get('/relatorio/periodo', vendasController.relatorioVendasPorPeriodo);

// GET /api/vendas/relatorio/top-produtos - Top produtos mais vendidos (deve vir antes de /:id)
router.get('/relatorio/top-produtos', vendasController.topProdutosMaisVendidos);

// GET /api/vendas/relatorio/categorias - Vendas por categoria (deve vir antes de /:id)
router.get('/relatorio/categorias', vendasController.vendasPorCategoria);

// GET /api/vendas/:id - Buscar venda por ID
router.get('/:id', vendasController.buscarVendaPorId);

module.exports = router;

