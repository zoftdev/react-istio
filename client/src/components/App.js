import React from 'react';
import axios from 'axios';
export default class App extends React.Component {

    constructor(props){
        super(props);
        console.log("props:");
        console.log(props);
        this.state={url:props.url,headerKey:null,
            headerValue:null,response:'',
           mock_sleep:0,no_of_request:1,
           max_wait:5000,mode:'chain'
        
        }   ;
        
    }
    
    onChange=(e)=>{
        console.log(e.target);
        this.setState({[e.target.name]:e.target.value})

    }

    onSubmit=(e)=>{
        e.preventDefault();
        this.setState({response:'Sending...'})
        const{url,headerKey,headerValue,mock_sleep,no_of_request,mode,max_wait}=this.state;
        console.log('url:'+url)
        console.log({url,headerKey,headerValue,mock_sleep,no_of_request})

        axios.post('/api/sendPost',{url,headerKey,headerValue,mock_sleep,no_of_request,mode,max_wait},{timeout:max_wait+300})
        .then((result)=>{
            console.log(result)
            this.setState({response:JSON.stringify( result.data)});
        }).catch(e=>{
            console.log("fail "+e)
            this.setState({response:e+"!"});
        });
    }

    render(){
        console.log("state:")
        console.log(this.state);

        return(
        <div className="ui container" onSubmit={this.onSubmit}>
            <form className="ui form">
                <div className="field">
                    <label>URL</label>
                    <input type="text" name="url" placeholder="URL" value={this.state.url}  onChange={this.onChange}/>
                </div>
                <div className="field">
                    <div className="ui radio checkbox">
                        <input type="radio" onChange={this.onChange}   name="mode"   tabIndex="0" value="chain" checked={this.state.mode === 'chain'} />
                        <label>Chain</label>
                    </div>
                </div>
                <div className="field">
                    <div className="ui radio checkbox">
                        <input type="radio" onChange={this.onChange}  name="mode"   tabIndex="1" value="fanout" checked={this.state.mode === 'fanout'} />
                        <label>FanOut</label>
                    </div>
                </div>
               
                {/* <div className="two fields"> */}
                <div className="hide">
                    <div className="field">
                        <label>Header</label>
                        <input type="text" name="headerKey" placeholder="header" onChange={this.onChange} />
                    </div>
                    <div className="field">
                        <label>Header Vale</label>
                        <input type="text" name="headerValue" placeholder="header value" onChange={this.onChange}/>

                    </div>
                </div>
                <div className="field">
                    <label>Connection Timeout(ms)  Each node will decrease 300ms (5000,4700,4300...)</label>
                    <input type="text" name="max_wait" placeholder="Wait wait time " value={this.state.max_wait} onChange={this.onChange}/>
                </div>
                
                <div className="field">
                    <label>Simulate Server process time(ms)</label>
                    <input type="text" name="mock_sleep" placeholder="mock_sleep" value={this.state.mock_sleep} onChange={this.onChange}/>
                </div>
                <div className="field">
                    <label>No. of request: Create multiple request to server</label>
                    <input type="text" name="no_of_request" placeholder="no_of_request" value={this.state.no_of_request} onChange={this.onChange}/>
                </div>
                <button className="ui button" type="submit">Submit</button>
            </form>
            <div>
                <h2>Result</h2>
                
            </div>
            <textarea value={this.state.response} readOnly={true} rows="20"  cols="80" />


            <div className="term">
            
            This Web application is owned and maintained by TRUE Corporation. 
The purposes of this Web application are to be the source and provider of various testing application regarding the companies.

Copyright in all the information, photos, texts, advertising media, docker images and other components on this Website, e.g., trademarks, logos, 
service marks and trade names contained in this Website, are owned by the TRUE Corporation and its affiliates. 
No part of these materials may be copied, modified, 
transmitted, distributed or disclosed in any way to public or for commercial purposes without prior written consent of the company and/or its affiliate, 
as the case may be.
            </div>
        </div>

    )}
}