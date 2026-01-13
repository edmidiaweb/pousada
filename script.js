// --- DADOS E CONFIGURAÇÕES INICIAIS ---
let CONFIG = JSON.parse(localStorage.getItem('encanto_config')) || {
    whatsapp: "5511999999999",
    escassez: "Temos apenas 2 suítes para este mês!",
    senhaAdmin: "1234" // Senha padrão inicial
};

let STATS = JSON.parse(localStorage.getItem('encanto_stats')) || {
    visitas: 0, chat: 0, checkins: 0, galeria: 0
};

const fotos = [
    { url: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=600', text: 'Nossa Fachada' },
    { url: 'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=600', text: 'Suíte Luxo' },
    { url: 'https://images.unsplash.com/photo-1544148103-0773bf10d330?w=600', text: 'Café da Manhã' }
];

let currentSlide = 0;
let etapa = 0;
let dados = { nome: "", tel: "", noites: "" };

// --- SISTEMA DE ANALYTICS ---
function track(m) { 
    STATS[m]++; 
    localStorage.setItem('encanto_stats', JSON.stringify(STATS)); 
}
window.onload = () => { track('visitas'); };

// --- NAVEGAÇÃO E INTERFACE ---
function mostrarPagina(id) {
    vibrar();
    document.querySelectorAll('.overlay-page').forEach(p => p.classList.add('hidden'));
    document.getElementById(id).classList.remove('hidden');
    if(id === 'galeria-page') { initCarousel(); track('galeria'); }
}

function voltarHome() { 
    vibrar(); 
    document.querySelectorAll('.overlay-page').forEach(p => p.classList.add('hidden')); 
}

function fecharAoClicarFora(e) { 
    if(e.target.classList.contains('overlay-page')) voltarHome(); 
}

function vibrar() { 
    if(navigator.vibrate) navigator.vibrate(15); 
}

// --- PAINEL ADMINISTRATIVO COM SENHA ---
let adminClicks = 0;
document.getElementById('secret-trigger').onclick = (e) => {
    e.stopPropagation();
    adminClicks++;
    if(adminClicks >= 5) {
        adminClicks = 0;
        const tentativa = prompt("Digite a senha de administrador:");
        if(tentativa === CONFIG.senhaAdmin) {
            atualizarAdminUI();
            mostrarPagina('admin-page');
        } else if(tentativa !== null) {
            alert("Senha incorreta!");
            vibrar();
        }
    }
};

function atualizarAdminUI() {
    document.getElementById('stats-area').innerHTML = `
        <b>Visitas:</b> ${STATS.visitas} | <b>Chats:</b> ${STATS.chat} <br>
        <b>Galeria:</b> ${STATS.galeria} | <b>Check-ins:</b> ${STATS.checkins}
    `;
    document.getElementById('admin-whatsapp').value = CONFIG.whatsapp;
    document.getElementById('admin-escassez').value = CONFIG.escassez;
    // Opcional: preencher campo de nova senha com a atual
    const passInput = document.getElementById('admin-password-input');
    if(passInput) passInput.value = CONFIG.senhaAdmin;
}

function salvarConfig() {
    CONFIG.whatsapp = document.getElementById('admin-whatsapp').value;
    CONFIG.escassez = document.getElementById('admin-escassez').value;
    
    const novaSenha = document.getElementById('admin-password-input').value;
    if(novaSenha) CONFIG.senhaAdmin = novaSenha;

    localStorage.setItem('encanto_config', JSON.stringify(CONFIG));
    alert("Configurações salvas com sucesso!");
    voltarHome();
}

function resetStats() { 
    if(confirm("Deseja zerar todas as estatísticas?")) { 
        STATS = {visitas:0, chat:0, checkins:0, galeria:0}; 
        localStorage.setItem('encanto_stats', JSON.stringify(STATS)); 
        atualizarAdminUI(); 
    } 
}

// --- LÓGICA DO CHATBOT ---
function abrirReserva(e) { 
    e.stopPropagation(); 
    document.getElementById('modal-chat').style.display = 'block'; 
    track('chat'); 
    resetBot(); 
}

function fecharReserva() { 
    document.getElementById('modal-chat').style.display = 'none'; 
}

function fecharReservaAoClicarFora(e) { 
    if(e.target.id === 'modal-chat') fecharReserva(); 
}

function resetBot() {
    etapa = 0;
    document.getElementById('chat-box').innerHTML = '<div class="msg bot">Olá! Bem-vindo à Pousada Encanto. Qual o seu <b>nome completo</b>?</div>';
    document.getElementById('input-area').classList.remove('hidden');
    document.getElementById('option-area').classList.add('hidden');
}

function processarBot() {
    const input = document.getElementById('user-input');
    const val = input.value.trim();
    if(!val) return;
    addMsg(val, 'user');
    input.value = "";

    setTimeout(() => {
        if(etapa === 0) {
            dados.nome = val;
            addMsg(`Prazer, ${val}! Qual seu <b>telefone</b> para contato? <br><button class="btn-voltar-chat" onclick="resetBot()">Corrigir nome</button>`, 'bot');
            etapa++;
        } else if(etapa === 1) {
            dados.tel = val;
            addMsg(`Ótimo. Quantas noites pretende ficar conosco?<br><small>⚡ ${CONFIG.escassez}</small>`, 'bot');
            etapa++;
        } else {
            dados.noites = val;
            addMsg("Reserva quase pronta! Deseja preencher o <b>Pré-Check-in</b> agora para agilizar sua entrada?", 'bot');
            document.getElementById('input-area').classList.add('hidden');
            const opt = document.getElementById('option-area');
            opt.classList.remove('hidden');
            opt.innerHTML = `
                <button class="btn-reservar-small" onclick="transicaoCheckin()">SIM, AGILIZAR</button>
                <button class="btn-voltar" onclick="finalizarZap()">SÓ WHATSAPP</button>
            `;
        }
    }, 1000);
}

function addMsg(t, c) {
    const b = document.getElementById('chat-box');
    const d = document.createElement('div');
    d.className = `msg ${c}`;
    d.innerHTML = t;
    b.appendChild(d);
    b.scrollTop = b.scrollHeight;
    vibrar();
}

function transicaoCheckin() {
    const m = document.getElementById('modal-chat');
    m.style.transition = "opacity 0.3s ease";
    m.style.opacity = "0";
    setTimeout(() => { 
        m.style.display='none'; 
        m.style.opacity="1"; 
        mostrarPagina('checkin-page'); 
        document.getElementById('checkin-cpf').focus();
    }, 300);
}

function finalizarZap() {
    const m = `Olá! Gostaria de reservar.%0A*Nome:* ${dados.nome}%0A*Noites:* ${dados.noites}`;
    window.open(`https://wa.me/${CONFIG.whatsapp}?text=${encodeURIComponent(m)}`);
    fecharReserva();
}

// --- CHECK-IN E VALIDAÇÃO DE CPF ---
function validarCPF(c) {
    c = c.replace(/\D/g,'');
    if(c.length!==11 || /^(\d)\1{10}$/.test(c)) return false;
    let s=0, r;
    for(let i=1;i<=9;i++) s+=parseInt(c[i-1])*(11-i);
    r=(s*10)%11; if(r===10||r===11) r=0;
    if(r!==parseInt(c[9])) return false;
    s=0; for(let i=1;i<=10;i++) s+=parseInt(c[i-1])*(12-i);
    r=(s*10)%11; if(r===10||r===11) r=0;
    return r===parseInt(c[10]);
}

document.getElementById('checkin-cpf').oninput = (e) => {
    let v = e.target.value.replace(/\D/g,'').substring(0,11);
    v = v.replace(/(\d{3})(\d)/, '$1.$2').replace(/(\d{3})(\d)/, '$1.$2').replace(/(\d{3})(\d{1,2})$/, '$1-$2');
    e.target.value = v;
};

function finalizarCheckin() {
    const cpfI = document.getElementById('checkin-cpf');
    const rgI = document.getElementById('checkin-rg');
    if(!validarCPF(cpfI.value)) { 
        alert("CPF Inválido. Por favor, verifique."); 
        cpfI.focus(); 
        return; 
    }
    track('checkins');
    const txt = `*PRÉ-CHECKIN DIGITAL*%0A*Nome:* ${dados.nome}%0A*CPF:* ${cpfI.value}%0A*RG:* ${rgI.value}`;
    window.open(`https://wa.me/${CONFIG.whatsapp}?text=${txt}`);
    voltarHome(); 
    fecharReserva();
}

// --- LÓGICA DA GALERIA ---
function initCarousel() {
    const c = document.getElementById('carousel-slides');
    if(c.innerHTML==="") c.innerHTML = fotos.map(f=>`<img src="${f.url}" alt="Foto da Pousada">`).join('');
    updateSlide();
}

function moveSlide(n, e) { 
    e.stopPropagation(); 
    currentSlide=(currentSlide+n+fotos.length)%fotos.length; 
    updateSlide(); 
    vibrar();
}

function updateSlide() {
    const c = document.getElementById('carousel-slides');
    if(c) { 
        c.style.transform=`translateX(-${currentSlide*100}%)`; 
        document.getElementById('caption-text').innerText=fotos[currentSlide].text; 
    }
}

// --- EVENTOS DE BOTÃO ---
const btnE = document.getElementById('btn-enviar');
if(btnE) {
    btnE.onclick = processarBot;
    document.getElementById('user-input').onkeypress = (e) => { if(e.key==='Enter') processarBot(); };
}