//const server = "https://rutasth-api.herokuapp.com"
const server = 'localhost:5500'
//Se ejecutará cuando recien se carga la página
window.onload = () => {
    mostrarCombis()
    lugarOrigen()
    lugarDestino()
}
//Scroll de button
const subir2 = document.querySelector('.subir2');
window.addEventListener('scroll', irArriba)
function irArriba() {
    if (window.scrollY >= 100) {
        //cambiaremos el valor de la propiedad display a block
        subir2.style.display = "block";

    } else {
        subir2.style.display = "none";
    }
}
function scrollToTop() {
    if (subir2.onclick) {
        window.scrollTo(0, 0)
    }
}
//Funcion de dezplazamiento a una seccion con ID
function empezar(){
    document.location.href = '#section1';
}

//llamada de la BDD para mostrar todas las combis
const mostrarCombis = async () => {
    const response = await fetch(server + '/get/combi/all')
    let data = await response.json()
    const template = await data.map(element =>
        (element.numeroC == "0") ?
            //aqui los colocaras al revés, y quitaras la palabra ruta!
            `<div id="combi" class=""><a href="ruta.html?ruta=${element.id_C}" value="${element.id_C}" >Ruta S/N ${element.nombreC} </a> </div>` :
            `<div id="combi" class=""><a href="ruta.html?ruta=${element.id_C}" value="${element.id_C}" >Ruta ${element.numeroC} ${element.nombreC} </a> </div>`
    );
    let reference = document.getElementById('lisRutas')
    template.forEach(element => {
        reference.innerHTML += element
    });
}
//Llama a la BDD de los lugares categoria Origen
const lugarOrigen = async () => {
    const response = await fetch(server + '/get/lugarOrigen')
    let data = await response.json()
    const template = await data.map(element =>
        `<option value="${element.id_L}">${element.nombre}</option>`
    );
    let reference = document.getElementById('opcionesOrigen')
    template.forEach(element => {
        reference.innerHTML += element
    });
}
//Llama a la BDD de los lugares categoria Destino
const lugarDestino = async () => {
    const response = await fetch(server + '/get/lugarDestino')
    let data = await response.json()
    const template = await data.map(element =>
        `<option value="${element.id_L}">${element.nombre}</option>`
    );
    let reference = document.getElementById('opcionesDestino')
    template.forEach(element => {
        reference.innerHTML += element
    });
}
// Aque se realizará el filtro de las combis existentes en el index del frontend
const filtroRutas = async () => {
    const lugarO = document.getElementById('opcionesOrigen').value
    const lugarD = document.getElementById('opcionesDestino').value
    //Div de referencia para crear el div que se usará para insertar los datos
    //Mensaje de alerta
    if (lugarO === "0" || lugarD === "0") {
        mensajeAlert('error', '¡No ha seleccionado los lugares!', 'Seleccione el lugar de origen y lugar de destino para continuar', false, 3500)
    } else {
        location.href = "#seccion2"
        const contenedor = document.getElementById('contenedorRutas')
        let reference = document.getElementById('lisRutas')
        const element = document.getElementById('combi')
        reference.remove(element)
        const newList = document.createElement('div')
        newList.setAttribute('id', 'lisRutas')
        newList.setAttribute('class', 'lisRutas icon-lis puntero-rutas')
        contenedor.appendChild(newList)
        const response = await fetch(server + `/get/combiByLugar/${lugarO}/${lugarD}`)
        let data = await response.json()
        if (!data.length) {
            newList.innerHTML = "<p>En este momento no hay rutas disponibles para tu búsqueda, pero estamos trabajando en ello.</p>"
        } else {
            const template = await data.map(element =>
                (element.numeroC == "0") ?
                    `<div id="combi" class=""><a href="ruta.html?ruta=${element.id_C}" value="${element.id_C}" >Ruta S/N ${element.nombreC} </a> </div>` :
                    `<div id="combi" class=""><a href="ruta.html?ruta=${element.id_C}" value="${element.id_C}" >Ruta ${element.numeroC} ${element.nombreC} </a> </div>`
            );
            template.forEach(element => {
                newList.innerHTML += element
            })
        }
    }
}
const mensajeAlert = (icon, title, text, showConfirmButton, timer) => {
    //Mensaje de alerta
    Swal.fire({
        icon,
        title,
        text,
        showConfirmButton,
        timer,
        allowOutsideClick: false,
    })
}