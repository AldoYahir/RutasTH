//const server = "https://rutasth-api.herokuapp.com"
const server = 'localhost:5500'
window.onload = () => {
    const token = localStorage.getItem('token')
    if (!token) {
        document.location.href = "accesoLogin.html"
    }
    mostrarCombis()
    mensajeAlerta('info', 'Si deseas agregar una combi sin número, en el campo "Número combi" coloque un cero.', '', true, '')
}
//llamada de la BDD para mostrar todas las combis
const mostrarCombis = async () => {
    const response = await fetch(server + '/get/adminCombi')
    let data = await response.json()
    const template = await data.map(element =>
        (element.numeroC == "0") ?
            `<div class="row">
        <div class="uno col-8"><a href="#">Ruta S/N ${element.nombreC}</a></div>
        <div class="btn-eliminar col-3">
            <button class="eliminar" onclick='deleteCombi(${element.id_C})'><i class="bi bi-x-lg"></i></button>
        </div>
        </div><hr>`
            :
            `<div class="row">
        <div class="uno col-8"><a href="#">Ruta ${element.numeroC} ${element.nombreC}</a></div>
        <div class="btn-eliminar col-3">
            <button class="eliminar" onclick='deleteCombi(${element.id_C})'><i class="bi bi-x-lg"></i></button>
        </div>
        </div><hr>`
    )
    let reference = document.getElementById('adminCombi')
    template.forEach(element => {
        reference.innerHTML += element
    })
}
//Metodo POST
const postadminCombi = async (event) => {
    event.preventDefault();
    const numeroC = document.getElementById('numeroC').value;
    const nombreC = document.getElementById('nombreC').value;
    const mapa_link = document.getElementById('mapa_link').value;
    const token = localStorage.getItem('token')

    if (numeroC == "" && nombreC == "") {
        return mensajeAlerta('warning', 'El campo número o nombre están vacíos, complete uno de ellos para guardar los datos.', '', false, 3500)
    } else if (mapa_link == "") {
        return mensajeAlerta('warning', 'Falta ingresar la URL.', '', false, 2800)
    }
    let data = { numeroC, nombreC, mapa_link }

    let response = await fetch(server + '/post/postadminCombi', {
        method: 'POST',
        body: JSON.stringify(data),
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        mode: 'cors'
    });
    let dataResponse = await response.json();
    //vaciar campos
    document.getElementById('numeroC').value = "";
    document.getElementById('nombreC').value = "";
    document.getElementById('mapa_link').value = "";
    if (!dataResponse.status) {
        return mensajeAlerta('error', dataResponse.info + ', verifica tus datos.', '', false, 3100)
    }
    //Mensaje de alerta
    Swal.fire({
        icon: 'success',
        title: '¡Los datos se han guardado con éxito!',
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
//DELETE
const deleteCombi = async (id_C) => {
    const token = localStorage.getItem('token')
    const response = await fetch(server + `/delete/adminCombi/${id_C}`, {
        method: 'DELETE',
        headers: {
            'Authorization': `Bearer ${token}`
        },
        mode: 'cors'
    })
    const dataResponse = await response.json()
    if (dataResponse.status == false) {
        mensajeAlerta('error', dataResponse.info, 'Puede que esta combi tenga relación con otros trayectos', false, 3100)
    } else {
        //Mensaje de alerta
        Swal.fire({
            icon: 'success',
            title: dataResponse.info,
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
}
//Mensaje Alert
const mensajeAlerta = (icon, title, text, showConfirmButton, timer) => {
    //Mandamos un mensaje al fronted
    Swal.fire({
        icon,
        title,
        text,
        showConfirmButton,
        allowOutsideClick: false,
        timer
    })
}