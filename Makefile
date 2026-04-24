NAME		= ft_transcendence
COMPOSE		= srcs/docker-compose.yml

all: up

up:
	docker compose -f $(COMPOSE) up --build

down:
	docker compose -f $(COMPOSE) down

re: down up

clean: down
	docker compose -f $(COMPOSE) down -v --rmi local

fclean: clean
	docker system prune -af --volumes

logs:
	docker compose -f $(COMPOSE) logs -f

ps:
	docker compose -f $(COMPOSE) ps

.PHONY: all up down re clean fclean logs ps
