const btn_sobre = document.getElementById('btn_navperfil-sobre');
const btn_avaliacao = document.getElementById('btn_navperfil-avaliacao');

const sessao_sobre = document.querySelector('.sobre');
const sessao_avaliacao = document.querySelector('.avaliacao');

function clicou_contatos_redes() {
    if (!btn_sobre.classList.contains('ativo')) {
        document.querySelector('.button-navper.ativo').classList.remove('ativo');
        btn_sobre.classList.add('ativo');

        document.querySelector('.sessao').classList.remove('sessao');
        sessao_sobre.classList.add('sessao');
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

btn_sobre.addEventListener('click', clicou_contatos_redes);
btn_avaliacao.addEventListener('click', clicou_avaliacao);

const btn_editarper = document.querySelector('.btn-editar-perfil');
const fosco = document.querySelector('.fosco');

function abrirEditarPerfil() {
    fosco.classList.add('ativo');
}

const btn_fechar = document.querySelector('.cancelar_top');

function fecharEditarPerfil() {
    fosco.classList.remove('ativo');
}
