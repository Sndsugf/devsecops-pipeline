
COMPOSE = docker compose -f ./srcs/compose.yaml

up:
	$(COMPOSE) up -d --build

down:
	$(COMPOSE) down

re:
	$(COMPOSE) up -d --build --always-recreate-deps

clean:
	$(COMPOSE) down -v

.PHONY: up re down clean