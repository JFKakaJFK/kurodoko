FROM node:12

RUN mkdir /web
WORKDIR /web

ADD package.json .
RUN npm install

ENV GATSBY_API_URI=http://localhost:4000/graphql

COPY . .

RUN node ./node_modules/gatsby/cli.js telemetry --disable\
  && node ./node_modules/gatsby/cli.js build

CMD ["node", "./node_modules/gatsby/cli.js", "serve", "-H", "0.0.0.0", "-p", "4444"]