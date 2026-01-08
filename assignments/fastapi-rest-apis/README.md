# 📘 Assignment: Construindo APIs REST com FastAPI

## 🎯 Objective

Você aprenderá a construir APIs REST robustas e de alto desempenho usando o framework FastAPI. Através dessa tarefa, você compreenderá conceitos como roteamento, validação de dados, autenticação e documentação automática de APIs.

## 📝 Tasks

### 🛠️ Criar uma API de Gerenciamento de Tarefas

#### Description
Desenvolva uma API REST completa para gerenciar uma lista de tarefas. A API deve permitir que os usuários criem, leiam, atualizem e deletem tarefas. Implemente validação de dados e trate erros apropriadamente.

#### Requirements
Completed program should:

- Implementar endpoints GET, POST, PUT e DELETE para operações CRUD
- Usar Pydantic para validação de dados de entrada
- Retornar códigos HTTP apropriados (200, 201, 404, 400, etc)
- Incluir tratamento de erros com mensagens descritivas
- Armazenar dados em memória (lista/dicionário) para simplicidade


### 🛠️ Adicionar Autenticação Básica

#### Description
Estenda sua API adicionando autenticação básica usando tokens. Implemente um sistema simples onde usuários devem autenticar-se antes de acessar certos endpoints.

#### Requirements
Completed program should:

- Criar endpoint de login que retorna um token
- Usar middleware ou dependências para verificar tokens
- Proteger endpoints específicos com autenticação
- Retornar status 401 para requisições não autenticadas
- Armazenar tokens em memória com expiração


### 🛠️ Implementar Documentação Automática

#### Description
Aproveite o poder do FastAPI para gerar documentação interativa da API. Configure a documentação Swagger/OpenAPI e adicione descrições aos seus endpoints e modelos de dados.

#### Requirements
Completed program should:

- Acessar documentação interativa em `/docs`
- Adicionar descrições aos endpoints (summary e description)
- Documentar modelos Pydantic com field descriptions
- Incluir exemplos de requisição/resposta
- Adicionar tags para organizar endpoints por categoria

