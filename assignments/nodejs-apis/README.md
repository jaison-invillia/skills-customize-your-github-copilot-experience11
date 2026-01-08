# 📘 Assignment: Criando APIs com NodeJS

## 🎯 Objective

Você aprenderá a criar APIs RESTful usando Node.js e Express.js. Através dessa tarefa, você compreenderá conceitos fundamentais como roteamento, middlewares, validação de dados, tratamento de erros e boas práticas no desenvolvimento de APIs modernas.

## 📝 Tasks

### 🛠️ Criar uma API de Cadastro de Usuários

#### Description
Desenvolva uma API REST para gerenciar cadastro de usuários. A API deve permitir criar, listar, atualizar e deletar usuários. Implemente validação básica de dados e tratamento de erros apropriado.

#### Requirements
Completed program should:

- Implementar endpoints GET, POST, PUT e DELETE para operações CRUD
- Usar Express.js como framework web
- Validar dados de entrada (nome, email, idade)
- Retornar códigos HTTP apropriados (200, 201, 404, 400, etc)
- Armazenar dados em memória usando um array ou objeto
- Tratar erros com mensagens descritivas em JSON


### 🛠️ Implementar Middlewares Personalizados

#### Description
Crie middlewares para adicionar funcionalidades transversais à sua API, como logging de requisições, validação de cabeçalhos e tratamento global de erros.

#### Requirements
Completed program should:

- Criar middleware de logging que registra todas as requisições (método, rota, timestamp)
- Implementar middleware de validação de Content-Type para requisições POST/PUT
- Criar middleware de tratamento de erros global
- Usar middleware para adicionar cabeçalhos CORS
- Aplicar middlewares na ordem correta no pipeline do Express


### 🛠️ Adicionar Filtros e Paginação

#### Description
Estenda sua API de usuários adicionando recursos de filtro e paginação. Permita que clientes filtrem usuários por critérios específicos e naveguem pelos resultados de forma paginada.

#### Requirements
Completed program should:

- Implementar query parameters para filtrar usuários (por nome, idade mínima/máxima)
- Adicionar paginação com parâmetros `page` e `limit`
- Retornar metadados de paginação (total de itens, página atual, total de páginas)
- Validar parâmetros de query e retornar erros apropriados
- Exemplo de endpoint: `GET /users?age_min=18&age_max=65&page=1&limit=10`

