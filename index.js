const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const db = require("./db");

const app = express();

//middleware
app.use(bodyParser.urlencoded({ extended: false }));

app.use(cors());

const port = 3000;

function query(request, data) {
  return new Promise((resolve, reject) => {
    db.query(request, data || [], (error, result) => {
      if (error) {
        reject(error);
      } else {
        resolve(result);
      }
    });
  });
}

// Récuperer toutes les voitures
app.get("/api/drugs", async (req, res) => {
  try {
    const drugs = await query("select * from drug");
    res.json(drugs);
  } catch (e) {
    res.status(400).json({ error: "Impossible to get drugs." });
  }
});

// Récuperer une voiture en particulier
app.get("/api/drugs/:id", async (req, res) => {
  const id = req.params.id;
  try {
    const [drug] = await query("select * from drug where id = ? ", [id]);
    if (drug) {
      return res.json(drug);
    }
    res.status(404).json({ error: "Car not found !" });
  } catch (e) {
    console.log(e);
    return res
      .status(400)
      .json({ error: "Impossible to get the current car." });
  }
});

// Supprimer une voiture
app.delete("/api/drugs/:id", async (req, res) => {
  const id = req.params.id;
  try {
    const result = await query("delete from drug where id = ?", [id]);
    if (result.affectedRows > 0) {
      return res.status(204).send();
    }
    return res.status(404).json({ error: "Car not found !" });
  } catch (e) {
    console.log(e);
    return res
      .status(400)
      .json({ error: "Impossible to remove the current car." });
  }
});

// Créer une voiture
app.post("/api/drugs", async (req, res) => {
  const { pharmacie, name } = req.body; // recuperation des données
  try {
    const {
      insertId,
    } = await query("insert into drug (pharmacie, name) values (?, ?)", [
      pharmacie,
      name,
    ]);
    if (insertId != null) {
      const [drug] = await query("select * from drug where id = ? ", [insertId]);
      if (drug) {
        return res.json(drug);
      }
      return res.status(404).json({ error: "Car not found !" });
    }
  } catch (e) {
    console.log(e);
    return res.status(400).json({ error: "Impossible to save the car." });
  }
});

// Mettre à jour une voiture
app.post("/api/drugs/:id", async (req, res) => {
  const id = req.params.id; //recuperer l'id

  const { pharmacie, name } = req.body; //récupérer les informations à mettre à jour

  try {
    const [drug] = await query("select * from drug where id = ? ", [id]);
    if (drug === null) {
      return res.status(404).json({ error: "Car cannot be found." });
    }
    drug.pharmacie = pharmacie;
    drug.name = name;
    const { affectedRows} = await query("update drug set pharmacie = ?, name = ? where id = ?", [
      drug.pharmacie,
      drug.name,
      drug.id,
    ]);
    if (affectedRows == 0) {
      throw "update failed";
    }
    res.json(drug);
  } catch (e) {
    console.log(e);
    return res
      .status(400)
      .json({ error: "Impossible to update the current car." });
  }
});

app.listen(port, function () {
  console.log(`server started :${port}`);
});