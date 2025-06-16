let button = document.querySelector('button');

function criarcard(){
    let div = document.createElement('div');
    div.innerHTML = '<div class="card"></div>';
    let divcard = div.querySelector('.card');
    divcard.innerHTML = '<div class="imagens"></div> <div class="informacoes"></div>';
    let divinfor = divcard.querySelector('.informacoes');
    divinfor.innerHTML = '<div class="foto"></div> <h2 class="name"></h2> <h2 class="profission"></h2> <button class="button">Acessar perfil</button>';

    var name = prompt('Digite um nome: ');
    var profission = prompt('Digite uma profissao: ');

    divinfor.querySelector('.name').innerText = name;
    divinfor.querySelector('.profission').innerText = profission;

    button.after(divcard);
}
