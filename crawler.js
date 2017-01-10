var request = require("request");
var cheerio = require("cheerio");
//var jsdom = require("jsdom");
//var $ = require("jquery");


var q = require("q");

var log = require("color-logs")(true, true, __filename);

function Crawler(){

  var currentSite;

  function crawlSite(url) {
    if ( url.substring(0, 4) != "http" ) {
      url = "http://" + url;
    }
    return htmlRobot(url);
  }

  function RunFunction(fn) {
    jsRobot(currentSite, fn);
  }

  function htmlRobot(url) {
    var queue = q.defer();
    log.colors("red").debug("calling page " + url);
    request({ uri: url }, function(error, response, body) {
      if(error || response.statusCode != 200){
        log.error("ERROR: ", error);
        q.reject();
        return;
      }
      currentSite = body;
      queue.resolve(currentSite);
    });
    return queue.promise;
  }

  function jsRobot(body, fn) {
    if(body == undefined) {
      log.error("invalid site body");
    }
    var $ = cheerio.load(body);
    fn($);
  }

  return {
    Go: crawlSite,
    Exec: RunFunction
  }
}

module.exports = new Crawler();