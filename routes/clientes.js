const express = require('express');
const router = express.Router();
const clientesController = require('../controllers/clientesController');
const { validateCliente, validateClienteUpdate } = require('../middlewares/validateCliente');
const { validateId } = require('../middlewares/validateProduto');

/**
 * Rotas para gerenciamento de clientes
 * Todas as rotas incluem validações apropriadas
 */

// GET /api/clientes - Listar todos os clientes
router.get('/', clientesController.listarClientes);

// GET /api/clientes/email/:email - Buscar cliente por email (deve vir antes de /:id)
router.get('/email/:email', clientesController.buscarPorEmail);

// GET /api/clientes/:id - Buscar cliente por ID
router.get('/:id', validateId, clientesController.buscarClientePorId);

// POST /api/clientes - Criar novo cliente
router.post('/', validateCliente, clientesController.criarCliente);

// PUT /api/clientes/:id - Atualizar cliente
router.put('/:id', validateId, validateClienteUpdate, clientesController.atualizarCliente);

// DELETE /api/clientes/:id - Deletar cliente
router.delete('/:id', validateId, clientesController.deletarCliente);

module.exports = router;

