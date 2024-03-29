const name_value = document.getElementById("name")
const email_value = document.getElementById("email")
const spinner = document.getElementById('spinner')
const locations = document.getElementById('locations')
const listStops = document.getElementById('list-stops')
const listRounds = document.getElementById('list-rounds')
const BASE_URL = 'https://api.ronda.gcmsoftware.com.br/api'

window.addEventListener('DOMContentLoaded', async ()=>{
    startLoading()

    await checkToken()

    await Promise.all([
        getStops(),
        getStopsCompleteds(),
    ])
 
    stopLoading()
})

document.querySelector('#logout').addEventListener('click', ()=>{
    logout()
})


async function getStopsCompleteds(){
    const {token} = await JSON.parse(localStorage.getItem('token'))
    const response = await fetch(`${BASE_URL}/stops`,{
        headers: {
            Authorization: `Bearer ${token}`,
        }
    })
    data = await response.json()
    console.log(data)
    data.forEach((item)=>{
        const listItem = document.createElement('li')
        listItem.classList = 'flex flex-col'
        const content = `
        <li class="flex items-center">
              <svg class="w-3.5 h-3.5 me-2 text-green-500 dark:text-green-400 flex-shrink-0" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5Zm3.707 8.207-4 4a1 1 0 0 1-1.414 0l-2-2a1 1 0 0 1 1.414-1.414L9 10.586l3.293-3.293a1 1 0 0 1 1.414 1.414Z"/>
              </svg>
              ${item.date_time}
          </li>
      `;
      listItem.innerHTML = content

      listStops.appendChild(listItem)
    })
    // return await response.json()
}

async function getStops(){
    const {token} = await JSON.parse(localStorage.getItem('token'))
    const response = await fetch(`${BASE_URL}/routes`,{
        headers: {
            Authorization: `Bearer ${token}`,
        }
    })
    data = await response.json()
    console.log(data)
    data.forEach((item)=>{
        const listItem = document.createElement('li')
        listItem.classList = 'flex flex-col'
        const content = `
        <div class="flex items-center">
          <svg class="w-3.5 h-3.5 me-2 text-green-500 dark:text-green-400 flex-shrink-0" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20">
            <path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5Zm3.707 8.207-4 4a1 1 0 0 1-1.414 0l-2-2a1 1 0 0 1 1.414-1.414L9 10.586l3.293-3.293a1 1 0 0 1 1.414 1.414Z"/>
          </svg>
          ${item.name}
        </div>
        <p>${item.description}</p>
      `;
      listItem.innerHTML = content

        listRounds.appendChild(listItem)
    })
    // return await response.json()
}

async function checkToken(){
    const tokenData = await JSON.parse(localStorage.getItem('token'))

    // const images = getImagesFromLocalStorage();
    console.log(tokenData);


    if (!tokenData || !tokenData.token) {
        await localStorage.setItem('token', '{}')
        window.location.href = 'login.html'
    }
    try {
        const res = await fetch(`${BASE_URL}/user`,{
            method:"GET",
            headers: {'Authorization': `Bearer ${tokenData.token}`}
        })
        console.log(res)
    } catch (error) {
        await localStorage.setItem('token', '{}')
        window.location.href = 'login.html'
    }



}

function getImagesFromLocalStorage() {
    const items = [];
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key.startsWith("image.")) {
        items.push(localStorage.getItem(key));
      }
    }
    return items;
  }

async function logout(){
    spinner.classList.remove('hidden')
    try {
        const tokenData = await JSON.parse(localStorage.getItem('token'))
        if (!tokenData || !tokenData.token) {
            await localStorage.setItem('token', '{}')
            window.location.href = 'login.html'
        }
        await fetch(`${BASE_URL}/logout`,{
            method:"DELETE",
            headers: {'Authorization': `Bearer ${tokenData.token}`}
        })
        
    } catch (error) {
        console.log(error)
    }finally{
        await localStorage.setItem('token', '{}')
        window.location.href = 'login.html'
        spinner.classList.add('hidden')
    }
}

function startLoading(){
    spinner.classList.remove('hidden')
}

function stopLoading(){
spinner.classList.add('hidden')
}