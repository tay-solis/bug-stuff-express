const express = require('express');
const app = express();
const port = process.env.PORT || 4000;
const db = require('./models');

//Parses json to url
const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({
    extended: true
}));

app.use(function (req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    next();
});

app.use(express.static('public'));

app.get('/', (req, res) => {
    res.sendFile('/views/index.html', {
        root: __dirname
    });
});

  //Read: Get all species in database
app.get('/api/orders', (req, res) => {
    db.Order.find({})
      .populate({ path: 'families', model: db.Family,
      populate: {
          path: 'genus',
          model: db.Genus,
          populate: {
            path: 'species',
            model: db.Species,
          }
      },
  })
      .exec((err, order) => {
        if (err) throw err;
        res.json(order)
      });
  });


app.get('/api/families/', (req, res)=>{
    db.Family.find({})
    .populate({ path: 'genera', model: db.Genus,
        populate: {
            path: 'species',
            model: db.Species
        },
    })
    .exec(function (err, doc) {
        if (err) throw err;
        res.send(doc);
    })
})

app.get('/api/genera/', (req,res) =>{
    db.Genus.find({})
    .populate({path: 'species', model: db.Species})
    .exec(function (err, doc) {
        if (err) throw err;
        res.send(doc);
    })
})

app.get('/api/species/:commonName', (req,res) =>{
    db.Species.findOne({commonName: req.params.commonName})
    .populate({path: 'genus', model: db.Genus})
    .exec(function (err, doc) {
        if (err) throw err;
        res.send(doc);
    })
})

app.listen(port, () => {
    console.log(`Bug app is listening on port:${port}`);
})