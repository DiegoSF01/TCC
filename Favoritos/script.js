function selecionar(botao){
    document.querySelectorAll('.botao').forEach(b => b.classList.remove('ativo'));

    botao.classList.add('ativo');
}