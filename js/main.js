/*
METER UN ICONO PARA INDICAR SI SE HA COMPRADO ESE PRODUCTO OK
AL PINCHAR CAMBIA EL COLOR DEL BACKGROUND DEL ELEMENTO y del icono check OK
METER UNA BARRA DE PROGRESO OK
CAMBIAR LA PROPIEDAD COMPRADO A true OK
AHORA NECESITAMOS QUE LA BARRA CAMBIE DINÁMICAMENTE
    1º RECUPERAR LA LONGITUD DE LA LISTA
    2º RECUPERAR LOS ELEMENTOS QUE TIENE comprado : true
    3º calcular el porcentaje 
        marcados * 100 / total
*/

/* (1) DEFINICIÓN DE VARIABLES */

const article = document.getElementById('article');
const quantity = document.querySelector('#quantity');
const priority = document.querySelector('#priority');
const addButton = document.querySelector('#addButton');
const form = document.querySelector('#form');
const shopList = document.getElementById('shopList');
let list = [];
// barra de progreso
const bar = document.getElementById('progress');

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
            .substr(2, 9),
        'Comprado': false
    };
    // agregamos el objeto al array
    list.push(element);
};

// método para mostrar los elementos que vamos agregando a la lista
const showList = () => {
    // si no hay elementos en la lista...
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
        // si hay elementos...
        shopList.innerHTML = "";
        list.forEach(element => {
            let divColor = 'success';
            let checkColor = 'success';
            if (element.Comprado) {
                divColor = 'warning';
                checkColor = 'warning';
            }
            // CUIDADO! si ponemos solo innerHTML = , machaca lo anterior
            // utilizamos la notación ` `
            shopList.innerHTML +=
                /*html*/
                `<div id="${element.Id}ck" class="alert alert-${divColor}">
                <i class="material-icons align-middle">list</i>
                <b>${element.Articulo}</b>
                <span class="badge badge-primary">${element.Cantidad}</span>
                <span class="badge badge-pill badge-secondary">${element.Prioridad}</span>
                <span id="id" class="d-none">${element.Id}</span>
                <i class="material-icons align-middle float-right deleteIcon">delete</i>
                <i id="${element.Id}ckIcon" class="material-icons align-middle float-right check text-${checkColor}">check_circle_outline</i>
                </div>`;
        });
    }
};

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
    // cambiamos barra de progreso
    changeBar();
};

const deleteElement = (id) => {
    /*
    list.forEach(function (item, index, object) {
        if (item.id === id) {
            object.splice(index, 1);
        }
    });
    */
    let index = 0;
    let i = 0;
    for (i; i < list.length; i++) {
        if (list[i].Id === id) {
            index = i;
        }
    }
    // borramos el elemento que tenga el índice = i
    list.splice(index, 1);
    // actualizamos el localStorage una vez eliminado el elemento del array list
    localStorage.setItem('listado', JSON.stringify(list));
    // mostramos el contenido de la lista
    showList();
};

const changeColors = (id) => {
    document.getElementById(id + 'ckIcon').classList.remove("text-success");
    document.getElementById(id + 'ckIcon').classList.add("text-warning");
    document.getElementById(id + 'ck').classList.remove("alert-success");
    document.getElementById(id + 'ck').classList.add("alert-warning");
};

// método que cambia el valor de Comprado del elemento en el array list en el caso de que pulsemos el icono de check
const changeComprado = (id) => {
    list.forEach(element => {
        if (element.Id === id) {
            element.Comprado = true;
            changeColors(id);
        }
    });
    localStorage.setItem('listado', JSON.stringify(list));

};

// para saber cuantos elementos han sido comprados
const comprados = () => {
    // contador de elementos comprados
    let contador = 0;
    // contador del total de elementos de la lista
    let elementos = 0;
    // recorremos el array
    list.forEach(element => {
        elementos++;
        if (element.Comprado === true) {
            contador++;
        }
    });
    // calculo del porcentaje de elementos que tienen Comprado = true
    let porcentaje = (contador * 100) / elementos;
    return porcentaje;
};

// se ejecuta cuando pinchamos en el div que contiene la lista de productos
const action = (e) => {
    // para recuperar el id que tenemos de cada elemento y que está oculto necesitamos 
    // esta ruta: e.path[1].children[4].innerHTML
    // 1º comprobamos que estamos pinchando en la papelera (accedemos al texto de la papelera a través de su ruta del dom)
    // hacemos un trim() del texto recuperado por si hubiera algún espacio o salto de línea
    if (e.target.innerHTML.trim() === 'delete') {
        // 2º ahora tenemos que eliminar el elemento del array que tenga como id el mismo que la papelera que hemos pinchado
        deleteElement(e.path[1].children[4].innerHTML);
    }

    if (e.target.innerHTML.trim() === 'check_circle_outline') {
        changeComprado(e.path[1].children[4].innerHTML);
    }
    // actualizamos barra de progreso
    changeBar();
};

// método que actualiza la barra de progreso dependiendo de los items comprados
const changeBar = () => {
    let porcentaje = comprados().toFixed();
    bar.innerText = porcentaje + '%';
    bar.style.width = porcentaje + '%';
    bar.setAttribute('aria-valuenow', porcentaje + '');
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
    // actualizamos elementos comprados
    comprados();
    // actualizamos barra de progreso
    changeBar();
};


/* (3) DEFINICIÓN DE EVENTOS */

// pendiente de que cargue el dom+
document.addEventListener("DOMContentLoaded", init);
// este listener escuchará cada vez que pulsemos una tecla
document.addEventListener("keyup", checkInput);
// evento asociado al botón
addButton.addEventListener('click', addArticle);
// añadimos un listener a toda el area donde aparece el listado de productos, nos servirá para poder eliminarlos
shopList.addEventListener('click', action);
