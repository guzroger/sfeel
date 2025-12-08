FROM node:22-alpine AS builder

#ENV CHROME_BIN="/usr/bin/chromium-browser" \
#    PUPPETEER_SKIP_CHROMIUM_DOWNLOAD="true"

ENV PUPPETEER_EXECUTABLE_PATH=/usr/bin/chromium-browser

RUN set -x \
    && apk update \
    && apk upgrade \
    && apk add --no-cache openssl\
    udev \
    ttf-freefont \
    chromium  \
    yarn

RUN yarn add puppeteer@22.8.2
RUN yarn add openssl

WORKDIR /app
#ENV NODE_ENV production

COPY package*.json ./
COPY prisma ./prisma/

# Install app dependencies
RUN npm install

COPY . .

#RUN npx prisma generate
RUN npm run build


#FROM node:18-alpine 

#WORKDIR /app

#COPY --from=builder /app/node_modules ./node_modules
#COPY --from=builder /app/package*.json ./
#COPY --from=builder /app/dist ./dist
#COPY --from=builder /app/tsconfig.json ./
#copy prisma directory
#COPY --from=builder /app/prisma ./prisma
#COPY --from=builder /app/.env ./

#CMD [ "npm", "run", "start:migrate:prod" ]
#CMD [ "node", "dist/main.js" ]
CMD ["node", "dist/src/main.js"]