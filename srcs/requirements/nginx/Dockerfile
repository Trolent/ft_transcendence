FROM nginx:alpine

RUN apk update && apk upgrade && apk add --no-cache openssl

COPY tools/generate_ssl.sh /tmp/generate_ssl.sh
RUN chmod +x /tmp/generate_ssl.sh && /tmp/generate_ssl.sh

COPY conf/nginx.conf /etc/nginx/nginx.conf

EXPOSE 80 443
