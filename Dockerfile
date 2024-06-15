#base image
FROM node:14

#container directory
WORKDIR /app

#copying package.josn files first , to help with docker caching layer
COPY package*.json ./

#to install dependencies
RUN npm install

#copy rest of directory
COPY . .

#exposing port 
EXPOSE ${PORT}

#commands to start the application
CMD ["node", "index.js"]
