const config = require('./config.json').sql;
/*var config = {
  user: "marina73_SQLLogin_1",
  password: "rr5ccm7f45",
  server: "MarinaDemo.mssql.somee.com",
  database: "MarinaDemo"
};
*/
var sqlCallTemplate = callback => {
  const sql = require("mssql");
  sql.close();
  sql.connect(config).then(conn => {
    callback(sql, conn)
      .then(() => conn.close())
      .catch(err => {
        conn.close();
        console.log(err);
      });
  });
  sql.on("error", err => {
    console.log(err);
  });
};

var getallproducts = callback => {
  sqlCallTemplate((sql, conn) => {
    return conn.query("SELECT * FROM Products").then(v => {
      console.log(v.recordset);
      callback(v.recordset);
    });
  });
};

var getUserById = (id, callback) => {
  sqlCallTemplate((sql, conn) => {
    conn.query("SELECT * FROM Users where id=" + id).then(v => {
      console.log(v.recordset[0]);
      callback(v.recordset[0]);
    });
  });
};

var getBasketByUserId = (id, callback) => {
  sqlCallTemplate((sql, conn) => {
    conn.query("SELECT * FROM Basket where UserId=" + id).then(v => {
      console.log(v.recordset);
      callback(v.recordset);
    });
  });
};

var clearBasketByUserId = (id, callback) => {
  sqlCallTemplate((sql, conn) => {
    conn.query("Delete FROM Basket where UserId=" + id).then(v => {
      callback({ status: 0 });
    });
  });
};

var getUser = (username, password, callback) => {
  sqlCallTemplate((sql, conn) => {
    return new Promise(function(resolve, reject) {
      const request = new sql.Request();
      request.input("username", username);
      request.input("password", password);
      request.execute("GetUser", (err, result) => {
        if (err) {
          console.log(err);
          reject(err);
        } else {
          var resUser = result.recordsets[0][0];
          console.log(result.recordsets[0][0]);
          callback(resUser);
          resolve(resUser);
        }
      });
    });
  });
};

var updateUserVerified = (id, verified, callback) => {
  sqlCallTemplate((sql, conn) => {
    return new Promise(function(resolve, reject) {
      const request = new sql.Request();
      request.input("id", sql.Int, id);
      request.input("verified", sql.TinyInt, 1);
      request.execute("UpdateUserVerified", (err, result) => {
        if (err) {
          console.log(err);
          callback(err);
          reject(err);
        } else {
          console.log(result);
          if (result.returnValue === 0) callback("OK");
          resolve("OK");
        }
      });
    });
  });
};

var updateBasket = (userId, productId, callback) => {
  sqlCallTemplate((sql, conn) => {
    return new Promise(function(resolve, reject) {
      const request = new sql.Request();
      request.input("userId", userId);
      request.input("productId", productId);
      request.execute("UpdateBasket", (err, result) => {
        if (err) {
          console.log(err);
          reject(err);
        } else {
          console.log(result);
          if (result.returnValue === 0) callback("OK");
          resolve("OK");
        }
      });
    });
  });
};

module.exports.getallproducts = getallproducts;
module.exports.getUser = getUser;
module.exports.updateBasket = updateBasket;
module.exports.getUserById = getUserById;
module.exports.updateUserVerified = updateUserVerified;
module.exports.clearBasketByUserId = clearBasketByUserId;
module.exports.getBasketByUserId = getBasketByUserId;
