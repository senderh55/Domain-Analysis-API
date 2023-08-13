# Use the official Node.js image as the base image for the application
FROM node:14

# Set the working directory in the container
WORKDIR /app

# Copy package.json and package-lock.json to the working directory
COPY package*.json ./

# Install application dependencies
RUN npm install

# Copy the entire project directory to the container
COPY . .

# Expose the port your application is running on 
EXPOSE 3000

# Start your application
CMD ["npm", "start"]
