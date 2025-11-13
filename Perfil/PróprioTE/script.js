// Estado Global
let especialidades = ["Alvenaria", "Revestimento", "Fundações"];
let postagens = [
    {
        id: 1,
        titulo: "Casa Moderna Finalizada",
        descricao: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Beatae accusamus fuga ut aut in asperiores ex eligendi.",
        imagem: ""
    },
    {
        id: 2,
        titulo: "Projeto Residencial",
        descricao: "Projeto completo de construção residencial com acabamento de alta qualidade.",
        imagem: ""
    }
];
let editandoPostagemId = null;

// Navegação entre abas
const btn_sobre = document.getElementById('btn_navperfil-sobre');
const btn_postagens = document.getElementById('btn_navperfil-postagens');
const btn_avaliacao = document.getElementById('btn_navperfil-avaliacao');

const sessao_sobre = document.querySelector('.sobre');
const sessao_publicacoes = document.querySelector('.publicacoes');
const sessao_avaliacao = document.querySelector('.avaliacao');

function clicou_sobre() {
    if (!btn_sobre.classList.contains('ativo')) {
        document.querySelector('.button-navper.ativo').classList.remove('ativo');
        btn_sobre.classList.add('ativo');
        document.querySelector('.sessao').classList.remove('sessao');
        sessao_sobre.classList.add('sessao');
    }
}

function clicou_postagens() {
    if (!btn_postagens.classList.contains('ativo')) {
        document.querySelector('.button-navper.ativo').classList.remove('ativo');
        btn_postagens.classList.add('ativo');
        document.querySelector('.sessao').classList.remove('sessao');
        sessao_publicacoes.classList.add('sessao');
    }
}

function clicou_avaliacao() {
    if (!btn_avaliacao.classList.contains('ativo')) {
        document.querySelector('.button-navper.ativo').classList.remove('ativo');
        btn_avaliacao.classList.add('ativo');
        document.querySelector('.sessao').classList.remove('sessao');
        sessao_avaliacao.classList.add('sessao');
    }
}

btn_sobre.addEventListener('click', clicou_sobre);
btn_postagens.addEventListener('click', clicou_postagens);
btn_avaliacao.addEventListener('click', clicou_avaliacao);

// Modal Editar Perfil
function abrirModalEditarPerfil() {
    document.getElementById('modalEditarPerfil').classList.add('active');
    renderizarEspecialidades();
}

function fecharModalEditarPerfil() {
    document.getElementById('modalEditarPerfil').classList.remove('active');
}

// Gerenciar Especialidades
function adicionarEspecialidade() {
    const input = document.getElementById('novaEspecialidade');
    const novaEsp = input.value.trim();
    
    if (novaEsp && !especialidades.includes(novaEsp)) {
        especialidades.push(novaEsp);
        renderizarEspecialidades();
        input.value = '';
        mostrarNotificacao('Especialidade adicionada!');
    }
}

function removerEspecialidade(index) {
    especialidades.splice(index, 1);
    renderizarEspecialidades();
    mostrarNotificacao('Especialidade removida!');
}

function renderizarEspecialidades() {
    const container = document.getElementById('especialidadesLista');
    container.innerHTML = '';
    
    especialidades.forEach((esp, index) => {
        const badge = document.createElement('div');
        badge.className = 'badge';
        badge.innerHTML = `
            ${esp}
            <button class="badge-remove" onclick="removerEspecialidade(${index})">×</button>
        `;
        container.appendChild(badge);
    });
    
    // Atualizar também na página
    const containerPagina = document.getElementById('especialidades-container');
    containerPagina.innerHTML = '';
    especialidades.forEach(esp => {
        const span = document.createElement('div');
        span.className = 'span-esp_op';
        span.innerHTML = `<span class="especialidade-op">${esp}</span>`;
        containerPagina.appendChild(span);
    });
}

// Permitir adicionar especialidade com Enter
document.addEventListener('DOMContentLoaded', function() {
    const inputEsp = document.getElementById('novaEspecialidade');
    if (inputEsp) {
        inputEsp.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                e.preventDefault();
                adicionarEspecialidade();
            }
        });
    }
});

// Salvar Perfil
document.getElementById('formEditarPerfil').addEventListener('submit', function(e) {
    e.preventDefault();
    
    const formData = new FormData(e.target);
    const dados = Object.fromEntries(formData);
    
    // Atualizar informações na página
    document.querySelector('.nome-perfil').textContent = dados.name;
    document.querySelector('.profissao').textContent = dados.profession;
    document.querySelector('.local-perfil').textContent = `${dados.city}, ${dados.state}`;
    document.querySelector('.tl-numero').textContent = dados.phone;
    document.querySelector('.email-text').textContent = dados.email;
    document.querySelector('.projetos_concluidos-text').textContent = dados.projects;
    document.querySelector('.tempo_experiencia-text').textContent = dados.experience;
    document.querySelector('.sobre_profissional p').textContent = dados.about;
    
    // Atualizar redes sociais
    document.querySelector('.name_perfil-ins').textContent = dados.instagram;
    document.querySelector('.name_perfil-fac').textContent = dados.facebook;
    document.querySelector('.name_perfil-x').textContent = dados.twitter;
    
    mostrarNotificacao('Perfil atualizado com sucesso!');
    fecharModalEditarPerfil();
});

// Modal Gerenciar Postagens
function abrirModalPostagens() {
    document.getElementById('modalPostagens').classList.add('active');
    renderizarListaPostagens();
}

function fecharModalPostagens() {
    document.getElementById('modalPostagens').classList.remove('active');
    cancelarFormPostagem();
}

