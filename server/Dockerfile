FROM node:16

WORKDIR /usr/src/app

# Copy dependencies first
COPY ./package.json ./
RUN npm install

# Copy the rest of the files
COPY . .

# Build-time env var for React
ARG REACT_APP_API_URL
ENV REACT_APP_API_URL=$REACT_APP_API_URL

# Build React app
RUN npm run build

# Serve the build folder
EXPOSE 80
CMD ["npx", "serve", "-s", "build"]
