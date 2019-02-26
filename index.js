const express = require('express');
const path = require('path');
var bodyParser = require('body-parser');
const axios =require( 'axios');
const app = express();
const hop_time_ms=300;
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

app.post('/api/sendPost', async (req, res, next) =>{
    let {mock_sleep,no_of_request,url,mode,max_wait}=req.body;
    res.setHeader('Content-Type', 'text/plain')
    if(url==null){
        res.json({"code":"11","desc":"no-url"});   
    }
    if(mode==='fanout'){        
        await reqParseAndSendFanOut(req,res)       
    }else 
        await proxy(req,res);
    next();
   
})

app.get('/api/receive', sleep, (req,res) => {    
    
     reqParseAndCallOutGet(req,res)

     
});


async function reqParseAndSendFanOut(req,res){
    console.log("reqParseAndSendFanOut body ",req.body);    
    let {mock_sleep,url,max_wait}=req.body;
    mock_sleep=mock_sleep||0;
    const timeout=parseInt(max_wait)||5000
        
    return new Promise((solve,reject)=>{
        
        Promise
        .all(url.split(",")
            .map(u=>{
                
                let option={params:{mock_sleep}  ,timeout: timeout}
                console.log("option ",option)
                return new Promise((reso2,rej2)=>{                                      
                    axios.get(u,option)
                        .then(resFromServer=>{                   
                            reso2({url:u,status:resFromServer.status})
                        })
                        .catch(function (error) {
                            console.log(error)
                            reso2({url:u,error:error.message});
                        })
                })
            })
        )
        .catch(function (error) {
            res.json(error)
            console.log(error)
            solve()
        })
        .then(promiseResult=>{
            res.json(promiseResult)
             
            solve()
        })
        

    }) 
    .catch(function (error) {
        console.log(error)
        res.json({error:error})
        
    })
        

}

// /api/receive?mock_sleep=0
// headerKey=headerValue

// read input param and forward to next
// read header with x and forward to next

async function reqParseAndCallOutGet(req,res){
    console.log("reqParseAndCallOutGet",req.query)
    const timeout=parseInt(req.query.max_wait)||5000
    return new Promise((solve,reject)=>{
        console.log(req.body);
    //res.json({"code":"0","desc":"success"});   
    try {        
        
         let  url=req.query.url;
         let  mock_sleep=req.query.mock_sleep;
 
         //last of chain
        if(!url ||url.trim().length==0){
            res.json({ 
            //    headers: req.headers,
                hostname:  os.hostname()} );
            solve()
            return;
        }
        let url1=url.split(",")[0];
        
        urlarr=url.split(",")
        urlarr.shift()
        let nextUrl=urlarr.join()
   
        
        let option={params:{mock_sleep,url:nextUrl,max_wait:next_hop_timeout_ms(timeout)} ,timeout: timeout }
        console.log("option ",option)

       
        
        axios.get(url1,option)
        .then(resFromServer=>{
            res.json({              
                'hostname' :os.hostname(),
                upStreamStatus: resFromServer.status,
                upStreamData:  resFromServer.data
            })
            solve()
        })
        .catch(error=>{
            res.json({              
                'hostname' :os.hostname(),
                error: error.message
                
            })
            solve()
        })
       
        
        } catch (e) {
            //this will eventually be handled by your error handling middleware
            console.log(e)
            reject(e) 
        }
    } )
}

async function proxy(req,res){
    return new Promise((solve,reject)=>{
        console.log("proxy body",req.body);
    //res.json({"code":"0","desc":"success"});   
    try {        
        let {mock_sleep,no_of_request,url,mode,max_wait}=req.body;
        let timeout=parseInt(max_wait||'5000')
        no_of_request=parseInt(no_of_request)||1
        mode=mode||'chain'

        if(!url ||url.trim().length==0){
            res.json({'req.query':req.query,"host": os.hostname()+""});
            solve()
            return;
        }
        let url1=url.split(",")[0];
        
        urlarr=url.split(",")
        urlarr.shift()
        let nextUrl=urlarr.join()
         
        let option={params:{mock_sleep,url:nextUrl,mode,max_wait:next_hop_timeout_ms(timeout)},timeout}
   
        if(req.body.headerKey!=null){
            option.headers={[req.body.headerKey]:req.body.headerValue}
        }
        

        ret=[]
        for (let index = 0; index < no_of_request; index++) {
            
            axios.get(url1,option)

            .then(resFromServer=>{
                ret.push({
                    status:resFromServer.status,
                    // headers: resFromServer.headers,
                    body:  resFromServer.data
    
                })
            })
            .catch(error=>{
                ret.push({
                    error:error.message,
                  
    
                })
            })            
        }
        clear=setInterval((ret)=>{
            console.log(ret.length)
            if(ret.length==no_of_request){
                
                res.end( JSON.stringify(ret)  );
                clearInterval(clear);
                solve()
            }

        },1000,ret)
         //  console.log(resFromServer.request)
          //    console.log( ret);
           
            
            // res.write(resFromServer.status+"");
            // res.write(resFromServer.statusText);
            
        
        } catch (e) {
            //this will eventually be handled by your error handling middleware
            console.log(e)
            reject(e) 
        }
    } )
}


// Handles any requests that don't match the ones above
app.get('*', (req,res) =>{
    res.sendFile(path.join(__dirname+'/client/build/index.html'));
});

const port = process.env.PORT || 5000;
app.listen(port);

console.log('App is listening on port ' + port);


function next_hop_timeout_ms(current_hop_timeout_ms){
    let next_hop_timeout_ms=current_hop_timeout_ms-hop_time_ms;
    if(next_hop_timeout_ms<=0) return 100;
    return next_hop_timeout_ms
}