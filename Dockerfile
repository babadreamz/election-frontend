# --- Stage 1: Build the React App ---
FROM node:20 AS build
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm install
COPY . .
RUN npm run build

# --- Stage 2: Serve the App with Nginx ---
FROM nginx:alpine

# CRITICAL FIX: Explicitly remove the default configuration file(s)
# This prevents the "server directive not allowed" error.
RUN rm -f /etc/nginx/conf.d/*

# Copy the static files we built into the folder Nginx serves from
COPY --from=build /app/dist /usr/share/nginx/html

# Copy the Nginx configuration file to the template location for environment variable substitution
COPY nginx.conf /etc/nginx/templates/default.conf.template

# Use the standard Nginx Alpine command.
CMD ["nginx", "-g", "daemon off;"]
