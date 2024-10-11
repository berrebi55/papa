const express = require('express');
const router = express.Router();
const Client = require('../models/Client');

// Créer un nouveau client
router.post('/', async (req, res) => {
    try {
        const client = new Client(req.body);
        await client.save();
        res.status(201).send(client);
    } catch (error) {
        res.status(400).send(error);
    }
});

// Récupérer tous les clients
router.get('/', async (req, res) => {
    try {
        const clients = await Client.find();
        res.status(200).send(clients);
    } catch (error) {
        res.status(500).send(error);
    }
});

// Récupérer un client par ID
router.get('/:id', async (req, res) => {
    try {
        const client = await Client.findById(req.params.id);
        if (!client) return res.status(404).send();
        res.status(200).send(client);
    } catch (error) {
        res.status(500).send(error);
    }
});

// Mettre à jour un client par ID
router.patch('/:id', async (req, res) => {
    try {
        const client = await Client.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
        if (!client) return res.status(404).send();
        res.status(200).send(client);
    } catch (error) {
        res.status(400).send(error);
    }
});

// Supprimer un client par ID
router.delete('/:id', async (req, res) => {
    try {
        const client = await Client.findByIdAndDelete(req.params.id);
        if (!client) return res.status(404).send();
        res.status(204).send();
    } catch (error) {
        res.status(500).send(error);
    }
});

module.exports = router;
