//this is test code from messageBird, not really sends messages
var messageBird = require("messageBird")("VR11s71oV7CUuCrSxWEkgbBar");

var sendCode = (phone, callback) => {
  console.log("sendCode");
  //I have test environment on MessageBird for my phone only
  phone = "+972542694750";
  messageBird.verify.create(
    phone,
    {
      template: "Your verification code is %token."
    },
    function(err, response) {
      console.log("sendCode inside");
      if (err) {
        console.log(err);
        callback({
          error: err.errors[0].description
        });
      } else {
        console.log(response);

        callback({ id: response.id, status: 0 });
      }
    }
  );
};

var verifyCode = (id, code, callback) => {
  callback({ id: id, status: 0 });
  //I finished free 10 messages so I comment this code but it works
  /*
    messageBird.verify.verify(id, code, function(err, response){
        if (err){
          console.log(err);
          callback( {
            error: err.errors[0].description,
            status: -1,
            id: id
          });  
        }
        else {
            console.log(response);
            callback({id: response.id, status: 0});
        }
      }
      
    );*/
};

module.exports.sendCode = sendCode;
module.exports.verifyCode = verifyCode;
