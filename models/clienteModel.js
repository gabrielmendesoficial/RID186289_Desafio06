const { getDb } = require("../config/database");


class ClienteModel {
  static async listarClientes() {
    const pool = getDb();
    const query = `SELECT id_cliente, nome_cliente, email, telefone, cpf, data_nascimento, endereco, data_cadastro FROM clientes ORDER BY data_cadastro DESC`;
    const [rows] = await pool.execute(query);
    return rows;
  }

  static async buscarClientePorId(id) {
    const pool = getDb();
    const query = `SELECT id_cliente, nome_cliente, email, telefone, cpf, data_nascimento, endereco, data_cadastro FROM clientes WHERE id_cliente = ?`;
    const [rows] = await pool.execute(query, [id]);
    return rows[0];
  }

  static async criarCliente(cliente) {
    const pool = getDb();
    const { nome_cliente, email, telefone, cpf, data_nascimento, endereco } = cliente;
    const query = `INSERT INTO clientes (nome_cliente, email, telefone, cpf, data_nascimento, endereco) VALUES (?, ?, ?, ?, ?, ?)`;
    const [result] = await pool.execute(query, [nome_cliente, email, telefone, cpf, data_nascimento, endereco]);
    return result;
  }

  static async atualizarCliente(id, cliente) {
    const pool = getDb();
    const { nome_cliente, email, telefone, cpf, data_nascimento, endereco } = cliente;
    const query = `UPDATE clientes SET nome_cliente = COALESCE(?, nome_cliente), email = COALESCE(?, email), telefone = COALESCE(?, telefone), cpf = COALESCE(?, cpf), data_nascimento = COALESCE(?, data_nascimento), endereco = COALESCE(?, endereco) WHERE id_cliente = ?`;
    const [result] = await pool.execute(query, [nome_cliente, email, telefone, cpf, data_nascimento, endereco, id]);
    return result;
  }

  static async deletarCliente(id) {
    const pool = getDb();
    const deleteQuery = 'DELETE FROM clientes WHERE id_cliente = ?';
    const [result] = await pool.execute(deleteQuery, [id]);
    return result;
  }

  static async buscarPorEmail(email) {
    const pool = getDb();
    const query = `SELECT id_cliente, nome_cliente, email, telefone, cpf, data_nascimento, endereco, data_cadastro FROM clientes WHERE email = ?`;
    const [rows] = await pool.execute(query, [email]);
    return rows[0];
  }
}

module.exports = ClienteModel;


