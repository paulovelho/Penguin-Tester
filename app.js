var log = require('color-logs')(true, true, __filename);
var async = require("async");
var q = require("q");

var log = require("color-logs")(true, true, __filename);

// DEBUG=horseman node app.js

function run() {
//  console.info("Penguin disabled"); return;
  log.colors("white", "black").info("<<<=====[ starting Penguin Tester ]=====>>>");
  async.series([
    testPeNaCova
  ], () => {
  log.colors("white", "black").info("<<<=====[ ending Penguin Tester ]=====>>>");
    process.exit();
  });
}

testPeNaCova = function(done) {
  var BolaoPeNaCova = require("./bolaopnc/test.js");
  BolaoPeNaCova.Load()
    .then( () => {
      BolaoPeNaCova.Go().then(done);
    });
}

run();
