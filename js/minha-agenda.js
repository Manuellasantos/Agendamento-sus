// Inicialização da página Minha Agenda
document.addEventListener('DOMContentLoaded', function() {
    carregarConsultas();
});

// Função para carregar consultas do localStorage
function carregarConsultas() {
    const listaConsultas = document.getElementById('lista-consultas');
    const mensagemSemConsultas = document.getElementById('mensagem-sem-consultas');
    
    if (!listaConsultas || !mensagemSemConsultas) return;
    
    const consultas = JSON.parse(localStorage.getItem('consultasSUS') || '[]');
    
    if (consultas.length === 0) {
        mensagemSemConsultas.style.display = 'block';
        listaConsultas.style.display = 'none';
        return;
    }
    
    // Ordenar consultas por data (mais recente primeiro)
    consultas.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
    
    // Limpar lista atual
    listaConsultas.innerHTML = '';
    
    // Adicionar cada consulta à lista
    consultas.forEach(consulta => {
        const consultaDiv = document.createElement('div');
        consultaDiv.className = 'card';
        consultaDiv.innerHTML = `
            <h3>${consulta.especialidade}</h3>
            <p><strong>Data:</strong> ${consulta.data}</p>
            <p><strong>Horário:</strong> ${consulta.horario}</p>
            <p><strong>Local:</strong> ${consulta.unidade}</p>
            <div style="margin-top: 1rem;">
                <button class="btn btn-secundario" onclick="cancelarConsulta(this, ${consulta.id})">Cancelar</button>
                <button class="btn" onclick="verDetalhes(this)">Ver Detalhes</button>
            </div>
        `;
        
        listaConsultas.appendChild(consultaDiv);
    });
    
    mensagemSemConsultas.style.display = 'none';
    listaConsultas.style.display = 'block';
}

// Sobrescrever função cancelarConsulta para trabalhar com IDs
const cancelarConsultaOriginal = window.cancelarConsulta;
window.cancelarConsulta = function(botao, idConsulta) {
    if (confirm('Tem certeza que deseja cancelar esta consulta?')) {
        // Remover do localStorage
        const consultas = JSON.parse(localStorage.getItem('consultasSUS') || '[]');
        const consultasAtualizadas = consultas.filter(consulta => consulta.id !== idConsulta);
        localStorage.setItem('consultasSUS', JSON.stringify(consultasAtualizadas));
        
        // Recarregar a lista
        carregarConsultas();
        
        // Atualizar dashboard se estiver na página inicial
        const mensagemProximaConsulta = document.getElementById('mensagem-proxima-consulta');
        if (mensagemProximaConsulta) {
            if (consultasAtualizadas.length === 0) {
                mensagemProximaConsulta.textContent = 'Você não tem consultas agendadas no momento.';
            } else {
                const proximaConsulta = consultasAtualizadas.sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp))[0];
                mensagemProximaConsulta.innerHTML = `
                    <strong>${proximaConsulta.especialidade}</strong><br>
                    Data: ${proximaConsulta.data}<br>
                    Horário: ${proximaConsulta.horario}<br>
                    Local: ${proximaConsulta.unidade}
                `;
            }
        }
    }
};