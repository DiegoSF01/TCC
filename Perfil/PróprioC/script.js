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
const modalPerfil = document.querySelector('.modal-perfil');

function abrirEditarPerfil() {
    modalPerfil.classList.add('ativo');
}

btn_editarper.addEventListener('click', abrirEditarPerfil);

const btn_fechar = document.querySelector('.cancelar');

function fecharEditarPerfil() {
    modalPerfil.classList.remove('ativo');
}

btn_fechar.addEventListener('click', fecharEditarPerfil);

// ===============================
// MODAL EDITAR PERFIL
// ===============================

// Evento clicar fora do modal
document.getElementById("modalEditarPerfil")?.addEventListener("click", (e) => {
    if (e.target.id === "modalEditarPerfil") {
        fecharEditarPerfil();
    }
});

// Fechar com ESC
document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
        fecharEditarPerfil();
    }
});

// ===============================
// SALVAR ALTERAÇÕES DO PERFIL
// ===============================

document.getElementById("btnSalvarPerfil")?.addEventListener("click", () => {

    // Inputs
    const nome = document.getElementById("name")?.value.trim();
    const profissao = document.getElementById("profession")?.value.trim();
    const cep = document.getElementById("cep")?.value.trim();
    const telefone = document.getElementById("phone")?.value.trim();
    const email = document.getElementById("email")?.value.trim();
    const instagram = document.getElementById("instagram")?.value.trim();
    const facebook = document.getElementById("facebook")?.value.trim();
    const twitter = document.getElementById("twitter")?.value.trim();
    const sobre = document.getElementById("about")?.value.trim();

    // Nome
    const elNome = document.querySelector(".nome-perfil");
    if (nome && elNome) elNome.textContent = nome;

    // Profissão
    const elProf = document.querySelector(".contratante-text");
    if (profissao && elProf) elProf.textContent = profissao;

    // CEP
    if (cep) {
        const arr = cep.split("-");
        const elCidade = document.querySelector(".lc-cidade");
        const elEstado = document.querySelector(".lc-estado");

        if (elCidade) elCidade.textContent = arr[0] || "";
        if (elEstado) elEstado.textContent = arr[1] || "";
    }

    // Telefone
    if (telefone) {
        const tl1 = document.querySelector(".tl-numero");
        const tl2 = document.querySelector(".telefone-numero");

        if (tl1) tl1.textContent = telefone;
        if (tl2) tl2.textContent = telefone;
    }

    // Email
    const elEmail = document.querySelector(".email-text");
    if (email && elEmail) elEmail.textContent = email;

    // Instagram
    const elInsta = document.querySelector(".name_perfil-ins");
    if (instagram && elInsta) elInsta.textContent = instagram;

    // Facebook
    const elFace = document.querySelector(".name_perfil-fac");
    if (facebook && elFace) elFace.textContent = facebook;

    // Twitter
    const elX = document.querySelector(".name_perfil-x");
    if (twitter && elX) elX.textContent = twitter;

    // Sobre (caso exista no HTML)
    const elSobre = document.querySelector(".sobre-text");
    if (sobre && elSobre) elSobre.textContent = sobre;


    fecharEditarPerfil();
});

// ===============================
// MÁSCARA TELEFONE (OPCIONAL)
// ===============================
document.getElementById("phone")?.addEventListener("input", (e) => {
    let v = e.target.value.replace(/\D/g, "");
    if (v.length > 11) v = v.slice(0, 11);

    if (v.length >= 1) v = "(" + v;
    if (v.length >= 3) v = v.slice(0, 3) + ") " + v.slice(3);
    if (v.length >= 10) v = v.slice(0, 10) + "-" + v.slice(10);

    e.target.value = v;
});