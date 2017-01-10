
function PenguHelper() {

}

PenguHelper.prototype.loadJQuery = function (doc) {
  var jq = doc.createElement('script');
  jq.src = "https://ajax.googleapis.com/ajax/libs/jquery/2.1.4/jquery.min.js";
  doc.getElementsByTagName('head')[0].appendChild(jq);
  jQuery.noConflict();
}

PenguHelper.prototype.sleep = function (time) {
  return new Promise((resolve) => setTimeout(resolve, time));
}

PenguHelper.prototype.clearIntervals = function () {
  for (var i = 1; i < 99999; i++)
    window.clearInterval(i);
}

module.exports = new PenguHelper();
