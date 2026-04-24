#!/bin/sh

SSL_DIR="/etc/nginx/ssl"

mkdir -p "$SSL_DIR"

openssl req -x509 -nodes -days 365 -newkey rsa:2048 \
    -keyout "$SSL_DIR/key.pem" \
    -out "$SSL_DIR/cert.pem" \
    -subj "/C=FR/ST=Paris/L=Paris/O=42/CN=localhost"
