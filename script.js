/* Dom on Load */

document.addEventListener("DOMContentLoaded", (e) => {
    getIp();
});
/* Functions tools */
/* Print map */
const printMap = (node, lat, lng)=>{
    const map = new L.map(node).setView([lat, lng], 14);
    L.marker([lat, lng]).addTo(map);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            }).addTo(map);
}
/* Validate Ip */
const validateIP = (ip) => {
    const ipRegex = /((^\s*((([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])\.){3}([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5]))\s*$)|(^\s*((([0-9A-Fa-f]{1,4}:){7}([0-9A-Fa-f]{1,4}|:))|(([0-9A-Fa-f]{1,4}:){6}(:[0-9A-Fa-f]{1,4}|((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3})|:))|(([0-9A-Fa-f]{1,4}:){5}(((:[0-9A-Fa-f]{1,4}){1,2})|:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3})|:))|(([0-9A-Fa-f]{1,4}:){4}(((:[0-9A-Fa-f]{1,4}){1,3})|((:[0-9A-Fa-f]{1,4})?:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(([0-9A-Fa-f]{1,4}:){3}(((:[0-9A-Fa-f]{1,4}){1,4})|((:[0-9A-Fa-f]{1,4}){0,2}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(([0-9A-Fa-f]{1,4}:){2}(((:[0-9A-Fa-f]{1,4}){1,5})|((:[0-9A-Fa-f]{1,4}){0,3}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(([0-9A-Fa-f]{1,4}:){1}(((:[0-9A-Fa-f]{1,4}){1,6})|((:[0-9A-Fa-f]{1,4}){0,4}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(:(((:[0-9A-Fa-f]{1,4}){1,7})|((:[0-9A-Fa-f]{1,4}){0,5}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:)))(%.+)?\s*$))/g
    if(ipRegex.test(ip)) return true
    return false
}

/* Error UX INPUT */
const errorInput = () =>{
  
    let data =document.getElementById('ip').classList; 
    let repoClas = [];
  
    for (const iterator of data) {
        repoClas.push(iterator) 
    }
    if(repoClas.includes('error')) {
        console.log("Ip Invalida");
        return //document.getElementById('ip').classList.toggle('error') ; 
    } else{
        console.log("No tiene error");
        document.getElementById('ip').classList.add('error');
    }
}


/* Functions tools IP */

/* Getting Ip current */
let getIp = async (data)=>{
    await fetch('https://api.ipify.org?format=json')
    .then(results => results.json())
    .then(results =>{
       return getData(results.ip);
    } ) 
        //return data;
  }
/* Setting data ip into CARD */
const dataCard = (ip, city, region, timezone, isp) =>{

    document.getElementById('card-ip').setAttribute('attr-data', ip);
    document.getElementById('card-location').setAttribute('attr-data', city+" - "+region);//card-timezone
    document.getElementById('card-timezone').setAttribute('attr-data', timezone.slice(1));
    document.getElementById('card-isp').setAttribute('attr-data', isp);
}

/* Form action */
  document.getElementById('form').addEventListener('submit', (e)=>{
    e.preventDefault();
    let data = new FormData(e.target);
    let ip = null ;
//
    for (var key of data.values()) {
            ip = key;
    }
    validateIP(ip) ? getData(ip) :  errorInput();
});
   


/* Function center */
    const  getData = async (dataIp = null) =>{
        var api_key = "at_qxiMavRHNgcgav70MIvkhQDQbLZPW";
            ip = dataIp;
        await fetch(`https://geo.ipify.org/api/v1?apiKey=${api_key}&ipAddress=${dataIp}`, {
                }
            )
            .then( res=> res.json())                             
            .then(res=>{ 
                let data =document.getElementById('ip').classList; 
                let repoClas = [];
                for (const iterator of data) {
                    repoClas.push(iterator) 
                }
                if(repoClas.includes('error')) {
                    document.getElementById('ip').classList.remove('error') ; 
                }
                
                let node =document.getElementById('map').childNodes;
                if(node.length == 0 ){
                    const div = document.createElement('div');
                    div.id = "container-map";
                    dataCard(res.ip, res.location.city, res.location.region, res.location.timezone, res.isp);
                    document.getElementById('map').appendChild(div); 
                    printMap('container-map', res.location.lat, res.location.lng)
                }else{
                    document.getElementById('map').innerHTML="";
                    const div = document.createElement('div');
                    div.id = "container-map";
                    dataCard(res.ip, res.location.city, res.location.region, res.location.timezone, res.isp);
                    document.getElementById('map').appendChild(div); 
                    printMap('container-map', res.location.lat, res.location.lng)   
                    }                           
                })   
    }    

