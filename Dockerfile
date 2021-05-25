  
FROM node:12-alpine

WORKDIR /cigar2

COPY package.json .
COPY yarn.lock .

RUN yarn install --production --silent

COPY . .

ENTRYPOINT []

CMD ["node","index.js"]