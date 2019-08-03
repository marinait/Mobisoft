import React, { Component } from "react";
import "./products.css";
import { Button } from "react-bootstrap";
import { productsService } from "../services/productsService";
import { authenticationService } from "../services/authenticationService";

export default class Products extends Component {
  constructor(props) {
    super(props);

    this.products = [
      { Id: 1, Name: "product1" },
      { Id: 2, Name: "product2" },
      { Id: 3, Name: "product3" }
    ];
    this.state = {
      products: [],
      productsDictionary: {},
      currentProductId: 0,
      basket: [],
      message: "Please wait for slow DB"
    };
  }

  submitAdd = event => {
    event.preventDefault();
    productsService
      .addToBasket(
        authenticationService.currentUserValue.userId,
        this.state.currentProductId
      )
      .then(result => {
        var basket = this.state.basket;
        var itemexist = basket.find(elem => {
          return elem.Id === this.state.currentProductId;
        });
        if (itemexist) {
          itemexist.Count++;
        } else
          basket.push({
            Id: this.state.currentProductId,
            Name: this.state.productsDictionary[this.state.currentProductId],
            Count: 1
          });
        this.setState({ basket: basket });
      });
  };

  submitClear = event => {
    event.preventDefault();
    productsService
      .clearBasket(authenticationService.currentUserValue.userId)
      .then(() => {
        this.setState({ basket: [] });
        this.setState({ statusMessage: "Basket is empty" });
      });
  };

  handleChange = event => {
    event.preventDefault();
    this.setState({ currentProductId: event.target.value });
  };

  componentDidMount = () => {
    productsService
      .getAllProducts()
      .then(result => {
        console.log(result);
        if (result && result.length > 0) {
          var productDic = {};
          result.map(x => (
            productDic[x.Id] = x.Name));
          this.setState({ products: result, currentProductId: result[0].Id, productsDictionary: productDic });
        }
        productsService.getBasket(authenticationService.currentUserValue.userId).then(result => {
          console.log(result);
          if (result && result.length > 0) 
          {
            var basket = this.state.basket;
            result.map((x) => (
              basket.push({
                Id: x.ProductId,
                Name: this.state.productsDictionary[x.ProductId],
                Count: x.Count
              })));
              this.setState({ basket: basket})
            }
            this.setState({ message: ""})
        });
      })
  };

  render() {
    return (
      <div>
        <span>{this.state.message}</span>
        <form onSubmit={this.submitAdd}>
          <div>
            <div>
              <select onChange={this.handleChange}>
                {this.state.products.map(x => (
                  <option key={x.Id} value={x.Id} name={x.Name}>
                    {x.Name}
                  </option>
                ))}
              </select>
            </div>
            <Button block bsSize="large" type="submit">
              Add product
            </Button>
            <Button
              className="right"
              block
              bsSize="large"
              onClick={this.submitClear}
            >
              Clear basket
            </Button>
            <div>
              Basket:{" "}
              {this.state.basket.length === 0
                ? "empty"
                : this.state.basket.length + " product(s)"}
            </div>
            <ul>
              {this.state.basket.map(x => (
                <li>{"name:" + x.Name + ", count:" + x.Count}</li>
              ))}
            </ul>
          </div>
        </form>
      </div>
    );
  }
}
