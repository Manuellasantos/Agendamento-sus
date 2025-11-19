// Elementos do fluxo de agendamento
const etapas = document.querySelectorAll('.etapa');
const passosAgendamento = document.querySelectorAll('.passo-agendamento');
const listaEspecialidades = document.getElementById('lista-especialidades');
const btnProximoEspecialidade = document.getElementById('btn-proximo-especialidade');
const btnVoltarUnidade = document.getElementById('btn-voltar-unidade');
const btnProximoUnidade = document.getElementById('btn-proximo-unidade');
const btnVoltarData = document.getElementById('btn-voltar-data');
const btnProximoData = document.getElementById('btn-proximo-data');
const btnVoltarConfirmacao = document.getElementById('btn-voltar-confirmacao');
const btnConfirmarAgendamento = document.getElementById('btn-confirmar-agendamento');
const btnNovoAgendamento = document.getElementById('btn-novo-agendamento');
const mensagemSucesso = document.getElementById('mensagem-sucesso');

// Dados do agendamento
let dadosAgendamento = {
    especialidade: null,
    unidade: null,
    data: null,
    horario: null
};

// Inicialização do agendamento
document.addEventListener('DOMContentLoaded', function() {
    if (listaEspecialidades) {
        iniciarAgendamento();
    }
});

function iniciarAgendamento() {
    // Configurar fluxo de agendamento - Etapa 1: Especialidade
    listaEspecialidades.querySelectorAll('.opcao-item').forEach(item => {
        item.addEventListener('click', function() {
            // Remover seleção anterior
            listaEspecialidades.querySelectorAll('.opcao-item').forEach(i => {
                i.classList.remove('selecionado');
            });
            
            // Selecionar atual
            this.classList.add('selecionado');
            dadosAgendamento.especialidade = this.getAttribute('data-especialidade');
            
            // Ativar botão próximo
            btnProximoEspecialidade.disabled = false;
        });
        
        // Permitir seleção por teclado
        item.addEventListener('keydown', function(e) {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                this.click();
            }
        });
    });
    
    btnProximoEspecialidade.addEventListener('click', function() {
        // Atualizar etapas
        etapas[0].classList.remove('ativa');
        etapas[0].classList.add('concluida');
        etapas[1].classList.add('ativa');
        
        // Mostrar próximo passo
        passosAgendamento[0].style.display = 'none';
        passosAgendamento[1].style.display = 'block';
    });
    
    // Configurar fluxo de agendamento - Etapa 2: Unidade
    const listaUnidades = document.getElementById('lista-unidades');
    const buscaUnidade = document.getElementById('busca-unidade');
    
    if (listaUnidades) {
        listaUnidades.querySelectorAll('.opcao-item').forEach(item => {
            item.addEventListener('click', function() {
                // Remover seleção anterior
                listaUnidades.querySelectorAll('.opcao-item').forEach(i => {
                    i.classList.remove('selecionado');
                });
                
                // Selecionar atual
                this.classList.add('selecionado');
                dadosAgendamento.unidade = this.getAttribute('data-unidade');
                
                // Ativar botão próximo
                btnProximoUnidade.disabled = false;
            });
            
            // Permitir seleção por teclado
            item.addEventListener('keydown', function(e) {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    this.click();
                }
            });
        });
    }
    
    // Filtro de busca para unidades
    if (buscaUnidade) {
        buscaUnidade.addEventListener('input', function() {
            const termo = this.value.toLowerCase();
            
            listaUnidades.querySelectorAll('.opcao-item').forEach(item => {
                const texto = item.textContent.toLowerCase();
                if (texto.includes(termo)) {
                    item.style.display = 'block';
                } else {
                    item.style.display = 'none';
                }
            });
        });
    }
    
    btnVoltarUnidade.addEventListener('click', function() {
        // Atualizar etapas
        etapas[1].classList.remove('ativa');
        etapas[0].classList.remove('concluida');
        etapas[0].classList.add('ativa');
        
        // Mostrar passo anterior
        passosAgendamento[1].style.display = 'none';
        passosAgendamento[0].style.display = 'block';
    });
    
    btnProximoUnidade.addEventListener('click', function() {
        // Atualizar etapas
        etapas[1].classList.remove('ativa');
        etapas[1].classList.add('concluida');
        etapas[2].classList.add('ativa');
        
        // Mostrar próximo passo
        passosAgendamento[1].style.display = 'none';
        passosAgendamento[2].style.display = 'block';
        
        // Gerar calendário
        gerarCalendario();
    });
    
    // Configurar fluxo de agendamento - Etapa 3: Data e Horário
    btnVoltarData.addEventListener('click', function() {
        // Atualizar etapas
        etapas[2].classList.remove('ativa');
        etapas[1].classList.remove('concluida');
        etapas[1].classList.add('ativa');
        
        // Mostrar passo anterior
        passosAgendamento[2].style.display = 'none';
        passosAgendamento[1].style.display = 'block';
    });
    
    btnProximoData.addEventListener('click', function() {
        // Atualizar etapas
        etapas[2].classList.remove('ativa');
        etapas[2].classList.add('concluida');
        etapas[3].classList.add('ativa');
        
        // Mostrar próximo passo
        passosAgendamento[2].style.display = 'none';
        passosAgendamento[3].style.display = 'block';
        
        // Preencher resumo
        document.getElementById('resumo-especialidade').textContent = 
            document.querySelector(`[data-especialidade="${dadosAgendamento.especialidade}"]`).textContent;
        
        document.getElementById('resumo-unidade').textContent = 
            document.querySelector(`[data-unidade="${dadosAgendamento.unidade}"]`).textContent;
        
        document.getElementById('resumo-data').textContent = dadosAgendamento.data + '/06/2023';
        document.getElementById('resumo-horario').textContent = dadosAgendamento.horario;
    });
    
    // Configurar fluxo de agendamento - Etapa 4: Confirmação
    btnVoltarConfirmacao.addEventListener('click', function() {
        // Atualizar etapas
        etapas[3].classList.remove('ativa');
        etapas[2].classList.remove('concluida');
        etapas[2].classList.add('ativa');
        
        // Mostrar passo anterior
        passosAgendamento[3].style.display = 'none';
        passosAgendamento[2].style.display = 'block';
    });
    
    btnConfirmarAgendamento.addEventListener('click', function() {
        // Aqui normalmente enviaríamos os dados para o servidor
        
        // Mostrar mensagem de sucesso
        passosAgendamento[3].style.display = 'none';
        mensagemSucesso.style.display = 'block';
        
        // Adicionar consulta à lista (salvar no localStorage)
        adicionarConsultaAgendada();
    });
    
    btnNovoAgendamento.addEventListener('click', function() {
        // Reiniciar o processo de agendamento
        reiniciarAgendamento();
    });
}

