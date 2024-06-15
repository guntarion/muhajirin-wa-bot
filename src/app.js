const express = require('express');
const bodyParser = require('body-parser');
const http = require('http');
const path = require('path');
const { engine } = require('express-handlebars');
const WebSocket = require('ws');
const cors = require('cors'); // Importing cors middleware
require('dotenv').config();

const client = require('../whatsapp/muhaclient');
const viewRoutes = require('../routes/viewRoutes');
const apiRoutes = require('../routes/apiRoutes');

const app = express();
const port = process.env.PORT || 3050;

// Use CORS middleware
app.use(cors()); // Enable CORS for all routes

// Body parser middleware
app.use(bodyParser.json());
app.use(express.urlencoded({ extended: true }));

// Setup handlebars engine and views location
const viewsPath = path.join(__dirname, '../templates/views');
const partialsPath = path.join(__dirname, '../templates/partials');
const layoutsPath = path.join(__dirname, '../templates/layouts');

app.engine(
    'hbs',
    engine({
        extname: 'hbs', // sets the extension name to .hbs
        defaultLayout: 'main', // sets the default layout to main.hbs
        layoutsDir: layoutsPath, // path to layouts folder
        partialsDir: partialsPath, // path to partials folder
        helpers: {
            truncate: function (str, numWords) {
                var words = str.split(' ');
                if (words.length > numWords) {
                    words = words.slice(0, numWords);
                    return words.join(' ') + '...';
                }
                return str;
            },
        },
    })
);
app.set('view engine', 'hbs');
app.set('views', viewsPath);

// Static files
const publicDirectoryPath = path.join(__dirname, '../public');
app.use(express.static(publicDirectoryPath));

// Mount routes
app.use('/api', apiRoutes); // Includes messageRoutes, healthRoute
app.use(viewRoutes); // Routes for serving HTML pages

// Initialize WhatsApp client
client.initialize();

// WebSocket server setup
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

wss.on('connection', (ws) => {
    console.log('New WebSocket connection');
    ws.on('message', (message) => {
        console.log('received: %s', message);
    });
    ws.send(JSON.stringify({ message: 'Welcome to the WebSocket server' }));
});

app.set('wss', wss);

// Closing correctly using CTRL+C
process.on('SIGINT', async () => {
    console.log('(SIGINT) Shutting down chat gracefully... 💝');
    await client.destroy();
    console.log('client destroyed');
    process.exit(0);
});

server.listen(port, () => {
    console.info('Muhajirin Server listening on port ' + port);
});

module.exports = app;
