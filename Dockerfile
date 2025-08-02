# Use an official Node.js runtime as a parent image (LTS Alpine is small and secure)
FROM node:18-alpine

# Set the working directory in the container
WORKDIR /app

# Copy package.json and package-lock.json to leverage Docker cache
COPY package*.json ./

# Install application dependencies
RUN npm install

# Copy the rest of the application source code
COPY . .

# App's port (assuming 5000, change if different)
EXPOSE 5000

# The command to run your app using nodemon for development
# This uses the "dev" script from your package.json
CMD [ "npm", "run", "dev" ]