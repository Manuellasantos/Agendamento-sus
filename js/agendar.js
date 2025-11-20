// Variáveis globais para armazenar seleções
let especialidadeSelecionada = null;
let unidadeSelecionada = null;
let dataSelecionada = null;
let horarioSelecionado = null;

// Inicialização quando o DOM estiver carregado
document.addEventListener('DOMContentLoaded', function() {
    inicializarAgendamento();
    
    // Esconde o calendário inicialmente
    document.getElementById('corpo-calendario').innerHTML = `
        <tr>
            <td colspan="7" style="text-align: center; padding: 2rem; color: #666;">
                Selecione um mês para ver o calendário
            </td>
        </tr>
    `;
    
    // Esconde a seleção de horários
    document.getElementById('selecao-horarios').style.display = 'none';
});

function inicializarAgendamento() {
    // Event listeners para especialidades
    const opcoesEspecialidades = document.querySelectorAll('#lista-especialidades .opcao-item');
    opcoesEspecialidades.forEach(opcao => {
        opcao.addEventListener('click', function() {
            selecionarEspecialidade(this);
        });
    });

    // Event listeners para unidades
    const opcoesUnidades = document.querySelectorAll('#lista-unidades .opcao-item');
    opcoesUnidades.forEach(opcao => {
        opcao.addEventListener('click', function() {
            selecionarUnidade(this);
        });
    });

    // Navegação entre etapas
    document.getElementById('btn-proximo-especialidade').addEventListener('click', avancarParaUnidade);
    document.getElementById('btn-voltar-unidade').addEventListener('click', voltarParaEspecialidade);
    document.getElementById('btn-proximo-unidade').addEventListener('click', avancarParaDataHorario);
    document.getElementById('btn-voltar-data').addEventListener('click', voltarParaUnidade);
    document.getElementById('btn-proximo-data').addEventListener('click', avancarParaConfirmacao);
    document.getElementById('btn-voltar-confirmacao').addEventListener('click', voltarParaDataHorario);
    document.getElementById('btn-confirmar-agendamento').addEventListener('click', confirmarAgendamento);
    document.getElementById('btn-novo-agendamento').addEventListener('click', reiniciarAgendamento);

    // Event listener para mudança de mês no calendário - AGORA CRIA O CALENDÁRIO
    document.getElementById('mes-calendario').addEventListener('change', function() {
        const mes = parseInt(this.value);
        const ano = new Date().getFullYear();
        criarCalendario(mes, ano);
    });

    // Configurar busca de unidades
    const buscaUnidade = document.getElementById('busca-unidade');
    if (buscaUnidade) {
        buscaUnidade.addEventListener('input', function() {
            filtrarUnidades(this.value.toLowerCase());
        });
    }
}

// Função para criar o calendário - SÓ É CHAMADA QUANDO SELECIONA UM MÊS
function criarCalendario(mes, ano) {
    const corpoCalendario = document.getElementById('corpo-calendario');
    
    corpoCalendario.innerHTML = '';
    
    const primeiroDia = new Date(ano, mes, 1).getDay();
    const ultimoDia = new Date(ano, mes + 1, 0).getDate();
    
    let dia = 1;
    
    for (let i = 0; i < 6; i++) {
        const linha = document.createElement('tr');
        
        for (let j = 0; j < 7; j++) {
            const celula = document.createElement('td');
            
            if (i === 0 && j < primeiroDia) {
                celula.className = 'vazia';
                celula.innerHTML = '';
            } else if (dia > ultimoDia) {
                celula.className = 'vazia';
                celula.innerHTML = '';
            } else {
                // Todos os dias disponíveis
                const disponivel = true;
                
                celula.textContent = dia;
                celula.setAttribute('data-dia', dia);
                celula.setAttribute('data-mes', mes);
                celula.setAttribute('data-ano', ano);
                
                if (disponivel) {
                    celula.className = 'data-disponivel';
                    celula.setAttribute('tabindex', '0');
                    
                    celula.addEventListener('click', function() {
                        selecionarData(this);
                    });
                    
                    celula.addEventListener('keydown', function(e) {
                        if (e.key === 'Enter' || e.key === ' ') {
                            e.preventDefault();
                            selecionarData(this);
                        }
                    });
                } else {
                    celula.className = 'data-indisponivel';
                    celula.setAttribute('tabindex', '-1');
                }
                
                dia++;
            }
            
            linha.appendChild(celula);
        }
        
        corpoCalendario.appendChild(linha);
        
        if (dia > ultimoDia) {
            break;
        }
    }
    
    // Reseta seleções quando muda de mês
    resetarSelecoesDataHorario();
    
    console.log(`Calendário de ${obterNomeMes(mes)} criado!`);
}

// Função auxiliar para obter nome do mês
function obterNomeMes(mes) {
    const meses = [
        'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
        'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
    ];
    return meses[mes];
}

