const express = require('express');
const router = express.Router();
const pedidosController = require('../controllers/pedidosController');

// GET /api/pedidos - Listar todos os pedidos
router.get('/', pedidosController.listarPedidos);

// GET /api/pedidos/cliente/:id_cliente - Listar pedidos por cliente (deve vir antes de /:id)
router.get('/cliente/:id_cliente', pedidosController.listarPedidosPorCliente);

// GET /api/pedidos/:id - Buscar pedido por ID com itens
router.get('/:id', pedidosController.buscarPedidoPorId);

// POST /api/pedidos - Criar novo pedido
router.post('/', pedidosController.criarPedido);

// PUT /api/pedidos/:id/status - Atualizar status do pedido
router.put('/:id/status', pedidosController.atualizarStatusPedido);

module.exports = router;

