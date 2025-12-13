# Use node image
FROM node:22-alpine

# Set working directory
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies (including devDependencies like nodemon)
RUN npm install

# Copy the rest of the code
COPY . .

# Expose port
EXPOSE 5000

# Start app (use node for production, nodemon for dev)
CMD ["npm", "run", "dev"]
