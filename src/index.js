const express = require('express');

// intializations 
const app express();

// settings 
app.set('port', process.env.PORT || 4000);

// MIddlewares muestran las solicitudes de la base darso
// morgan