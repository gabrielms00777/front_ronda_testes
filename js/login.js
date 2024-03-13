const form = document.querySelector("form")
const spinner = document.getElementById('spinner')
const BASE_URL = 'https://api.ronda.gcmsoftware.com.br/api'
    
form.addEventListener('submit', async (e) => {
    e.preventDefault()
    spinner.classList.remove('hidden')
    
    const email = e.target.email.value
    const password = e.target.password.value

    try {
        const response = await fetch(`${BASE_URL}/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json', 
                'Accept': 'application/json',
            },
            body: JSON.stringify({ email, password })
        });
    
        if (!response.ok) {
            throw new Error(`API request failed with status ${response.status}`);
        }
    
        const {name, token} = await response.json();

        await localStorage.setItem('token', JSON.stringify({name, token, email}))

        window.location.href = 'dashboard.html'
        spinner.classList.add('hidden')
    
        } catch (error) {
        console.error('Error:', error.message); 
        alert('Login falhou, tente novamente.');
        spinner.classList.add('hidden')
    }

})
