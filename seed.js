const db = require('./models');
const mongoose = require('mongoose');
const fs = require('fs');

let data = fs.readFileSync('./bugguide-files/mantodea.json');
let mantodea = JSON.parse(data);


console.log("//////////////////" + mantodea[0].order)

const createSpecies = (i) => {
    console.log('Species' + i)
    if (i == mantodea.length) {
        return;
    } else{
        db.Species.findOne({
            speciesName: mantodea[i].species
        }, (err, species) => {
            if (err) throw err;
            if (species === null) {
                console.log('creating new Species')
                const newSpecies = new db.Species({
                    commonName: mantodea[i].commonName,
                    speciesName: mantodea[i].species,
                    genusName: mantodea[i].genus
                })
                console.log(`Saved Species: ${newSpecies}`)
                db.Genus.findOne({
                    name: mantodea[i].genus
                }, (err, genus) => {
                    if (err) throw err;
                    newSpecies.genus = genus;
                    genus.species.push(newSpecies);
                    let promise1 = newSpecies.save();
                    promise1.then(() => {
                        let promise2 = genus.save();
                        promise2.then(() => {
                            createSpecies(i + 1);
                        })
                    })               
                }) 
            } else{
                createSpecies(i + 1);
            }
        })
    }
    
}

const createGenera = (i) => {
    console.log('Genus' + i)
    if (i == mantodea.length) {
        console.log('completed genera')
        createSpecies(0);
    } else {
        db.Genus.findOne({
            name: mantodea[i].genus
        }, (err, genus) => {
            if (err) throw err;
            if (genus === null) {
                console.log('creating new genus')
                const newGenus = new db.Genus({
                    name: mantodea[i].genus
                })
                console.log(`Saved genus: ${newGenus}`)
                db.Family.findOne({
                    name: mantodea[i].family
                }, (err, family) => {
                    if (err) throw err;
                    newGenus.family = family;
                    family.genera.push(newGenus);
                    let promise1 = newGenus.save();
                    promise1.then(() => {
                        let promise2 = family.save();
                        promise2.then(() => {
                            createGenera(i + 1);
                        })
                    })               
                }) 
            } else{
                createGenera(i + 1);
            }
        })
    }
}

const createFamilies = (i) => {
    console.log(i + ' ' + mantodea.length)
    if (i == mantodea.length) {
        console.log('completed families')
        createGenera(0);
    } else{
        db.Family.findOne({
            name: mantodea[i].family
        }, (err, family) => {
            if (err) throw err;
            if (family === null) {
                const newFamily = new db.Family({
                    name: mantodea[i].family
                })
                console.log(`Saved Family: ${newFamily}`)
                db.Order.findOne({
                    name: mantodea[i].order
                }, (err, order) => {
                    if (err) throw err;
                    newFamily.order = order;
                    order.families.push(newFamily);
                    let promise1 = newFamily.save();
                    promise1.then(() => {
                        let promise2 = order.save();
                        promise2.then(() => {
                            createFamilies(i + 1);
                        })
                    });                
                }) 
            } else{
                createFamilies(i + 1);
            }
        })
    }
   
}


const createOrders = (i) => {
    db.Order.findOne({
        name: mantodea[i].order
    }, (err, order) => {
        if (err) throw err;
        if (order === null) {
            const newOrder = new db.Order({
                name: mantodea[i].order
            })
            console.log(`Saved Order: ${newOrder}`)
            let promise = newOrder.save();
            promise.then(() => {
                createOrders(i + 1);
            });
        } else{
            console.log('Done with orders')
            createFamilies(0); 
        }
    })
}

db.Order.deleteMany({}, (err) => {
    if (err) throw err;
    db.Family.deleteMany({}, (err) => {
        if (err) throw err;    
        db.Genus.deleteMany({}, (err) => {
            if (err) throw err;
            db.Species.deleteMany({}, (err) => {
                if (err) throw err; 
                createOrders(0);
            });    
        });
        
    });
});
