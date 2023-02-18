//const server = "https://rutasth-api.herokuapp.com"
const server = 'localhost:5500'
window.onload = () => {
    const token = localStorage.getItem('token')
    if (!token) {
        document.location.href = "accesoLogin.html"
    }
    mostrarValoraciones()
}
//llamada de la BDD para mostrar todos las combis
const mostrarValoraciones = async () => {
    const response = await fetch(server + '/get/adminCombi/Valoracion')
    let data = await response.json()
    const template = await data.map(element =>
        (element.numeroC == "0") ? `<option value="${element.id_C}">Ruta S/N ${element.nombreC}</option>` :
            `<option value="${element.id_C}">Ruta ${element.numeroC} ${element.nombreC}</option>`
    )
    let reference = document.getElementById('adminCombiValoracion')
    template.forEach(element => {
        reference.innerHTML += element
    });
}
//Eliminara un comentario con respecto al ID que extrae el boton de eliminar. es la accion anterior de esta
const deleteComentario = async (id_CP) => {
    const token = localStorage.getItem('token')
    const response = await fetch(server + `/delete/comentariosAdmin/${id_CP}`, {
        method: 'DELETE',
        headers: {
            'Authorization': `Bearer ${token}`
        },
        mode: 'cors'
    })
    const dataResponse = await response.json()
    if (dataResponse.status) {
        mensajeAlerta('success', '¡Comentario eliminado!')
    } else {
        mensajeAlerta('error', 'El comentario no se elimino.')
    }

}
//Filtro para hacer el OnChange
const filtraComent = async (event) => {
    const idRuta = document.getElementById('adminCombiValoracion').value; //extraccion del ID de la combi

    const contenedor = document.getElementById('divComents')
    let reference = document.getElementById('lisComents')
    const element = document.getElementById('caja-coment')
    reference.remove(element)
    const newComent = document.createElement('div')
    newComent.setAttribute('id', 'lisComents')
    newComent.setAttribute('class', 'col-12 col-lg-12')
    contenedor.appendChild(newComent)
    const response = await fetch(server + `/get/comentByID/${idRuta}`)
    let data = await response.json()
    if (!data.length) {
        newComent.innerHTML = "<p class='aviso'>No existen comentarios aún.</p>"
    } else {
        const template = await data.map(result =>
            `<div id="caja-coment" class="caja-coment">
            <div class="lisComents_name">${result.nombre_per}</div>
            <div class="btn-eliminar">
            <button class="eliminar" onclick='deleteComentario(${result.id_CP})'><i class="bi bi-x-lg"></i></button>
            </div>
            </div>
            <div><p class="comentarios">${result.comentario}</p></div><hr>`
        )
        template.forEach(element => {
            newComent.innerHTML += element
        })
    }
}
//MensajeAlert
const mensajeAlerta = (icon, title) => {
    //Mandamos un mensaje al fronted
    Swal.fire({
        icon,
        title,
        text: 'Confirme para continuar.',
        showDenyButton: false,
        showCancelButton: false,
        confirmButtonText: `¡Entendido!`,
        allowOutsideClick: false
        //denyButtonText: `Don't save`,
    }).then((result) => {
        //* Read more about isConfirmed, isDenied below
        if (result.isConfirmed) {
            location.reload()
        }
    })
}