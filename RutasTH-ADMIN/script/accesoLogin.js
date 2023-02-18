//const server = "https://rutasth-api.herokuapp.com"
const server = 'localhost:5500'
//Esta función es para loguear una cuenta en el admin
const accountLogin = async (event) => {
    event.preventDefault();
    const nameLogin = document.getElementById('nameLogin').value;
    const password = document.getElementById('password').value;

    if (nameLogin == "" || password == "") {
        //Mandamos un mensaje al fronted
        mensajeAlert('warning', 'Hay campos vacíos, completelos para ingresar.', '', false, 2800)
        return
    }
    const data = { nameLogin, password } //Creamos una constante que tiene dos objetos empaquetados

    const response = await fetch(server + '/post/loginAccount/admin', {
        method: 'POST',
        mode: 'cors',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    })
    const dataAPI = await response.json()
    if (dataAPI.info == false) {
        //Mandamos un mensaje al fronted
        mensajeAlert('error', '¡Datos incorrectos!', 'Intentelo nuevamente', false, 2900)
        //vaciar campos
        document.getElementById('nameLogin').value = "";
        document.getElementById('password').value = "";
        return
    }
    //Lo que hace localStorage es almacenar datos en el navegador, se ya ingresaste y refrescas la página ya no te pedirá que ingreses de nuevo
    localStorage.setItem('token', dataAPI.token)
    //vaciar campos
    document.getElementById('nameLogin').value = "";
    document.getElementById('password').value = "";
    //Mandamos un mensaje al fronted
    Swal.fire({
        icon: 'success',
        title: 'Logueo exitoso.',
        text: 'Confirme para continuar.',
        showDenyButton: false,
        showCancelButton: false,
        confirmButtonText: `¡Entendido!`,
        //denyButtonText: `Don't save`,
    }).then((result) => {
        //Read more about isConfirmed, isDenied below
        if (result.isConfirmed) {
            document.location.href = "bienvenida.html" //Aquí abrimos un archivo en html
        }
    })
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