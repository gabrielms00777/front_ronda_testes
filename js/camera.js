const video = document.querySelector('#video');
const spinner = document.querySelector('#spinner');
video.width = window.innerWidth
video.height = window.innerHeight
let lat = null;
let long = null;

function startVideo() {
  // startLoading()
    const constraints = {
        video: {
          width: {
            ideal: window.innerWidth,
            max: window.innerWidth,
          },
          height: {
            ideal: window.innerHeight,
            max: window.innerHeight,
          },
        },
      };
    navigator.mediaDevices.getUserMedia(constraints)
      .then(stream => video.srcObject = stream)
      .catch(console.error);
    // stopLoading()
}

window.addEventListener('DOMContentLoaded', startVideo);

document.querySelector('#send').addEventListener('click', async () => {
    // const canvas = document.querySelector('canvas');
    startLoading()
    const canvas = document.createElement('canvas');
    canvas.height = video.videoHeight;
    canvas.width = video.videoWidth;
    const context = canvas.getContext('2d');
    context.drawImage(video, 0, 0);
    nav(canvas.toDataURL())
});

async function saveLocal(latitude, longitude, timestamp, image){
  const id = String(Math.random())
  data = {
    id: id.split('.')[1],
    image,
    latitude,
    longitude,
    timestamp,
  }

  await localStorage.setItem(`image.${data.id}`,JSON.stringify(data))

  window.location.href = `./foto.html?id=${data.id}`
  stopLoading()
}


async function nav(file) {

    const success = async (pos)=>{
        let lat = pos.coords.latitude
        let long = pos.coords.longitude
        let timestamp = pos.timestamp
        // console.log(lat+ ' ' +long)
        // console.log(timestamp)

        saveLocal(lat, long, timestamp, file)
        // const formData = new FormData()
        // formData.append('image', file)
        // formData.append('latitude', lat)
        // formData.append('longitude', long)
  
        // const response = await fetch('http://api-ronda.test/api/camera-qr-post', {
        //     method: 'POST',
        //     headers: { 'Accept': 'application/json' },
        //     body: formData,
        // });
        
        // console.log(response)
        // const data = await response.json()
        // console.log(data)
        // alert("Foto enviada com sucesso!!!")
    }
    const err = (error)=>{
        console.log(error.message)
    }
    navigator.geolocation.getCurrentPosition(success, err,{enableHighAccuracy:true});
}

function startLoading(){
  spinner.classList.remove('hidden')
}
function stopLoading(){
  spinner.classList.add('hidden')
}