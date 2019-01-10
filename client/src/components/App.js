import React from 'react';
import axios from 'axios';
export default class App extends React.Component {

    constructor(props){
        super(props);
        console.log("props:");
        console.log(props);
        this.state={url:props.url,headerKey:null,
            headerValue:null,response:'',
            mock_sleep:0,no_of_request:1
        }   ;
        
    }
    
    onChange=(e)=>{
        console.log(e.target);
        this.setState({[e.target.name]:e.target.value})

    }

    onSubmit=(e)=>{
        e.preventDefault();
        const{url,headerKey,headerValue,mock_sleep,no_of_request}=this.state;
        console.log('url:'+url)
        console.log({url,headerKey,headerValue,mock_sleep,no_of_request})

        axios.post('/api/sendPost',{url,headerKey,headerValue,mock_sleep,no_of_request})
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
                    <input type="text" name="url" placeholder="URL" value={this.state.url} onChange={this.onChange}/>
                </div>
                
                <div className="two fields">
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
        </div>

    )}
}