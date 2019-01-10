
const axios =require( 'axios');
axios.get("https://www.google.com",{headers:{"h":"v"}})
    .then((response)=>{
        console.log(response.data);
        console.log(response.status);
        console.log(response.statusText);
        console.log(response.headers);
        console.log(response.config);
        });