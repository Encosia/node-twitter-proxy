var twitter = require('ntwitter'),
    http = require('http'),
    tweets = [];

http.createServer(function(req, res) {
    if (tweets.length) {
        writeTweets(res, tweets);

        return;
    }

    // Else
    var twit = new twitter({
        consumer_key: '8ePxZShNrr4kEWbPKg',
        consumer_secret: 'ZB4jpSNDATbc525XLhOeWbLUcPDqTqetiKUit6ql08',
        access_token_key: '11680672-3vnJLvK1G2d8zDA5PrVWUYwnDKbPP05C2VzC2V1D7',
        access_token_secret: 'm1m6VWZH4V7rhQq6WeppdYfrbQ9B2ZVyzMlwctMk8o'
    });

    twit.verifyCredentials(function(err, data) {
           //console.log(data);
        }).getUserTimeline({ trim_user: true, exclude_replies: true, count: 50 }, function(err, data) {
            for (var i = 0; i < data.length; i++) {
                tweets.push({ id_str: data[i].id_str, text: data[i].text });
            }

            setTimeout(clearTweets, 1000 * 60 * 10);

            writeTweets(res, tweets);
        });

}).listen(process.env.port || 8080);

function clearTweets() {
    tweets = [];
}

function writeTweets(res, tweets) {
    res.writeHead(200, { 'Content-Type': 'text/plain'});

    res.write(JSON.stringify(tweets));
//    for (var i = 0; i < tweets.length; i++) {
//        res.write(tweets[i]);
//    }

    res.end();
}

//<blockquote class="twitter-tweet"><p>Trying out a Twitter Timeline(tm)(r)(c) on my sidebar instead of the custom code I used to use.
// Annoying how inflexible Twitter is becoming.</p>&mdash; Dave Ward (@Encosia) <a href="https://twitter.com/Encosia/status/257995927086833665"
// data-datetime="2012-10-16T00:06:37+00:00">October 16, 2012</a></blockquote>
