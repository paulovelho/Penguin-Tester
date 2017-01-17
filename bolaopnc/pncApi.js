var request = require("request");
var q = require("q");
var log = require("color-logs")(true, true, __filename);

var config = require("../config.js");

function pncApi(){

  var key = config.penacova.api_key;

  getEmailTests = function() {
    var queue = q.defer();
    let apiUrl = config.penacova.api_url + "admin-getTests.php";
    log.colors("red", "black").debug("checking API for tests e-mails");
    request.post({
      url: apiUrl,
      form: {
        key: key
      }
    }, function (error, response, body) {
      if (!error && response.statusCode == 200) {
        queue.resolve(JSON.parse(body));
      } else {
        queue.reject(body);
      }
    });
    return queue.promise;
  }

  cleanEmailTests = function() {
    var queue = q.defer();
    let apiUrl = config.penacova.api_url + "admin-cleanTests.php";
    log.colors("red", "black").debug("checking API for tests e-mails");
    request.post({
      url: apiUrl,
      form: {
        key: key
      }
    }, function (error, response, body) {
      if (!error && response.statusCode == 200) {
        queue.resolve(JSON.parse(body));
      } else {
        queue.reject(body);
      }
    });
    return queue.promise;
  }

  return {
    getEmailTests: getEmailTests
  }
}

module.exports = new pncApi();
