import { BehaviorSubject } from 'rxjs';

//import config from 'config';

const currentUserSubject = new BehaviorSubject(JSON.parse(localStorage.getItem('currentUser')));

export const authenticationService = {
    login,
    logout,
    testToken,
    twofastep1,
    twofastep2,
    currentUser: currentUserSubject.asObservable(),
    get currentUserValue () { return currentUserSubject.value }
};

function getAuthorizedPOSTRequestOptions(){
    return {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 
                   'Authorization': 'Bearer ' +  currentUserSubject.value.token},
        body: ''            
    };
}
function twofastep1(phone){
    let requestOptions = getAuthorizedPOSTRequestOptions();
    requestOptions.body = JSON.stringify({ phone });

    return fetch(`http://localhost:8003/api/twofastep1`, requestOptions)

    .then(response => {
        if (response.ok) {
            return response.json();
    }
  });
}

function testToken(){
    if (currentUserSubject.value)
    {
        let requestOptions = getAuthorizedPOSTRequestOptions();
        return fetch(`http://localhost:8003/api/testToken`, requestOptions)

        .then(response => {
            if (!response.ok) {
                logout();    
        }
        }).catch(()=>{
            logout();
        });
    }
}

function twofastep2(id, twofaid, code){
    let requestOptions = getAuthorizedPOSTRequestOptions();
    requestOptions.body = JSON.stringify({ id, twofaid, code });

    return fetch(`http://localhost:8003/api/twofastep2`, requestOptions)

    .then(response => {
        if (response.ok) {
            return response.json().then(json => {
                console.log(json);
                if (json.status === 0) //verified success
                {
                    //update verified
                    var user = currentUserSubject.value;
                    user.verified = true;
                    localStorage.setItem('currentUser', JSON.stringify(user));
                    currentUserSubject.next(user);
                }
                return json;   
                
        });
    }
  });
}


function login(username, password) {
    const requestOptions = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
    };

    return fetch(`http://localhost:8003/api/login`, requestOptions)

        .then(handleResponse)
        .then(user => {
            // store user details and jwt token in local storage to keep user logged in between page refreshes
            localStorage.setItem('currentUser', JSON.stringify(user));
            currentUserSubject.next(user);

            return user;
        });
        
}

function handleResponse(response) {
    //console.log(response.text());
    return response.text().then(text => {
        console.log(text);
        console.log(response.ok);
        const data = text && JSON.parse(text);
        //free 
        if (!response.ok) {
            if ([401, 403].indexOf(response.status) !== -1) {
                // auto logout if 401 Unauthorized or 403 Forbidden response returned from api
                authenticationService.logout();
                //location.reload(true);
            }

            const error = (data && data.message) || response.statusText;
            return Promise.reject(error);
        }
        if (data.result)
            return data.result;
        else
            return Promise.reject({status:-1})
    });
}

function logout() {
    // remove user from local storage to log user out
    localStorage.removeItem('currentUser');
    currentUserSubject.next(null);
}
