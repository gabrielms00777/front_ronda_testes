const form = document.querySelector("form")
const spinner = document.getElementById('spinner')
    
form.addEventListener('submit', async (e) => {
    e.preventDefault()
    spinner.classList.remove('hidden')
    
    const email = e.target.email.value
    const password = e.target.password.value

    try {
        const response = await fetch('http://api-ronda.test/api/login', {
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

        // console.log(data); 
        window.location.href = 'dashboard.html'
        spinner.classList.add('hidden')
    
        } catch (error) {
        console.error('Error:', error.message); // Log error for debugging
        alert('Login failed, please try again later.');
        spinner.classList.add('hidden')
    }

})
