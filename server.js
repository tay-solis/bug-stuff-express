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

//Allows urls to take params of any case
const caseFixName =(name)=>{
    name = name.toLowerCase()
    name = name.charAt(0).toUpperCase() + name.substr(1);
    return name;
}

//Read: Get all orders in a database
app.get('/api/order/all', (req, res) => {
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

//Read: Get order by name
app.get('/api/order/:name', (req, res) => {
    db.Order.findOne({name: caseFixName(req.params.name)})
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


//Read: Get all families in a database
app.get('/api/family/all', (req, res)=>{
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

//Read: Get family by name
app.get('/api/family/:name', (req, res) => {
    db.Family.findOne({name: caseFixName(req.params.name)})
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
});


//Read: Get all genera in a database
app.get('/api/genus/all', (req,res) =>{
    db.Genus.find({})
    .populate({path: 'species', model: db.Species})
    .exec(function (err, doc) {
        if (err) throw err;
        res.send(doc);
    })
})

//Read: Get genus by name
app.get('/api/genus/:name', (req, res) => {
    db.Genus.findOne({name: caseFixName(req.params.name)})
    .populate({path: 'species', model: db.Species})
    .exec(function (err, doc) {
        if (err) throw err;
        res.send(doc);
    })
});

//Read: Get a species by common name
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