require('dotenv').config();
const express = require('express');
const cors = require('cors');
const dns = require("node:dns");
const bodyParser = require("body-parser");
const urlencoded = require('body-parser/lib/types/urlencoded');
const { hostname } = require('os');
const app = express();

// Basic Configuration
const port = process.env.PORT || 3000;

app.use(cors());

app.use(bodyParser({ urlencoded: false }));
app.use(bodyParser.json());

app.use('/public', express.static(`${process.cwd()}/public`));

app.get('/', function(req, res) {
    res.sendFile(process.cwd() + '/views/index.html');
});

// Your first API endpoint
app.get('/api/hello', function(req, res) {
    res.json({ greeting: 'hello API' });
});

app.post("/api/shorturl", (req, res, next) => {
    let url = req.body.url;
    let getHostname = "";
    if (url != undefined && url != null && url != '' && (url.startsWith("http://") || (url.startsWith("https://")))) {
        if (url.startsWith("https://")) {
            getHostname = url.split('https://');
        } else if (url.startsWith("http://")) {
            getHostname = url.split("http://");
        }
        let right_url = getHostname[1].split('/')[0];
        console.log(right_url);
        if (right_url == 'www.example.com') {
            return res.status(400).json({ error: 'invalid url' });
        }
        dns.lookup(right_url, (err, hostname) => {
            console.log(url);
            if (err) {
                console.log(err);
                return res.status(400).json({ error: 'invalid url' });
            }
            next();
        })
    } else {
        return res.status(400).json({ error: 'invalid url' });
    }
}, (req, res, next) => {
    return res.status(200).json({ body: "Everything work fine" });
});

app.listen(port, function() {
    console.log(`Listening on port ${port}`);
});