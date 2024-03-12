const spinner = document.querySelector('#spinner');
const urlParams = new URLSearchParams(window.location.search);
const idParam = urlParams.get("id");
const canvasElement = document.querySelector('canvas');
let data = null

window.addEventListener('DOMContentLoaded', async ()=>{
    startLoading()

    data = await getItem()
    console.log(data)
    renderItem(data.image)


    stopLoading()
});

document.querySelector('#cancel').addEventListener('click', deleteItem)
document.querySelector('#send').addEventListener('click', async () => {
    startLoading()
    canvasElement.toBlob(async (blop)=>{
        var file = new File([blop], 'image.png');
        await sendServer(data, file);
        await localStorage.removeItem(`image.${idParam}`)
        window.location.href = './dashboard.html'
    });

    stopLoading()
})

async function sendServer(data, file){
    const token = await getToken()

    var data = new Date(data.timestamp);

    var ano = data.getFullYear();
    var mes = ('0' + (data.getMonth() + 1)).slice(-2);
    var dia = ('0' + data.getDate()).slice(-2);
    var hora = ('0' + data.getHours()).slice(-2);
    var minuto = ('0' + data.getMinutes()).slice(-2);
    var segundo = ('0' + data.getSeconds()).slice(-2);

    var data_formatada = ano + '-' + mes + '-' + dia + ' ' + hora + ':' + minuto + ':' + segundo;

    console.log(data_formatada); 

    const formData = new FormData()
    formData.append('photo', file)
    formData.append('latitude', data.latitude)
    formData.append('longitude', data.longitude)
    formData.append('date_time', data_formatada)

    try {
        const response = await fetch('http://api-ronda.test/api/route/store', {
            method: 'POST',
            headers: { 'Accept': 'application/json', 'Authorization': `Bearer ${token}` },
            body: formData,
        });
        
        const res = await response.json()
        console.log(res)
        alert("Foto enviada com sucesso!!!")
    } catch (error) {
        console.log(error)
    }
}

async function getToken(){
    const tokenData = await JSON.parse(localStorage.getItem('token'))

    if (!tokenData || !tokenData.token) {
        await localStorage.setItem('token', '{}')
        window.location.href = 'login.html'
    }
    return tokenData.token

}

async function deleteItem(){
    await localStorage.removeItem(`image.${idParam}`)
    window.location.href = './camera.html'
}

async function renderItem(base64){
    const context = canvasElement.getContext("2d");

    canvasElement.width = window.innerWidth
    canvasElement.height = window.innerHeight
    const image = new Image();
    image.src = base64;

    image.onload = function() {
        context.drawImage(image, 0, 0,image.width, image.height);
    }
}

async function getItem(){
    let infos = await localStorage.getItem(`image.${idParam}`)
    if(!infos) return window.location.href = './camera.html'
    // console.log(JSON.parse(infos))
    return JSON.parse(infos)
}

function startLoading(){
    spinner.classList.remove('hidden')
}
function stopLoading(){
    spinner.classList.add('hidden')
}