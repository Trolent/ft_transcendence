FROM nginx:alpine

RUN apk update && apk upgrade && apk add --no-cache openssl bash

COPY conf/nginx.conf /etc/nginx/nginx.conf
COPY tools/generate_ssl.sh /docker-entrypoint.sh
RUN chmod +x /docker-entrypoint.sh

EXPOSE 80 443

ENTRYPOINT ["/docker-entrypoint.sh"]
