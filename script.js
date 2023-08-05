const ipAddress = document.getElementById('ip');
const getInfoAboutIpAddress = document.getElementById('get-started');

const ipURL = 'https://api.ipify.org?format=json';

async function fetchIp() {
    try {
        const response = await fetch(ipURL, {
            method : 'get'
        })
        const data = await response.json();

        ipAddress.innerText = data.ip;

        localStorage.setItem('userIpAddress',JSON.stringify(data));

    } catch (error) {
        console.log('Error:',error)
    }
}

getInfoAboutIpAddress.addEventListener('click', () => {
    window.location.href = '../information'
})

fetchIp();