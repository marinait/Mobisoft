import React, { Component } from "react";
import {authenticationService} from '../services/authenticationService';

export default class Logout extends Component {
    logout = () =>{
        authenticationService.logout();
    }
    render() {
    return (
      <form onSubmit={this.Logout}>
           <div><button onClick={this.logout}>Logout</button></div>
      </form>  
    )
}
}