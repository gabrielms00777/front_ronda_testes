const login_button = document.getElementById("login")

window.addEventListener('DOMContentLoaded', async () => {
    const tokenData = await JSON.parse(localStorage.getItem('token'))
    if (tokenData.token){
        login_button.textContent = "Dashboard"
        login_button.href = "dashboard.html"
    }
})
