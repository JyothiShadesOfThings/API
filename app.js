const express = require('express');
const routes = require('./routes');
const dbconnection = require('./database/mysqlConnection')
const cors = require('cors')
const app = express();

app.use(cors())
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(routes);



const PORT = 3000;

app.listen(PORT, () => { console.log(`Server listening on port ${PORT}`); });