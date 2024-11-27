// script.js - Código atualizado para implementar o botão de acessibilidade com contraste preto e amarelo aplicado em todo o site

// Variáveis Globais
let dadosSelecionados = []; // Array para armazenar os dados selecionados
const listaDadosSelecionados = document.getElementById("listaDadosSelecionados");
const resultadoTotal = document.getElementById("resultadoTotal");
const detalhesRolagem = document.getElementById("detalhesRolagem");
const historicoLista = document.getElementById("historicoLista");

// Modificadores
let modificador = 0;
const inputModificador = document.getElementById("inputModificador");

// Função para atualizar o valor do modificador
function atualizarModificador(valor) {
    modificador = Math.max(-10, Math.min(10, modificador + valor));
    inputModificador.value = modificador;
    console.log("Modificador atualizado:", modificador);
}

// Atualiza o valor do modificador ao digitar diretamente
inputModificador.addEventListener('input', () => {
    modificador = parseInt(inputModificador.value) || 0;
    console.log("Valor do modificador digitado:", modificador);
});

// Funções para aumentar e diminuir o modificador
document.getElementById("aumentarMod").addEventListener('click', () => {
    atualizarModificador(1);
});

document.getElementById("diminuirMod").addEventListener('click', () => {
    atualizarModificador(-1);
});

// Delegar evento de clique ao container dos dados
const diceContainer = document.querySelector('.dice-container');
if (diceContainer) {
    diceContainer.addEventListener('click', (e) => {
        if (e.target && e.target.classList.contains('dado')) {
            const tipoDado = parseInt(e.target.getAttribute('data-dado'));
            
            if (isNaN(tipoDado)) {
                console.error('Atributo data-dado não encontrado ou inválido');
                return;
            }

            console.log("Tipo de dado selecionado:", tipoDado);

            // Verifica se o dado já foi selecionado
            const dadoExistente = dadosSelecionados.find(d => d.tipo === tipoDado);
            if (dadoExistente) {
                dadoExistente.quantidade += 1; // Se já existe, aumenta a quantidade
            } else {
                dadosSelecionados.push({ tipo: tipoDado, quantidade: 1 }); // Se não existe, adiciona um novo
            }

            // Atualiza a exibição da lista de dados selecionados
            atualizarListaDadosSelecionados();
            document.getElementById('rolarDado').disabled = false;
        }
    });
} else {
    console.error("Container de dados '.dice-container' não encontrado.");
}

// Função para atualizar a lista de dados selecionados
function atualizarListaDadosSelecionados() {
    console.log("Atualizando lista de dados selecionados:", dadosSelecionados);
    // Usando DocumentFragment para reduzir reflows e melhorar a performance
    const fragment = document.createDocumentFragment(); // Usa DocumentFragment para melhorar a performance ao manipular múltiplos elementos do DOM
    for (let i = 0; i < dadosSelecionados.length; i++) {
        const dado = dadosSelecionados[i];
        const dadoCard = document.createElement('div');
        dadoCard.classList.add('dado-card');
        dadoCard.style.padding = '5px';
        dadoCard.style.marginBottom = '5px';

        const dadoInfo = document.createElement('span');
        dadoInfo.textContent = `${dado.quantidade}D${dado.tipo}`;

        const removerDadoBtn = document.createElement('button');
        removerDadoBtn.textContent = '✖';
        removerDadoBtn.addEventListener('click', () => {
            removerUmDado(dado.tipo);
        });

        dadoCard.appendChild(dadoInfo);
        dadoCard.appendChild(removerDadoBtn);
        fragment.appendChild(dadoCard);
    }
    while (listaDadosSelecionados.firstChild) {
        listaDadosSelecionados.removeChild(listaDadosSelecionados.firstChild);
    } // Limpa a lista atual
    listaDadosSelecionados.appendChild(fragment); // Adiciona o conteúdo do fragmento
}

// Função para remover UM dado de um tipo
function removerUmDado(tipoDado) {
    console.log("Removendo um dado do tipo:", tipoDado);
    const index = dadosSelecionados.findIndex(d => d.tipo === tipoDado);
    if (index !== -1) {
        if (dadosSelecionados[index].quantidade > 1) {
            dadosSelecionados[index].quantidade -= 1; // Diminui a quantidade
        } else {
            dadosSelecionados.splice(index, 1); // Remove completamente se for o último
        }
    }
    atualizarListaDadosSelecionados(); // Atualiza a interface
    if (dadosSelecionados.length === 0) {
        document.getElementById('rolarDado').disabled = true;
    }
}

// Evento do botão de rolar dados
const debouncedRolarDados = debounce(() => {
    document.getElementById('rolarDado').disabled = true;
    rolarDados();
    const timeoutDuration = 1000;
    setTimeout(() => {
        document.getElementById('rolarDado').disabled = false;
    }, timeoutDuration);
}, 300);

document.getElementById('rolarDado').addEventListener('click', debouncedRolarDados);

// Função debounce
function debounce(func, wait) {
    let timeout;
    return function(...args) {
        clearTimeout(timeout);
        timeout = setTimeout(() => func.apply(this, args), wait);
    };
}

