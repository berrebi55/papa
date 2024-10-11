const axios = require('axios');

const BASE_URL_GEO = 'https://api.gouv.fr/géoportail'; // Remplacez par l'URL de l'API Géoportail
const BASE_URL_CADASTRE = 'https://api.gouv.fr/cadastre'; // Remplacez par l'URL de l'API Cadastre

// Fonction pour interroger l'API Géoportail
async function getGeoData(geometry) {
    try {
        const response = await axios.get(`${BASE_URL_GEO}/wfs-geoportail/search`, {
            params: {
                geom: JSON.stringify(geometry),
                source: 'CADASTRALPARCELS.PARCELLAIRE_EXPRESS', // Exemple de source
                _limit: 10, // Limite des résultats
                _start: 0 // Début des résultats
            }
        });
        return response.data;
    } catch (error) {
        console.error('Erreur lors de l\'appel à l\'API Géoportail:', error);
        throw error;
    }
}

// Fonction pour interroger l'API Cadastre
async function getCadastreData(codeInsee) {
    try {
        const response = await axios.get(`${BASE_URL_CADASTRE}/cadastre/parcelle`, {
            params: {
                code_insee: codeInsee
            }
        });
        return response.data;
    } catch (error) {
        console.error('Erreur lors de l\'appel à l\'API Cadastre:', error);
        throw error;
    }
}

module.exports = {
    getGeoData,
    getCadastreData
};
