const { getDb } = require("../config/database");

const Cliente = {
  listarClientes: async () => {
    const pool = getDb();
    const query = `
      SELECT id_cliente, nome_cliente, email, telefone, cpf, data_nascimento, endereco, data_cadastro
      FROM clientes 
      ORDER BY data_cadastro DESC
    `;
    const [rows] = await pool.execute(query);
    return rows;
  },

  buscarClientePorId: async (id) => {
    const pool = getDb();
    const query = `
      SELECT id_cliente, nome_cliente, email, telefone, cpf, data_nascimento, endereco, data_cadastro
      FROM clientes 
      WHERE id_cliente = ?
    `;
    const [rows] = await pool.execute(query, [id]);
    return rows[0];
  },

  criarCliente: async (cliente) => {
    const pool = getDb();
    const { nome_cliente, email, telefone, cpf, data_nascimento, endereco } = cliente;
    const query = `
      INSERT INTO clientes (nome_cliente, email, telefone, cpf, data_nascimento, endereco)
      VALUES (?, ?, ?, ?, ?, ?)
    `;
    const [result] = await pool.execute(query, [nome_cliente, email, telefone, cpf, data_nascimento, endereco]);
    return result;
  },

  atualizarCliente: async (id, cliente) => {
    const pool = getDb();
    const { nome_cliente, email, telefone, cpf, data_nascimento, endereco } = cliente;
    const query = `
      UPDATE clientes 
      SET nome_cliente = COALESCE(?, nome_cliente),
          email = COALESCE(?, email),
          telefone = COALESCE(?, telefone),
          cpf = COALESCE(?, cpf),
          data_nascimento = COALESCE(?, data_nascimento),
          endereco = COALESCE(?, endereco)
      WHERE id_cliente = ?
    `;
    const [result] = await pool.execute(query, [nome_cliente, email, telefone, cpf, data_nascimento, endereco, id]);
    return result;
  },

  deletarCliente: async (id) => {
    const pool = getDb();
    const checkQuery = 'SELECT COUNT(*) as total FROM pedidos WHERE id_cliente = ?';
    const [rows] = await pool.execute(checkQuery, [id]);
    const totalPedidos = rows[0].total;

    if (totalPedidos > 0) {
      throw new Error('Cliente possui pedidos associados');
    }

    const deleteQuery = 'DELETE FROM clientes WHERE id_cliente = ?';
    const [result] = await pool.execute(deleteQuery, [id]);
    return result;
  },

  buscarPorEmail: async (email) => {
    const pool = getDb();
    const query = `
      SELECT id_cliente, nome_cliente, email, telefone, cpf, data_nascimento, endereco, data_cadastro
      FROM clientes 
      WHERE email = ?
    `;
    const [rows] = await pool.execute(query, [email]);
    return rows[0];
  }
};

module.exports = Cliente;


