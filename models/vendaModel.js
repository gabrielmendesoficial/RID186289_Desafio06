const { getDb } = require("../config/database");

const Venda = {
  listarVendas: async () => {
    const pool = getDb();
    const query = `
      SELECT v.*, p.nome_produto, p.categoria, p.marca, 
             ped.data_pedido, ped.status_pedido,
             c.nome_cliente, c.email
      FROM vendas v
      INNER JOIN produtos p ON v.id_produto = p.id_produto
      INNER JOIN pedidos ped ON v.id_pedido = ped.id_pedido
      INNER JOIN clientes c ON ped.id_cliente = c.id_cliente
      ORDER BY ped.data_pedido DESC
    `;
    const [rows] = await pool.execute(query);
    return rows;
  },

  buscarVendaPorId: async (id) => {
    const pool = getDb();
    const query = `
      SELECT v.*, p.nome_produto, p.categoria, p.marca, p.descricao,
             ped.data_pedido, ped.status_pedido, ped.endereco_entrega, ped.forma_pagamento,
             c.nome_cliente, c.email, c.telefone
      FROM vendas v
      INNER JOIN produtos p ON v.id_produto = p.id_produto
      INNER JOIN pedidos ped ON v.id_pedido = ped.id_pedido
      INNER JOIN clientes c ON ped.id_cliente = c.id_cliente
      WHERE v.id_venda = ?
    `;
    const [rows] = await pool.execute(query, [id]);
    return rows[0];
  },

  listarVendasPorProduto: async (id_produto) => {
    const pool = getDb();
    const query = `
      SELECT v.*, p.nome_produto, p.categoria, p.marca,
             ped.data_pedido, ped.status_pedido,
             c.nome_cliente, c.email
      FROM vendas v
      INNER JOIN produtos p ON v.id_produto = p.id_produto
      INNER JOIN pedidos ped ON v.id_pedido = ped.id_pedido
      INNER JOIN clientes c ON ped.id_cliente = c.id_cliente
      WHERE v.id_produto = ?
      ORDER BY ped.data_pedido DESC
    `;
    const [rows] = await pool.execute(query, [id_produto]);
    return rows;
  },

  listarVendasPorPedido: async (id_pedido) => {
    const pool = getDb();
    const query = `
      SELECT v.*, p.nome_produto, p.categoria, p.marca, p.descricao
      FROM vendas v
      INNER JOIN produtos p ON v.id_produto = p.id_produto
      WHERE v.id_pedido = ?
      ORDER BY v.id_venda
    `;
    const [rows] = await pool.execute(query, [id_pedido]);
    return rows;
  },

  relatorioVendasPorPeriodo: async (data_inicio, data_fim) => {
    const pool = getDb();
    const query = `
      SELECT 
        DATE(ped.data_pedido) as data_venda,
        COUNT(v.id_venda) as total_vendas,
        SUM(v.quantidade) as total_produtos_vendidos,
        SUM(v.subtotal) as valor_total_vendas,
        AVG(v.subtotal) as ticket_medio
      FROM vendas v
      INNER JOIN pedidos ped ON v.id_pedido = ped.id_pedido
      WHERE DATE(ped.data_pedido) BETWEEN ? AND ?
        AND ped.status_pedido != 'cancelado'
      GROUP BY DATE(ped.data_pedido)
      ORDER BY data_venda DESC
    `;
    const [rows] = await pool.execute(query, [data_inicio, data_fim]);
    return rows;
  },

  topProdutosMaisVendidos: async (limite) => {
    const pool = getDb();
    const query = `
      SELECT 
        p.id_produto,
        p.nome_produto,
        p.categoria,
        p.marca,
        p.preco,
        SUM(v.quantidade) as total_vendido,
        COUNT(v.id_venda) as numero_vendas,
        SUM(v.subtotal) as receita_total,
        AVG(v.preco_unitario) as preco_medio_venda
      FROM vendas v
      INNER JOIN produtos p ON v.id_produto = p.id_produto
      INNER JOIN pedidos ped ON v.id_pedido = ped.id_pedido
      WHERE ped.status_pedido != 'cancelado'
      GROUP BY p.id_produto, p.nome_produto, p.categoria, p.marca, p.preco
      ORDER BY total_vendido DESC
      LIMIT ?
    `;
    const [rows] = await pool.execute(query, [parseInt(limite)]);
    return rows;
  },

  vendasPorCategoria: async () => {
    const pool = getDb();
    const query = `
      SELECT 
        p.categoria,
        COUNT(v.id_venda) as total_vendas,
        SUM(v.quantidade) as total_produtos_vendidos,
        SUM(v.subtotal) as receita_total,
        AVG(v.subtotal) as ticket_medio
      FROM vendas v
      INNER JOIN produtos p ON v.id_produto = p.id_produto
      INNER JOIN pedidos ped ON v.id_pedido = ped.id_pedido
      WHERE ped.status_pedido != 'cancelado'
      GROUP BY p.categoria
      ORDER BY receita_total DESC
    `;
    const [rows] = await pool.execute(query);
    return rows;
  }
};

module.exports = Venda;