// Função para gerar calendário
function gerarCalendario() {
    const corpoCalendario = document.getElementById('corpo-calendario');
    if (!corpoCalendario) return;
    
    corpoCalendario.innerHTML = '';
    
    // Exemplo: gerar um calendário para o mês atual
    const dataAtual = new Date();
    const mesAtual = dataAtual.getMonth();
    const anoAtual = dataAtual.getFullYear();
    
    // Primeiro dia do mês
    const primeiroDia = new Date(anoAtual, mesAtual, 1);
    // Último dia do mês
    const ultimoDia = new Date(anoAtual, mesAtual + 1, 0);
    
    // Dias da semana do primeiro dia (0 = Domingo, 1 = Segunda, etc.)
    const diaSemanaPrimeiro = primeiroDia.getDay();
    
    // Número de dias no mês
    const numDias = ultimoDia.getDate();
    
    let data = 1;
    let html = '';
    
    for (let i = 0; i < 6; i++) {
        html += '<tr>';
        
        for (let j = 0; j < 7; j++) {
            if (i === 0 && j < diaSemanaPrimeiro) {
                html += '<td class="indisponivel"></td>';
            } else if (data > numDias) {
                html += '<td class="indisponivel"></td>';
            } else {
                // Marcar alguns dias como disponíveis (exemplo)
                const disponivel = data % 3 !== 0; // Apenas para exemplo
                
                if (disponivel) {
                    html += `<td class="disponivel" tabindex="0" data-dia="${data}">${data}</td>`;
                } else {
                    html += `<td class="indisponivel">${data}</td>`;
                }
                
                data++;
            }
        }
        
        html += '</tr>';
        
        if (data > numDias) {
            break;
        }
    }
    
    corpoCalendario.innerHTML = html;
    
    // Adicionar eventos aos dias disponíveis
    corpoCalendario.querySelectorAll('.disponivel').forEach(dia => {
        dia.addEventListener('click', selecionarData);
        dia.addEventListener('keydown', function(e) {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                selecionarData.call(this);
            }
        });
    });
}

