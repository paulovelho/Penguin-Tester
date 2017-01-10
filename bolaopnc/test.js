var fs = require("fs");
var async = require("async");
var q = require("q");

var Horseman = require('node-horseman');
var horseman = new Horseman({
  loadImages: true,
  injectJquery: true,
  webSecurity: true,
  timeout: 10000
});

var log = require("color-logs")(true, true, __filename);
var util = require("util");

function PeNaCova(){

  var list = [];
  var email;

  function Load() {
    var queue = q.defer();
    GenerateEmail();
    GenerateList().then( function() {
      queue.resolve();
    });
    return queue.promise;
  }

  function Run() {
    log.colors("white", "black").info("=====[ testing: pe na cova ]=====");
    var queue = q.defer();
    async.series([
      checkEmail
    ], () => {
      log.debug("PeNaCova run finished");
      queue.resolve();
    });
    return queue.promise;
  }

  function logError(msg, data) {
    log.error("+++-ERROR-+++ ==> " + msg);
    if ( data ) {
      console.info("===error-data=== [" + util.inspect(data, { depth: null }) + "]");
    }
    process.exit(1);
  }

  GenerateList = function() {
    var queue = q.defer();
    fs.readFile("./bolaopnc/apostas.txt", "utf-8", function(err, data){
      if(err) throw err;
      var lines = data.split('\n');
      lines.sort( function() { return 0.5 - Math.random() } );
      list = lines.slice(0, 15);
      queue.resolve();
    });
    return queue.promise;
  }
  GenerateEmail = function() {
    getNowDate = function() {
      var date = new Date();
      return date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate();
    }
    email = "teste+" + getNowDate() + "@paulovelho.com";
  }

  // check if all names are there:
  function assertList(str) {
    for (var i = list.length - 1; i >= 0; i--) {
      if ( str.indexOf(list[i]) < 0 ){
        logError("list validation incorrect!", { list: list, data: str });
        return false;
      }
    }
    return true;
  }


  function Bet(done) {
    logError("Penguin disabled"); return;

    log.colors("yellow", "black").debug("====> betting...");
    log.colors("yellow", "black").debug("email:", email);
    log.colors("yellow", "black").debug("list:", list.join(", "));

    horseman
      .authentication("paulovelho", "jackass1")
      .on('urlChanged', function(targetUrl) {
        log.colors("red", "black").debug("horseman loaded: " + targetUrl);
      })
      .open("http://www.bolaopenacova.com")
      .click("a:contains('Envie sua lista!')")
      .waitForNextPage()
      .type('input[name="data_nome"]', 'PNC')
      .type('input[name="data_email"]', email)
      .type('input[name="data_city"]', 'Vilar Seco')
      .type('input[name="data_state"]', 'Miranda')
      .click('#toggle_lista')
      .click('.btn-flat > .icon-ok')
      .waitForSelector("#divError")
      .type('input[name="presunto1"]', list[0])
      .type('input[name="presunto2"]', list[1])
      .type('input[name="presunto3"]', list[2])
      .type('input[name="presunto4"]', list[3])
      .type('input[name="presunto5"]', list[4])
      .type('input[name="presunto6"]', list[5])
      .type('input[name="presunto7"]', list[6])
      .type('input[name="presunto8"]', list[7])
      .type('input[name="presunto9"]', list[8])
      .type('input[name="presunto10"]', list[9])
      .type('input[name="presunto11"]', list[10])
      .type('input[name="presunto12"]', list[11])
      .type('input[name="presunto13"]', list[12])
      .type('input[name="presunto14"]', list[13])
      .type('input[name="presunto15"]', list[14])
      .click('.btn-flat > .icon-ok')
      .waitForNextPage()
      .html()
      .text(".table_ranking")
      .then( function(table) {
        log.colors("white").info("Testing if all names are present in page: " + assertList(table) );
        done();
      })
      .close();
  }

  function checkEmail(done){
    log.colors("yellow", "black").debug("====> checking e-mail");
    log.colors("yellow", "black").debug("email:", email);
    var contactServer = require("./contactServer.js");
    return contactServer.getEmail("paulovelho@paulovelho.com")
      .then((resp) => {
        if( resp.email_to != email ) {
          logError("E-mail validation error", resp);
        } else {
          log.colors("white").info("Testing if all names are present in e-mail: " + assertList(resp.message) );
        }
      })
      .catch( (data) => {
        logError("e-mail was not correctly sent after sign up ", data);
      }).finally( () => {
        log.debug("email checked");
        done();
      });
  }

  return {
    Load: Load,
    Go: Run
  }
}

module.exports = new PeNaCova();
