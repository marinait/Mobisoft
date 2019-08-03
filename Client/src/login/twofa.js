import React, { Component } from "react";
import {authenticationService} from '../services/authenticationService';

export default class Twofa extends Component {
    constructor(props) {
        super(props);
    
        this.state = {
            code: "",
            error: "",
            authId: "",
            step: 1   
          };
    }

   
    SendSMS = event => {
        event.preventDefault();
        //this.setState({error: "", authId : "errrer", step:2});
        authenticationService.twofastep1(authenticationService.currentUserValue.phone).then((result)=>{
            console.log("sendsms result");
            console.log(result);
            if (result.error)
            {
                this.setState({error : "Verification failed"});
            }
            else{
                console.log("update");
                this.setState({error: "", authId : result.id, step:2});
            }
            console.log(this.state.step);
        });
    }

    VerifyCode = () =>{
        authenticationService.twofastep2(authenticationService.currentUserValue.userId, this.state.authId, this.state.code).then((result)=>{
            if (!result || result.error)
            {
                this.setState({error : "Verification failed. Please log out and enter with another credentials or update your phone in user details."});
            }
            else{
                console.log(result);
            }
        });
    }

    handleChange = event => {
        this.setState({
          code : event.target.value
        });
      }

    render() {
    return (
      <form onSubmit={this.SendSMS}>
          <div>{this.state.step}</div>
          {this.state.step === 1 ? 
             (<div>
                 <div>Please verify your email. </div>
                 <div>We will send SMS message to your phone ****  {authenticationService.currentUserValue.phone.slice(-3)}  stored in our system.</div>
                 <div><button type='submit'>Send SMS</button></div>
              </div>)
             :( <div>
                <div>Please enter code sent to your phone.</div>
                <div><input type='text' value={this.state.code} onChange={this.handleChange}></input></div>
                <div><button type='button' onClick={this.VerifyCode}>Send Code</button></div>
                </div>)
           }
      </form>  
    )
}
}