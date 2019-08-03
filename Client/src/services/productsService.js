import { authenticationService } from "./authenticationService";
import {config} from '../config';

export const productsService = {
  getAllProducts,
  getBasket,
  clearBasket,
  addToBasket
};

function getAuthorizedPOSTRequestOptions() {
  return {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer " + authenticationService.currentUserValue.token
    },
    body: ""
  };
}
function getAllProducts() {
  let requestOptions = getAuthorizedPOSTRequestOptions();

  return fetch(`${config.serverUrl}/api/getallproducts`, requestOptions)
    .then(response => {
      if (response.ok) {
        return response.json();
      }
    })
    .catch(error => {
      console.log(error);
    });
}

function getBasket(userId) {
  let requestOptions = getAuthorizedPOSTRequestOptions();
  requestOptions.body = JSON.stringify({ userId });
  return fetch(`${config.serverUrl}/api/getBasketByUserId`, requestOptions)
    .then(response => {
      if (response.ok) {
        return response.json();
      }
    })
    .catch(error => {
      console.log(error);
    });
}

function clearBasket(userId) {
  let requestOptions = getAuthorizedPOSTRequestOptions();
  requestOptions.body = JSON.stringify({ userId });
  return fetch(
    `${config.serverUrl}/api/clearBasketByUserId`,
    requestOptions
  ).then(response => {
    if (response.ok) {
      return response.json();
    }
  });
}

function addToBasket(userId, productId) {
  let requestOptions = getAuthorizedPOSTRequestOptions();
  requestOptions.body = JSON.stringify({ userId, productId });
  return fetch(`${config.serverUrl}/api/addToBasket`, requestOptions).then(
    response => {
      if (response.ok) {
        return response.json();
      }
    }
  );
}
