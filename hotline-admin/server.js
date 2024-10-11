const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const axios = require('axios'); // Importer axios

const app = express();
const PORT = process.env.PORT || 5000; // Utiliser le port 5000

app.use(bodyParser.json());
app.use(cors()); // Ajouter CORS pour permettre les requêtes depuis le client
app.use(express.static('public')); // Servir des fichiers statiques depuis le dossier "public"

// Connexion à MongoDB
mongoose.connect('mongodb://localhost:27017/clientsDB', {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
.then(() => console.log('Connecté à MongoDB'))
.catch(err => console.error('Erreur de connexion à MongoDB:', err));

// Définir le schéma et le modèle pour les clients
const clientSchema = new mongoose.Schema({
    nom: String,
    prenom: String,
    adresse: String,
    codePostal: String,
    ville: String
});

const Client = mongoose.model('Client', clientSchema);

// Route pour ajouter un client
app.post('/api/clients', async (req, res) => {
    const { nom, prenom, adresse, codePostal, ville } = req.body;
    const client = new Client({ nom, prenom, adresse, codePostal, ville });
    try {
        const savedClient = await client.save();
        res.status(201).json(savedClient);
    } catch (err) {
        console.error('Erreur lors de l\'ajout du client:', err);
        res.status(500).json({ message: 'Erreur lors de l\'ajout du client.' });
    }
});

// Route pour récupérer tous les clients
app.get('/api/clients', async (req, res) => {
    try {
        const clients = await Client.find();
        res.json(clients);
    } catch (err) {
        console.error('Erreur lors de la récupération des clients:', err);
        res.status(500).json({ message: 'Erreur lors de la récupération des clients.' });
    }
});

// Route pour supprimer un client par ID
app.delete('/api/clients/:id', async (req, res) => {
    try {
        await Client.findByIdAndDelete(req.params.id);
        res.status(204).send(); // Pas de contenu
    } catch (err) {
        console.error('Erreur lors de la suppression du client:', err);
        res.status(500).json({ message: 'Erreur lors de la suppression du client.' });
    }
});

// -------------------------------------
// API Géoportail
// -------------------------------------

const BASE_URL_GEO = 'https://api.gouv.fr/géoportail'; // Remplacez par l'URL correcte

// Route pour obtenir des données Géoportail
app.get('/api/geo', async (req, res) => {
    const geometry = {
        type: "Point",
        coordinates: [-1.691634, 48.104237] // Exemple de coordonnées
    };

    try {
        const response = await axios.get(`${BASE_URL_GEO}/wfs-geoportail/search`, {
            params: {
                geom: JSON.stringify(geometry),
                source: 'CADASTRALPARCELS.PARCELLAIRE_EXPRESS', // Exemple de source
                _limit: 10, // Limite des résultats
                _start: 0 // Début des résultats
            }
        });
        res.json(response.data);
    } catch (error) {
        console.error('Erreur lors de l\'appel à l\'API Géoportail:', error);
        res.status(500).json({ message: 'Erreur lors de l\'obtention des données Géoportail.' });
    }
});

// -------------------------------------
// API Cadastre
// -------------------------------------

const BASE_URL_CADASTRE = 'https://api.gouv.fr/cadastre'; // Remplacez par l'URL correcte

// Route pour obtenir des données cadastrales
app.get('/api/cadastre/:codeInsee', async (req, res) => {
    const codeInsee = req.params.codeInsee;

    try {
        const response = await axios.get(`${BASE_URL_CADASTRE}/cadastre/parcelle`, {
            params: {
                code_insee: codeInsee
            }
        });
        res.json(response.data);
    } catch (error) {
        console.error('Erreur lors de l\'appel à l\'API Cadastre:', error);
        res.status(500).json({ message: 'Erreur lors de l\'obtention des données cadastrales.' });
    }
});

// Démarrer le serveur
app.listen(PORT, () => {
    console.log(`Le serveur est en cours d'exécution sur le port ${PORT}`);
});
