function putCode(title) {
    return title;
}

document.getElementById("title").innerHTML = putCode("ovo mata o javascripto - php");

let deuCerto = "funcionou sua ideia";
let classe = 'highlight';
let title = document.querySelector('#title');
let isYellow = false;

document.getElementById("myButton").addEventListener('click', function(){
    if (!isYellow) {
        title.classList.add(classe);
        title.setAttribute('style', 'background-color: yellow');
        isYellow = true;
    } else {
        title.classList.remove(classe);
        title.style.backgroundColor = '';
        isYellow = false;
    }
});


