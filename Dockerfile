FROM node:17-stretch as builder
WORKDIR /usr/src/app
COPY package.json .
RUN yarn install
COPY . ./
RUN yarn build

FROM nginx:stable as deployment
COPY --from=builder /usr/src/app/build/ /usr/share/nginx/html/
RUN rm /etc/nginx/conf.d/default.conf
COPY nginx/nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80

# Copy .env file and shell script to container
WORKDIR /usr/share/nginx/html
COPY ./env.sh .
COPY ./.docker-env /usr/share/nginx/html/.env
# Make our shell script executable
RUN chmod +x env.sh

CMD ["/bin/bash", "-c", "/usr/share/nginx/html/env.sh && nginx -g \"daemon off;\""]