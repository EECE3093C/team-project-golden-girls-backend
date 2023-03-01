# team-project-golden-girls-backend
Backend for obscene odds

See the frontend [here](https://github.com/`EECE3093C/team-project-golden-girls).

## API 

These are calls from frontend, NOT to RapidAPI.

### Odds

The odds endpoint returns a list of odds for a given sport.

`GET /api/v1/odds` 

#### Parameters

| Attribute | Type     | Requirement | Notes             |
|-----------|----------|-------------|-------------------|
| `sport`   | `string` | optional    | Defaults to `nba` |

#### Example

`GET /api/v1/odds?sport=nba`

```json
[
    <insert example>
]
```

### Games

The games endpoint returns a list of games for a given sport.

`GET /api/v1/games`

#### Parameters

| Attribute    | Type     | Requirement | Notes             |
|--------------|----------|-------------|-------------------|
| `start_date` | `string` | required    | ISO8061 format    |
| `end_date`   | `string` | required    | ISO8061 format    |
| `sport`      | `string` | optional    | Defaults to `nba` |

#### Example

`GET /api/v1/games?sport=nba&start_date=2020-01-01&end_date=2020-01-02`

```json
[
    <insert example>
]
```

### Live

The live endpoint returns a list of live games for a given sport.

`GET /api/v1/live`

#### Parameters

| Attribute | Type     | Requirement | Notes             |
|-----------|----------|-------------|-------------------|
| `sport`   | `string` | optional    | Defaults to `nba` |

#### Example

`GET /api/v1/live?sport=nba`

```json
[
    <insert example>
]
```

### Players

The players endpoint returns a list of players for a given sport.

`GET /api/v1/players`

#### Parameters

| Attribute | Type     | Requirement | Notes             |
|-----------|----------|-------------|-------------------|
| `team`    | `string` | required    |                   |
| `sport`   | `string` | optional    | Defaults to `nba` |

#### Example

`GET /api/v1/players?sport=nba&team=tor`

```json
[
    <insert example>
]
```

### Matchups

The matchups endpoint returns a list of the last 5 matchups between two teams.

`GET /api/v1/matchups`

#### Parameters

| Attribute | Type     | Requirement | Notes             |
|-----------|----------|-------------|-------------------|
| `team1`   | `string` | required    |                   |
| `team2`   | `string` | required    |                   |
| `sport`   | `string` | optional    | Defaults to `nba` |

#### Example

`GET /api/v1/matchups?sport=nba&team1=tor&team2=phi`

```json
[
    <insert example>
]
```

### Previous

The previous endpoint returns a list of the last 10 games for a team.

`GET /api/v1/previous`

#### Parameters

| Attribute | Type     | Requirement | Notes             |
|-----------|----------|-------------|-------------------|
| `team`    | `string` | required    |                   |
| `sport`   | `string` | optional    | Defaults to `nba` |

#### Example

`GET /api/v1/previous?sport=nba&team=tor`

```json
[
    <insert example>
]
```

### Stats

The stats endpoint returns a list of stats for a team.

`GET /api/v1/stats`

#### Parameters

| Attribute | Type     | Requirement | Notes             |
|-----------|----------|-------------|-------------------|
| `team`    | `string` | required    |                   |
| `sport`   | `string` | optional    | Defaults to `nba` |

#### Example

`GET /api/v1/stats?sport=nba&team=tor`

```json
[
    <insert example>
]
```

## Setup

There are 3 different dockerfiles:

1. `Dockerfile.dev` - for development (mounts the current directory) 
2. `Dockerfile.prod` - for production
3. `Dockerfile.test` - for testing

### Development

1. Build the docker image with `docker build -f Dockerfile.dev -t oo-backend .`
2. Run the image with `docker run --rm -p 9000:9000 --mount type=bind,source="$(pwd)",target="$(pwd)" -w "$(pwd)" --name oob oo-backend`

### Production

1. Build the docker image with `docker build -f Dockerfile.prod -t oo-backend .`
2. Run the image with `docker run --rm -p 9000:9000 --name oob oo-backend`

### Testing

1. Build the docker image with `docker build -f Dockerfile.test -t oo-backend .`
2. Run the image with `docker run --rm -p 9000:9000 --name oob oo-backend`

For all of the above, you can access the app at `localhost:9000`.

- If you want to run the container in the background, add the `-d` flag
- Kill the process with `Ctrl-c` (in foreground) or `docker kill oof` (in background)

**Production and development images serve a webpage, testing does not.**