NAME		= Typerun
COMPOSE		= srcs/docker-compose.yml
COMPOSE_DEV	= srcs/docker-compose.dev.yml
DOMAIN		:= $(shell grep '^DOMAIN=' srcs/.env | cut -d= -f2)

all: hosts up

up:
	docker compose -f $(COMPOSE) up --build -d
	@printf "\n\033[1;32m  [OK] $(NAME) is up and running!\033[0m\n\n"
	@printf "\033[1;36m  ┌───────────────────────────────────────────┐\033[0m\n"
	@printf "\033[1;36m  │\033[0m  https://$(DOMAIN)                        \033[1;36m│\033[0m\n"
	@printf "\033[1;36m  └───────────────────────────────────────────┘\033[0m\n\n"

dev: hosts
	docker compose -f $(COMPOSE) -f $(COMPOSE_DEV) up --build -d
	@printf "\n\033[1;33m  [DEV] $(NAME) is up in dev mode!\033[0m\n\n"
	@printf "\033[1;36m  ┌───────────────────────────────────────────┐\033[0m\n"
	@printf "\033[1;36m  │\033[0m  Frontend  ->  http://$(DOMAIN):5173      \033[1;36m│\033[0m\n"
	@printf "\033[1;36m  │\033[0m  Backend   ->  http://$(DOMAIN):3000      \033[1;36m│\033[0m\n"
	@printf "\033[1;36m  │\033[0m  Database  ->  $(DOMAIN):5432             \033[1;36m│\033[0m\n"
	@printf "\033[1;36m  └───────────────────────────────────────────┘\033[0m\n\n"

down:
	docker compose -f $(COMPOSE) -f $(COMPOSE_DEV) down

re: down hosts up

clean: down
	docker compose -f $(COMPOSE) -f $(COMPOSE_DEV) down -v --rmi local

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

prisma:
	@docker exec backend pkill -f "prisma studio" 2>/dev/null || true
	@docker compose -f $(COMPOSE) -f $(COMPOSE_DEV) exec -d backend npx prisma studio --port 5555
	@sleep 2
	@xdg-open http://localhost:5555 2>/dev/null || open http://localhost:5555 2>/dev/null || echo "Open: http://localhost:5555"

trust-cert:
	@if [ "$(DOMAIN)" = "localhost" ]; then exit 0; fi
	@until docker exec nginx test -f /etc/nginx/ssl/cert.pem 2>/dev/null; do sleep 1; done
	@docker cp nginx:/etc/nginx/ssl/cert.pem /tmp/$(DOMAIN).crt
	@sudo cp /tmp/$(DOMAIN).crt /usr/local/share/ca-certificates/$(DOMAIN).crt
	@sudo update-ca-certificates > /dev/null 2>&1
	@which certutil > /dev/null 2>&1 && certutil -d sql:$$HOME/.pki/nssdb -A -n $(DOMAIN) -t "CT,C,C" -i /tmp/$(DOMAIN).crt 2>/dev/null || true

.PHONY: all up dev down re clean fclean logs ps hosts home trust-cert
