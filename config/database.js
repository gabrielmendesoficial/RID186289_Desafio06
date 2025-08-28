const mysql = require("mysql2/promise");

const dbConfig = {
  host: process.env.DB_HOST || "localhost",
  user: process.env.DB_USER || "root",
  password: process.env.DB_PASSWORD || "ftw1421",
  database: process.env.DB_NAME || "dncommerce",
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
};

let pool;

const initializeDatabase = async () => {
  try {
    pool = await mysql.createPool(dbConfig);
    console.log("Conectado ao banco de dados MySQL.");

    // Testar a conexão
    await pool.getConnection();
    console.log("Conexão MySQL bem-sucedida!");

    // Não criaremos tabelas aqui, pois o script SQL será executado manualmente
    // Nem inseriremos dados de exemplo, pois eles virão do dump SQL

  } catch (error) {
    console.error("Erro ao conectar ou inicializar o banco de dados MySQL:", error.message);
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


