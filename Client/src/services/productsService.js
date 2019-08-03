import {authenticationService} from './authenticationService';

export const productsService = {
    getAllProducts,
    getBasket,
    clearBasket,
    addToBasket
};

function getAuthorizedPOSTRequestOptions(){
    return {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 
                   'Authorization': 'Bearer ' +  authenticationService.currentUserValue.token},
        body: ''            
    };
}
function getAllProducts(){
    let requestOptions = getAuthorizedPOSTRequestOptions();

    return fetch(`http://localhost:8003/api/getallproducts`, requestOptions)
   .then(response => {
        if (response.ok) {
            return response.json();
        }
    }).catch((error) =>{
        console.log(error);
    });

}

function getBasket(userId){
    let requestOptions = getAuthorizedPOSTRequestOptions();
    requestOptions.body = JSON.stringify({ userId });
    return fetch(`http://localhost:8003/api/getBasketByUserId`, requestOptions)
    .then(response => {
        if (response.ok) {
            return response.json();
        }
    }).catch((error) =>{
        console.log(error);
    });
}

function clearBasket(userId){
    let requestOptions = getAuthorizedPOSTRequestOptions();
    requestOptions.body = JSON.stringify({ userId });
    return fetch(`http://localhost:8003/api/clearBasketByUserId`, requestOptions)

    .then(response => {
        if (response.ok) {
            return response.json();
    }
  });
}

function addToBasket(userId, productId){
    let requestOptions = getAuthorizedPOSTRequestOptions();
    requestOptions.body = JSON.stringify({ userId, productId });
    return fetch(`http://localhost:8003/api/addToBasket`, requestOptions)

    .then(response => {
        if (response.ok) {
            return response.json();
    }
  });
}