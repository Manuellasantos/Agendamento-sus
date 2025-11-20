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
// Inicialização da página Minha Agenda
document.addEventListener('DOMContentLoaded', function() {
    carregarConsultas();
});

// Função para carregar consultas do localStorage
function carregarConsultas() {
    const listaConsultas = document.getElementById('lista-consultas');
    const mensagemSemConsultas = document.getElementById('mensagem-sem-consultas');
    const statusConsultas = document.getElementById('status-consultas');
    
    if (!listaConsultas || !mensagemSemConsultas || !statusConsultas) return;
    
    const consultas = JSON.parse(localStorage.getItem('agendamentosSUS') || '[]');
    
    if (consultas.length === 0) {
        mensagemSemConsultas.style.display = 'block';
        listaConsultas.style.display = 'none';
        statusConsultas.setAttribute('aria-label', 'Nenhuma consulta agendada');
        return;
    }
    
    // Ordenar consultas por data (mais próxima primeiro)
    consultas.sort((a, b) => {
        const dataA = new Date(a.data.ano, a.data.mes, a.data.dia);
        const dataB = new Date(b.data.ano, b.data.mes, b.data.dia);
        return dataA - dataB;
    });
    
    // Limpar lista atual
    listaConsultas.innerHTML = '';
    
    // Adicionar cada consulta à lista
    consultas.forEach((consulta, index) => {
        const consultaItem = document.createElement('div');
        consultaItem.className = 'consulta-item';
        consultaItem.setAttribute('role', 'listitem');
        consultaItem.setAttribute('aria-label', `Consulta ${index + 1} de ${consultas.length}`);
        consultaItem.setAttribute('tabindex', '0');
        
        const dataFormatada = formatarDataParaExibicao(consulta.data);
        const dataObj = new Date(consulta.data.ano, consulta.data.mes, consulta.data.dia);
        const hoje = new Date();
        const status = dataObj >= hoje ? 'Agendada' : 'Realizada';
        
        consultaItem.innerHTML = `
            <div class="consulta-header">
                <h3 class="consulta-especialidade" aria-label="Especialidade: ${consulta.especialidade}">
                    ${consulta.especialidade}
                </h3>
                <span class="consulta-status" aria-label="Status: ${status}">
                    ${status}
                </span>
            </div>
            
            <div class="consulta-detalhes">
                <div class="detalhe-item" aria-label="Data: ${dataFormatada}">
                    <i class="fas fa-calendar-alt" aria-hidden="true"></i>
                    <span><strong>Data:</strong> ${dataFormatada}</span>
                </div>
                <div class="detalhe-item" aria-label="Horário: ${consulta.horario}">
                    <i class="fas fa-clock" aria-hidden="true"></i>
                    <span><strong>Horário:</strong> ${consulta.horario}</span>
                </div>
                <div class="detalhe-item" aria-label="Local: ${consulta.unidade}">
                    <i class="fas fa-map-marker-alt" aria-hidden="true"></i>
                    <span><strong>Local:</strong> ${consulta.unidade}</span>
                </div>
                <div class="detalhe-item" aria-label="Agendado em: ${new Date(consulta.dataAgendamento).toLocaleDateString('pt-BR')}">
                    <i class="fas fa-calendar-check" aria-hidden="true"></i>
                    <span><strong>Agendado em:</strong> ${new Date(consulta.dataAgendamento).toLocaleDateString('pt-BR')}</span>
                </div>
            </div>
            
            <div class="consulta-acoes">
                <button class="btn btn-secundario" onclick="cancelarConsulta(${consulta.id})" 
                        aria-label="Cancelar consulta de ${consulta.especialidade} no dia ${dataFormatada} às ${consulta.horario}">
                    <i class="fas fa-times" aria-hidden="true"></i> Cancelar
                </button>
                <button class="btn" onclick="verDetalhes(${consulta.id})" 
                        aria-label="Ver detalhes da consulta de ${consulta.especialidade}">
                    <i class="fas fa-info-circle" aria-hidden="true"></i> Ver Detalhes
                </button>
            </div>
            <span class="sr-only">Pressione Enter ou Espaço para interagir com esta consulta</span>
        `;
        
        // Adicionar eventos de teclado
        consultaItem.addEventListener('keydown', function(e) {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                this.click();
            }
        });
        
        listaConsultas.appendChild(consultaItem);
    });
    
    mensagemSemConsultas.style.display = 'none';
    listaConsultas.style.display = 'block';
    statusConsultas.setAttribute('aria-label', `${consultas.length} consulta(s) agendada(s)`);
    
    // Anunciar para leitores de tela
    anunciarParaLeitorDeTela(`${consultas.length} consulta(s) carregada(s) na agenda`);
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
    const consultas = JSON.parse(localStorage.getItem('agendamentosSUS') || '[]');
    const consulta = consultas.find(c => c.id === idConsulta);
    
    if (!consulta) return;
    
    const dataFormatada = formatarDataParaExibicao(consulta.data);
    const mensagem = `Tem certeza que deseja cancelar a consulta de ${consulta.especialidade} no dia ${dataFormatada} às ${consulta.horario}?`;
    
    if (confirm(mensagem)) {
        // Remover do localStorage
        const consultasAtualizadas = consultas.filter(consulta => consulta.id !== idConsulta);
        localStorage.setItem('agendamentosSUS', JSON.stringify(consultasAtualizadas));
        
        // Recarregar a lista
        carregarConsultas();
        
        // Anunciar para leitores de tela
        anunciarParaLeitorDeTela('Consulta cancelada com sucesso');
    }
}

// Função para ver detalhes da consulta
function verDetalhes(idConsulta) {
    const consultas = JSON.parse(localStorage.getItem('agendamentosSUS') || '[]');
    const consulta = consultas.find(c => c.id === idConsulta);
    
    if (consulta) {
        const dataFormatada = formatarDataParaExibicao(consulta.data);
        const dataObj = new Date(consulta.data.ano, consulta.data.mes, consulta.data.dia);
        const hoje = new Date();
        const status = dataObj >= hoje ? 'Agendada' : 'Realizada';
        
        const detalhes = `
            Detalhes da Consulta:

            Especialidade: ${consulta.especialidade}
            Status: ${status}
            Data: ${dataFormatada}
            Horário: ${consulta.horario}
            Local: ${consulta.unidade}
            Endereço: Unidade de Saúde da Família
            Agendado em: ${new Date(consulta.dataAgendamento).toLocaleDateString('pt-BR')}
            
            Documentos necessários:
            • Cartão Nacional de Saúde
            • Documento de identidade com foto
            • Comprovante de residência
        `;
        
        alert(detalhes);
    }
}

// Função para anunciar mudanças para leitores de tela
function anunciarParaLeitorDeTela(mensagem) {
    const announcer = document.getElementById('announcer') || criarAnunciador();
    announcer.textContent = mensagem;
    
    setTimeout(() => {
        announcer.textContent = '';
    }, 3000);
}

function criarAnunciador() {
    const announcer = document.createElement('div');
    announcer.id = 'announcer';
    announcer.style.cssText = `
        position: absolute;
        left: -10000px;
        width: 1px;
        height: 1px;
        overflow: hidden;
    `;
    announcer.setAttribute('aria-live', 'polite');
    announcer.setAttribute('aria-atomic', 'true');
    document.body.appendChild(announcer);
    return announcer;
}