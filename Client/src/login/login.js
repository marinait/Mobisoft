import React, { Component } from "react";
import { Button, FormControl } from "react-bootstrap";
import {authenticationService} from '../services/authenticationService';
import "./login.css";

export default class Login extends Component {
  constructor(props) {
    super(props);

    this.state = {
      username: "test",
      password: "test",
      errorMessage: ""
    };
  }

  validateForm() {
    return this.state.username.length > 0 && this.state.password.length > 0;
  }

  handleChange = event => {
    this.setState({
      [event.target.id]: event.target.value
    });
  }

  handleSubmit = event => {
    event.preventDefault();
    authenticationService.login(this.state.username, this.state.password).then((result)=>{
        console.log(result);  
        this.setState({errorMessage:""});
    })
    .catch(err =>{
      this.setState({errorMessage:"User/password not found"});
    });
  }

  render() {
    return (
      <div className="Login">
        <form onSubmit={this.handleSubmit}>
          <div className="form-group">
              <div className="form-group">Username</div><div>Password</div>  
          </div>    
          <div className="form-group">
              <FormControl
              autoFocus
              id="username"  
              type="text"
              value={this.state.username}
              onChange={this.handleChange}
            /><div><FormControl
            value={this.state.password}
            onChange={this.handleChange}
            id="password"
            type="password"
            />
         </div>
          </div>    
          <div>
          <Button
            block
            bsSize="large"
            disabled={!this.validateForm()}
            type="submit"
          >
            Login
          </Button>
          </div>
          <div>{this.state.errorMessage}</div> 
        </form>
      </div>
    );
  }
}