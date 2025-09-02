/**
 * Middleware de tratamento centralizado de erros
 * Captura e formata todos os erros da aplicação de forma consistente
 */
const errorHandler = (err, req, res, next) => {
  // Log do erro para debugging
  console.error('🚨 Erro capturado:', {
    message: err.message,
    stack: err.stack,
    url: req.url,
    method: req.method,
    timestamp: new Date().toISOString()
  });

  // Determinar status code
  let statusCode = err.status || err.statusCode || 500;
  
  // Tratamento específico para erros do MySQL
  if (err.code) {
    switch (err.code) {
      case 'ER_DUP_ENTRY':
        statusCode = 409;
        break;
      case 'ER_NO_REFERENCED_ROW_2':
        statusCode = 400;
        break;
      case 'ER_ROW_IS_REFERENCED_2':
        statusCode = 409;
        break;
      case 'ER_BAD_FIELD_ERROR':
        statusCode = 400;
        break;
      default:
        statusCode = 500;
    }
  }

  // Estrutura padrão de resposta de erro
  const errorResponse = {
    success: false,
    error: err.message || 'Erro interno do servidor',
    timestamp: new Date().toISOString()
  };

  // Em ambiente de desenvolvimento, incluir stack trace
  if (process.env.NODE_ENV === 'development') {
    errorResponse.stack = err.stack;
    errorResponse.details = {
      code: err.code,
      errno: err.errno,
      sqlState: err.sqlState
    };
  }

  // Enviar resposta de erro
  res.status(statusCode).json(errorResponse);
};

module.exports = errorHandler;
