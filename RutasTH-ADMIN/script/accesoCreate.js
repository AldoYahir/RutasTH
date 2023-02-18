//const server = "https://rutasth-api.herokuapp.com"
const server = 'localhost:5500'
//Esta función o "Metodo" es para crear una cuenta en el admin
const account = async (event) => {
    event.preventDefault();
    const nameCreate = document.getElementById('nameCreate').value;
    const passwordCreate = document.getElementById('passwordCreate').value;

    if (nameCreate == "" || passwordCreate == "") {
        //Mandamos un mensaje al fronted
        mensajeAlert('warning', 'Hay campos vacíos, completelos para ingresar.','','',2900)
        return
    }
    const data = { nameCreate, passwordCreate } //Creamos una constante que tiene dos objetos empaquetados

    const response = await fetch(server + '/post/createAccount/admin', {
        method: 'POST',
        mode: 'cors',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    })
    //vaciar campos
    document.getElementById('nameCreate').value = "";
    document.getElementById('passwordCreate').value = "";
    //Mandamos un mensaje al fronted
    Swal.fire({
        icon: 'success',
        title: 'Su cuenta ha sido creada con éxito, inicie sesíon para empezar.',
        text: 'Confirme para continuar.',
        showDenyButton: false,
        showCancelButton: false,
        confirmButtonText: `¡Entendido!`,
        allowOutsideClick: false
    }).then((result) => {
        /* Read more about isConfirmed, isDenied below */
        if (result.isConfirmed) {
            document.location.href = "accesoLogin.html" //Aquí abrimos un archivo en html
        }
    })
}
//Mensaje Alerta
const mensajeAlert = (icon, title, text, showConfirmButton, timer) =>{
    Swal.fire({
        icon,
        title,
        text,
        showConfirmButton,
        allowOutsideClick: false,
        timer
    })
}