NAME		= Typerun
COMPOSE		= srcs/docker-compose.yml
DOMAIN		:= $(shell grep '^DOMAIN=' srcs/.env | cut -d= -f2)

all: hosts up

up:
	docker compose -f $(COMPOSE) up --build -d

down:
	docker compose -f $(COMPOSE) down

re: down hosts up

clean: down
	docker compose -f $(COMPOSE) down -v --rmi local

fclean: clean
	docker system prune -af --volumes

logs:
	docker compose -f $(COMPOSE) logs -f

ps:
	docker compose -f $(COMPOSE) ps

hosts:
	@grep -q "$(DOMAIN)" /etc/hosts || echo "127.0.0.1 $(DOMAIN)" | sudo tee -a /etc/hosts > /dev/null
	@echo "Hosts entry: 127.0.0.1 $(DOMAIN)"

home:
	@xdg-open https://$(DOMAIN) 2>/dev/null || open https://$(DOMAIN) 2>/dev/null || echo "Open: https://$(DOMAIN)"

trust-cert:
	@if [ "$(DOMAIN)" = "localhost" ]; then exit 0; fi
	@until docker exec nginx test -f /etc/nginx/ssl/cert.pem 2>/dev/null; do sleep 1; done
	@docker cp nginx:/etc/nginx/ssl/cert.pem /tmp/$(DOMAIN).crt
	@sudo cp /tmp/$(DOMAIN).crt /usr/local/share/ca-certificates/$(DOMAIN).crt
	@sudo update-ca-certificates > /dev/null 2>&1
	@which certutil > /dev/null 2>&1 && certutil -d sql:$$HOME/.pki/nssdb -A -n $(DOMAIN) -t "CT,C,C" -i /tmp/$(DOMAIN).crt 2>/dev/null || true

.PHONY: all up down re clean fclean logs ps hosts home trust-cert
