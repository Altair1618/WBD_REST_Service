FROM node:18-alpine

WORKDIR /app

COPY package*.json ./

# node-canvas requirements
RUN apk add --update --no-cache \
    make \
    g++ \
    jpeg-dev \
    cairo-dev \
    giflib-dev \
    pango-dev \
    libtool \
    autoconf \
    automake

RUN npm install

# install fonts
COPY fonts/* /usr/share/fonts/
RUN fc-cache

COPY . .

EXPOSE 3000

CMD ["npm", "run", "dev"]
