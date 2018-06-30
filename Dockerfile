FROM node:8

# Create App Director
WORKDIR /app

# Install App Dependencies
# copying package.json first allows for caching
COPY package*.json ./ 
RUN npm install

# Copy The App Code Over 
COPY . .

# Expose Port Bound In The App
EXPOSE 3000

# Start The App
CMD [ "npm", "start" ]