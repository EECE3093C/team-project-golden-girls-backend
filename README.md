# team-project-golden-girls-backend
Backend for obscene odds

See the frontend [here](https://github.com/EECE3093C/team-project-golden-girls).

## API 

Needed calls:
- [ ] games
- [ ] players
- [ ] teams
- [ ] bets
- [ ] leagues

| Type | Call | Description |
| - | - | - |
| GET | `/api/v1/games` | Get a list of the games|

## Setup

There are 3 different dockerfiles:

1. `Dockerfile.dev` - for development (mounts the current directory) 
2. `Dockerfile.prod` - for production
3. `Dockerfile.test` - for testing

### Development

1. Build the docker image with `docker build -f Dockerfile.dev -t oo-backend .`
2. Run the image in detached mode with `docker run --rm -p 9000:9000 --mount type=bind,source="$(pwd)",target="$(pwd)" -w $(pwd) --name oob oo-backend`
    - If you want to run the image in the background, add the `-d` flag
    - Kill the process with `Ctrl-c` (in foreground) or `docker kill oob` (in background)

### Production

1. Build the docker image with `docker build -f Dockerfile.prod -t oo-backend .`
2. Run the image in detached mode with `docker run --rm -p 9000:9000 --name oob oo-backend`
    - If you want to run the image in the background, add the `-d` flag
    - Kill the process with `Ctrl-c` (in foreground) or `docker kill oob` (in background)

### Testing

1. Build the docker image with `docker build -f Dockerfile.test -t oo-backend .`
2. Run the image in detached mode with `docker run --rm -p 9000:9000 --name oob oo-backend`
    - If you want to run the image in the background, add the `-d` flag
    - Kill the process with `Ctrl-c` (in foreground) or `docker kill oob` (in background)