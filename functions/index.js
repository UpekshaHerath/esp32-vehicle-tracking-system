const {onRequest} = require("firebase-functions/v2/https");
const logger = require("firebase-functions/logger");
const { getFirestore } = require('firebase-admin/firestore');
const admin = require('firebase-admin');

admin.initializeApp();

const db = getFirestore();

exports.updateVehicleData = onRequest({ region: 'asia-southeast1' }, async (request, response) => {
    const { vehicleId, temperature, longitude, latitude, speed, altitude, hdop, satellites, time } = request.query;

    if (!vehicleId) {
        response.status(400).send('vehicleId is required');
        return;
    }

    try {
        const geopoint = new admin.firestore.GeoPoint(parseFloat(latitude), parseFloat(longitude));
        const timestamp = admin.firestore.Timestamp.now();

        await db.collection('Vehicles')
            .doc(vehicleId)
            .collection("History")
            .add({
                coordinate: geopoint,
                temperature: parseFloat(temperature),
                speed: parseFloat(speed),
                altitude: parseFloat(altitude),
                hdop: parseFloat(hdop),
                satellites: parseInt(satellites),
                time: timestamp
            });

        response.status(200).send('Vehicle data updated successfully');
    } catch (error) {
        logger.error('Error updating vehicle data:', error);
        response.status(500).send('Internal Server Error');
    }
});
