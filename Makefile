db:
	@docker compose exec db mysql -u root -p mysql

up:
	@docker compose up -d

down:
	@docker compose down

build:
	@docker compose up -d --build