const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const path = require('path');

// Importar rotas
const produtosRoutes = require('./routes/produtos');
const clientesRoutes = require('./routes/clientes');
const estoqueRoutes = require('./routes/estoque');
const pedidosRoutes = require('./routes/pedidos');
const vendasRoutes = require('./routes/vendas');

// Importar configuração do banco de dados
const database = require('./config/database');

const app = express();
const PORT = process.env.PORT || 3030;

// Middlewares de segurança e logging
app.use(helmet());
app.use(morgan('combined'));
app.use(cors());

// Middleware para parsing JSON
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Função para inicializar o servidor
const startServer = async () => {
  try {
    // Inicializar banco de dados
    await database.initializeDatabase();

    // Rotas da API
    app.use('/api/produtos', produtosRoutes);
    app.use('/api/clientes', clientesRoutes);
    app.use('/api/estoque', estoqueRoutes);
    app.use('/api/pedidos', pedidosRoutes);
    app.use('/api/vendas', vendasRoutes);

    // Rota de health check
    app.get('/api/health', (req, res) => {
      res.status(200).json({
        status: 'OK',
        message: 'DNCommerce API está funcionando',
        timestamp: new Date().toISOString()
      });
    });

    // Rota raiz
    app.get('/', (req, res) => {
      res.json({
        message: 'Bem-vindo à API DNCommerce',
        version: '1.0.0',
        endpoints: {
          produtos: '/api/produtos',
          clientes: '/api/clientes',
          estoque: '/api/estoque',
          pedidos: '/api/pedidos',
          vendas: '/api/vendas',
          health: '/api/health'
        }
      });
    });

    // Middleware de tratamento de erros
    app.use((err, req, res, next) => {
      console.error(err.stack);
      res.status(500).json({
        error: 'Erro interno do servidor',
        message: err.message
      });
    });

    // Middleware para rotas não encontradas
    app.use('*', (req, res) => {
      res.status(404).json({
        error: 'Rota não encontrada',
        message: `A rota ${req.originalUrl} não existe`
      });
    });

    // Iniciar servidor
    app.listen(PORT, '0.0.0.0', () => {
      console.log(`Servidor DNCommerce API rodando na porta ${PORT}`);
      console.log(`Acesse: http://localhost:${PORT}`);
    });
    
  } catch (error) {
    console.error('Erro ao inicializar o servidor:', error);
    process.exit(1);
  }
};

// Iniciar o servidor
startServer();

module.exports = app;

