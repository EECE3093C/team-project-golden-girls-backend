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
{
    "date": "00/00/00",
    "team":{
        "teamName": "name",
        "teamLogo": "https://image.png",
        "teamScore": 100,
        "teamColor": "#000000"
    },
    "sportsBooks": [
        {
            "bookName": "name",
            "bookLogo": "https://image.png",
            "odds": "+000"
        }
    ]
}
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
{
    "timeFrame":{   
        "startDate": "00/00/00",
        "endDate": "00/01/00"
    },
    "games": [
        {
            "homeTeam":{
                "name": "name",
                "city": "city",
                "teamColor": "#000000",
                "logo": "https://image.png",
                "totalScore": 0,
                "quarterScores": [],
                "record": 
                {
                    "wins": 0,
                    "losses": 0
                },
                "code": "code"
            },
            "awayTeam":{
                "name": "name",
                "city": "city",
                "teamColor": "#000000",
                "logo": "https://image.png",
                "totalScore": 0,
                "quarterScores": [],
                "record": 
                {
                    "wins": 0,
                    "losses": 0
                },
                "code": "code"
            },
            "statusLong": "Scheduled",
            "statusShort": 0,
            "time": "00:00",
            "date": "00/00/00"
        }
    ]
}
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
{
    "games": [
        {
            "id": "id",
            "homeTeam":
            {
                "name": "name",
                "city": "city",
                "logo": "https://image.png",
                "totalScore": 0,
                "quarterScores": [],
                "record": 
                {
                    "wins": 0,
                    "losses": 0
                },
                "code": "code"
            },
            "awayTeam": 
            {
                "name": "name",
                "city": "city",
                "logo": "https://image.png",
                "totalScore": 0,
                "quarterScores": [],
                "record": 
                {
                    "wins": 0,
                    "losses": 0
                },
                "code": "code"
            },
            "startTime": "00:00",
            "endTime": "00:00",
            "date": "00/00/00",
            "gameStatus":
            {
                "statusLong": "Scheduled",
                "statusShort": 0,
                "gameQuarter": "Q0",
                "clock": "00:00",
                "halftime": false
            }
        }
    ]
}
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
{
    "team":
    {
        "name": "name",
        "city": "city",
        "code": "code",
        "color": "#000000"
    },
    "players":
    [
        {
            "name":
            {
                "first": "first",
                "last": "last"
            },
            "status":
            {
                "short": 0,
                "long": "Playing"
            }
        }
    ]
}
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
    {
    "teams":
    {
        "home":
        {
            "name": "name",
            "city": "city",
            "code": "code",
            "color": "#000000",
            "record": 
            {
                "wins": 0,
                "losses": 0
            }
        },
        "away":
        {
            "name": "name",
            "city": "city",
            "code": "code",
            "color": "#000000",
            "record": 
            {
                "wins": 0,
                "losses": 0
            }
        }
    },
    "matchups":
    [
        {
            "teams":
            {
                "home":{
                    "name": "name",
                    "city": "city",
                    "code": "code",
                    "score": 100,
                    "win": true
                },
                "away":
                {
                    "name": "name",
                    "city": "city",
                    "code": "code",
                    "score": 100,
                    "win": false
                }
            },
            "date": "00/00/00"
        }
    ],
    "series":
    {
        "home": 0,
        "away": 0
    }
}
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
    {
    "teams":
    {
        "home":
        {
            "name": "name",
            "city": "city",
            "code": "code",
            "color": "#000000",
            "record": 
            {
                "wins": 0,
                "losses": 0
            }
        },
        "away":
        {
            "name": "name",
            "city": "city",
            "code": "code",
            "color": "#000000",
            "record": 
            {
                "wins": 0,
                "losses": 0
            }
        }
    },
    "games":
    [
        {
            "home":
            {
                "team":
                {
                    "score": 100,
                    "win": true
                },
                "opponent":
                {
                    "name": "name",
                    "city": "city",
                    "code": "code",
                    "score": 100,
                    "record": 
                    {
                        "wins": 0,
                        "losses": 0
                    }
                }
            },
            "away":
            {
                "team":
                {
                    "score": 100,
                    "win": true
                },
                "opponent":
                {
                    "name": "name",
                    "city": "city",
                    "code": "code",
                    "score": 100,
                    "record": 
                    {
                        "wins": 0,
                        "losses": 0
                    }
                }
            }
        }
    ]
}
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
    {
    "teams":
    {
        "home":
        {
            "name": "name",
            "city": "city",
            "code": "code",
            "color": "#000000",
            "record": 
            {
                "wins": 0,
                "losses": 0
            }
        },
        "away":
        {
            "name": "name",
            "city": "city",
            "code": "code",
            "color": "#000000",
            "record": 
            {
                "wins": 0,
                "losses": 0
            }
        }
    },
    "stats":
    {
        "home":{
            "games": 0,
            "avgp": 0,
            "avgto": 0,
            "avgst": 0,
            "avgreb": 0,
            "fgp": "0%",
            "twptp": "0%"
        },
        "away":{
            "games": 0,
            "avgp": 0,
            "avgto": 0,
            "avgst": 0,
            "avgreb": 0,
            "fgp": "0%",
            "twptp": "0%"
        }
    }
}
]
```

## Setup

There are 3 different dockerfiles:

1. `Dockerfile.dev` - for development (mounts the current directory) 
2. `Dockerfile.prod` - for production
3. `Dockerfile.test` - for testing

### Development

1. Build the docker image with `docker build -f Dockerfile.dev -t oo-backend .`
2. Run the image with `docker run --rm -p 9000:9000 --mount type=bind,source="$(pwd)",target="/work" -w "/work" --name oob oo-backend`

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

## Documentation

Documentation for indavidual files will be written as comments within the specified file and will be later combined into a formal documentation of the entire program. Commits pertaining to improving file documentation or README improvements can be linked to issue **#33** [Improve Backend Document Comments](https://github.com/EECE3093C/team-project-golden-girls-backend/issues/33). Be sure to include the file(s) that were changed in the comment. Example commit message `made improvements to <filename>.js comment documentation`.
### Header
Process files will contain a header comment that contains useful information regarding the contents and history of the file. A template to be used for the header can be found below.

```js
/**
 * File: <file name>.js
 * Description: <brief description of the file purpose>
 * 
 * @author: [<author full name>]
 * @date: [Date Created: <file creation date mm/dd/yy> / Modified: <file
 * modified date mm/dd/yy>]
 * 
 * HISTORY:
 *  - <date mm/dd/yy>, <Name>(<branch used for change>): Created file.<Anyother
 * changes or immprovements made>
 */
```
