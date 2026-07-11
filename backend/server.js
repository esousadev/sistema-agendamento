const express = require('express');
const cors = require('cors');
const { Sequelize, DataTypes } = require('sequelize');

const app = express();
const PORT = 3001; // Usando a porta 3001 para não dar conflito com o sistema de vendas

app.use(cors());
app.use(express.json());

// 1. Conexão com o PostgreSQL (Banco: sistema_agendamento)
const sequelize = new Sequelize('sistema_agendamento', 'postgres', 'Esousa*5432', {
    host: 'localhost',
    dialect: 'postgres',
    port: 5432,
    logging: false
});

// 2. Modelo de Serviços
const Servico = sequelize.define('Servico', {
    nome: { type: DataTypes.STRING, allowNull: false },
    preco: { type: DataTypes.FLOAT, allowNull: false }
});

// 3. Modelo de Clientes
const Cliente = sequelize.define('Cliente', {
    nome: { type: DataTypes.STRING, allowNull: false },
    telefone: { type: DataTypes.STRING, allowNull: false }
});

// 4. Modelo de Agendamentos (Tabela Principal)
const Agendamento = sequelize.define('Agendamento', {
    data: { type: DataTypes.DATEONLY, allowNull: false }, // Salva no formato YYYY-MM-DD
    horario: { type: DataTypes.STRING, allowNull: false } // Salva no formato "14:00"
});

// Criando os relacionamentos (Vínculos entre as tabelas)
Agendamento.belongsTo(Cliente, { foreignKey: 'clienteId' });
Agendamento.belongsTo(Servico, { foreignKey: 'servicoId' });

// 5. Inicializar Banco de Dados e Cadastrar dados de teste
async function inicializarBanco() {
    try {
        await sequelize.sync({ force: false }); // Cria as tabelas se não existirem
        
        // Insere serviços padrão se a tabela estiver vazia
        const totalServicos = await Servico.count();
        if (totalServicos === 0) {
            await Servico.bulkCreate([
                { nome: "Corte de Cabelo", preco: 45.00 },
                { nome: "Barba Completa", preco: 30.00 },
                { nome: "Combo Cabelo e Barba", preco: 70.00 }
            ]);
            console.log("-> Serviços iniciais cadastrados!");
        }
        console.log("-> Banco PostgreSQL conectado e tabelas prontas!");
    } catch (erro) {
        console.error("Erro ao conectar ou criar tabelas:", erro);
    }
}
inicializarBanco();

// ==================== ROTAS DA API ====================

// ROTA: Listar todos os serviços disponíveis
app.get('/api/servicos', async (req, res) => {
    const servicos = await Servico.findAll();
    res.json(servicos);
});

// ROTA: Criar um Agendamento com Validação de Horário Ocupado
app.post('/api/agendamentos', async (req, res) => {
    try {
        const { nomeCliente, telefoneCliente, servicoId, data, horario } = req.body;

        // 1. Validação de segurança básica
        if (!nomeCliente || !telefoneCliente || !servicoId || !data || !horario) {
            return res.status(400).json({ erro: "Todos os campos são obrigatórios." });
        }

        // 2. REGRA DE OURO: Verifica se já existe um agendamento na mesma data e horário
        const horarioOcupado = await Agendamento.findOne({
            where: { data, horario }
        });

        if (horarioOcupado) {
            return res.status(400).json({ erro: "Este horário já está reservado por outro cliente." });
        }

        // 3. Cadastra o cliente primeiro (ou localiza se ele já existir no banco)
        const [cliente] = await Cliente.findOrCreate({
            where: { telefone: telefoneCliente },
            defaults: { nome: nomeCliente }
        });

        // 4. Salva o agendamento vinculando o cliente e o serviço correto
        const novoAgendamento = await Agendamento.create({
            data,
            horario,
            clienteId: cliente.id,
            servicoId: parseInt(servicoId)
        });

        res.status(201).json({ 
            mensagem: "Agendamento realizado com sucesso!", 
            agendamento: novoAgendamento 
        });

    } catch (erro) {
        console.error(erro);
        res.status(500).json({ erro: "Erro interno ao processar o agendamento." });
    }
});

app.listen(PORT, () => {
    console.log(`Servidor de Agendamentos rodando em http://localhost:${PORT}`);
});
