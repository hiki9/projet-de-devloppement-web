module.exports = function (app, queryPromise) {
  app.get("/api/pharmacies", async (req, res) => {
    try {
      const pharmacies = await queryPromise("select * from pharmacie");
      res.json(pharmacies);
    } catch (e) {
      console.log(e);
      res.status(400).json({ error: "Impossible to get brands." });
    }
  });

  // Récuperer une marque en particulier
  app.get("/api/pharmacies/:id", async (req, res) => {
    const id = req.params.id;
    try {
      const [pharmacie] = await queryPromise("select * from pharmacie where id = ? ", [
        id,
      ]);
      if (pharmacie) {
        return res.json(pharmacie);
      }
      res.status(404).json({ error: "pharma not found !" });
    } catch (e) {
      console.log(e);
      return res
        .status(400)
        .json({ error: "Impossible to get the current pharma." });
    }
  });

  // Supprimer une marque
  app.delete("/api/pharmacies/:id", async (req, res) => {
    const id = req.params.id;
    try {
      const result = await queryPromise("delete from pharmacie where id = ?", [id]);
      if (result.affectedRows > 0) {
        return res.status(204).send();
      }
      return res.status(404).json({ error: "Brand not found !" });
    } catch (e) {
      console.log(e);
      return res
        .status(400)
        .json({ error: "Impossible to remove the current brand." });
    }
  });


  // Créer une marque
  app.post("/api/pharmacies", async (req, res) => {
    const { name } = req.body; // recuperation des données
    try {
      const {
        insertId,
      } = await queryPromise("insert into pharmacie (name) values (?)", [
        name,
      ]);
      if (insertId != null) {
        const [pharmacie] = await queryPromise("select * from pharmacie where id = ? ", [
          insertId,
        ]);
        if (pharmacie) {
          return res.json(pharmacie);
        }
        return res.status(404).json({ error: "Brand not found !" });
      }
    } catch (e) {
      console.log(e);
      return res.status(400).json({ error: "Impossible to save the brand." });
    }
  });


  // Mettre à jour d'une marque
  app.post("/api/pharmacies/:id", async (req, res) => {
    const id = req.params.id; //recuperer l'id

    const { name } = req.body; //récupérer les informations à mettre à jour

    try {
      const [pharmacie] = await queryPromise("select * from pharmacie where id = ? ", [id]);
      if (pharmacie === null) {
        return res.status(404).json({ error: "Brand cannot be found." });
      }
      pharmacie.name = name;
      const {
        affectedRows,
      } = await queryPromise("update pharmacie set name = ? where id = ?", [
        pharmacie.name,
        pharmacie.id,
      ]);
      if (affectedRows == 0) {
        throw "update failed";
      }
      res.json(pharmacie);
    } catch (e) {
      console.log(e);
      return res
        .status(400)
        .json({ error: "Impossible to update the current brand." });
    }
  });

};