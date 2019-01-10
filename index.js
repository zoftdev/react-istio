const express = require('express');
const path = require('path');
var bodyParser = require('body-parser');
const axios =require( 'axios');
const app = express();
os=require('os');
// Serve the static files from the React app
app.use(express.static(path.join(__dirname, 'client/build')));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true })); // support encoded bodies
// An api endpoint that returns a short list of items
  
sleep=async (req,res,next)=>{
    let timeout=parseInt( req.query.mock_sleep)||0
    setTimeout(next,timeout)
     
}

app.get('/api/receive', sleep, (req,res) => {
    res.json({'req.query':req.query,"host": os.hostname+""});
   // setTimeout(next,timeout)
     
     
});
app.post('/api/sendPost', async (req, res, next) =>{
    console.log(req.body);
    //res.json({"code":"0","desc":"success"});   
    try {        
        const {mock_sleep,no_of_request}=req.body;
        let option={params:{mock_sleep}}
   
        if(req.body.headerKey!=null){
            option.headers={[req.body.headerKey]:req.body.headerValue}
        }
        res.setHeader('Content-Type', 'text/plain')

        ret=[]
        for (let index = 0; index < no_of_request; index++) {
            
            axios.get(req.body.url,option).then(resFromServer=>{
                ret.push({
                    status:resFromServer.status,
                    headers: resFromServer.headers,
                    body:  resFromServer.data
    
                })
            }
            )
        }
        clear=setInterval((ret)=>{
            console.log(ret.length)
            if(ret.length==no_of_request){
                
                res.end( JSON.stringify(ret)  );
                clearInterval(clear);
                next()
            }

        },1000,ret)
         //  console.log(resFromServer.request)
          //    console.log( ret);
           
            
            // res.write(resFromServer.status+"");
            // res.write(resFromServer.statusText);
            
        
      } catch (e) {
        //this will eventually be handled by your error handling middleware
        console.log(e)
        next(e) 
      }
   
})
// Handles any requests that don't match the ones above
app.get('*', (req,res) =>{
    res.sendFile(path.join(__dirname+'/client/build/index.html'));
});

const port = process.env.PORT || 5000;
app.listen(port);

console.log('App is listening on port ' + port);