function selecionarData() {
    // Remover seleção anterior
    document.querySelectorAll('.disponivel').forEach(dia => {
        dia.classList.remove('selecionado');
    });
    
    // Selecionar data atual
    this.classList.add('selecionado');
    dadosAgendamento.data = this.getAttribute('data-dia');
    
    // Mostrar horários disponíveis
    document.getElementById('selecao-horarios').style.display = 'block';
    
    // Gerar horários disponíveis
    gerarHorarios();
}

function gerarHorarios() {
    const listaHorarios = document.getElementById('lista-horarios');
    if (!listaHorarios) return;
    
    listaHorarios.innerHTML = '';
    
    // Horários de exemplo
    const horarios = ['08:00', '09:00', '10:00', '11:00', '14:00', '15:00', '16:00', '17:00'];
    
    horarios.forEach(horario => {
        const div = document.createElement('div');
        div.className = 'horario-item';
        div.textContent = horario;
        div.setAttribute('data-horario', horario);
        div.setAttribute('tabindex', '0');
        
        div.addEventListener('click', selecionarHorario);
        div.addEventListener('keydown', function(e) {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                selecionarHorario.call(this);
            }
        });
        
        listaHorarios.appendChild(div);
    });
}

function selecionarHorario() {
    // Remover seleção anterior
    document.querySelectorAll('.horario-item').forEach(horario => {
        horario.classList.remove('selecionado');
    });
    
    // Selecionar horário atual
    this.classList.add('selecionado');
    dadosAgendamento.horario = this.getAttribute('data-horario');
    
    // Ativar botão próximo
    btnProximoData.disabled = false;
}

// Função para reiniciar o processo de agendamento
function reiniciarAgendamento() {
    // Mostrar primeiro passo
    passosAgendamento.forEach(passo => {
        passo.style.display = 'none';
    });
    passosAgendamento[0].style.display = 'block';
    
    // Reiniciar etapas
    etapas.forEach(etapa => {
        etapa.classList.remove('ativa', 'concluida');
    });
    etapas[0].classList.add('ativa');
    
    // Limpar dados
    dadosAgendamento = {
        especialidade: null,
        unidade: null,
        data: null,
        horario: null
    };
    
    // Limpar seleções
    document.querySelectorAll('.opcao-item.selecionado, .disponivel.selecionado, .horario-item.selecionado').forEach(item => {
        item.classList.remove('selecionado');
    });
    
    // Desativar botões
    btnProximoEspecialidade.disabled = true;
    btnProximoUnidade.disabled = true;
    btnProximoData.disabled = true;
    
    // Ocultar mensagem de sucesso
    mensagemSucesso.style.display = 'none';
}

// Função para adicionar consulta à lista (salvar no localStorage)
function adicionarConsultaAgendada() {
    // Salvar consulta no localStorage
    const consultas = JSON.parse(localStorage.getItem('consultasSUS') || '[]');
    
    const novaConsulta = {
        id: Date.now(),
        especialidade: document.querySelector(`[data-especialidade="${dadosAgendamento.especialidade}"]`).textContent,
        unidade: document.querySelector(`[data-unidade="${dadosAgendamento.unidade}"]`).textContent,
        data: dadosAgendamento.data + '/06/2023',
        horario: dadosAgendamento.horario,
        timestamp: new Date().toISOString()
    };
    
    consultas.push(novaConsulta);
    localStorage.setItem('consultasSUS', JSON.stringify(consultas));
    
    // Atualizar dashboard se estiver na página inicial
    const mensagemProximaConsulta = document.getElementById('mensagem-proxima-consulta');
    if (mensagemProximaConsulta) {
        const proximaConsulta = consultas.sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp))[0];
        if (proximaConsulta) {
            mensagemProximaConsulta.innerHTML = `
                <strong>${proximaConsulta.especialidade}</strong><br>
                Data: ${proximaConsulta.data}<br>
                Horário: ${proximaConsulta.horario}<br>
                Local: ${proximaConsulta.unidade}
            `;
        }
    }
}
// Estado da aplicação
let estadoFonte = 0; // 0: normal, 1: ampliada, 2: extra-ampliada

// Elementos da interface
const btnAcessibilidade = document.getElementById('btn-acessibilidade');

