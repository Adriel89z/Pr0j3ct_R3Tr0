const botaoEntrar = document.getElementById('botao-entrar');
const inputNome = document.getElementById('input-nome');
const telaLogin = document.getElementById('tela-login');
const telaDesktop = document.getElementById('tela-desktop');
const nomeUsuarioSpan = document.getElementById('nome-usuario');

const areaTrabalho = document.getElementById('area-trabalho');
const botoesJanelas = document.getElementById('botoes-janelas');
const relogio = document.getElementById('relogio');

const botoesBarra = new Map();
const janelasPorPrograma = new Map();

const popup = document.getElementById('popup');
const popupMensagem = document.getElementById('popup-mensagem');
const popupOk = document.getElementById('popup-ok');
const popupFechar = document.getElementById('popup-fechar');
const botaoIniciar = document.getElementById('botao-iniciar');
const menuIniciar = document.getElementById('menu-iniciar');

const TAMANHO_MAXIMO_NOME = 20;

const areaIcones = document.getElementById('area-icones');

const programas = [
    {
        id: 'computador',
        icone: '🖥️',
        nome: 'Meu Computador',
        conteudo: 'Aqui vai ficar o conteúdo do Meu Computador.'
    },
    {
        id: 'notas',
        icone: '📝',
        nome: 'Bloco de Notas',
        conteudo: 'Uma janela de teste, aberta pelo segundo ícone.'
    },
    {
        id: 'lixeira',
        icone: '🗑️',
        nome: 'Lixeira',
        conteudo: 'Janela onde vai o Lixo!.'
    },
    {
    id: 'sobre',
    icone: 'ℹ️',
    nome: 'Sobre',
    conteudo: 'Pr0j3ct_R3Tr0, um projeto de estudo.'
    },
    {
    id: 'musica',
    icone: '🎵',
    nome: 'Player de Música',
    montar: montarPlayer
    }
];

const sons = {
    abrirJanela: new Audio('audio/sons/abrir-janela.wav'),
    login: new Audio('audio/sons/login.wav'),
    erro: new Audio('audio/sons/erro.wav'),
    chatMensagem: new Audio('audio/sons/chat-mensagem.wav')
};

const playlist = [];

const limpezasJanelas = new Map();


let somLigado = true;
let volume = 0.6;

function tocarSom(nome) {
    if (!somLigado) return;
    const som = sons[nome];
    if (!som) return;
    som.volume = volume;
    som.currentTime = 0;
    som.play().catch(() => {});
}

let zTopo = 1;
let janelaTopo = null;

function mostrarAviso(mensagem) {
    popupMensagem.textContent = mensagem;
    popup.classList.remove('escondido');
    popup.style.left = `${(window.innerWidth - popup.offsetWidth) / 2}px`;
    popup.style.top = `${(window.innerHeight - popup.offsetHeight) / 2}px`;
    tocarSom('erro');
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
    tocarSom('login');
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
    if (janela !== janelaTopo) {
        zTopo++;
        janela.style.zIndex = zTopo;
        janelaTopo = janela;
    }
    atualizarBarra(janela);
}

function encontrarJanelaTopo() {
    let candidata = null;
    let maiorZ = -1;

    botoesBarra.forEach((botao, janela) => {
        if (!janela.classList.contains('minimizada')) {
            const z = Number(janela.style.zIndex);
            if (z > maiorZ) {
                maiorZ = z;
                candidata = janela;
            }
        }
    });

    return candidata;
}

function alternarJanela(janela) {

    if (janela.classList.contains('minimizada')) {
        janela.classList.remove('minimizada');
        trazerParaFrente(janela);
    } else if (janela === janelaTopo) {
        janela.classList.add('minimizada');
        janelaTopo = encontrarJanelaTopo();
        atualizarBarra(janelaTopo);
    } else {
        trazerParaFrente(janela);
    }
}

function configurarJanela(janela) {
    tornarArrastavel(janela);
    configurarBotaoFechar(janela);
    janela.addEventListener('pointerdown', () => trazerParaFrente(janela));
}

function fecharJanela(janela) {
    janelasPorPrograma.delete(janela.dataset.programaId);
    
    const botao = botoesBarra.get(janela);
    if (botao) botao.remove();
    botoesBarra.delete(janela);
    const limpeza = limpezasJanelas.get(janela);
    if (limpeza) limpeza();
    limpezasJanelas.delete(janela);
    janela.remove();

    if (janela === janelaTopo) {
        janelaTopo = encontrarJanelaTopo();
        atualizarBarra(janelaTopo);
    }
}

function configurarBotaoFechar(janela) {
    const botaoFechar = janela.querySelector('.janela-fechar');
    if (botaoFechar) {
        botaoFechar.addEventListener('click', () => fecharJanela(janela));
    }
}

