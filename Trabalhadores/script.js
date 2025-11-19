async function carregarCards() {
    try {
        const response = await fetch("getPrestadores.php");
        const dados = await response.json();

        const container = document.querySelector(".home-cards");
        container.innerHTML = ""; // Limpa cards fixos

        dados.forEach(item => {
            const cardHTML = `
                <div class="card">
                    <div class="top-content-card">
                        <div class="TCC-center">
                            <div class="foto-perfil"></div>

                            <div class="nome-area">
                                <h3 class="nome-card">${item.nome}</h3>
                                <p class="area-card">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24"
                                        viewBox="0 0 24 24" fill="none" stroke="#6d6c7f" stroke-width="2"
                                        stroke-linecap="round" stroke-linejoin="round"
                                        class="lucide lucide-briefcase w-4 h-4">
                                        <path d="M16 20V4a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"></path>
                                        <rect width="20" height="14" x="2" y="6" rx="2"></rect>
                                    </svg>
                                    Prestador de Serviços
                                </p>
                            </div>
                        </div>

                        <button class="remover-favorito"></button>
                    </div>

                    <p class="empresa-ou-profissional">Profissional</p>

                    <div class="localizacao">
                        <svg ... ></svg>
                        <span class="lc-cidade_estado">${item.cidade}, ${item.uf}</span>
                    </div>

                    <div class="telefone">
                        <svg ... ></svg>
                        <span class="tl-numero">${item.telefone}</span>
                    </div>

                    <div class="email">
                        <svg ... ></svg>
                        <span class="email-text">${item.email}</span>
                    </div>

                    <div class="line"></div>

                    <button class="ver-perfil">Ver Perfil</button>
                </div>
            `;

            container.innerHTML += cardHTML;
        });

    } catch (e) {
        console.error("Erro ao carregar cards:", e);
    }
}

carregarCards();
