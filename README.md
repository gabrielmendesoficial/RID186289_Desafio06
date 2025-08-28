# DNCommerce API

Sistema de gerenciamento de estoque e pedidos para loja online de produtos de beleza.

## Descrição

A DNCommerce API é uma solução completa para gerenciamento de uma loja online de produtos de beleza. O sistema permite o cadastro de produtos, clientes, controle de estoque, criação de pedidos e registro de vendas.

## Diagrama do Banco de Dados

![Diagrama ER](./DNCommerce_ER_Diagram.png)

## Tecnologias Utilizadas

- **Node.js** - Runtime JavaScript
- **Express.js** - Framework web
- **MySQL** - Banco de dados
- **mysql2/promise** - Driver MySQL para Node.js
- **CORS** - Controle de acesso
- **Helmet** - Segurança
- **Morgan** - Logging

## Instalação e Configuração (MySQL)

### Pré-requisitos

Certifique-se de ter o Node.js, npm e um servidor MySQL instalados em sua máquina.

### No Linux (Ubuntu/Debian)

1.  **Instalar Node.js e npm:**
    ```bash
    sudo apt update
    sudo apt install nodejs npm
    ```
2.  **Instalar MySQL Server:**
    ```bash
    sudo apt install mysql-server
    sudo mysql_secure_installation # Siga as instruções para configurar a segurança
    ```
3.  **Acessar MySQL e criar DB/Usuário:**
    ```bash
    sudo mysql -u root -p
    # Dentro do MySQL Shell, execute os comandos da seção '3.1. Crie o Banco de Dados e Usuário'
    exit
    ```
4.  **Siga os passos 1, 2, 3.2 e 3.3 da seção 'Instalação e Configuração (MySQL)' acima.**

### No Windows