// Configurar botão de acessibilidade
if (btnAcessibilidade) {
    btnAcessibilidade.addEventListener('click', function() {
        estadoFonte = (estadoFonte + 1) % 3;
        
        // Remover todas as classes de fonte primeiro
        document.body.classList.remove('font-ampliada', 'font-extra-ampliada');
        
        // Aplicar a classe correspondente ao estado atual
        if (estadoFonte === 1) {
            document.body.classList.add('font-ampliada');
            this.setAttribute('aria-label', 'Tamanho da fonte ampliado. Clique para aumentar mais');
            console.log('Fonte ampliada ativada');
        } else if (estadoFonte === 2) {
            document.body.classList.add('font-extra-ampliada');
            this.setAttribute('aria-label', 'Tamanho da fonte extra ampliado. Clique para voltar ao normal');
            console.log('Fonte extra ampliada ativada');
        } else {
            this.setAttribute('aria-label', 'Aumentar tamanho da fonte');
            console.log('Fonte normal ativada');
        }
        
        // Salvar preferência no localStorage
        localStorage.setItem('preferenciaFonte', estadoFonte.toString());
    });
}

// Restaurar preferência de fonte ao carregar a página
document.addEventListener('DOMContentLoaded', function() {
    // Restaurar preferência de fonte
    const fonteSalva = localStorage.getItem('preferenciaFonte');
    if (fonteSalva !== null) {
        estadoFonte = parseInt(fonteSalva);
        
        document.body.classList.remove('font-ampliada', 'font-extra-ampliada');
        
        if (estadoFonte === 1) {
            document.body.classList.add('font-ampliada');
            if (btnAcessibilidade) {
                btnAcessibilidade.setAttribute('aria-label', 'Tamanho da fonte ampliado. Clique para aumentar mais');
            }
        } else if (estadoFonte === 2) {
            document.body.classList.add('font-extra-ampliada');
            if (btnAcessibilidade) {
                btnAcessibilidade.setAttribute('aria-label', 'Tamanho da fonte extra ampliado. Clique para voltar ao normal');
            }
        }
    }
    
    // Configurar foco para elementos interativos
    document.querySelectorAll('button, a, input, select, [tabindex]').forEach(elemento => {
        elemento.addEventListener('focus', function() {
            this.style.outline = '3px solid #FFCC00';
        });
        
        elemento.addEventListener('blur', function() {
            this.style.outline = '';
        });
    });
    
    // Debug: verificar se o botão está funcionando
    if (btnAcessibilidade) {
        console.log('Botão de acessibilidade encontrado e configurado');
    } else {
        console.log('Botão de acessibilidade não encontrado');
    }
});

// Funções para a lista de consultas (compartilhadas)
window.cancelarConsulta = function(botao, idConsulta) {
    if (confirm('Tem certeza que deseja cancelar esta consulta?')) {
        const consultaDiv = botao.closest('.card');
        
        // Se um ID foi fornecido, remover do localStorage
        if (idConsulta) {
            const consultas = JSON.parse(localStorage.getItem('consultasSUS') || '[]');
            const consultasAtualizadas = consultas.filter(consulta => consulta.id !== idConsulta);
            localStorage.setItem('consultasSUS', JSON.stringify(consultasAtualizadas));
        }
        
        consultaDiv.remove();
        
        const listaConsultas = document.getElementById('lista-consultas');
        if (listaConsultas && listaConsultas.children.length === 0) {
            document.getElementById('mensagem-sem-consultas').style.display = 'block';
            listaConsultas.style.display = 'none';
        }
        
        // Atualizar dashboard se estiver na página inicial
        const mensagemProximaConsulta = document.getElementById('mensagem-proxima-consulta');
        if (mensagemProximaConsulta) {
            const consultas = JSON.parse(localStorage.getItem('consultasSUS') || '[]');
            if (consultas.length === 0) {
                mensagemProximaConsulta.textContent = 'Você não tem consultas agendadas no momento.';
            } else {
                const proximaConsulta = consultas.sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp))[0];
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

window.verDetalhes = function(botao) {
    const consultaDiv = botao.closest('.card');
    const especialidade = consultaDiv.querySelector('h3').textContent;
    const data = consultaDiv.querySelectorAll('p')[0].textContent;
    const horario = consultaDiv.querySelectorAll('p')[1].textContent;
    const local = consultaDiv.querySelectorAll('p')[2].textContent;
    
    alert('Detalhes da consulta:\n\n' + 
          especialidade + '\n' +
          data + '\n' +
          horario + '\n' +
          local);
};