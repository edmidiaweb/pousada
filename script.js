const CONFIG = { WHATSAPP: "5511999999999", NOME: "Pousada Encanto" };

const fotos = [
    { url: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=600', text: 'Suíte Master Luxo' },
    { url: 'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=600', text: 'Café da Manhã Colonial' },
    { url: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=600', text: 'Nossa Piscina' }
];

let currentSlide = 0;
let etapa = 0;
let dados = {};

// NAVEGAÇÃO
function mostrarPagina(id) {
    document.querySelectorAll('.overlay-page').forEach(s => s.classList.add('hidden'));
    document.getElementById(id).classList.remove('hidden');
    if(id === 'galeria-page') initCarousel();
    vibrar();
}

function voltarHome() {
    document.querySelectorAll('.overlay-page').forEach(s => s.classList.add('hidden'));
    vibrar();
}

function fecharAoClicarFora(event) {
    if (event.target.classList.contains('overlay-page')) voltarHome();
}

// FEEDBACK TÁTIL
function vibrar() { if (navigator.vibrate) navigator.vibrate(10); }

// CARROSSEL COM SKELETON
function initCarousel() {
    const container = document.getElementById('carousel-slides');
    if(container.innerHTML === "") {
        container.innerHTML = fotos.map(f => `
            <div class="skeleton" style="width:100%; flex-shrink:0;">
                <img src="${f.url}" onload="this.style.opacity=1" style="opacity:0">
            </div>
        `).join('');
    }
    updateSlide();
}

function moveSlide(n, e) {
    if(e) e.stopPropagation();
    currentSlide = (currentSlide + n + fotos.length) % fotos.length;
    updateSlide();
    vibrar();
}

function updateSlide() {
    const c = document.getElementById('carousel-slides');
    if(c) {
        c.style.transform = `translateX(-${currentSlide * 100}%)`;
        document.getElementById('caption-text').innerText = fotos[currentSlide].text;
    }
}

// CHATBOT COM DELAY HUMANO
function abrirReserva(e) { if(e) e.stopPropagation(); document.getElementById('modal-chat').style.display = 'block'; }
function fecharReserva() { document.getElementById('modal-chat').style.display = 'none'; }

document.getElementById('btn-enviar').onclick = processarBot;
document.getElementById('user-input').onkeypress = (e) => { if(e.key === 'Enter') processarBot(); };

function addMsg(t, tipo) {
    const b = document.getElementById('chat-box');
    const d = tipo === 'bot' ? 1200 : 0;

    if(tipo === 'bot') {
        const divT = document.createElement('div');
        divT.className = 'msg bot typing';
        divT.innerHTML = 'Digitando...';
        b.appendChild(divT);
        b.scrollTop = b.scrollHeight;
        
        setTimeout(() => {
            divT.remove();
            renderMsg(t, tipo, b);
        }, d);
    } else {
        renderMsg(t, tipo, b);
    }
}

function renderMsg(t, c, b) {
    const div = document.createElement('div');
    div.className = `msg ${c}`;
    div.innerHTML = t;
    b.appendChild(div);
    b.scrollTop = b.scrollHeight;
    vibrar();
}

function processarBot() {
    const input = document.getElementById('user-input');
    const val = input.value;
    if(!val) return;
    addMsg(val, 'user');
    input.value = "";

    setTimeout(() => {
        if(etapa === 0) { dados.nome = val; addMsg(`Olá ${val}! Qual seu telefone?`, 'bot'); etapa++; }
        else if(etapa === 1) { dados.tel = val; addMsg("Quantas noites?", 'bot'); etapa++; }
        else {
            addMsg("Reserva ok! Deseja fazer o <b>Pré-Check-in</b> agora para ganhar tempo?", 'bot');
            document.getElementById('option-area').classList.remove('hidden');
            document.getElementById('option-area').innerHTML = `
                <button class="btn-reservar-small" onclick="mostrarPagina('checkin-page')">SIM, AGILIZAR</button>
                <button class="btn-voltar" onclick="finalizarSemCheckin()">NÃO, SÓ WHATSAPP</button>
            `;
        }
    }, 1500);
}

function finalizarSemCheckin() {
    const msg = `Olá! Reserva para ${dados.nome}. Tel: ${dados.tel}`;
    window.open(`https://wa.me/${CONFIG.WHATSAPP}?text=${encodeURIComponent(msg)}`);
    fecharReserva();
}

// CHECK-IN DIGITAL
function finalizarCheckin() {
    const cpf = document.getElementById('checkin-cpf').value;
    const texto = `*Pré-Check-in Digital*%0A*Nome:* ${dados.nome}%0A*CPF:* ${cpf}`;
    window.open(`https://wa.me/${CONFIG.WHATSAPP}?text=${texto}`);
    voltarHome();
    fecharReserva();
}