var request = require("request");
var q = require("q");
var log = require("color-logs")(true, true, __filename);

var config = require("../config.js");

function pncContactServer(){

  getEmail = function(email) {
    var queue = q.defer();
    let key = config.penacova.contact_key;
    let encodedMail = encodeURIComponent(email);
    let apiUrl = config.penacova.contact_url + "&auth=" + key + "&email=" + encodedMail;
    log.debug("contact url: " + apiUrl);
    request(apiUrl, function (error, response, body) {
      if (!error && response.statusCode == 200) {
        queue.resolve(JSON.parse(body));
      } else {
        queue.reject(body);
      }
    });
    return queue.promise;
  }

  return {
    getEmail: getEmail
  }
}

module.exports = new pncContactServer();
