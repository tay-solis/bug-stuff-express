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
// app.get('/api/species', (req, res) => {
//     db.Species.find({})
//       .populate('family')
//       .exec((err, species) => {
//         if (err) throw err;
//         res.json(species)
//       });
//   });

  //Read: Get all species in database
app.get('/api/orders', (req, res) => {
    db.Order.find({})
      .populate('family')
      .exec((err, order) => {
        if (err) throw err;
        res.json(order)
      });
  });

app.listen(port, () => {
    console.log(`Bug app is listening on port:${port}`);
})