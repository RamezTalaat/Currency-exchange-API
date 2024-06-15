const request = require('supertest');
const app = require('./index'); 

describe('GET /currencyExchange', () => {
    it('should return status 200 and data for valid request', async () => {
        const response = await request(app)
            .get('/currencyExchange')
            .query({ currencies: 'EUR,USD,CAD', base_currency: 'USD' });

        expect(response.status).toBe(200);
        expect(response.body).toBeDefined();
    });

    it('should return status 422 for invalid currency base currency , EGP not supported', async () => {
        const response = await request(app)
            .get('/currencyExchange')
            .query({ currencies: 'EUR,USD,CAD', base_currency: 'EGP' }); //EGP not supported by original api

        expect(response.status).toBe(422);
    });

    it('should return status 422 for invalid currency currency , EGP not supported', async () => {
        const response = await request(app)
            .get('/currencyExchange')
            .query({ currencies: 'EGP', base_currency: 'USD' }); //EGP not supported by original api

        expect(response.status).toBe(422);
    });

    it('should return status 400 for invalid api call , currencies not provided', async () => {
        const response = await request(app)
            .get('/currencyExchange')
            .query({ currencies: '', base_currency: 'USD' }); //empty currency

        expect(response.status).toBe(400);
    });
    it('should return status 400 for invalid api call , base_currency not provided', async () => {
        const response = await request(app)
            .get('/currencyExchange')
            .query({ currencies: 'USD', base_currency: '' }); //empty currency

        expect(response.status).toBe(400);
    });


    //NOTE: to test the rate limiter , change the  max: 20, // limit for unique ip in index.js to 5 
    //it was adjusted to 20 because Swagger sent more than 5 requests to server , so i needed to increase the limit for 
    //swagger to work properly

    // it('should return status 429 for passing the rate limit ,Assuming the limit is 5 requests per 2 Minutes', async () => {

    //     const response = await request(app) //this would be the 6th request , which passes the limit
    //         .get('/currencyExchange')
    //         .query({ currencies: 'EUR', base_currency: 'USD' }); 

    //     expect(response.status).toBe(429);
    // });



   
});
