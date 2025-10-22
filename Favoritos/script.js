const botao_todos = document.getElementById('btn-todos');
const botao_profi = document.getElementById('btn-profissionais');
const botao_empre = document.getElementById('btn-empresas');

function filtro_T(){
    if(botao_todos.classList.contains('ativo') == false){
        document.querySelector('.button-tab.ativo').classList.remove('ativo');
        botao_todos.classList.add('ativo');
        moverHighlight(botao);
    }
}


function filtro_P(){
    if(botao_profi.classList.contains('ativo') == false){
        document.querySelector('.button-tab.ativo').classList.remove('ativo');
        botao_profi.classList.add('ativo');
        moverHighlight(botao);
    }
}


function filtro_E(){
    if(botao_empre.classList.contains('ativo') == false){
        document.querySelector('.button-tab.ativo').classList.remove('ativo');
        botao_empre.classList.add('ativo');
        moverHighlight(botao);
    }
}


botao_todos.addEventListener("click", filtro_T);
botao_profi.addEventListener("click", filtro_P);
botao_empre.addEventListener("click", filtro_E);