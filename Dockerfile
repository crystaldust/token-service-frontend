FROM node

ADD ./package.json /project/package.json
ADD ./package-lock.json /project/package-lock.json
ADD ./public /project/public
ADD ./src /project/src
ADD ./yarn.lock /project/yarn.lock

WORKDIR /project
RUN npm install
RUN npm run build


FROM nginx
COPY --from=0 /project/build /dist
ADD ./token-service-webconsole.conf /etc/nginx/conf.d/token-service-webconsole.conf
