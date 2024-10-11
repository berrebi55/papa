const mongoose = require('mongoose');

const clientSchema = new mongoose.Schema({
    nom: { type: String, required: true },
    adresse: { type: String, required: true },
    ville: { type: String, required: true },
    codePostal: { type: String, required: true },
    photos: {
        facade: String,
        toit: String,
    },
    documents: {
        mandatANAH: String,
        demandeMairie: String,
    },
}, {
    timestamps: true,
});

module.exports = mongoose.model('Client', clientSchema);
