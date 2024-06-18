# Currency-exchange-API
Currency Exchange API Integration pet project

to run project ,  you need these dependencies

1. please add your api key to .env file , you can get your key from : https://freecurrencyapi.com 
2. install these dependencies , note : install npm first

npm install express axios dotenv 
npm install --save-dev jest supertest
npm install express-rate-limit
npm install node-cache
npm install swagger-ui-express swagger-jsdoc

================================================
To test the project:
npm test
================================================
To run Docker compose :
docker-compose up --build
================================================

//NOTE: http://localhost:{PORT}/api-docs/ , to view api documentation

//NOTE: to test the rate limiter , change the  max: 20, // limit for unique ip in index.js to 5 
//it was adjusted to 20 because Swagger sent more than 5 requests to server , so i needed to increase the limit for 
//swagger to work properly
