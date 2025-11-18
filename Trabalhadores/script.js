// Função para renderizar um card de prestador
function criarCard(prestador) {
    return `
        <div class="card">
            <div class="top-content-card">
                <div class="TCC-center">
                    <div class="foto-perfil" style="background-image: url('${prestador.foto || '/perfil.jpg'}'); background-size: cover; background-position: center;"></div>

                    <div class="nome-area">
                        <h3 class="nome-card">${prestador.nome}</h3>
                        <p class="area-card">
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24"
                                viewBox="0 0 24 24" fill="none" stroke="#6d6c7f" stroke-width="2"
                                stroke-linecap="round" stroke-linejoin="round"
                                class="lucide lucide-briefcase w-4 h-4">
                                <path d="M16 20V4a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"></path>
                                <rect width="20" height="14" x="2" y="6" rx="2"></rect>
                            </svg>
                            ${prestador.area}
                        </p>
                    </div>
                </div>

                <button class="remover-favorito">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"
                        fill="#ef4343" stroke="#ef4343" stroke-width="2" stroke-linecap="round"
                        stroke-linejoin="round"
                        class="lucide lucide-heart w-5 h-5 fill-destructive text-destructive group-hover:scale-110 transition-transform">
                        <path
                            d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z">
                        </path>
                    </svg>
                </button>
            </div>

            <p class="empresa-ou-profissional">Profissional</p>

            <div class="avaliacao-content">
                <div class="stars">
                    ${gerarEstrelas(prestador.avaliacao)}
                </div>
                <span class="quant-stars">${prestador.avaliacao.toFixed(1)}</span>
                <span class="quant-avaliacoes">(${prestador.quantidadeAvaliacoes} avaliações)</span>
            </div>

            <div class="localizacao">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none"
                    stroke="#6d6c7f" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"
                    class="lucide lucide-map-pin w-4 h-4">
                    <path
                        d="M20 10c0 4.993-5.539 10.193-7.399 11.799a1 1 0 0 1-1.202 0C9.539 20.193 4 14.993 4 10a8 8 0 0 1 16 0">
                    </path>
                    <circle cx="12" cy="10" r="3"></circle>
                </svg>
                <span class="lc-cidade_estado">${prestador.estado}, ${prestador.uf}</span>
            </div>

            <div class="telefone">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none"
                    stroke="#6d6c7f" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"
                    class="lucide lucide-phone w-4 h-4">
                    <path
                        d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z">
                    </path>
                </svg>
                <span class="tl-numero">${prestador.telefone}</span>
            </div>

            <div class="email">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none"
                    stroke="#6d6c7f" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"
                    class="lucide lucide-mail w-4 h-4">
                    <rect width="20" height="16" x="2" y="4" rx="2"></rect>
                    <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"></path>
                </svg>
                <span class="email-text">${prestador.email}</span>
            </div>

            <div class="line"></div>

            <button class="ver-perfil">Ver Perfil</button>
        </div>
    `;
}

// Função auxiliar para gerar estrelas baseado na avaliação
function gerarEstrelas(avaliacao) {
    const estrelaSVG = `
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"
            fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"
            stroke-linejoin="round" class="star">
            <path
                d="M11.525 2.295a.53.53 0 0 1 .95 0l2.31 4.679a2.123 2.123 0 0 0 1.595 1.16l5.166.756a.53.53 0 0 1 .294.904l-3.736 3.638a2.123 2.123 0 0 0-.611 1.878l.882 5.14a.53.53 0 0 1-.771.56l-4.618-2.428a2.122 2.122 0 0 0-1.973 0L6.396 21.01a.53.53 0 0 1-.77-.56l.881-5.139a2.122 2.122 0 0 0-.611-1.879L2.16 9.795a.53.53 0 0 1 .294-.906l5.165-.755a2.122 2.122 0 0 0 1.597-1.16z">
            </path>
        </svg>
    `;
    
    const classes = ['pri', 'seg', 'ter', 'qua', 'qui'];
    let estrelas = '';
    
    for (let i = 0; i < 5; i++) {
        estrelas += estrelaSVG.replace('class="star"', `class="star ${classes[i]}"`);
    }
    
    return estrelas;
}

// Função para renderizar todos os cards
function renderizarCards(prestadores) {
    const container = document.querySelector('.home-cards');
    
    if (!container) {
        console.error('Container .home-cards não encontrado');
        return;
    }
    
    if (prestadores.length === 0) {
        container.innerHTML = '<p style="grid-column: 1/-1; text-align: center; padding: 2rem;">Nenhum prestador encontrado.</p>';
        return;
    }
    
    container.innerHTML = prestadores.map(criarCard).join('');
}

// Função principal para carregar e exibir os dados
async function carregarPrestadores() {
    const container = document.querySelector('.home-cards');
    container.innerHTML = '<p style="grid-column: 1/-1; text-align: center; padding: 2rem;">Carregando prestadores...</p>';
    
    const dadosCompletos = await obterDadosCompletos();
    renderizarCards(dadosCompletos);
}

// Executar quando o DOM estiver pronto
document.addEventListener('DOMContentLoaded', carregarPrestadores);
