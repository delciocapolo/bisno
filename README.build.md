# Subir os containers

```bash
  docker compose --env-file ../secrets/.env --profile "*" build evolution-api --no-cache
```

```bash
  docker compose --env-file ../secrets/.env --profile "*" up --build -d
```

## Mandar abaixo

```bash
  docker compose --env-file ../secrets/.env --profile "*" down -v --rmi local --remove-orphans
```
