function selecionar(botao){
    document.querySelectorAll('.button-tab').forEach(b => b.classList.remove('ativo'));

    botao.classList.add('ativo');
}