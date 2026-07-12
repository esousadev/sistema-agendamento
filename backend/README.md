# 📅 Sistema de Agendamento Online

Este é um projeto de estudo de uma aplicação web full stack para agendamento de serviços, interligando uma interface visual a um servidor backend e um banco de dados relacional.

## 📱 Visual do Formulário

Aqui está a interface onde o cliente preenche os dados e realiza o agendamento:

![Tela do Formulário](./formulario.png)

## 🚀 Funcionalidades Principais

* **Cadastro Automatizado**: Identifica se o cliente é novo ou recorrente pelo telefone.
* **Validação de Horários (Regra de Ouro)**: O sistema impede que dois clientes agendem o mesmo dia e horário.
* **Persistência de Dados**: Todas as informações são salvas de forma definitiva.

## 🛠️ Tecnologias Utilizadas

* **Frontend**: HTML5, JavaScript (Fetch API) e CSS3.
* **Backend**: Node.js com o framework Express.
* **Banco de Dados**: PostgreSQL gerenciado através do ORM Sequelize.
* **Ambiente de Desenvolvimento**: VS Code e pgAdmin 4.

## 💻 Como Rodar o Projeto Localmente

1. Certifique-se de ter o **Node.js** e o **PostgreSQL** instalados.
2. Crie um banco de dados vazio chamado `sistema_agendamento` no seu pgAdmin.
3. No terminal do VS Code, entre na pasta do backend: `cd backend`
4. Instale as dependências: `npm install`
5. Inicie o servidor: `node server.js`
6. Abra o arquivo `frontend/index.html` usando a extensão **Live Server** do VS Code.
