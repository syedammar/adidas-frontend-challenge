# pull the Node.js image to run this application inside a container 
FROM node:alpine

#working directory as /app
WORKDIR /app

#copy the package-lock.json and package.json from the computer to /app on the client’s Docker image
COPY package.json ./
COPY package-lock.json ./

# Copy everything from our client root folder to the client container’s working directory.
COPY ./ ./

RUN npm i
CMD ["npm", "run", "start"]