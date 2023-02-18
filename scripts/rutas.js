//const server = "https://rutasth-api.herokuapp.com"
const server = 'localhost:5500'
window.onload = () => {
    const params = valoresID()
    mostrarMapa(params)
    mostrarnombreMapa(params)
    mostraComentarios(params)
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

//Nombre de la ruta
const mostrarnombreMapa = async (params) => {
    const response = await fetch(server + `/get/nombreMapa/${params}`)
    let data = await response.json()
    const template = await data.map(element =>
        (element.numeroC == "0") ?
            `<div class="text1">Ruta S/N ${element.nombreC}</div>` :
            `<div class="text1">Ruta ${element.numeroC} ${element.nombreC}</div>`
    );
    let reference = document.getElementById('nombreMapa')
    template.forEach(element => {
        reference.innerHTML += element
    });
}
//llamada de la BDD a los mapas de las combis
const mostrarMapa = async (params) => {
    const response = await fetch(server + `/get/mapa/all/${params}`)
    let data = await response.json()
    const template = await data.map(element =>
        `<iframe src="${element.mapa_link}" height="480" style="width: 100%"></iframe>`
    );
    let reference = document.getElementById('mapa')
    template.forEach(element => {
        reference.innerHTML += element
    });
}
//Traerá todos los comentarios
const mostraComentarios = async (params) => {
    const response = await fetch(server + `/get/ComentariosByID/${params}`)
    let data = await response.json()
    const template = await data.map(element =>
        `<div class="uno">${element.nombre_per}</div>
        <p class="comentarios">${element.comentario}</p><hr>`
    );
    let reference = document.getElementById('lisComents')
    template.forEach(element => {
        reference.innerHTML += element
    });
}
//extracion de los ID
const valoresID = () => {
    const valores = window.location.search.substring(6, 8)
    return valores
}
//Metodo POST
const postRutasComentario = async (event) => {
    event.preventDefault();
    const nombre_per = document.getElementById('name').value;
    const comentario = document.getElementById('commentario').value;

    if (comentario == "") {
        //Mandamos un mensaje al fronted
        mensajeAlerta('warning', 'Hay campos vacíos, completelos para enviar el comentario.', '', '', 2900)
        return
    }
    if (nombre_per == "") {
        mensajeAlerta('info', 'Su comentario ha sido establecido como anónimo.', 'Envíe nuevamente el comentario para guardar cambios.', '', 5800)
        document.getElementById('name').value = "Anónimo";
        nombre_per = document.getElementById('name').value;
    }
    const id_Co = valoresID()
    let data = { id_Co, nombre_per, comentario }

    let response = await fetch(server + '/post/rutasComentario', {
        method: 'POST',
        body: JSON.stringify(data),
        headers: {
            'Content-Type': 'application/json'
        },
        mode: 'cors'
    })
    let dataResponse = await response.json();
    //Vaciar campos
    document.getElementById('name').value = "";
    document.getElementById('commentario').value = "";
    if (!dataResponse.status) {
        return mensajeAlerta('error', dataResponse.info, 'Quite los emojis e intente nuevamente.', '', 6000)
    }
    //Mensaje de alerta
    Swal.fire({
        icon: 'success',
        title: '¡Su comentario se ha enviado!',
        showConfirmButton: true,
        confirmButtonText: 'Continuar',
        confirmButtonColor: '#3085d6',
        allowOutsideClick: false,
    }).then((result) => {
        if (result.isConfirmed) {
            location.reload()
        }
    })
}
//Mensaje Alerta
const mensajeAlerta = (icon, title, text, showConfirmButton, timer) => {
    Swal.fire({
        icon,
        title,
        text,
        showConfirmButton,
        allowOutsideClick: false,
        timer
    })
}