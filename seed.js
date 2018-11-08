const db = require('./models');
const mongoose = require('mongoose');
const fs = require('fs');

let data = fs.readFileSync('./bugguide-files/embiidina.json');
let embiidina = JSON.parse(data);

// console.log(embiidina);

console.log("//////////////////" + embiidina[0].order)

const createFamilies = (i) => {
    if (i >= embiidina.length) return;
    db.Family.findOne({
        name: embiidina[i].family
    }, (err, family) => {
        if (err) throw err;
        if (family === null) {
            const newFamily = new db.Family({
                name: embiidina[i].family
            })
            console.log(`Saved Family: ${newFamily}`)
            db.Order.findOne({
                name: embiidina[i].order
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


const createOrders = (i) => {
    db.Order.findOne({
        name: embiidina[i].order
    }, (err, order) => {
        if (err) throw err;
        if (order === null) {
            const newOrder = new db.Order({
                name: embiidina[i].order
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
        createOrders(0);
    });
});
// 
// db.Genus.deleteMany({}, (err) => {
//     if (err) throw err;
// });
// db.Species.deleteMany({}, (err) => {
//     if (err) throw err;
// });



// //Set Up Families

// db.Family.findOne({
//     name: embiidina[i].family
// }, (err, family) => {
//     if (err) throw err;
//     if (family === null) {
//         db.Family.create({
//             name: embiidina[i].family
//         }, (err, savedFamily) => {
//             if (err) throw err;
//             db.Order.findOne({
//                 name: embiidina[i].order
//             }, (err, order) => {
//                 if (err) throw err;
//                 savedFamily.order = order;
//                 order.families.push(savedFamily);
//                 savedFamily.save();
//                 order.save();
//             })
//             console.log(`Saved family: ${savedFamily}`);
//         })
//     }
// })


// //Set up genera

// db.Genus.findOne({
//     name: embiidina[i].genus
// }, (err, genus) => {
//     if (err) throw err;
//     if (genus === null) {
//         db.Genus.create({
//             name: embiidina[i].genus
//         }, (err, savedGenus) => {
//             if (err) throw err;
//             db.Family.findOne({
//                 name: embiidina[i].order
//             }, (err, family) => {
//                 if (err) throw err;
//                 if (family !== null) {
//                     savedGenus.family = family;
//                     family.genera.push(savedGenus);
//                     savedGenus.save();
//                     family.save();
//                 }
//             })
//             console.log(`Saved Genus: ${savedGenus}`);
//         })
//     }
// })


// //Set up species
// db.Species.create({
//     commonName: embiidina[i].commonName,
//     speciesName: embiidina[i].species
// }, (err, savedSpecies) => {
//     if (err) throw err;
//     db.Genus.findOne({
//         name: embiidina[i].order
//     }, (err, genus) => {
//         if (err) throw err;
//         if (genus !== null) {
//             savedSpecies.Genus = genus;
//             genus.species.push(savedSpecies);
//             savedSpecies.save();
//             genus.save();
//         }
//     })
//     console.log(`Saved Species: ${savedSpecies}`);
// })

// }