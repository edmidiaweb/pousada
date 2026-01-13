// --- CONFIGURAÇÕES GERAIS ---
const CONFIG = {
    WHATSAPP: "5511999999999", // Substitua pelo seu número (apenas números)
    NOME_POUSADA: "Pousada Encanto"
};

const fotos = [
    { url: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=600', text: 'Nossa Fachada' },
    { url: 'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=600', text: 'Suíte Luxo' },
    { url: 'https://images.unsplash.com/photo-1544148103-0773bf10d330?w=600', text: 'Café da Manhã Colonial' },
    { url: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=600', text: 'Almoço Especial' }
];

// --- ESTADOS DO SISTEMA ---
let currentSlide = 0;
let etapa = 0;
let dadosReserva = { nome: "", tel: "", noites: "" };

// --- FUNÇÃO DE VALIDAÇÃO DE CPF ---
function validarCPF(cpf) {
    cpf = cpf.replace(/[^\d]+/g, ''); 
    if (cpf.length !== 11 || !!cpf.match(/(\d)\1{10}/)) return false;
    let soma = 0, resto;
    for (let i = 1; i <= 9; i++) soma += parseInt(cpf.substring(i-1, i)) * (11 - i);
    resto = (soma * 10) % 11;
    if ((resto === 10) || (resto === 11)) resto = 0;
    if (resto !== parseInt(cpf.substring(9, 10))) return false;
    soma = 0;
    for (let i = 1; i <= 10; i++) soma += parseInt(cpf.substring(i-1, i)) * (12 - i);
    resto = (soma * 10) % 11;
    if ((resto === 10) || (resto === 11)) resto = 0;
    if (resto !== parseInt(cpf.substring(10, 11))) return false;
    return true;
}

// --- NAVEGAÇÃO E INTERFACE ---
function mostrarPagina(id) {
    vibrar();
    document.querySelectorAll('.overlay-page').forEach(page => page.classList.add('hidden'));
    const target = document.getElementById(id);
    if (target) {
        target.classList.remove('hidden');
        if (id === 'galeria-page') initCarousel();
    }
}

function voltarHome() {
    vibrar();
    document.querySelectorAll('.overlay-page').forEach(page => page.classList.add('hidden'));
}

function fecharAoClicarFora(event) {
    if (event.target.classList.contains('overlay-page')) voltarHome();
}

function vibrar() {
    if (navigator.vibrate) navigator.vibrate(15);
}

// --- LÓGICA DA GALERIA ---
function initCarousel() {
    const container = document.getElementById('carousel-slides');
    if (container.innerHTML === "") {
        container.innerHTML = fotos.map(f => `
            <div class="skeleton" style="width:100%; flex-shrink:0;">
                <img src="${f.url}" onload="this.style.opacity=1" style="opacity:0; width:100%; height:220px; object-fit:cover;">
            </div>
        `).join('');
    }
    updateSlide();
}

function moveSlide(n, event) {
    if (event) event.stopPropagation();
    currentSlide = (currentSlide + n + fotos.length) % fotos.length;
    updateSlide();
    vibrar();
}

function updateSlide() {
    const container = document.getElementById('carousel-slides');
    const caption = document.getElementById('caption-text');
    if (container) {
        container.style.transform = `translateX(-${currentSlide * 100}%)`;
        caption.innerText = fotos[currentSlide].text;
    }
}

// --- LÓGICA DO CHATBOT ---
function abrirReserva(event) {
    if (event) event.stopPropagation();
    document.getElementById('modal-chat').style.display = 'block';
    document.getElementById('input-area').classList.remove('hidden'); // Garante que o input volte ao abrir
    vibrar();
}

function fecharReserva() {
    document.getElementById('modal-chat').style.display = 'none';
    // Reset opcional do bot ao fechar
    etapa = 0;
    document.getElementById('option-area').classList.add('hidden');
}

function fecharReservaAoClicarFora(event) {
    if (event.target.id === 'modal-chat') fecharReserva();
}

const btnEnviar = document.getElementById('btn-enviar');
const userInput = document.getElementById('user-input');

if (btnEnviar) {
    btnEnviar.onclick = processarBot;
    userInput.onkeypress = (e) => { if (e.key === 'Enter') processarBot(); };
}

function addMsg(texto, tipo) {
    const chatBox = document.getElementById('chat-box');
    if (tipo === 'bot') {
        const typing = document.createElement('div');
        typing.className = 'msg bot typing';
        typing.innerHTML = '<i>Digitando...</i>';
        chatBox.appendChild(typing);
        chatBox.scrollTop = chatBox.scrollHeight;
        setTimeout(() => {
            typing.remove();
            renderMsg(texto, tipo, chatBox);
        }, 1200);
    } else {
        renderMsg(texto, tipo, chatBox);
    }
}

function renderMsg(texto, tipo, container) {
    const div = document.createElement('div');
    div.className = `msg ${tipo}`;
    div.innerHTML = texto;
    container.appendChild(div);
    container.scrollTop = container.scrollHeight;
    vibrar();
}

function processarBot() {
    const val = userInput.value.trim();
    if (!val) return;
    addMsg(val, 'user');
    userInput.value = "";
    setTimeout(() => {
        if (etapa === 0) {
            dadosReserva.nome = val;
            addMsg(`Muito prazer, ${val}! Qual seu <b>telefone com DDD</b>?`, 'bot');
            etapa++;
        } else if (etapa === 1) {
            dadosReserva.tel = val;
            addMsg("Entendido. Para <b>quantas noites</b> seria a reserva?", 'bot');
            etapa++;
        } else {
            dadosReserva.noites = val;
            addMsg("Excelente escolha! Deseja preencher o <b>Pré-Check-in</b> agora para ganhar tempo?", 'bot');
            
            // MELHORIA: Oculta o campo de digitação e mostra as opções
            document.getElementById('input-area').classList.add('hidden');
            const optionArea = document.getElementById('option-area');
            optionArea.classList.remove('hidden');
            optionArea.innerHTML = `
                <button class="btn-reservar-small" onclick="transicaoParaCheckin()">SIM, AGILIZAR</button>
                <button class="btn-voltar" onclick="finalizarSemCheckin()">NÃO, SÓ WHATSAPP</button>
            `;
        }
    }, 1500);
}

// --- TRANSIÇÕES E MÁSCARAS ---
function transicaoParaCheckin() {
    vibrar();
    const modal = document.getElementById('modal-chat');
    modal.style.transition = "opacity 0.3s ease";
    modal.style.opacity = "0";
    setTimeout(() => {
        modal.style.display = 'none';
        modal.style.opacity = "1";
        mostrarPagina('checkin-page');
        document.getElementById('checkin-cpf').focus();
    }, 300);
}

// Máscara de CPF
document.getElementById('checkin-cpf').addEventListener('input', function (e) {
    let v = e.target.value.replace(/\D/g, '').substring(0, 11);
    v = v.replace(/(\d{3})(\d)/, '$1.$2');
    v = v.replace(/(\d{3})(\d)/, '$1.$2');
    v = v.replace(/(\d{3})(\d{1,2})$/, '$1-$2');
    e.target.value = v;
});

function finalizarSemCheckin() {
    const msg = `Olá! Reserva para ${dadosReserva.nome}. Tel: ${dadosReserva.tel}. Noites: ${dadosReserva.noites}`;
    window.open(`https://wa.me/${CONFIG.WHATSAPP}?text=${encodeURIComponent(msg)}`, '_blank');
    fecharReserva();
}

function finalizarCheckin() {
    const inputCPF = document.getElementById('checkin-cpf');
    const cpf = inputCPF.value;
    const rg = document.getElementById('checkin-rg').value;
    const endereco = document.getElementById('checkin-endereco').value;

    if (!validarCPF(cpf)) {
        vibrar();
        inputCPF.style.borderColor = "#ff4d4d";
        alert("O CPF digitado é inválido. Por favor, verifique.");
        inputCPF.focus();
        return;
    }

    if (!rg) { alert("Por favor, preencha o RG."); return; }

    const textoCheckin = `*PRÉ-CHECKIN DIGITAL*%0A*Nome:* ${dadosReserva.nome}%0A*CPF:* ${cpf}%0A*RG:* ${rg}%0A*Endereço:* ${endereco}`;
    window.open(`https://wa.me/${CONFIG.WHATSAPP}?text=${textoCheckin}`, '_blank');
    voltarHome();
    fecharReserva();
}