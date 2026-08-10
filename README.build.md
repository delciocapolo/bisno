# Subir os containers

## Any Service

```bash
  docker compose --env-file ../secrets/.env --profile "*" build [service] --no-cache
```

```bash
  docker compose --env-file ../secrets/.env --profile "*" up --build -d
```

```bash
  docker compose --env-file ../secrets/.env --profile "*" down -v --rmi local --remove-orphans
```

```bash
  docker push [imagem]:[tag]
```
