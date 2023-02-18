//const server = "https://rutasth-api.herokuapp.com"
const server = 'localhost:5500'
window.onload = () => {
    const token = localStorage.getItem('token')
    if (!token) {
        document.location.href = "accesoLogin.html"
    }
    mostrarLugares()
}
//llamada de la BDD para mostrar todos los lugares
const mostrarLugares = async () => {
    const response = await fetch(server + '/get/adminLugar')
    let data = await response.json()
    const template = await data.map(element =>
        `<div class="row">
        <div class="uno col-8"><a href="#">${element.nombre}</a></div>
        <div class="btn-eliminar col-3">
            <button class="eliminar" onclick='deteleLugar(${element.id_L})'><i class="bi bi-x-lg"></i></button>
        </div>
        </div>
        <hr>`
    );
    let reference = document.getElementById('adminLugar')
    template.forEach(element => {
        reference.innerHTML += element
    });
}
//Metodo POST
const postadminLugar = async (event) => {
    event.preventDefault();
    const nombre = document.getElementById('nombre').value;
    const tipo = document.getElementById('tipo').value;
    const token = localStorage.getItem('token')

    if (nombre == "" || tipo == "") {
        mensajeAlert('warning', 'Hay campos vacíos, completelos para guardar los datos.', '', false, 2800)
        return
    }

    let data = { nombre, tipo }

    let response = await fetch(server + '/post/postadminLugar', {
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
    document.getElementById('nombre').value = "";
    document.getElementById('tipo').value = "";
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
//Delete
const deteleLugar = async (id_L) => {
    const token = localStorage.getItem('token')
    const response = await fetch(server + `/delete/adminLugar/${id_L}`, {
        method: 'DELETE',
        headers: {
            'Authorization': `Bearer ${token}`
        },
        mode: 'cors'
    })
    const dataResponse = await response.json()
    if (dataResponse.status == false) {
        mensajeAlert('error', dataResponse.info, 'Puede que este lugar tenga relación con otros trayectos', false, 3000)
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
//Mensaje Alerta
const mensajeAlert = (icon, title, text, showConfirmButton, timer) => {
    Swal.fire({
        icon,
        title,
        text,
        showConfirmButton,
        allowOutsideClick: false,
        timer
    })
}