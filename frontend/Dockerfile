# Use official Node.js image
FROM node:24 AS dev

# Set working directory
WORKDIR /app

# Copy package files and install dependencies
COPY . .

RUN npm install -g @angular/cli

RUN npm install

# Expose the port used by Angular's dev server
EXPOSE 4200

# Start Angular in development mode
CMD ["npm", "run", "start"]
