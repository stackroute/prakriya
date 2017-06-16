FROM mhart/alpine-node

RUN apk update && \
    apk add git && \
    apk add python build-base

# Create app directory
RUN mkdir -p /usr/src/app && echo "Prakriya"
WORKDIR /usr/src/app

#Install App dependencies
COPY package.json /usr/src/app/
RUN npm install

#Bundle app source
COPY . /usr/src/app/

EXPOSE 8080

WORKDIR /usr/src/app

CMD ["npm", "run", "serve"]
