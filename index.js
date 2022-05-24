require('dotenv').config();
const express = require('express');
const cors = require('cors');
const dns = require("dns");
const bodyParser = require("body-parser");
const urlencoded = require('body-parser/lib/types/urlencoded');
const { hostname } = require('os');
const connectDb = require("./utils/connectDb.js");
const app = express();

// Basic Configuration
const port = process.env.PORT || 3000;

app.use(cors());

app.use(bodyParser({ urlencoded: false }));
app.use(bodyParser.json());
connectDb().then(() => {
    console.log("Server connected");
}).catch((e) => {
    console.log(e);
})
const Shorter = require("./models/shorter.js");

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
        dns.lookup(right_url, (err, hostname) => {
            if (err) {
                console.log(err);
                return res.status(200).json({ "error": 'Invalid URL' });
            }
            next();
        })
    } else {
        return res.status(200).json({ "error": 'Invalid URL' });
    }
}, async(req, res, next) => {
    let urlShorter = new Shorter({
        original_url: req.body.url
    });
    let urlSave = await urlShorter.save();
    let uniqueId = urlSave.id.substring((urlSave.id.length - 1) - 1);
    urlSave.short_url = uniqueId;
    await urlSave.save();
    return res.status(200).json({ original_url: urlSave.original_url, short_url: urlSave.short_url });
});

app.use("/api/shorturl/:short_url", (req, res, next) => {
    let url = req.params.short_url;
    Shorter.findOne({ short_url: url }).then((value) => {
        if (!value) {
            return res.status(404).json({ error: "Not found" });
        }
        return res.redirect(value.original_url);
    }).catch((err) => {
        return res.status(500).json({ error: "Internal Server" });
    });
});

app.listen(port, function() {
    console.log(`Listening on port ${port}`);
});