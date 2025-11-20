// Inicialização da página Minha Agenda
document.addEventListener('DOMContentLoaded', function() {
    carregarConsultas();
});

// Função para carregar consultas do localStorage
function carregarConsultas() {
    const listaConsultas = document.getElementById('lista-consultas');
    const mensagemSemConsultas = document.getElementById('mensagem-sem-consultas');
    
    if (!listaConsultas || !mensagemSemConsultas) return;
    
    // CORREÇÃO: Mudar de 'consultasSUS' para 'agendamentosSUS'
    const consultas = JSON.parse(localStorage.getItem('agendamentosSUS') || '[]');
    
    if (consultas.length === 0) {
        mensagemSemConsultas.style.display = 'block';
        listaConsultas.style.display = 'none';
        return;
    }
    
    // Ordenar consultas por data (mais recente primeiro)
    consultas.sort((a, b) => new Date(b.dataAgendamento) - new Date(a.dataAgendamento));
    
    // Limpar lista atual
    listaConsultas.innerHTML = '';
    
    // Adicionar cada consulta à lista
    consultas.forEach(consulta => {
        const consultaDiv = document.createElement('div');
        consultaDiv.className = 'card';
        
        // CORREÇÃO: Formatar a data para exibição
        const dataFormatada = formatarDataParaExibicao(consulta.data);
        
        consultaDiv.innerHTML = `
            <h3>${consulta.especialidade}</h3>
            <p><strong>Data:</strong> ${dataFormatada}</p>
            <p><strong>Horário:</strong> ${consulta.horario}</p>
            <p><strong>Local:</strong> ${consulta.unidade}</p>
            <div style="margin-top: 1rem;">
                <button class="btn btn-secundario" onclick="cancelarConsulta(${consulta.id})">Cancelar</button>
                <button class="btn" onclick="verDetalhes(${consulta.id})">Ver Detalhes</button>
            </div>
        `;
        
        listaConsultas.appendChild(consultaDiv);
    });
    
    mensagemSemConsultas.style.display = 'none';
    listaConsultas.style.display = 'block';
}

// Função para formatar a data para exibição
function formatarDataParaExibicao(dataObj) {
    if (!dataObj) return 'Data não disponível';
    
    const { dia, mes, ano } = dataObj;
    const data = new Date(ano, mes, dia);
    
    return data.toLocaleDateString('pt-BR', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
}

// Função para cancelar consulta
function cancelarConsulta(idConsulta) {
    if (confirm('Tem certeza que deseja cancelar esta consulta?')) {
        // Remover do localStorage
        const consultas = JSON.parse(localStorage.getItem('agendamentosSUS') || '[]');
        const consultasAtualizadas = consultas.filter(consulta => consulta.id !== idConsulta);
        localStorage.setItem('agendamentosSUS', JSON.stringify(consultasAtualizadas));
        
        // Recarregar a lista
        carregarConsultas();
        
        // Atualizar dashboard se estiver na página inicial
        atualizarDashboard();
    }
}

// Função para ver detalhes da consulta
function verDetalhes(idConsulta) {
    const consultas = JSON.parse(localStorage.getItem('agendamentosSUS') || '[]');
    const consulta = consultas.find(c => c.id === idConsulta);
    
    if (consulta) {
        const dataFormatada = formatarDataParaExibicao(consulta.data);
        
        alert(`Detalhes da Consulta:\n\n` +
              `Especialidade: ${consulta.especialidade}\n` +
              `Data: ${dataFormatada}\n` +
              `Horário: ${consulta.horario}\n` +
              `Local: ${consulta.unidade}\n` +
              `Agendado em: ${new Date(consulta.dataAgendamento).toLocaleDateString('pt-BR')}`);
    }
}

// Função para atualizar o dashboard na página inicial
function atualizarDashboard() {
    const mensagemProximaConsulta = document.getElementById('mensagem-proxima-consulta');
    if (mensagemProximaConsulta) {
        const consultas = JSON.parse(localStorage.getItem('agendamentosSUS') || '[]');
        
        if (consultas.length === 0) {
            mensagemProximaConsulta.textContent = 'Você não tem consultas agendadas no momento.';
        } else {
            // Encontrar a próxima consulta (mais recente)
            const proximaConsulta = consultas.sort((a, b) => new Date(a.dataAgendamento) - new Date(b.dataAgendamento))[0];
            const dataFormatada = formatarDataParaExibicao(proximaConsulta.data);
            
            mensagemProximaConsulta.innerHTML = `
                <strong>${proximaConsulta.especialidade}</strong><br>
                Data: ${dataFormatada}<br>
                Horário: ${proximaConsulta.horario}<br>
                Local: ${proximaConsulta.unidade}
            `;
        }
    }
}

// Se a função cancelarConsultaOriginal existir, removemos a sobrescrita desnecessária
if (window.cancelarConsultaOriginal) {
    window.cancelarConsulta = window.cancelarConsultaOriginal;
}