const express = require('express');
const router = express.Router();

// Exemple de données clients
const clients = [
    { id: 1, name: 'Client 1' },
    { id: 2, name: 'Client 2' },
    { id: 3, name: 'Client 3' },
];

// Définir l'endpoint pour /api/clients
router.get('/clients', (req, res) => {
    res.json(clients); // Renvoie les données clients en JSON
});

// Exporter le routeur
module.exports = router;
// Route POST pour créer un nouveau client
router.post('/', async (req, res) => {
    const newClient = new Client({
        name: req.body.name,
        email: req.body.email // Assurez-vous que vous envoyez un email dans la requête
    });

    try {
        const savedClient = await newClient.save();
        res.status(201).json(savedClient);
    } catch (err) {
        res.status(400).send(err);
    }
});
