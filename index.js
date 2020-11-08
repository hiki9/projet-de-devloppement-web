const express = require("express");
const bodyParser = require("body-parser");
const db =require('./db');

const app = express();

//middleware
app.use(bodyParser.urlencoded({ extended: false }));

const port = 3000;

//MOCK
const cars = [
    {id:1,brand:'citroen',model:'berlingo'},
    {id:2,brand:'fiat',model:'chrysler'},
    {id:3,brand:'peugeot',model:308},
    {id:4,brand:'opel',model:'astra'},
    {id:5,brand:'dacia',model:'renault'},
    {id:6,brand:'ds',model:7},
    ];

// Récuperer toutes les voitures
app.get("/API_2/cars", function (req, res) {
    db.query('select * from car',function(error,result){
if(error){
  return res.status(400).json({error:'impossible to get cars.'});
}
    res.json(result);
    });
});

// Récuperer une voiture en particulier

app.get("/API_2api/cars/:id", function (req, res) {
  console.log(req);
db.query('select * from car where id=?', [req.params.id], function (error, results) {
   if (error) throw error;
   res.end(JSON.stringify(results));
 });
});

// Supprimer une voiture
app.delete('/API_2/cars/:id', function(req, res) {
   console.log(req.body);
   db.query('DELETE FROM `car` WHERE `id`=?', [req.body.id], function (error, results) {
	  if (error) throw error;
	  res.end('Record has been deleted!');
	});
});

// Créer une voiture
app.post("/API_2/cars", function (req, res) { 
  const car = req.body;
  db.query('INSERT INTO car SET ?', postData, function (error, results) {
   if (error) throw error;
   res.end(JSON.stringify(results));
 });
});
 
app.post('/API_2/cars/:id', function(req, res){
  const id = req.params.id; //recuperer l'id
  const { brand, model } = req.body;  //récupérer les informations à mettre à jour

db.query('select*from car where id=?',[id], function (error,result){
if(error){

    return res.status(404).json({error:'impossible to update the current car.'});
}
if(result.length===0){
    return res.status(404).json({error:'car cannot be found.'});
}
const car=result[0];
car.brand=brand;
car.model=model;
db.query('update car set brand=?,model=? where id =?',[car.brand,car.model,car.id],function(error,result){
    if(error){

    return res.status(404).json({error:'impossible to update the current car.'});
    }
    res.json(car);
})

});

});

app.listen(port, function () {
  console.log(`server started :${port}`);
});