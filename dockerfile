# --- STAGE 1: Build ---
FROM node:20-alpine AS build
WORKDIR /app

# Kopieer package.json + package-lock.json en installeer dependencies
COPY package*.json ./
RUN npm install

# Kopieer de rest van de frontend code
COPY . .

# Build de React app
RUN npm run build

# --- STAGE 2: Serve ---
FROM nginx:alpine
# Kopieer build output naar Nginx html folder
COPY --from=build /app/build /usr/share/nginx/html

# Expose poort 80
EXPOSE 80

# Start Nginx
CMD ["nginx", "-g", "daemon off;"]

