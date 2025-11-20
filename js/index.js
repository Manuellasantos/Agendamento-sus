// Carregar próxima consulta ao inicializar a página
document.addEventListener('DOMContentLoaded', function() {
    carregarProximaConsulta();
});

function carregarProximaConsulta() {
    const mensagemProximaConsulta = document.getElementById('mensagem-proxima-consulta');
    if (!mensagemProximaConsulta) return;

    const consultas = JSON.parse(localStorage.getItem('agendamentosSUS') || '[]');
    
    if (consultas.length === 0) {
        mensagemProximaConsulta.innerHTML = `
            <p>Você não tem consultas agendadas no momento.</p>
            <a href="agendar.html" class="btn" style="margin-top: 1rem;">
                <i class="fas fa-calendar-plus" aria-hidden="true"></i> Agendar Primeira Consulta
            </a>
        `;
    } else {
        // Ordenar por data mais próxima
        const proximaConsulta = consultas.sort((a, b) => {
            const dataA = new Date(a.data.ano, a.data.mes, a.data.dia);
            const dataB = new Date(b.data.ano, b.data.mes, b.data.dia);
            return dataA - dataB;
        })[0];

        const dataFormatada = formatarDataParaExibicao(proximaConsulta.data);
        
        mensagemProximaConsulta.innerHTML = `
            <div class="consulta-detalhes">
                <p><strong>${proximaConsulta.especialidade}</strong></p>
                <p><i class="fas fa-calendar-alt" aria-hidden="true"></i> Data: ${dataFormatada}</p>
                <p><i class="fas fa-clock" aria-hidden="true"></i> Horário: ${proximaConsulta.horario}</p>
                <p><i class="fas fa-map-marker-alt" aria-hidden="true"></i> Local: ${proximaConsulta.unidade}</p>
            </div>
            <div class="consulta-acoes" style="margin-top: 1rem;">
                <a href="minha-agenda.html" class="btn btn-secundario">
                    <i class="fas fa-calendar-check" aria-hidden="true"></i> Ver Todas
                </a>
            </div>
        `;
    }
}

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