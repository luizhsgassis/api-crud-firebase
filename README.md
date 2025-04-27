# API CRUD de Usuários com Node.js, Express e Firebase Firestore

Este projeto implementa uma API RESTful básica para realizar operações CRUD (Criar, Ler, Atualizar, Deletar) em uma coleção de usuários armazenada no Firebase Firestore.

## Funcionalidades

*   Criação de novos usuários com nome, email e senha (senha é armazenada com hash bcrypt).
*   Listagem de todos os usuários cadastrados.
*   Busca de um usuário específico por ID.
*   Atualização dos dados (nome e email) de um usuário existente.
*   Deleção de um usuário por ID.
*   Uso de HATEOAS para links de navegação na API.
*   Validação básica de entrada e tratamento de erros.

## Pré-requisitos

*   [Node.js](https://nodejs.org/) (versão LTS recomendada)
*   [npm](https://www.npmjs.com/) (geralmente instalado com o Node.js) ou [Yarn](https://yarnpkg.com/)
*   [Git](https://git-scm.com/)
*   Uma conta Google para usar o Firebase.

## Configuração e Execução

Siga os passos abaixo para configurar e executar o projeto localmente:

1.  **Clonar o Repositório:**
    ```bash
    git clone <URL_DO_SEU_REPOSITORIO>
    cd api-crud-firebase
    ```
    *Substitua `<URL_DO_SEU_REPOSITORIO>` pela URL do seu repositório Git.*

2.  **Configurar o Firebase:**
    *   Acesse o [Console do Firebase](https://console.firebase.google.com/).
    *   Clique em "Adicionar projeto" e siga as instruções para criar um novo projeto gratuito.
    *   No menu lateral do seu novo projeto, vá para "Build" -> "Firestore Database".
    *   Clique em "Criar banco de dados".
    *   Escolha o modo de **teste** (permitir leitura e escrita por um período) ou **produção** (configure as regras de segurança adequadamente se escolher produção).
    *   Selecione a localização do servidor Firestore (recomenda-se a mais próxima de você).
    *   Aguarde a criação do banco de dados.
    *   No menu lateral, clique no ícone de engrenagem ao lado de "Visão geral do projeto" e selecione "Configurações do projeto".
    *   Vá para a aba "Contas de serviço".
    *   Clique no botão "Gerar nova chave privada". Confirme a geração.
    *   Um arquivo JSON (geralmente nomeado como `<nome-do-projeto>-firebase-adminsdk-<hash>-<hash>.json`) será baixado.
    *   **Renomeie** este arquivo para `serviceAccountKey.json`.
    *   **Mova** o arquivo `serviceAccountKey.json` para a **raiz** do diretório do projeto clonado (a pasta `api-crud-firebase`).
    *   **Importante:** O arquivo `serviceAccountKey.json` está listado no `.gitignore` para evitar que suas credenciais sejam enviadas acidentalmente para o repositório Git.

3.  **Configurar Variáveis de Ambiente:**
    *   Na raiz do projeto, crie um arquivo chamado `.env`.
    *   Adicione o seguinte conteúdo ao arquivo `.env`, ajustando os valores conforme necessário:

    ```dotenv
    # Caminho para a chave de serviço do Firebase
    # No Windows, pode ser necessário usar barras invertidas duplas ou barras normais:
    # GOOGLE_APPLICATION_CREDENTIALS=./serviceAccountKey.json
    # GOOGLE_APPLICATION_CREDENTIALS=a:\\caminho\\completo\\para\\serviceAccountKey.json
    GOOGLE_APPLICATION_CREDENTIALS=./serviceAccountKey.json

    # Porta em que o servidor Node.js será executado
    PORT=3001

    # URL base da API (usada para links HATEOAS)
    # Certifique-se de que a porta aqui corresponde à variável PORT
    API_BASE_URL=http://localhost:3001
    ```
    *   **Observação:** O valor de `GOOGLE_APPLICATION_CREDENTIALS` deve ser o caminho *relativo* ou *absoluto* para o arquivo `serviceAccountKey.json` que você baixou e renomeou. O exemplo `./serviceAccountKey.json` funciona se o arquivo estiver na raiz do projeto e você executar o `node index.js` a partir da raiz.

4.  **Instalar Dependências:**
    Navegue até o diretório raiz do projeto no seu terminal e execute:
    ```bash
    npm install
    ```
    *(Ou `yarn install` se você preferir usar o Yarn)*

5.  **Executar o Projeto:**
    Ainda no diretório raiz do projeto, execute:
    ```bash
    node index.js
    ```
    O servidor deverá iniciar e exibir mensagens no console indicando que está rodando na porta especificada (padrão 3001) e que o Firebase Admin SDK foi inicializado.

## Endpoints da API

A API estará disponível na URL base configurada (padrão: `http://localhost:3001`).

*   **`POST /usuarios`**: Cria um novo usuário.
    *   Corpo da requisição (JSON): `{ "nome": "...", "email": "...", "senha": "..." }`
*   **`GET /usuarios`**: Lista todos os usuários.
*   **`GET /usuarios/:id`**: Busca um usuário pelo seu ID.
*   **`PUT /usuarios/:id`**: Atualiza o nome e/ou email de um usuário.
    *   Corpo da requisição (JSON): `{ "nome": "...", "email": "..." }` (pelo menos um campo é necessário)
*   **`DELETE /usuarios/:id`**: Deleta um usuário pelo seu ID.

Você pode usar ferramentas como [Postman](https://www.postman.com/), [Insomnia](https://insomnia.rest/), ou `curl` para interagir com a API.