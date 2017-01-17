var request = require("request");
var q = require("q");
var log = require("color-logs")(true, true, __filename);

var config = require("../config.js");

function pncContactServer(){

  let key = config.penacova.contact_key;

  getEmail = function(email) {
    var queue = q.defer();
    let encodedMail = encodeURIComponent(email);
    let apiUrl = config.penacova.contact_url + "?GetForMail&auth=" + key + "&email=" + encodedMail;
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

  avoidSending = function(email_id) {
    let apiUrl = config.penacova.contact_url + "?SimulateSend&auth=" + key + "&id=" + email_id;
    request(apiUrl, function (error, response, body) {
      if (!error && response.statusCode == 200) {
        var result = JSON.parse(body);
        if (result.success) {
          log.debug("just avoided sending the e-mail id [" + email_id + "]");
        } else {
          log.error("could not avoid e-mail to be sent...");
          log.error(result);
        }
      } else {
        log.error("error avoid sending e-mail...");
      }
    });
  }

  return {
    getEmail: getEmail,
    avoidSending: avoidSending
  }
}

module.exports = new pncContactServer();
