var request = require('request');
var $ = require('cheerio');

request({
    uri: 'http://uecmyanmar.org/index.php/voters',
    headers: {
      'user-agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_10_3) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/45.0.2454.85 Safari/537.36'
    }
  }, function (err, response, body) {
    var parties = $(body).find('tr');
    function readParty(p) {
      var partyLink = 'http://uecmyanmar.org' + $(parties[p]).find('a').attr('href');
      //console.log(partyLink);
      request({
        uri: partyLink,
        headers: {
          'user-agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_10_3) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/45.0.2454.85 Safari/537.36'
        }
      }, function (err, response, body2) {
        var answers = $('td:last-child', body2.replace(/\r|\n/g, ''));
        var output = [];
        for (var a = 0; a < answers.length; a++) {
          output.push($(answers[a]).text());
        }
        console.log(output.join(','));
        if (p + 1 >= parties.length) {
          return;
        }
        setTimeout(function() {
          readParty(p + 1);
        }, 1000);
      });
    };
    setTimeout(function() {
      readParty(76);
    }, 1000);
  });
