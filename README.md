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

1. Build the docker image with `docker build -f Dockerfile.prod -t oo-backend .`
2. Run the image in detached mode with `docker run -p 9000:9000 -d --name oob oo-backend `
    - Kill the process with `docker kill oob`
    - If you want to run the image in the foreground, remove the `-d` flag