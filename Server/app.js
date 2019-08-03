const express = require("express");
var sqlcall = require("./sqlcall");
const jwt = require("jsonwebtoken");
var bodyParser = require("body-parser");
var twofasms = require("./twofasms");
var cors = require("cors");

const app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json()); // support json encoded bodies
app.use(cors());

app.post("/api/testToken", verifyToken, (req, res) => {
  jwtVerify(req, () => {
    res.send("OK");
  });
});

app.post("/api/getallproducts", verifyToken, (req, res) => {
  jwtVerify(req, () => {
    sqlcall.getallproducts(recordset => {
      res.json(recordset);
    });
  });
});

app.post("/api/updateUserVerified", verifyToken, (req, res) => {
  jwtVerify(req, () => {
    var id = req.body.userId;
    var verified = req.body.verified;
    sqlcall.updateUserVerified(id, verified, result => {
      res.json(result);
    });
  });
});

app.post("/api/getBasketByUserId", verifyToken, (req, res) => {
  jwtVerify(req, () => {
    var id = req.body.userId;
    console.log(id);
    sqlcall.getBasketByUserId(id, result => {
      res.json(result);
    });
  });
});

app.post("/api/clearBasketByUserId", verifyToken, (req, res) => {
  jwtVerify(req, () => {
    var id = req.body.userId;
    sqlcall.clearBasketByUserId(id, result => {
      res.json(result);
    });
  });
});

app.post("/api/addToBasket", verifyToken, (req, res) => {
  jwtVerify(req, () => {
    var userId = req.body.userId;
    var productId = req.body.productId;
    sqlcall.updateBasket(userId, productId, response => {
      res.json(response);
    });
  });
});

app.post("/api/login", (req, res) => {
  var username = req.body.username;
  var password = req.body.password;
  sqlcall.getUser(username, password, recordset => {
    if (!recordset) res.send({});
    else {
      console.log(recordset);

      const user = {
        id: recordset.id,
        username: recordset.Username,
        email: recordset.Email
      };

      console.log(user);

      jwt.sign({ user }, "secretkey", (err, token) => {
        var result = {
          userId: user.id,
          phone: recordset.Phone,
          verified: recordset.Verified,
          token: token
        };
        res.json({ result });
      });
    }
  });
});

function jwtVerify(req, callback) {
  jwt.verify(req.token, "secretkey", (err, authData) => {
    if (err) {
      res.sendStatus(403);
    } else {
      callback();
    }
  });
}
function verifyToken(req, res, next) {
  const bearerHeader = req.headers["authorization"];
  console.log(req.headers);
  if (typeof bearerHeader !== "undefined") {
    const bearer = bearerHeader.split(" ");
    const bearerToken = bearer[1];
    req.token = bearerToken;
    console.log("token" + bearerToken);
    next();
  } else {
    res.sendStatus(403);
  }
}

app.post("/api/twofastep1", verifyToken, (req, res) => {
  console.log("twofastep1");
  var phone = req.body.phone;
  twofasms.sendCode(phone, response => {
    res.send(response);
  });
});

app.post("/api/twofastep2", verifyToken, (req, res) => {
  var twofaid = req.body.twofaid;
  var code = req.body.code;
  var id = req.body.id;
  twofasms.verifyCode(twofaid, code, response => {
    sqlcall.updateUserVerified(id, response.status === 0, () => {});
    res.send(response);
  });
});

app.listen(8003, () => console.log("Server started on port 8003"));
