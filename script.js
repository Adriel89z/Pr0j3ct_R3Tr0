const botaoEntrar = document.getElementById('botao-entrar');
const inputNome = document.getElementById('input-nome');
const telaLogin = document.getElementById('tela-login');
const telaDesktop = document.getElementById('tela-desktop');
const nomeUsuarioSpan = document.getElementById('nome-usuario');

const areaTrabalho = document.getElementById('area-trabalho');
const botoesJanelas = document.getElementById('botoes-janelas');
const relogio = document.getElementById('relogio');

const botoesBarra = new Map();

const popup = document.getElementById('popup');
const popupMensagem = document.getElementById('popup-mensagem');
const popupOk = document.getElementById('popup-ok');
const popupFechar = document.getElementById('popup-fechar');

const TAMANHO_MAXIMO_NOME = 20;

let zTopo = 1;

function mostrarAviso(mensagem) {
    popupMensagem.textContent = mensagem;
    popup.classList.remove('escondido');
    popup.style.left = `${(window.innerWidth - popup.offsetWidth) / 2}px`;
    popup.style.top = `${(window.innerHeight - popup.offsetHeight) / 2}px`;
}

function fecharAviso() {
    popup.classList.add('escondido');
}

function entrar() {
    const nomeDigitado = inputNome.value.trim();

    if (nomeDigitado === '') {
        mostrarAviso('Por favor, digite o seu nome.');
        return;
    }

    if (nomeDigitado.length > TAMANHO_MAXIMO_NOME) {
        mostrarAviso('O nome pode ter no máximo ' + TAMANHO_MAXIMO_NOME + ' caracteres.');
        return;
    }

    nomeUsuarioSpan.textContent = nomeDigitado;
    fecharAviso();
    telaLogin.classList.add('escondido');
    telaDesktop.classList.remove('escondido');
}

botaoEntrar.addEventListener('click', entrar);

inputNome.addEventListener('keydown', (event) => {
    if (event.key === 'Enter') {
        entrar();
    }
});

popupOk.addEventListener('click', fecharAviso);
popupFechar.addEventListener('click', fecharAviso);

function tornarArrastavel(janela) {
    const titulo = janela.querySelector('.janela-titulo');
    let deslocamentoX = 0;
    let deslocamentoY = 0;

    titulo.addEventListener('pointerdown', (event) => {
        if (event.target.closest('button')) return;
        deslocamentoX = event.clientX - janela.offsetLeft;
        deslocamentoY = event.clientY - janela.offsetTop;

        titulo.setPointerCapture(event.pointerId);
    });

    titulo.addEventListener('pointermove', (event) => {
        if (!titulo.hasPointerCapture(event.pointerId)) return;
        let novaEsquerda = event.clientX - deslocamentoX;
        let novoTopo = event.clientY - deslocamentoY;

        const area = janela.parentElement;
        const limiteMaxEsquerda = area.clientWidth - janela.offsetWidth + 50;
        const limiteMaxTopo = area.clientHeight - janela.offsetHeight + 50;

        
        novaEsquerda = Math.max(-50, Math.min(novaEsquerda, limiteMaxEsquerda));
        novoTopo = Math.max(0, Math.min(novoTopo, limiteMaxTopo));
        
        janela.style.left = `${novaEsquerda}px`;
        janela.style.top = `${novoTopo}px`;
    });
    
    titulo.addEventListener('pointerup', (event) => {
        if (titulo.hasPointerCapture(event.pointerId)) {
            titulo.releasePointerCapture(event.pointerId);
        }
    });
}

function atualizarBarra(janelaAtiva) {
    botoesBarra.forEach((botao, janela) => {
        botao.classList.toggle('ativo', janela === janelaAtiva);
    });
}

function trazerParaFrente(janela) {
    zTopo++;
    janela.style.zIndex = zTopo;
    atualizarBarra(janela);
}

function configurarJanela(janela) {
    tornarArrastavel(janela);
    configurarBotaoFechar(janela);
    janela.addEventListener('pointerdown', () => trazerParaFrente(janela));
}

function fecharJanela(janela) {
    const botao = botoesBarra.get(janela);
    if (botao) botao.remove();
    botoesBarra.delete(janela);
    janela.remove();
}

function configurarBotaoFechar(janela) {
    const botaoFechar = janela.querySelector('.janela-fechar');
    if (botaoFechar) {
        botaoFechar.addEventListener('click', () => fecharJanela(janela));
    }
}

let contadorJanelas = 0;

function abrirJanela(titulo, conteudo) {
    const janela = document.createElement('div');
    janela.className = 'janela';

    const barra = document.createElement('div');
    barra.className = 'janela-titulo';

    const spanTitulo = document.createElement('span');
    spanTitulo.textContent = titulo;

    const botaoFechar = document.createElement('button');
    botaoFechar.className = 'janela-fechar';
    botaoFechar.textContent = 'X';

    barra.append(spanTitulo, botaoFechar);

    const corpo = document.createElement('div');
    corpo.className = 'janela-corpo';
    corpo.textContent = conteudo;

    janela.append(barra, corpo);

    const deslocamento = (contadorJanelas % 8) * 30;
    janela.style.left = `${150 + deslocamento}px`;
    janela.style.top = `${100 + deslocamento}px`;
    contadorJanelas++;

    areaTrabalho.appendChild(janela);
    configurarJanela(janela);

    const botaoBarra = document.createElement('button');
    botaoBarra.className = 'botao-janela';
    botaoBarra.textContent = titulo;
    botaoBarra.addEventListener('click', () => trazerParaFrente(janela));
    botoesBarra.set(janela, botaoBarra);
    botoesJanelas.appendChild(botaoBarra);

    trazerParaFrente(janela);
}

const icones = document.querySelectorAll('.icone');

icones.forEach(icone => {
    icone.addEventListener('dblclick', () => {
        abrirJanela(icone.dataset.titulo, icone.dataset.conteudo);
    });

    icone.addEventListener('click', (evento) => {
        evento.stopPropagation();
        icones.forEach(item => item.classList.remove('selecionado'));
        icone.classList.add('selecionado');
    });
});

telaDesktop.addEventListener('click', () => {
    icones.forEach(icone => icone.classList.remove('selecionado'));
});

tornarArrastavel(popup);

function atualizarRelogio() {
    const agora = new Date();
    relogio.textContent = agora.toLocaleTimeString('pt-BR', {
        hour: '2-digit',
        minute: '2-digit'
    });
}

atualizarRelogio();
setInterval(atualizarRelogio, 1000);