// Função para selecionar especialidade
function selecionarEspecialidade(elemento) {
    document.querySelectorAll('#lista-especialidades .opcao-item').forEach(item => {
        item.classList.remove('selecionado');
    });
    
    elemento.classList.add('selecionado');
    especialidadeSelecionada = elemento.getAttribute('data-especialidade');
    document.getElementById('btn-proximo-especialidade').disabled = false;
}

// Função para selecionar unidade
function selecionarUnidade(elemento) {
    document.querySelectorAll('#lista-unidades .opcao-item').forEach(item => {
        item.classList.remove('selecionado');
    });
    
    elemento.classList.add('selecionado');
    unidadeSelecionada = elemento.getAttribute('data-unidade');
    document.getElementById('btn-proximo-unidade').disabled = false;
}

// Função para filtrar unidades na busca
function filtrarUnidades(termo) {
    const unidades = document.querySelectorAll('#lista-unidades .opcao-item');
    
    unidades.forEach(unidade => {
        const texto = unidade.textContent.toLowerCase();
        if (texto.includes(termo)) {
            unidade.style.display = 'flex';
        } else {
            unidade.style.display = 'none';
        }
    });
}

// Função para selecionar data
function selecionarData(elemento) {
    // Remove seleção anterior
    document.querySelectorAll('.data-selecionada').forEach(data => {
        data.classList.remove('data-selecionada');
    });
    
    // Adiciona seleção atual
    elemento.classList.add('data-selecionada');
    
    // Salva os dados
    const dia = elemento.getAttribute('data-dia');
    const mes = elemento.getAttribute('data-mes');
    const ano = elemento.getAttribute('data-ano');
    
    dataSelecionada = { dia, mes, ano };
    
    // Mostra horários e atualiza
    mostrarHorariosDisponiveis();
    atualizarResumoData();
    verificarCompletudeEtapa3();
}

// Função para mostrar horários disponíveis
function mostrarHorariosDisponiveis() {
    const containerHorarios = document.getElementById('selecao-horarios');
    const listaHorarios = document.getElementById('lista-horarios');
    
    listaHorarios.innerHTML = '';
    
    const horariosDisponiveis = ['08:00', '09:00', '10:00', '14:00', '15:00', '16:00'];
    
    horariosDisponiveis.forEach(horario => {
        const horarioElement = document.createElement('div');
        horarioElement.className = 'horario-disponivel';
        horarioElement.textContent = horario;
        horarioElement.setAttribute('data-horario', horario);
        horarioElement.setAttribute('tabindex', '0');
        
        horarioElement.addEventListener('click', function() {
            selecionarHorario(this, horario);
        });
        
        horarioElement.addEventListener('keydown', function(e) {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                selecionarHorario(this, horario);
            }
        });
        
        listaHorarios.appendChild(horarioElement);
    });
    
    containerHorarios.style.display = 'block';
    horarioSelecionado = null;
    document.getElementById('btn-proximo-data').disabled = true;
}

// Função para selecionar horário
function selecionarHorario(elemento, horario) {
    // Remove seleção anterior
    document.querySelectorAll('.horario-selecionado').forEach(h => {
        h.classList.remove('horario-selecionado');
        h.classList.add('horario-disponivel');
    });
    
    // Adiciona seleção atual
    elemento.classList.remove('horario-disponivel');
    elemento.classList.add('horario-selecionado');
    horarioSelecionado = horario;
    
    atualizarResumoHorario();
    verificarCompletudeEtapa3();
}

// Função para verificar se etapa 3 está completa
function verificarCompletudeEtapa3() {
    const btnProximoData = document.getElementById('btn-proximo-data');
    btnProximoData.disabled = !(dataSelecionada && horarioSelecionado);
}

// Função para atualizar resumo da data
function atualizarResumoData() {
    const resumoData = document.getElementById('resumo-data');
    if (resumoData && dataSelecionada) {
        const { dia, mes, ano } = dataSelecionada;
        const dataObj = new Date(ano, mes, dia);
        resumoData.textContent = dataObj.toLocaleDateString('pt-BR', {
            weekday: 'long', 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric'
        });
    }
}

// Função para atualizar resumo do horário
function atualizarResumoHorario() {
    const resumoHorario = document.getElementById('resumo-horario');
    if (resumoHorario && horarioSelecionado) {
        resumoHorario.textContent = horarioSelecionado;
    }
}

// Função para resetar seleções
function resetarSelecoesDataHorario() {
    dataSelecionada = null;
    horarioSelecionado = null;
    
    document.querySelectorAll('.data-selecionada').forEach(el => {
        el.classList.remove('data-selecionada');
    });
    
    document.querySelectorAll('.horario-selecionado').forEach(el => {
        el.classList.remove('horario-selecionado');
        el.classList.add('horario-disponivel');
    });
    
    const containerHorarios = document.getElementById('selecao-horarios');
    if (containerHorarios) {
        containerHorarios.style.display = 'none';
    }
    
    document.getElementById('btn-proximo-data').disabled = true;
}

