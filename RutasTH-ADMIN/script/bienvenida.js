window.onload = () => {
    const token = localStorage.getItem('token')
    if (!token) {
        document.location.href = "accesoLogin.html"
    }
}
