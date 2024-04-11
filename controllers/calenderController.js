const fs = require('fs').promises;
const path = require('path');
const process = require('process');
const { authenticate } = require('@google-cloud/local-auth');
const { google } = require('googleapis');
const moment = require('moment-timezone');

exports.setCalendar = async (req, res) => {
    const {email}= req.body;

    const SCOPES = ['https://www.googleapis.com/auth/calendar'];

    /**
     * Reads previously authorized credentials from the save file.
     *
     * @return {Promise<OAuth2Client|null>}
     */
    async function loadSavedCredentialsIfExist() {
        try {
            const credentials = {
                type: "authorized_user", 
                client_id: process.env.CLIENT_ID, 
                client_secret: process.env.CLIENT_SECRET, 
                refresh_token: process.env.REFRESH_TOKEN
            };
            return google.auth.fromJSON(credentials);
        } catch (err) {
            return null;
        }
    }

    /**
     * Serializes credentials to a file compatible with GoogleAuth.fromJSON.
     *
     * @param {OAuth2Client} client
     * @return {Promise<void>}
     */

    async function authorize() {
        let client = await loadSavedCredentialsIfExist();
        if (client) {
            return client;
        }
    }

    /**
     * Lists the next 10 events on the user's primary calendar.
     * @param {google.auth.OAuth2} auth An authorized OAuth2 client.
     */

    async function addEvent(auth) {
        const calendar = google.calendar({ version: 'v3', auth });

        calendar.events.insert({
            auth: auth,
            calendarId: 'primary',
            resource: event,
        }, function (err, event) {
            if (err) {
                console.log('There was an error contacting the Calendar service: ' + err);
                return;
            }
            console.log('Event created: %s', event.htmlLink);
        });
    }

    authorize()
        .then((auth) => addEvent(auth).then(() => {
            res.status(201).json({ message: 'Done!' });
        })).catch(console.error);

    const options = { timeZone: 'Asia/Kolkata' };

    const currentDate = moment.tz('Asia/Kolkata').toDate();
    const endDate = moment.tz('Asia/Kolkata').add(10, 'minutes').toDate();

    const event = {
        'summary': 'User Login Event',
        'start': {
            'dateTime': currentDate,
            'timeZone': options.timeZone,
        },
        'end': {
            'dateTime': endDate,
            'timeZone': options.timeZone,
        },
        'attendees': [
            { email: email }
        ],
    };

}