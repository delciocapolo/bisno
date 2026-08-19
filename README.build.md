# Subir os containers

## Criar imagem

```bash
  docker compose --env-file ../secrets/.env --profile "*" build [service] --no-cache
```

## Criar um Serviço

```bash
  docker compose --env-file ../secrets/.env --profile "*" up [service] --build -d --no-deps
```

## Subir todos serviços

```bash
  docker compose --env-file ../secrets/.env --profile "*" up --build -d
```

## Remover todos serviços, inclusive os volumes, imagems, etc

```bash
  docker compose --env-file ../secrets/.env --profile "*" down -v --rmi local --remove-orphans
```

## Subir no Docker.hub

```bash
  docker push [imagem]:[tag]
```
