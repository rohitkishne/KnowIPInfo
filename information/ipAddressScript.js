const ipAddress = document.getElementById('ip');
const basicInfo = document.getElementById('basic-info');
const googleMap = document.getElementById('google-location');
const moreInfoAboutIP = document.getElementById('more-info');
const postOffices = document.getElementById('post-offices');
const searchingThePostOffice = document.getElementById('search-post-office');

// first get the ip of user from local storage
const getIp = JSON.parse(localStorage.getItem('userIpAddress'))
console.log(getIp.ip)
//display ip address to the UI
ipAddress.innerText = getIp.ip
const hostname = location.hostname;


let postOfficeList;

//URL for accessing the data
const ipInfoURL = `https://ipinfo.io/${getIp.ip}?token=329ff967fad4c9`

//fetch the information of the ip address
async function fetchIpInfo() {
    try {
        const response = await fetch(ipInfoURL, {
            method : 'get'
        })

        const data = await response.json();

        console.log(data)

        rederIpbasicInfo(data);

    } catch (error) {
        console.log('Error:',error)
    }
}

// ************************ Fetching the IP Address information *************************
// city: "Indore"
// country: "IN"
// ip: "49.36.27.148"
// loc: "22.7179,75.8333"
// org: "AS55836 Reliance Jio Infocomm Limited"
// postal: "452002"
// region: "Madhya Pradesh"
// timezone: "Asia/Kolkata"


function rederIpbasicInfo(info) {
    basicInfo.innerHTML = ``;
    const location = info.loc.split(",");
    const lat = location[0] 
    const long = location[1] 
    basicInfo.innerHTML += `<div class="lat">Lat: ${lat}</div>
                            <div class="city">City: ${info.city}</div>
                            <div class="organisation">Organisation: ${info.org}</div>
                            <div class="long">Long: ${long}</div>
                            <div class="region">Region: ${info.region}</div>
                            <div class="hostname">Hostname: ${hostname}</div>`


    //get the current location as per the latitude and longitude
    const googleMapLocation = `<iframe src="https://maps.google.com/maps?q=${lat}, ${long}&z=15&output=embed" width="100%" height="600" frameborder="0" style="border:0"></iframe>`

    //when a user current will find and then display it on to UI
    googleMap.innerHTML = ` <div class="current-location">Your Current Location</div>
                             ${googleMapLocation}
                            `;

    // URL for accessing the post offices
    const postOffices = `https://api.postalpincode.in/pincode/${info.postal}`
    fetchPostOffice(postOffices);
    //find the data and time wrt to the timezone
    const timezone = info.timezone;
    let india_datetime = new Date().toLocaleString("en-US", {timeZone: `${timezone}`})


    setTimeout(() => {
        moreInfoAboutIP.innerHTML = ``;
        moreInfoAboutIP.innerHTML += ` <span>Time Zone: ${timezone}</span>
                                    <span>Date And Time: ${india_datetime}</span>
                                    <span>Pincode: ${info.postal}</span>
                                    <span>Message: ${postOfficeList[0].Message}</span>`
    }, 1000);

   


}


// ***************Fetching Post office object **********************
// Block: "Indore"
// BranchType: "Sub Post Office"
// Circle: "Madhya Pradesh"
// Country: "India"
// DeliveryStatus: "Delivery"
// Description: null
// District: "Indore"
// Division: "Indore City"
// Name: "Indore City-2"
// Pincode: "452002"
// Region: "Indore"
// State: "Madhya Pradesh"

//All the post office of that location store in the postOfficeinCity array
let postOfficeinCity;

async function fetchPostOffice(postOfficeData) {
    try {
        const response = await fetch(postOfficeData, {
            method : 'get'
        })

        postOfficeList = await response.json();

        console.log(postOfficeList)
        postOfficeinCity = postOfficeList[0].PostOffice;
        console.log(postOfficeinCity[0])
        renderPostOffice(postOfficeinCity);

    } catch (error) {
        console.log('Error:',error)
    }
}

// Render all the post office of location
function renderPostOffice(postOfficeArray) {
    postOffices.innerHTML = ``;
    postOfficeArray.forEach(post => {
        postOffices.innerHTML += `<div class="post-office-card">
                                    <span>Name: ${post.Name}</span>
                                    <span>Branch Type: ${post.BranchType}</span>
                                    <span>Delivery Status: ${post.DeliveryStatus}</span>
                                    <span>District: ${post.District}</span>
                                    <span>Division: ${post.Division}</span>
                                </div>`;
    });
}


// Implementation of searching functionality for post offices
searchingThePostOffice.addEventListener('keyup', () => {
    const optimisedSearchingFunction = findPostOffice(searchPostOffice, 500);
    optimisedSearchingFunction();
})

//optimise the searching by implementing the debouncing concept which search the keyword at some interval of time
const findPostOffice = (callback, delay) => {
    let timer;
    return function(...args) {
        if(timer) clearTimeout();
        timer = setTimeout(() => {
            callback(...args);
        }, delay);
    }
}


const searchPostOffice = () => {
    try {
        const postOfficeSearch = searchingThePostOffice.value;
        const filterPostOffice = search(postOfficeSearch, postOfficeinCity);
        console.log(filterPostOffice)
        renderPostOffice(filterPostOffice);
    } catch (error) {
        console.log("Error: ", error)
    }
}

//Search function which filter the result on the basis of name and branch office
function search(localPostOffice, allPostOffice) {
    return allPostOffice.filter(postDetail => {
        return postDetail.Name.toLowerCase().includes(localPostOffice.toLowerCase()) ||
                postDetail.BranchType.toLowerCase().includes(localPostOffice.toLowerCase());
    })
}


// call the fetch function for gather the information of IP Address
fetchIpInfo();