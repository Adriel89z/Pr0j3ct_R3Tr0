const botaoEntrar = document.getElementById('botao-entrar');
const inputNome = document.getElementById('input-nome');
const telaLogin = document.getElementById('tela-login');
const telaDesktop = document.getElementById('tela-desktop');
const nomeUsuarioSpan = document.getElementById('nome-usuario');

const popup = document.getElementById('popup');
const popupMensagem = document.getElementById('popup-mensagem');
const popupOk = document.getElementById('popup-ok');
const popupFechar = document.getElementById('popup-fechar');

const TAMANHO_MAXIMO_NOME = 20;

function mostrarAviso(mensagem) {
    popupMensagem.textContent = mensagem;
    popup.classList.remove('escondido');
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
        deslocamentoX = event.clientX - janela.offsetLeft;
        deslocamentoY = event.clientY - janela.offsetTop;

        titulo.setPointerCapture(event.pointerId);
    });

    titulo.addEventListener('pointermove', (event) => {
        if (!titulo.hasPointerCapture(event.pointerId)) return;
        let novaEsquerda = event.clientX - deslocamentoX;
        let novoTopo = event.clientY - deslocamentoY;

        const limiteMaxEsquerda = window.innerWidth - janela.offsetWidth + 50; 
        const limiteMaxTopo = window.innerHeight - janela.offsetHeight + 50;

        
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

tornarArrastavel(document.querySelector('.janela'));