function mostrarFormPostagem() {
    document.getElementById('formPostagem').style.display = 'block';
    document.getElementById('tituloFormPostagem').textContent = 'Nova Postagem';
    document.getElementById('tituloPostagem').value = '';
    document.getElementById('descricaoPostagem').value = '';
    document.getElementById('imagemPostagem').value = '';
    editandoPostagemId = null;
}

function cancelarFormPostagem() {
    document.getElementById('formPostagem').style.display = 'none';
    document.getElementById('tituloPostagem').value = '';
    document.getElementById('descricaoPostagem').value = '';
    document.getElementById('imagemPostagem').value = '';
    editandoPostagemId = null;
}

function salvarPostagem() {
    const titulo = document.getElementById('tituloPostagem').value.trim();
    const descricao = document.getElementById('descricaoPostagem').value.trim();
    const imagem = document.getElementById('imagemPostagem').value.trim();
    
    if (!titulo || !descricao) {
        mostrarNotificacao('Preencha todos os campos obrigatórios!', 'erro');
        return;
    }
    
    if (editandoPostagemId) {
        // Editar postagem existente
        const index = postagens.findIndex(p => p.id === editandoPostagemId);
        if (index !== -1) {
            postagens[index] = {
                ...postagens[index],
                titulo,
                descricao,
                imagem
            };
            mostrarNotificacao('Postagem atualizada com sucesso!');
        }
    } else {
        // Criar nova postagem
        const novaPostagem = {
            id: Date.now(),
            titulo,
            descricao,
            imagem: imagem || ''
        };
        postagens.push(novaPostagem);
        mostrarNotificacao('Postagem criada com sucesso!');
    }
    
    renderizarListaPostagens();
    renderizarPostagensNaPagina();
    cancelarFormPostagem();
}

function editarPostagem(id) {
    const postagem = postagens.find(p => p.id === id);
    if (postagem) {
        document.getElementById('formPostagem').style.display = 'block';
        document.getElementById('tituloFormPostagem').textContent = 'Editar Postagem';
        document.getElementById('tituloPostagem').value = postagem.titulo;
        document.getElementById('descricaoPostagem').value = postagem.descricao;
        document.getElementById('imagemPostagem').value = postagem.imagem || '';
        editandoPostagemId = id;
    }
}

function deletarPostagem(id) {
    if (confirm('Tem certeza que deseja excluir esta postagem?')) {
        postagens = postagens.filter(p => p.id !== id);
        renderizarListaPostagens();
        renderizarPostagensNaPagina();
        mostrarNotificacao('Postagem excluída com sucesso!');
    }
}

function renderizarListaPostagens() {
    const lista = document.getElementById('listaPostagens');
    lista.innerHTML = '';
    
    if (postagens.length === 0) {
        lista.innerHTML = '<p style="text-align: center; color: var(--muted-foreground);">Nenhuma postagem ainda. Crie sua primeira!</p>';
        return;
    }
    
    postagens.forEach(postagem => {
        const item = document.createElement('div');
        item.className = 'postagem-item';
        item.innerHTML = `
            <div class="postagem-img" style="${postagem.imagem ? `background-image: url(${postagem.imagem}); background-size: cover; background-position: center;` : ''}"></div>
            <div class="postagem-info">
                <h4>${postagem.titulo}</h4>
                <p>${postagem.descricao}</p>
            </div>
            <div class="postagem-actions">
                <button class="btn-icon" onclick="editarPostagem(${postagem.id})">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                        <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                    </svg>
                </button>
                <button class="btn-icon delete" onclick="deletarPostagem(${postagem.id})">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <polyline points="3 6 5 6 21 6"></polyline>
                        <path d="m19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                    </svg>
                </button>
            </div>
        `;
        lista.appendChild(item);
    });
}

function renderizarPostagensNaPagina() {
    const container = document.getElementById('postagens-container');
    container.innerHTML = '';
    
    postagens.forEach(postagem => {
        const card = document.createElement('div');
        card.className = 'card-publicacoes';
        card.innerHTML = `
            <div class="img-card_publicacoes" style="${postagem.imagem ? `background-image: url(${postagem.imagem}); background-size: cover; background-position: center;` : ''}"></div>
            <div class="mini-informacoes-card_publicacoes">
                <h4>${postagem.titulo}</h4>
                <p>${postagem.descricao}</p>
            </div>
        `;
        container.appendChild(card);
    });
}

// Sistema de Notificação
function mostrarNotificacao(mensagem, tipo = 'sucesso') {
    // Remover notificação anterior se existir
    const notifAnterior = document.querySelector('.notificacao');
    if (notifAnterior) {
        notifAnterior.remove();
    }
    
    const notif = document.createElement('div');
    notif.className = 'notificacao';
    notif.style.cssText = `
        position: fixed;
        top: 2rem;
        right: 2rem;
        padding: 1rem 1.5rem;
        background-color: ${tipo === 'erro' ? '#dc2626' : '#16a34a'};
        color: white;
        border-radius: 0.5rem;
        box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.3);
        z-index: 10000;
        animation: slideIn 0.3s ease-out;
    `;
    notif.textContent = mensagem;
    
    document.body.appendChild(notif);
    
    setTimeout(() => {
        notif.style.animation = 'slideOut 0.3s ease-out';
        setTimeout(() => notif.remove(), 300);
    }, 3000);
}

// Adicionar animações
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @keyframes slideOut {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(100%);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);

// Fechar modais ao clicar fora
document.getElementById('modalEditarPerfil').addEventListener('click', function(e) {
    if (e.target === this) {
        fecharModalEditarPerfil();
    }
});

document.getElementById('modalPostagens').addEventListener('click', function(e) {
    if (e.target === this) {
        fecharModalPostagens();
    }
});

// Inicialização
document.addEventListener('DOMContentLoaded', function() {
    renderizarEspecialidades();
    renderizarPostagensNaPagina();
});
