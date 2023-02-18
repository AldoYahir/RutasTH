//const server = "https://rutasth-api.herokuapp.com"
const server = 'localhost:5500'
window.onload = () => {
    const token = localStorage.getItem('token')
    if (!token) {
        document.location.href = "accesoLogin.html"
    }
    mostrarLugarOrigen()
    mostrarLugarDestino()
    mostrarCombi()
    mostrarTodo()
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
//llamada de la BDD para mostrar todos los lugares
const mostrarLugarOrigen = async () => {
    const response = await fetch(server + '/get/adminLugar/Origen')
    let data = await response.json()
    const template = await data.map(element =>
        `<option value="${element.id_L}">${element.nombre}</option>`
    );
    let reference = document.getElementById('adminLugarOrigen')
    template.forEach(element => {
        reference.innerHTML += element
    });
}
//llamada de la BDD para mostrar todos los lugares
const mostrarLugarDestino = async () => {
    const response = await fetch(server + '/get/adminLugar/Destino')
    let data = await response.json()
    const template = await data.map(element =>
        `<option value="${element.id_L}">${element.nombre}</option>`
    );
    let reference = document.getElementById('adminLugarDestino')
    template.forEach(element => {
        reference.innerHTML += element
    });
}
//llamada de la BDD para mostrar todas las combis
const mostrarCombi = async () => {
    const response = await fetch(server + '/get/adminCombi/Trayecto')
    let data = await response.json()
    const template = await data.map(element =>
        (element.numeroC == "0") ? `<option value="${element.id_C}">Ruta S/N ${element.nombreC}</option>` :
            `<option value="${element.id_C}">Ruta ${element.numeroC} ${element.nombreC}</option>`
    );
    let reference = document.getElementById('adminCombiTrayecto')
    template.forEach(element => {
        reference.innerHTML += element
    });
}
//Metodo POST
const postadminTrayecto = async (event) => {
    event.preventDefault();
    const id_origen = document.getElementById('adminLugarOrigen').value;
    const id_destino = document.getElementById('adminLugarDestino').value;
    const id_combi = document.getElementById('adminCombiTrayecto').value;
    const token = localStorage.getItem('token')

    if (id_origen == "" || id_destino == "" || id_combi == "") {
        //Mandamos un mensaje al fronted
        mensajeAlert('warning', 'Hay campos vacíos, completelos para enviar el comentario.', '', false, 2900)
        return
    }

    let data = { id_origen, id_destino, id_combi }

    let response = await fetch(server + '/post/adminTrayecto', {
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
    document.getElementById('adminLugarOrigen').value = "";
    document.getElementById('adminLugarDestino').value = "";
    document.getElementById('adminCombiTrayecto').value = "";
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
//llamada de la BDD mostrando los id de relacion con los lugares y las combis
const mostrarTodo = async () => {
    const response = await fetch(server + '/get/adminIDtrayecto/all')
    let data = await response.json()
    const template = await data.map(element =>
        (element.numC == "0") ?
            `<tr>
        <th scope="row">S/N</th>
        <td>${element.nombreC}</td>
        <td>${element.origen}</td>
        <td>${element.destino}</td>
        <td><button class="eliminar" onclick='deleteTrayectoria(${element.id})'><i class="bi bi-x-lg"></i></button></td>
        </tr>`
            :
            `<tr>
        <th scope="row">${element.numC}</th>
        <td>${element.nombreC}</td>
        <td>${element.origen}</td>
        <td>${element.destino}</td>
        <td><button class="eliminar" onclick='deleteTrayectoria(${element.id})'><i class="bi bi-x-lg"></i></button></td>
        </tr>`
    );
    let reference = document.getElementById('adminIDtrayecto')
    template.forEach(element => {
        reference.innerHTML += element
    });
}
//DELETE
const deleteTrayectoria = async (id) => {
    const token = localStorage.getItem('token')
    const response = await fetch(server + `/delete/adminTrayecto/${id}`, {
        method: 'DELETE',
        headers: {
            'Authorization': `Bearer ${token}`
        },
        mode: 'cors'
    })
    const dataResponse = await response.json()
    if (dataResponse.status == false) {
        mensajeAlert('error', dataResponse.info, 'Este trayecto no se puede eliminar por cuestión de relación con otros trayectos', false, 3800)
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