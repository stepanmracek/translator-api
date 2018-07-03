var express = require("express");
var bodyParser = require("body-parser");
var fs = require("fs");

var app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

var router = express.Router();
router.route('/:env').get((req, res) => {
    const env = req.params.env;
    fs.readdir(`./data/${env}/`, (err, files) => {
        if (err) res.status(400).json(err);
        else res.json(files);
    });
});

router.route('/:env/:project').get((req, res) => {
    const env = req.params.env;
    const project = req.params.project;
    fs.readdir(`./data/${env}/${project}`, (err, files) => {
        if (err) res.status(400).json(err);
        else res.json(files.map(fn => fn.substring(0, fn.indexOf(".json"))));
    });
});

router.route('/:env/:project/:lang')
    .get((req, res) => {
        const env = req.params.env;
        const project = req.params.project;
        const lang = req.params.lang;
        fs.readFile(`./data/${env}/${project}/${lang}.json`, 'utf-8', (err, data) => {
            if (err) res.status(400).json(err);
            else res.send(data);
        });
    })
    .post((req, res) => {
        const env = req.params.env;
        const project = req.params.project;
        const lang = req.params.lang;
        fs.writeFile(`./data/${env}/${project}/${lang}.json`, JSON.stringify(req.body), err => {
            if (err) res.status(400).json(err);
            else res.json({ result: 'ok' });
        });
    });

app.use('/api', router);

var server = app.listen(3000, () => {
    console.log("app running on port ", server.address().port);
});
