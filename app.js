var twitter = require('ntwitter'),
    http = require('http'),
    nconf = require('nconf'),
    tweets = [];

nconf.env()
     .file({ file: 'config.json' });

http.createServer(function(req, res) {
    // If we've already cached some tweets, use the cached array.
    if (tweets.length) {
        writeTweets(req, res, tweets);

        return;
    }

    // Else, request them from Twitter.
    var twit = new twitter({
        consumer_key: nconf.get('consumer_key'),
        consumer_secret: nconf.get('consumer_secret'),
        access_token_key: nconf.get('access_token_key'),
        access_token_secret: nconf.get('access_token_secret')
    });

    twit.verifyCredentials(function(err, data) { })
        .getUserTimeline({ trim_user: true, exclude_replies: true, count: 25 }, function(err, data) {
            if (err) {
                res.writeHead(500);

                res.end();

                return;
            }

            for (var i = 0; i < data.length; i++) {
                tweets.push({ id_str: data[i].id_str, text: data[i].text });
            }

            // Set a timer to expire the tweets cache in 10 minutes.
            setTimeout(function() { tweets = [] }, 1000 * 60 * 10);

            writeTweets(req, res, tweets);
        });
}).listen(process.env.port || 8080);

function writeTweets(req, res, tweets) {
    res.writeHead(200, {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
    });

    var url = require('url').parse(req.url, true);

    if (url.query.callback)
        res.write(url.query.callback + '(');

    res.write(JSON.stringify(tweets));

    if (url.query.callback)
        res.write(');');

    res.end();
}

//<blockquote class="twitter-tweet"><p>Trying out a Twitter Timeline(tm)(r)(c) on my sidebar instead of the custom code I used to use.
// Annoying how inflexible Twitter is becoming.</p>&mdash; Dave Ward (@Encosia) <a href="https://twitter.com/Encosia/status/257995927086833665"
// data-datetime="2012-10-16T00:06:37+00:00">October 16, 2012</a></blockquote>