// Função para rolar os dados selecionados
function rolarDados() {
    console.log("Iniciando rolagem dos dados:", dadosSelecionados);
    if (dadosSelecionados.length > 0) {
        let resultadoSoma = 0;
        let detalhes = '';

        // Rola cada tipo de dado a quantidade de vezes selecionada
        dadosSelecionados.forEach(dado => {
            for (let i = 0; i < dado.quantidade; i++) {
                const resultado = rolarDado(dado.tipo);
                resultadoSoma += resultado;
                detalhes += `D${dado.tipo}: ${resultado} `;
            }
        });

        // Adiciona o modificador
        resultadoSoma += modificador;
        detalhes += `+ Modificador: ${modificador}`;

        // Exibe o resultado
        resultadoTotal.textContent = `Total: ${resultadoSoma}`;
        detalhesRolagem.textContent = detalhes;
        document.getElementById('resultado').classList.add('mostrar');

        console.log("Resultado da rolagem:", resultadoSoma, "Detalhes:", detalhes);

        // Adicionar ao histórico
        adicionarAoHistorico(detalhes, resultadoSoma);
    } else {
        alert('Por favor, selecione ao menos um dado.');
    }
}

// Função que rola o dado
function rolarDado(lados) {
    const resultado = Math.floor(Math.random() * lados) + 1;
    console.log("Resultado do dado de", lados, "lados:", resultado);
    return resultado;
}

// Adicionar ao histórico de rolagens
function adicionarAoHistorico(detalhes, resultado) {
    console.log("Adicionando ao histórico. Detalhes:", detalhes, "Resultado:", resultado);
    const historicoItem = document.createElement('div');
    historicoItem.classList.add('historico-item');
    historicoItem.style.padding = '10px';
    historicoItem.style.marginBottom = '10px';

    const timestamp = new Date().toLocaleString();
    const timestampDiv = document.createElement('div');
    timestampDiv.classList.add('timestamp');
    timestampDiv.innerHTML = `<em>${timestamp}</em>`;
    timestampDiv.style.marginBottom = "10px";
    timestampDiv.style.fontSize = "0.9rem";

    const detalhesDiv = document.createElement('div');
    detalhesDiv.classList.add('detalhes');
    detalhesDiv.innerHTML = `<strong>Detalhes:</strong> ${detalhes}`;
    detalhesDiv.style.marginBottom = "10px";

    const totalDiv = document.createElement('div');
    totalDiv.classList.add('total');
    totalDiv.innerHTML = `<strong>Total:</strong> ${resultado}`;
    totalDiv.style.fontSize = "1.2rem";
    totalDiv.style.fontWeight = "bold";

    historicoItem.appendChild(timestampDiv);
    historicoItem.appendChild(detalhesDiv);
    historicoItem.appendChild(totalDiv);
    historicoLista.prepend(historicoItem); // Adiciona ao início do histórico
}

// Limpar seleção de dados
document.getElementById('limparDados').addEventListener('click', () => {
    dadosSelecionados = []; // Limpa a seleção de dados
    atualizarListaDadosSelecionados(); // Atualiza a interface
    document.getElementById('rolarDado').disabled = true;
});

// Botões de rolagem do histórico
document.getElementById('scrollTop').addEventListener('click', () => {
    historicoLista.scrollTop = 0;
});

document.getElementById('scrollBottom').addEventListener('click', () => {
    historicoLista.scrollTop = historicoLista.scrollHeight;
});

// Código JavaScript para implementar um botão de acessibilidade que altera o contraste para preto e amarelo baseado no projeto existente

// Criação do botão de acessibilidade
const botaoAcessibilidade = document.createElement('button');
botaoAcessibilidade.id = 'botaoContraste';
botaoAcessibilidade.textContent = 'Ativar Contraste Alto';
botaoAcessibilidade.classList.add('acessibilidade-botao');
document.body.appendChild(botaoAcessibilidade);

// Função para ativar/desativar o modo de contraste alto
botaoAcessibilidade.addEventListener('click', () => {
    const body = document.body;
    const contrasteAtivo = body.classList.toggle('contraste-alto');
    botaoAcessibilidade.textContent = contrasteAtivo ? 'Desativar Contraste Alto' : 'Ativar Contraste Alto';
});

// Estilos para o modo de contraste alto e botão de acessibilidade
const estiloContrasteAlto = document.createElement('style');
estiloContrasteAlto.innerHTML = `
  .contraste-alto {
    background-color: #000 !important;
    color: #ff0 !important;
    scrollbar-width: thin !important;
    scrollbar-color: #ff0 #000 !important;
  }
  .contraste-alto * {
    background-color: #000 !important;
    color: #ff0 !important;
    border-color: #ff0 !important;
    scrollbar-width: thin !important;
    scrollbar-color: #ff0 #000 !important;
  }
  .contraste-alto .total {
    color: #ff0 !important;
  }

  .contraste-alto body {
    background: #000 !important;
    background-image: none !important;
    scrollbar-width: thin !important;
    scrollbar-color: #ff0 #000 !important;
  }

  .contraste-alto .historico-item {
    border-color: #ff0 !important;
    scrollbar-width: thin!important ;
    scrollbar-color: #ff0 #000 !important;
  }

  .contraste-alto .historicolista {
    border-color: #ff0 !important;
    scrollbar-width: thin !important; 
    scrollbar-color: #ff0 #000 !important ;
  }

  .contraste-alto button {
    border: 1px solid #ff0 !important;
  }

  .contraste-alto {
    background: #000 !important;
    background-image: none !important;
  }

  #botaoContraste {
    position: fixed;
    top: 10px;
    right: 10px;
    padding: 10px;
    background-color: #000;
    color: #ff0;
    border: 1px solid #ff0;
    border-radius: 5px;
    cursor: pointer;
    z-index: 1000;
  }
  #botaoContraste:hover {
    background-color: #ff0;
    color: #000;
  }
`;
document.head.appendChild(estiloContrasteAlto);
