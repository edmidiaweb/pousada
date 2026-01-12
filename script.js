const CONFIG = { WHATSAPP: "5511999999999", NOME: "Pousada Encanto" };

const fotos = [
    { url: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=600', text: 'Nossa Fachada' },
    { url: 'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=600', text: 'Suíte Luxo' },
    { url: 'https://images.unsplash.com/photo-1544148103-0773bf10d330?w=600', text: 'Café da Manhã Colonial' }
];

let currentSlide = 0;
let etapa = 0;
let dados = {};

// NAVEGAÇÃO
function mostrarPagina(id) {
    document.querySelectorAll('.overlay-page').forEach(s => s.classList.add('hidden'));
    document.getElementById(id).classList.remove('hidden');
    if(id === 'galeria-page') initCarousel();
}

function voltarHome() {
    document.querySelectorAll('.overlay-page').forEach(s => s.classList.add('hidden'));
}

function fecharAoClicarFora(event) {
    if (event.target.classList.contains('overlay-page')) {
        voltarHome();
    }
}

// CARROSSEL
function initCarousel() {
    const container = document.getElementById('carousel-slides');
    if(container.innerHTML === "") {
        container.innerHTML = fotos.map(f => `<img src="${f.url}">`).join('');
    }
    updateSlide();
}

function moveSlide(n, event) {
    if(event) event.stopPropagation();
    currentSlide = (currentSlide + n + fotos.length) % fotos.length;
    updateSlide();
}

function updateSlide() {
    const container = document.getElementById('carousel-slides');
    if(container) {
        container.style.transform = `translateX(-${currentSlide * 100}%)`;
        document.getElementById('caption-text').innerText = fotos[currentSlide].text;
    }
}

// CHATBOT
function abrirReserva(event) {
    if(event) event.stopPropagation();
    document.getElementById('modal-chat').style.display = 'block';
}

function fecharReserva() {
    document.getElementById('modal-chat').style.display = 'none';
}

function fecharReservaAoClicarFora(event) {
    if (event.target.id === 'modal-chat') fecharReserva();
}

document.getElementById('btn-enviar').onclick = processarBot;
document.getElementById('user-input').onkeypress = (e) => { if(e.key === 'Enter') processarBot(); };

function processarBot() {
    const input = document.getElementById('user-input');
    const val = input.value;
    if(!val) return;
    
    addMsg(val, 'user');
    input.value = "";
    
    setTimeout(() => {
        if(etapa === 0) {
            dados.nome = val;
            addMsg(`Muito bem, ${val}! Qual seu telefone?`, 'bot');
            etapa++;
        } else if(etapa === 1) {
            dados.tel = val;
            addMsg("Para quantas noites seria a reserva?", 'bot');
            etapa++;
        } else {
            addMsg("Perfeito! Redirecionando para o nosso WhatsApp...", 'bot');
            const msg = `Olá! Gostaria de reservar.%0A*Nome:* ${dados.nome}%0A*Tel:* ${dados.tel}%0A*Noites:* ${val}`;
            window.open(`https://wa.me/${CONFIG.WHATSAPP}?text=${msg}`);
            fecharReserva();
        }
    }, 600);
}

function addMsg(t, c) {
    const b = document.getElementById('chat-box');
    const div = document.createElement('div');
    div.className = `msg ${c}`;
    div.innerHTML = t;
    b.appendChild(div);
    b.scrollTop = b.scrollHeight;
}