let contadorJanelas = 0;

function desselecionarIcones() {
    areaIcones.querySelectorAll('.icone').forEach(icone => {
        icone.classList.remove('selecionado');
    });
}

function criarIcone(programa) {
    const icone = document.createElement('div');
    icone.className = 'icone';

    const imagem = document.createElement('span');
    imagem.className = 'icone-imagem';
    imagem.textContent = programa.icone;

    const nome = document.createElement('span');
    nome.className = 'icone-nome';
    nome.textContent = programa.nome;

    icone.append(imagem, nome);

    icone.addEventListener('dblclick', () => abrirJanela(programa));

    icone.addEventListener('click', (evento) => {
        evento.stopPropagation();
        desselecionarIcones();
        icone.classList.add('selecionado');
    });

    return icone;
}

function criarItemMenu(programa) {
    const item = document.createElement('div');
    item.className = 'menu-item';
    item.textContent = `${programa.icone} ${programa.nome}`;

    item.addEventListener('click', () => {
        abrirJanela(programa);
        menuIniciar.classList.add('escondido');
    });

    return item;
}

programas.forEach(programa => {
    areaIcones.appendChild(criarIcone(programa));
    menuIniciar.appendChild(criarItemMenu(programa));
});

function abrirJanela(programa) {
    const existente = janelasPorPrograma.get(programa.id);

    if (existente) {
        existente.classList.remove('minimizada');
        trazerParaFrente(existente);
        return;
    }
    
    const janela = document.createElement('div');
    janela.className = 'janela';
    janela.dataset.programaId = programa.id;

    const barra = document.createElement('div');
    barra.className = 'janela-titulo';

    const spanTitulo = document.createElement('span');
    spanTitulo.textContent = programa.nome;

    const botaoFechar = document.createElement('button');
    botaoFechar.className = 'janela-fechar';
    botaoFechar.textContent = 'X';

    barra.append(spanTitulo, botaoFechar);

    const corpo = document.createElement('div');
    corpo.className = 'janela-corpo';
    let limpeza = null;

    if (programa.montar) {
        limpeza = programa.montar(corpo);
    } else {
        corpo.textContent = programa.conteudo;
    }

    janela.append(barra, corpo);

    const deslocamento = (contadorJanelas % 8) * 30;
    janela.style.left = `${150 + deslocamento}px`;
    janela.style.top = `${100 + deslocamento}px`;
    contadorJanelas++;

    areaTrabalho.appendChild(janela);
    configurarJanela(janela);

    const botaoBarra = document.createElement('button');
    botaoBarra.className = 'botao-janela';
    botaoBarra.textContent = programa.nome;
    botaoBarra.addEventListener('click', () => alternarJanela(janela));
    botoesBarra.set(janela, botaoBarra);
    janelasPorPrograma.set(programa.id, janela);
    if (limpeza) limpezasJanelas.set(janela, limpeza);
    botoesJanelas.appendChild(botaoBarra);

    trazerParaFrente(janela);
    tocarSom('abrirJanela');
}

telaDesktop.addEventListener('click', () => {
    desselecionarIcones();
    menuIniciar.classList.add('escondido');
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

botaoIniciar.addEventListener('click', (evento) => {
    evento.stopPropagation();
    menuIniciar.classList.toggle('escondido');
});

menuIniciar.addEventListener('click', (evento) => {
    evento.stopPropagation();
});

function montarPlayer(corpo) {
    if (playlist.length === 0) {
        const aviso = document.createElement('p');
        aviso.textContent = 'Nenhuma faixa disponível ainda.';
        corpo.appendChild(aviso);
        return null;
    }
    const audio = new Audio();
    let faixaAtual = 0;

    const nomeFaixa = document.createElement('p');
    const botaoPlay = document.createElement('button');
    botaoPlay.textContent = '▶';

    function carregarFaixa(indice) {
        faixaAtual = indice;
        const faixa = playlist[indice];
        audio.src = faixa.arquivo;
        nomeFaixa.textContent = `${faixa.titulo} - ${faixa.artista}`;
    }

    botaoPlay.addEventListener('click', () => {
        if (audio.paused) {
            audio.play().catch((erro) => console.log('Erro no player:', erro));
        } else {
            audio.pause();
        }
    });

    audio.addEventListener('play', () => { botaoPlay.textContent = '⏸'; });
    audio.addEventListener('pause', () => { botaoPlay.textContent = '▶'; });

    carregarFaixa(0);
    corpo.append(nomeFaixa, botaoPlay);

    return () => {
        audio.pause();
        audio.src = '';
    };
}

