const { getDb } = require("../config/database");

const Pedido = {
  listarPedidos: async () => {
    const pool = getDb();
    const query = `
      SELECT p.*, c.nome_cliente, c.email
      FROM pedidos p
      INNER JOIN clientes c ON p.id_cliente = c.id_cliente
      ORDER BY p.data_pedido DESC
    `;
    const [rows] = await pool.execute(query);
    return rows;
  },

  buscarPedidoPorId: async (id) => {
    const pool = getDb();
    const pedidoQuery = `
      SELECT p.*, c.nome_cliente, c.email, c.telefone
      FROM pedidos p
      INNER JOIN clientes c ON p.id_cliente = c.id_cliente
      WHERE p.id_pedido = ?
    `;
    const [pedidos] = await pool.execute(pedidoQuery, [id]);
    const pedido = pedidos[0];

    if (!pedido) {
      return null;
    }

    const itensQuery = `
      SELECT v.*, pr.nome_produto, pr.categoria, pr.marca
      FROM vendas v
      INNER JOIN produtos pr ON v.id_produto = pr.id_produto
      WHERE v.id_pedido = ?
    `;
    const [itens] = await pool.execute(itensQuery, [id]);
    return { ...pedido, itens };
  },

  criarPedido: async (pedidoData) => {
    const pool = getDb();
    const { id_cliente, endereco_entrega, forma_pagamento, itens } = pedidoData;

    // Verificar se o cliente existe
    const [clientes] = await pool.execute(
      'SELECT id_cliente FROM clientes WHERE id_cliente = ?',
      [id_cliente]
    );
    if (clientes.length === 0) {
      throw new Error('Cliente não encontrado');
    }

    let valorTotal = 0;
    const errosEstoque = [];

    for (const item of itens) {
      const { id_produto, quantidade } = item;
      if (!id_produto || !quantidade || quantidade <= 0) {
        throw new Error('Item inválido: ID do produto e quantidade são obrigatórios');
      }

      const [produtos] = await pool.execute(
        `
          SELECT p.preco, e.quantidade_disponivel, p.nome_produto
          FROM produtos p
          INNER JOIN estoque e ON p.id_produto = e.id_produto
          WHERE p.id_produto = ? AND p.ativo = 1
        `,
        [id_produto]
      );
      const produto = produtos[0];

      if (!produto) {
        errosEstoque.push(`Produto ${id_produto} não encontrado ou inativo`);
      } else if (produto.quantidade_disponivel < quantidade) {
        errosEstoque.push(`Estoque insuficiente para ${produto.nome_produto}. Disponível: ${produto.quantidade_disponivel}, Solicitado: ${quantidade}`);
      }
      valorTotal += produto.preco * quantidade;
    }

    if (errosEstoque.length > 0) {
      throw new Error(errosEstoque.join('; '));
    }

    const [pedidoResult] = await pool.execute(
      `
        INSERT INTO pedidos (id_cliente, valor_total, endereco_entrega, forma_pagamento)
        VALUES (?, ?, ?, ?)
      `,
      [id_cliente, valorTotal, endereco_entrega, forma_pagamento]
    );
    const idPedido = pedidoResult.insertId;

    for (const item of itens) {
      const { id_produto, quantidade } = item;
      const [precoRows] = await pool.execute(
        'SELECT preco FROM produtos WHERE id_produto = ?',
        [id_produto]
      );
      const precoUnitario = precoRows[0].preco;
      const subtotal = precoUnitario * quantidade;

      await pool.execute(
        `
          INSERT INTO vendas (id_pedido, id_produto, quantidade, preco_unitario, subtotal)
          VALUES (?, ?, ?, ?, ?)
        `,
        [idPedido, id_produto, quantidade, precoUnitario, subtotal]
      );

      await pool.execute(
        `
          UPDATE estoque 
          SET quantidade_disponivel = quantidade_disponivel - ?,
              data_ultima_atualizacao = CURRENT_TIMESTAMP
          WHERE id_produto = ?
        `,
        [quantidade, id_produto]
      );
    }

    return { id_pedido: idPedido, id_cliente, valor_total: valorTotal, endereco_entrega, forma_pagamento, status_pedido: 'pendente', total_itens: itens.length };
  },

  atualizarStatusPedido: async (id, status_pedido) => {
    const pool = getDb();
    const query = 'UPDATE pedidos SET status_pedido = ? WHERE id_pedido = ?';
    const [result] = await pool.execute(query, [status_pedido, id]);
    return result;
  },

  listarPedidosPorCliente: async (id_cliente) => {
    const pool = getDb();
    const query = `
      SELECT p.*, c.nome_cliente, c.email
      FROM pedidos p
      INNER JOIN clientes c ON p.id_cliente = c.id_cliente
      WHERE p.id_cliente = ?
      ORDER BY p.data_pedido DESC
    `;
    const [rows] = await pool.execute(query, [id_cliente]);
    return rows;
  }
};

module.exports = Pedido;


