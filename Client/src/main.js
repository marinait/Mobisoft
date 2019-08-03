import React, { Component } from "react";
import "./main.css";
import Login from "./login/login";
import Logout from "./login/logout";
import Products from "./products/products";
import Twofa from "./login/twofa";
import { authenticationService } from "./services/authenticationService";

export default class Main extends Component {
  constructor(props) {
    super(props);

    this.state = {
      currentUser: null
    };
  }

  componentDidMount() {
      //we have SPA which we manage via this.state.currentUser
      //it's the user updated after login
    authenticationService.currentUser.subscribe(x =>
      this.setState({ currentUser: x })
    );
    //if we have token (in localstorage) but it is not valid (outdated) then log out 
    authenticationService.testToken();
  }

  render() {
    return (
      <div>
        {this.state.currentUser ? (
          this.state.currentUser.verified ? (
            [<Products key="1" />, <Logout key="2" />]
          ) : (
            [<Twofa key="1" />, <Logout key="2" />]
          )
        ) : (
          <Login />
        )}
      </div>
    );
  }
}
