/*
const titulo1 = document.getElementById('titulo1');

titulo1.style.color = "lightgray";

function cambiarColor() {
    titulo1.className = "text-light text-center";
    // titulo1.style.background = "steelblue";
}

titulo1.addEventListener("click", cambiarColor);
*/

/* (1) DEFINICIÓN DE VARIABLES */

const article = document.getElementById('article');
const quantity = document.querySelector('#quantity');
const priority = document.querySelector('#priority');
const addButton = document.querySelector('#addButton');
const form = document.querySelector('#form');
const shopList = document.getElementById('shopList');
let list = [];

/* (2) DEFINICIÓN DE FUNCIONES */

const checkInput = () => {
    /*
    console.log("La longitud de lo que hay en el input articulo es " + article.value);
    console.log("Longitud de la cadena " + article.value.length);
    */
    // console.log(`Input: ${article.value} - ${article.value.length}`);
    /*
    if (article.value.length === 0) {
        addButton.disabled = true;
    } else {
        addButton.disabled = false;
    }
    */
    // desabilitamos el botón si la longitud es 0
    addButton.disabled = article.value.length === 0;
};

// recogemos el articulo, lo guardamos en el array list como un objeto y lo mostramos en el documento
const createList = (article, quantity, priority) => {
    // creamos un objeto que recogerá los valores
    let element = {
        'Articulo': article,
        'Cantidad': quantity,
        'Prioridad': priority,
        // agregamos un id, al que asignamos un valor aleatorio
        'Id': Math.random()
            .toString()
            .substr(2, 9)
    };
    // agregamos el objeto al array
    list.push(element);
};

// método para mostrar los elementos que vamos agregando a la lista
const showList = () => {
    if (list.length === 0) {
        /*
        shopList.innerHTML = "";
        shopList.innerHTML = "<div class = 'alert alert-danger'>" +
            "La lista de la compra tiene " + list.length + " elementos para comprar" +
            "</div>";
        */
        // TRAS INSTALAR UNA EXTENSIÓN PARA QUE NOS COLOREE EL TEXTO FORMATEADO
        // TENEMOS QUE ESCRIBIR /*html*/
        shopList.innerHTML =
            /*html*/
            `<div class = "alert alert-danger">
            <i class="material-icons align-middle">list</i> No hay artículos que comprar
            </div>`;

    } else {
        shopList.innerHTML = "";
        list.forEach(element => {
            // CUIDADO! si ponemos solo innenHTML = , machaca lo anterior
            shopList.innerHTML +=
                /*html*/
                `<div class = "alert alert-success">
                <i class="material-icons align-middle">list</i> 
                ${element.Articulo} - ${element.Cantidad} - ${element.Prioridad}
                </div>`;
        });
    }
}

// Esta función se ejecuta cuando damos click al botón, pasamos el evento por argumento
const addArticle = (e) => {
    // para prevenir el comportamiento del formulario por defecto
    e.preventDefault();
    // llamamos a la funcion que nos crea la lista de articulos
    createList(article.value, quantity.value, priority.value);
    // AHORA VAMOS A GUARDAR LA LISTA EN EL localStorage del navegador
    // la key listado, puede ser cualquier otra cosa
    // para poder pasar el array, lo convertimos a cadena con JSON.stringify
    localStorage.setItem('listado', JSON.stringify(list));
    // ahora a la funcion que la muestra
    showList();
    // para que cada vez que le demos al botón al añadir un articulo, se borre el formulario
    form.reset();
    // volvemos a comprobar una vez limpiado que el botón se deshabilita
    checkInput();
};

// método que se ha de ejecutar al inicio
const init = () => {
    checkInput();
    // si hay algo en el localStorage, lo asignamos al array para mostrarlo
    if (localStorage.length > 0 || localStorage.getItem('listado') != null) {
        list = JSON.parse(localStorage.getItem('listado'));
    }
    // mostramos la lista
    showList();
};


/* (3) DEFINICIÓN DE EVENTOS */

// pendiente de que cargue el dom+
document.addEventListener("DOMContentLoaded", init)
// este listener escuchará cada vez que pulsemos una tecla
document.addEventListener("keyup", checkInput);
// evento asociado al botón
addButton.addEventListener('click', addArticle);