// Funções de navegação entre etapas
function avancarParaUnidade() {
    document.getElementById('passo-especialidade').style.display = 'none';
    document.getElementById('passo-unidade').style.display = 'block';
    atualizarEtapaAtiva(2);
}

function voltarParaEspecialidade() {
    document.getElementById('passo-unidade').style.display = 'none';
    document.getElementById('passo-especialidade').style.display = 'block';
    atualizarEtapaAtiva(1);
}

function avancarParaDataHorario() {
    document.getElementById('passo-unidade').style.display = 'none';
    document.getElementById('passo-data-horario').style.display = 'block';
    atualizarEtapaAtiva(3);
    
    // Quando chega na etapa 3, já cria o calendário do mês atual
    const hoje = new Date();
    const mesAtual = hoje.getMonth();
    const anoAtual = hoje.getFullYear();
    
    document.getElementById('mes-calendario').value = mesAtual;
    criarCalendario(mesAtual, anoAtual);
}

function voltarParaUnidade() {
    document.getElementById('passo-data-horario').style.display = 'none';
    document.getElementById('passo-unidade').style.display = 'block';
    atualizarEtapaAtiva(2);
    resetarSelecoesDataHorario();
}

function avancarParaConfirmacao() {
    document.getElementById('resumo-especialidade').textContent = 
        document.querySelector('#lista-especialidades .opcao-item.selecionado .opcao-texto strong').textContent;
    
    document.getElementById('resumo-unidade').textContent = 
        document.querySelector('#lista-unidades .opcao-item.selecionado .opcao-texto strong').textContent;
    
    atualizarResumoData();
    atualizarResumoHorario();
    
    document.getElementById('passo-data-horario').style.display = 'none';
    document.getElementById('passo-confirmacao').style.display = 'block';
    atualizarEtapaAtiva(4);
}

function voltarParaDataHorario() {
    document.getElementById('passo-confirmacao').style.display = 'none';
    document.getElementById('passo-data-horario').style.display = 'block';
    atualizarEtapaAtiva(3);
}

function confirmarAgendamento() {
    console.log('Agendamento confirmado:', {
        especialidade: especialidadeSelecionada,
        unidade: unidadeSelecionada,
        data: dataSelecionada,
        horario: horarioSelecionado
    });
    
    salvarAgendamento();
    document.getElementById('passo-confirmacao').style.display = 'none';
    document.getElementById('mensagem-sucesso').style.display = 'block';
}

function reiniciarAgendamento() {
    especialidadeSelecionada = null;
    unidadeSelecionada = null;
    dataSelecionada = null;
    horarioSelecionado = null;
    
    document.querySelectorAll('.selecionado, .data-selecionada, .horario-selecionado').forEach(el => {
        el.classList.remove('selecionado', 'data-selecionada', 'horario-selecionado');
    });
    
    document.getElementById('btn-proximo-especialidade').disabled = true;
    document.getElementById('btn-proximo-unidade').disabled = true;
    document.getElementById('btn-proximo-data').disabled = true;
    
    document.getElementById('mensagem-sucesso').style.display = 'none';
    document.getElementById('passo-especialidade').style.display = 'block';
    atualizarEtapaAtiva(1);
    
    document.getElementById('busca-unidade').value = '';
    filtrarUnidades('');
    
    // Reseta o calendário para o estado inicial
    document.getElementById('corpo-calendario').innerHTML = `
        <tr>
            <td colspan="7" style="text-align: center; padding: 2rem; color: #666;">
                Selecione um mês para ver o calendário
            </td>
        </tr>
    `;
    document.getElementById('selecao-horarios').style.display = 'none';
}

function atualizarEtapaAtiva(etapa) {
    document.querySelectorAll('.etapa').forEach(e => {
        e.classList.remove('ativa', 'concluida');
    });
    
    for (let i = 1; i <= 4; i++) {
        const etapaElement = document.getElementById(`etapa${i}`);
        if (i < etapa) {
            etapaElement.classList.add('concluida');
        } else if (i === etapa) {
            etapaElement.classList.add('ativa');
        }
    }
}

function salvarAgendamento() {
    const agendamentos = JSON.parse(localStorage.getItem('agendamentosSUS') || '[]');
    
    const novoAgendamento = {
        id: Date.now(),
        especialidade: document.querySelector('#lista-especialidades .opcao-item.selecionado .opcao-texto strong').textContent,
        unidade: document.querySelector('#lista-unidades .opcao-item.selecionado .opcao-texto strong').textContent,
        data: dataSelecionada,
        horario: horarioSelecionado,
        dataAgendamento: new Date().toISOString()
    };
    
    agendamentos.push(novoAgendamento);
    localStorage.setItem('agendamentosSUS', JSON.stringify(agendamentos));
}