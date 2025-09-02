const mysql = require("mysql2/promise");

// Configuração do banco de dados
const dbConfig = {
  host: process.env.DB_HOST || "localhost",
  user: process.env.DB_USER || "root",
  password: process.env.DB_PASSWORD || "ftw1421",
  database: process.env.DB_NAME || "dncommerce",
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  acquireTimeout: 60000,
  timeout: 60000,
  reconnect: true
};

let pool;

const initializeDatabase = async () => {
  try {
    // Criar pool de conexões
    pool = await mysql.createPool(dbConfig);
    console.log("Pool de conexões MySQL criado com sucesso!");

    // Testar a conexão
    const connection = await pool.getConnection();
    console.log("Conexão MySQL estabelecida com sucesso!");
    
    // Verificar se o banco existe
    const [rows] = await connection.execute("SHOW TABLES");
    console.log(`Banco de dados '${dbConfig.database}' conectado com ${rows.length} tabelas`);
    
    connection.release();

  } catch (error) {
    console.error("Erro ao conectar com o banco de dados MySQL:");
    console.error(`   Host: ${dbConfig.host}`);
    console.error(`   Database: ${dbConfig.database}`);
    console.error(`   User: ${dbConfig.user}`);
    console.error(`   Erro: ${error.message}`);
    
    if (error.code === 'ER_ACCESS_DENIED_ERROR') {
      console.error("Verifique as credenciais do banco de dados no arquivo .env");
    } else if (error.code === 'ER_BAD_DB_ERROR') {
      console.error("Verifique se o banco de dados 'dncommerce' existe");
    } else if (error.code === 'ECONNREFUSED') {
      console.error("Verifique se o servidor MySQL está executando");
    }
    
    process.exit(1);
  }
};

const getDb = () => {
  if (!pool) {
    throw new Error("Pool de conexão MySQL não inicializado. Chame initializeDatabase primeiro.");
  }
  return pool;
};

const closeDatabase = async () => {
  if (pool) {
    await pool.end();
    console.log("Conexão com o banco de dados MySQL fechada.");
  }
};

module.exports = { initializeDatabase, getDb, closeDatabase };


