$('#mostrar-nav').on('click', function () {
    $('nav').toggleClass('mostrar');
})

//Esta funcion onclick borrará el token "key" del logeo, en pocas palabras cierra sesión
const closeSesion = () => {
    localStorage.removeItem('token') //Ocuparemos remove para quitar/eliminar el token
    document.location.href = "accesoLogin.html" //lo redirigimos al login para logearse
}