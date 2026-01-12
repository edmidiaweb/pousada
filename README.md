# 🏨 Pousada Encanto - Sistema de Reserva Conversacional

![Versão](https://img.shields.io/badge/version-1.0.0-blue)
![Status](https://img.shields.io/badge/status-ativo-brightgreen)
![Licença](https://img.shields.io/badge/license-MIT-lightgrey)

Uma solução **Mobile-First** elegante e eficiente para pousadas de pequeno e médio porte. Este sistema substitui formulários frios por uma experiência de **chatbot conversacional**, aumentando a conversão de reservas via WhatsApp.

---

## 🚀 Funcionalidades Principal (MVP)

- **Home Experience:** Interface imersiva com foco em branding e conversão imediata.
- **Storytelling (Quem Somos):** Seção dedicada à história da pousada para gerar conexão emocional com o hóspede.
- **Galeria Interativa:** Carrossel de fotos otimizado para visualização de suítes e gastronomia.
- **Chatbot Inteligente:** Fluxo de triagem que coleta Nome, Telefone e Período de Estadia de forma amigável.
- **Integração WhatsApp:** Direcionamento automático dos dados coletados para o fechamento da venda.
- **UX Moderna:** Sistema de navegação por camadas (overlays) com fechamento inteligente ao clicar fora da área de conteúdo.

## 🛠️ Tecnologias Utilizadas

Para garantir leveza, velocidade e custo zero de manutenção, o projeto foi construído com a stack **Vanilla Web**:

* **HTML5:** Estrutura semântica e SEO-friendly.
* **CSS3:** Estilização avançada com *Glassmorphism* (efeito de desfoque) e variáveis CSS.
* **JavaScript (ES6+):** Lógica de estados, gerenciamento de DOM e automação do chatbot.
* **Font Awesome:** Ícones vetoriais para uma interface intuitiva.

## 📦 Como Instalar e Rodar

1.  **Clone o repositório:**
    ```bash
    git clone [https://github.com/seu-usuario/pousada-encanto.git](https://github.com/seu-usuario/pousada-encanto.git)
    ```
2.  **Acesse a pasta:**
    ```bash
    cd pousada-encanto
    ```
3.  **Configuração:**
    Abra o arquivo `script.js` e altere a constante `CONFIG` com o seu número de WhatsApp:
    ```javascript
    const CONFIG = { 
        WHATSAPP: "5511999999999", 
        NOME: "Pousada Encanto" 
    };
    ```
4.  **Execução:**
    Basta abrir o arquivo `index.html` em qualquer navegador moderno.

## 📱 Visualização do Projeto

O sistema é totalmente responsivo e adaptado para dispositivos móveis:

| Home Page | Galeria | Chatbot |
| :---: | :---: | :---: |
| ![Home](https://via.placeholder.com/150x300?text=Home) | ![Galeria](https://via.placeholder.com/150x300?text=Galeria) | ![Chat](https://via.placeholder.com/150x300?text=Chat) |

## 🎨 Personalização de Imagens

Para utilizar fotos reais da sua pousada, basta atualizar o array `fotos` no arquivo `script.js`:

```javascript
const fotos = [
    { url: 'caminho/para/sua-foto-1.jpg', text: 'Descrição da Foto' },
    // adicione quantas quiser...
];****
