const express = require('express');
const axios = require('axios');
const rateLimit = require('express-rate-limit');
const NodeCache = require('node-cache');
require('dotenv').config(); // Load environment variables from .env file
const { swaggerUi, swaggerSpec } = require('./swagger'); //swagger api documentation


const app = express();
const port = process.env.PORT || 3000; // server runs on environment variable port or default to 3000
const cache = new NodeCache({ stdTTL: 60 }); // Cache time to live = 60 seconds for each key

const rateLimiter = rateLimit({
    windowMs: 2 * 60 * 1000, // 2 minutes Time window
    max: 20, // limit for unique ip
    message: "Too many requests, please try again later.",
    statusCode: 429
}); //in case of reaching limit , the return message : "Too many requests, please try again later." , status : 429

app.use(rateLimiter);

//This is swagger documentation
/**
 * @swagger
 * /currencyExchange:
 *   get:
 *     summary: Get currency exchange rates
 *     parameters:
 *       - in: query
 *         name: currencies
 *         schema:
 *           type: string
 *         required: true
 *         description: Comma-separated list of target currencies
 *       - in: query
 *         name: base_currency
 *         schema:
 *           type: string
 *         required: true
 *         description: Base currency for exchange rates
 *     responses:
 *       200:
 *         description: Successful response
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *       400:
 *         description: Bad request
 *       429:
 *         description: Too many requests
 *       500:
 *         description: Internal server error
 */

app.get('/currencyExchange', async (req, res) => {
    const apiKey = process.env.API_KEY; // Retrieve API key from environment variables

    if (!apiKey) {
        console.log("ERROR: No API key specified in .env file");
        return res.status(400).send('ERROR: API key not set , please add API key in .env file or when running conatiner');
    }

    const { currencies, base_currency } = req.query;
    
    //checking for api validity
    if (!currencies || !base_currency) {
        return res.status(400).send('Please provide currencies and base_currency.');
    }
    
    //cache check
    const cacheKey = `currencyExchange-${currencies}-${base_currency}`;
    const cachedData = cache.get(cacheKey);
    if (cachedData) {
        console.log('getting data from cache , cache Key : ' , cacheKey);
        return res.json(cachedData);
    }

    try {
        const response = await axios.get(`https://api.freecurrencyapi.com/v1/latest`, { //external API request
            params: {
                apikey: apiKey,
                currencies: currencies,
                base_currency: base_currency
            }
        });

        cache.set(cacheKey, response.data); //adding data to cache , it stores right responses only
        res.json(response.data);
        
    } catch (error) {
        if(error.response.status === 422){
            res.status(error.response.status).send('Error : invalid currency , please re-check if your paramters are compatible with the original api');
        }
        else if(error.response.status === 429){
            res.status(error.response.status).send('Error : You have hit your rate limit or your monthly limit');
        }
        else if(error.response.status === 401){
            res.status(error.response.status).send('Error : Invalid authentication credentials , Please check your api key');
        }
        else{
            res.status(error.response.status).send('Error calling currency API.');
        }
    }
});

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

const server = app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});

module.exports = server; //exported to be used in the test suite
