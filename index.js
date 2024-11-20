const express = require('express');
const axios = require('axios');
const app = express();

app.set('view engine', 'pug');
app.use(express.static(__dirname + '/public'));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// * Please DO NOT INCLUDE the private app access token in your repo. Don't do this practicum in your normal account.
const PRIVATE_APP_ACCESS = ''; // Replace with your token when testing locally

// TODO: ROUTE 1 - Fetch and display custom object data on the homepage
app.get('/', async (req, res) => {
    const customObjectsURL = 'https://api.hubspot.com/crm/v3/objects/custom_object_name'; // Replace with your custom object name
    const headers = {
        Authorization: `Bearer ${PRIVATE_APP_ACCESS}`,
        'Content-Type': 'application/json',
    };

    try {
        const response = await axios.get(customObjectsURL, { headers });
        const customObjects = response.data.results;
        res.render('index', { title: 'Custom Objects', data: customObjects });
    } catch (error) {
        console.error('Error fetching custom objects:', error);
        res.status(500).send('Error fetching custom objects');
    }
});

// TODO: ROUTE 2 - Render a form for creating or updating custom object data
app.get('/form', (req, res) => {
    res.render('form', { title: 'Create or Update Custom Object' });
});

// TODO: ROUTE 3 - Handle form submission to create or update custom object data
app.post('/form', async (req, res) => {
    const { id, property1, property2 } = req.body; // Replace `property1` and `property2` with actual property names
    const customObjectURL = id
        ? `https://api.hubspot.com/crm/v3/objects/custom_object_name/${id}` // Update endpoint
        : 'https://api.hubspot.com/crm/v3/objects/custom_object_name'; // Create endpoint
    const method = id ? 'patch' : 'post';

    const headers = {
        Authorization: `Bearer ${PRIVATE_APP_ACCESS}`,
        'Content-Type': 'application/json',
    };

    const payload = {
        properties: {
            property1,
            property2,
        },
    };

    try {
        await axios({
            method,
            url: customObjectURL,
            headers,
            data: payload,
        });
        res.redirect('/');
    } catch (error) {
        console.error('Error creating/updating custom object:', error);
        res.status(500).send('Error creating/updating custom object');
    }
});

// * Sample route for reference
app.get('/contacts', async (req, res) => {
    const contacts = 'https://api.hubspot.com/crm/v3/objects/contacts';
    const headers = {
        Authorization: `Bearer ${PRIVATE_APP_ACCESS}`,
        'Content-Type': 'application/json',
    };
    try {
        const resp = await axios.get(contacts, { headers });
        const data = resp.data.results;
        res.render('contacts', { title: 'Contacts | HubSpot APIs', data });
    } catch (error) {
        console.error(error);
    }
});

// * Localhost
app.listen(3000, () => console.log('Listening on http://localhost:3000'));
