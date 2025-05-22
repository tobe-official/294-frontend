# CheatcheetDB

## Development server

To start a local development server, run:

```bash
ng serve
```

start db:
```bash
docker compose up -d pocketbase
```

start the whole app with docker
```bash
docker compose up -d 
```

*on the first startup of pocketbase*
go to the logs and click the url to create a new superuser. or else you wont be able to use the admin dashboard
