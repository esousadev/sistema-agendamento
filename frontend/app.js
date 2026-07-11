const API_URL = 'http://localhost:3001/api'; // Porta 3001 conforme configuramos no backend

// 1. Busca os serviços do banco e coloca na caixa de seleção (select)
async function carregarServicos() {
    try {
        const response = await fetch(`${API_URL}/servicos`);
        const servicos = await response.json();
        const select = document.getElementById('select-servico');
        
        select.innerHTML = '<option value="">Selecione um serviço...</option>';
        
        servicos.forEach(servico => {
            const option = document.createElement('option');
            option.value = servico.id;
            option.textContent = `${servico.nome} - R$ ${servico.preco.toFixed(2)}`;
            select.appendChild(option);
        });
    } catch (erro) {
        console.error("Erro ao carregar serviços:", erro);
    }
}

// 2. Envia os dados do formulário para o backend processar o agendamento
async function salvarAgendamento(event) {
    event.preventDefault(); // Impede a página de recarregar

    const nomeCliente = document.getElementById('nome').value;
    const telefoneCliente = document.getElementById('telefone').value;
    const servicoId = document.getElementById('select-servico').value;
    const data = document.getElementById('data').value;
    const horario = document.getElementById('horario').value;

    const dadosAgendamento = { nomeCliente, telefoneCliente, servicoId, data, horario };

    try {
        const response = await fetch(`${API_URL}/agendamentos`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(dadosAgendamento)
        });

        const resultado = await response.json();

        if (response.ok) {
            alert(`🎉 ${resultado.mensagem}`);
            document.getElementById('form-agendamento').reset(); // Limpa o formulário
        } else {
            // Exibe a mensagem caso o horário já esteja ocupado no banco de dados!
            alert(`⚠️ Atenção: ${resultado.erro}`);
        }
    } catch (erro) {
        alert("Não foi possível conectar ao servidor de agendamentos.");
    }
}

// Executa automaticamente ao abrir a página
carregarServicos();