1.  **Instalar Node.js e npm:**
    Baixe e execute o instalador MSI do site oficial: [nodejs.org](https://nodejs.org/en/download/)
2.  **Instalar MySQL Server:**
    Baixe e execute o MySQL Installer do site oficial: [dev.mysql.com/downloads/installer/](https://dev.mysql.com/downloads/installer/)
    Durante a instalação, configure um usuário `root` e uma senha.
3.  **Acessar MySQL e criar DB/Usuário:**
    Abra o MySQL Command Line Client ou MySQL Workbench e execute os comandos da seção '3.1. Crie o Banco de Dados e Usuário'.
4.  **Siga os passos 1, 2, 3.2 e 3.3 da seção 'Instalação e Configuração (MySQL)' acima.**
    Para o passo 3.3, você pode criar o arquivo `.env` usando um editor de texto como o Bloco de Notas.


### 1. Clone o repositório

```bash
git clone https://github.com/gabrielmendesoficial/RID186289_Desafio06
cd RID186289_Desafio06
```

### 2. Instale as dependências

```bash
npm install
```

### 3. Configuração do Banco de Dados MySQL

#### 3.1. Crie o Banco de Dados e Usuário

No seu servidor MySQL, crie um banco de dados chamado `dncommerce` e um usuário com permissões adequadas para acessá-lo:

```sql
CREATE DATABASE dncommerce;
CREATE USER 'user'@'localhost' IDENTIFIED BY 'senha';
GRANT ALL PRIVILEGES ON dncommerce.* TO 'user'@'localhost';
FLUSH PRIVILEGES;
```

#### 3.2. Importe o Esquema e Dados Iniciais

O projeto inclui um arquivo `dncommerce_mysql.sql` com o esquema do banco de dados e dados de exemplo. Importe-o para o seu banco de dados `dncommerce`:

```bash
mysql -u user -p dncommerce < dncommerce_mysql.sql
```
> Substitua `user` pelo seu usuário MySQL e `dncommerce` pelo nome do seu banco de dados. Será solicitada a senha.

#### 3.3. Configure as Variáveis de Ambiente

Crie um arquivo `.env` na raiz do projeto (`RID186289_Desafio06/`) com as suas credenciais do MySQL:

```
DB_HOST=localhost
DB_USER=user
DB_PASSWORD=senha
DB_NAME=dncommerce
```

### 4. Inicie o servidor

```bash
npm start
```

> O servidor estará disponível em `http://localhost:3000` (ou a porta configurada no `app.js`).

## Estrutura do Banco de Dados

### Entidades

#### Produtos
- `id_produto` (PK) - Identificador único
- `nome_produto` - Nome do produto
- `descricao` - Descrição detalhada
- `preco` - Preço unitário
- `categoria` - Categoria (maquiagem, skincare, perfumes)
- `marca` - Marca do produto
- `data_cadastro` - Data de cadastro
- `ativo` - Status do produto

#### Clientes
- `id_cliente` (PK) - Identificador único
- `nome_cliente` - Nome completo
- `email` - Email (único)
- `telefone` - Telefone de contato
- `cpf` - CPF (único)
- `data_nascimento` - Data de nascimento
- `endereco` - Endereço completo
- `data_cadastro` - Data de cadastro

#### Estoque
- `id_estoque` (PK) - Identificador único
- `id_produto` (FK) - Referência ao produto
- `quantidade_disponivel` - Quantidade em estoque
- `quantidade_minima` - Estoque mínimo
- `localizacao` - Localização física
- `data_ultima_atualizacao` - Última atualização

#### Pedidos
- `id_pedido` (PK) - Identificador único
- `id_cliente` (FK) - Referência ao cliente
- `data_pedido` - Data e hora do pedido
- `status_pedido` - Status (pendente, processando, enviado, entregue, cancelado)
- `valor_total` - Valor total
- `endereco_entrega` - Endereço de entrega
- `forma_pagamento` - Forma de pagamento

#### Vendas (Itens do Pedido)
- `id_venda` (PK) - Identificador único
- `id_pedido` (FK) - Referência ao pedido
- `id_produto` (FK) - Referência ao produto
- `quantidade` - Quantidade vendida
- `preco_unitario` - Preço no momento da venda
- `subtotal` - Subtotal do item

## API Endpoints

### Produtos

| Método | Endpoint | Descrição |
|--------|----------|-----------|
| GET | `/api/produtos` | Listar todos os produtos |
| GET | `/api/produtos/:id` | Buscar produto por ID |
| GET | `/api/produtos/categoria/:categoria` | Buscar produtos por categoria |
| POST | `/api/produtos` | Criar novo produto |
| PUT | `/api/produtos/:id` | Atualizar produto |
| DELETE | `/api/produtos/:id` | Deletar produto |

### Clientes

| Método | Endpoint | Descrição |
|--------|----------|-----------|
| GET | `/api/clientes` | Listar todos os clientes |
| GET | `/api/clientes/:id` | Buscar cliente por ID |
| GET | `/api/clientes/email/:email` | Buscar cliente por email |
| POST | `/api/clientes` | Criar novo cliente |
| PUT | `/api/clientes/:id` | Atualizar cliente |
| DELETE | `/api/clientes/:id` | Deletar cliente |

### Estoque

| Método | Endpoint | Descrição |
|--------|----------|-----------|
| GET | `/api/estoque` | Listar todo o estoque |
| GET | `/api/estoque/baixo` | Produtos com estoque baixo |
| GET | `/api/estoque/produto/:id_produto` | Estoque de um produto |
| PUT | `/api/estoque/produto/:id_produto` | Atualizar estoque |
| POST | `/api/estoque/produto/:id_produto/adicionar` | Adicionar ao estoque |
| POST | `/api/estoque/produto/:id_produto/remover` | Remover do estoque |

### Pedidos

| Método | Endpoint | Descrição |
|--------|----------|-----------|
| GET | `/api/pedidos` | Listar todos os pedidos |
| GET | `/api/pedidos/:id` | Buscar pedido por ID |
| GET | `/api/pedidos/cliente/:id_cliente` | Pedidos de um cliente |
| POST | `/api/pedidos` | Criar novo pedido |
| PUT | `/api/pedidos/:id/status` | Atualizar status do pedido |

### Vendas

| Método | Endpoint | Descrição |
|--------|----------|-----------|
| GET | `/api/vendas` | Listar todas as vendas |
| GET | `/api/vendas/:id` | Buscar venda por ID |
| GET | `/api/vendas/produto/:id_produto` | Vendas de um produto |
| GET | `/api/vendas/pedido/:id_pedido` | Vendas de um pedido |
| GET | `/api/vendas/relatorio/periodo` | Relatório por período |
| GET | `/api/vendas/relatorio/top-produtos` | Produtos mais vendidos |
| GET | `/api/vendas/relatorio/categorias` | Vendas por categoria |

## Exemplos de Uso

### Criar um produto
```bash
curl -X POST http://localhost:3000/api/produtos \
  -H "Content-Type: application/json" \
  -d \'{
    "nome_produto": "Base Líquida Premium",
    "descricao": "Base de alta cobertura",
    "preco": 89.90,
    "categoria": "Maquiagem",
    "marca": "BeautyPro"
  }\'
```

### Criar um cliente
```bash
curl -X POST http://localhost:3000/api/clientes \
  -H "Content-Type: application/json" \
  -d \'{
    "nome_cliente": "Maria Silva",
    "email": "maria@email.com",
    "telefone": "(11) 99999-1111",
    "cpf": "123.456.789-01",
    "endereco": "Rua das Flores, 123"
  }\'
```

### Criar um pedido
```bash
curl -X POST http://localhost:3000/api/pedidos \
  -H "Content-Type: application/json" \
  -d \'{
    "id_cliente": 1,
    "endereco_entrega": "Rua das Flores, 123",
    "forma_pagamento": "Cartão de Crédito",
    "itens": [
      {
        "id_produto": 1,
        "quantidade": 2
      }
    ]
  }\'
```

## Códigos de Status HTTP

- `200` - Sucesso
- `201` - Criado com sucesso
- `400` - Erro de validação
- `404` - Não encontrado
- `409` - Conflito (dados duplicados)
- `500` - Erro interno do servidor

## Estrutura do Projeto

```
RID186289_Desafio06/
├── app.js                 # Arquivo principal
├── package.json           # Dependências e scripts
├── config/
│   └── database.js        # Configuração do banco
├── controllers/
│   ├── produtosController.js
│   ├── clientesController.js
│   ├── estoqueController.js
│   ├── pedidosController.js
│   └── vendasController.js
├── models/
│   ├── clienteModel.js
│   ├── produtoModel.js
│   ├── estoqueModel.js
│   ├── pedidoModel.js
│   └── vendaModel.js
├── routes/
│   ├── produtos.js
│   ├── clientes.js
│   ├── estoque.js
│   ├── pedidos.js
│   └── vendas.js
└── dncommerce_mysql.sql   # Esquema e dados para MySQL
```