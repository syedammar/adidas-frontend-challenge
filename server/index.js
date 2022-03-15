const express = require('express');
const cors = require('cors');
const db = require('./sqlConnection');
const axios = require('axios').default;
const app = express();

const FOOTBALL_API = 'https://api.football-data.org/v2';
const AUTH_TOKEN = 'e3d6dd6e2ec54bc6b9d2c0f831a53bfc';

// Enable cors security headers
app.use(cors());

// add an express method to parse the POST method
app.use(express.json());

app.get('/', (request, res) => {
    res.send('Hi There')
});

app.post('/login', (request, response) => {
    let email = request.body.email;
	let password = request.body.password;
    if (email && password) {
        db.query('SELECT * FROM users WHERE email = ? AND password = ?', [email, password],function(error, results, fields) {
            // If there is an issue with the query, output the error
			if (error) {
                response.status(404).send({error: error})
            }
			// If the account exists
			if (results.length > 0) {
                response.send({
                    token: 'test123',
                    user: {
                        id: results[0].id,
                        name: results[0].name,
                        email: results[0].email
                    }

                });
                response.end();
			} else {
				response.send({error:'Incorrect Username and/or Password!'});
            }
        })
    } else {
        response.send('Please enter Username and Password!');
		response.end();
    }
});

app.post('/save-players', async (request, response) => {
    let userId = request.body.userId;
	let players = request.body.players;
    let teamId = request.body.teamId;
    const totalNoOfPlayers = await getSelectedPlayersFromNationalTeam(teamId);
    console.log(totalNoOfPlayers);
    let updatedPlayerArray = players.map(player => {
        return [
            userId,
            teamId,
            player.teamName,
            player.id,
            player.name,
            player.nationality,
            player.position
        ]
    });
    if (userId && players && teamId) {
        const InsertQuery = "INSERT INTO selected_players (userId, teamId, teamName, playerId, name, nationality, position) VALUES ?";
        db.query(InsertQuery, [updatedPlayerArray], function (err, result) {
            if (err) throw err;
            console.log("Number of records inserted: " + result.affectedRows);
            response.status(200).json({
                no_of_players: totalNoOfPlayers.length + 1
            });
          });
    }   else {
        response.status(400).send('Bad Request');
		response.end();
    }
});

function getSelectedPlayersFromNationalTeam (teamId) {
    return new Promise((resolve, reject) => {
        const SelectQuery = " SELECT * FROM selected_players WHERE teamId = "+teamId;
    db.query(SelectQuery, function (err, result) {
        if (err) reject(err);
        resolve(result);
    });
    })
}

app.post('/create-team', (request, response) => {
    let userId = request.body.userId;
	let userTeamPlayersIds = request.body.userTeamPlayersIds;
    let userTeamName = request.body.userTeamName;
    
    if (userId && userTeamPlayersIds && userTeamName) {
        const InsertQuery = `INSERT INTO teams (userId, userTeamName, userTeamPlayersIds) VALUES (${userId}, '${userTeamName}', '${userTeamPlayersIds}')`;
        db.query(InsertQuery, function (err, result) {
            if (err) throw err;
            console.log("Number of records inserted: " + result.affectedRows);
            response.status(200).json(result);
          });
    }   else {
        response.status(400).send('Bad Request');
		response.end();
    }
});

/* Get all teams of loggedIn user */
app.get('/get-user-team/:userId', (request, response) => {
    const userId = request.params.userId;
    if (!userId) {
        response.statusMessage = "Bad Request";
        response.sendStatus(400);
    }
    const SelectQuery = " SELECT * FROM teams WHERE userId = "+userId;
        db.query(SelectQuery, (err, result) => {
            if (err) {
                response.status(200).json({
                    'error':err,
                     teams: []
                })
            } else {
                response.status(200).json({
                    statusCode: 200,                    
                    teams:  result
                })
            }
        })
})

/* Get all selected players of loggedIn user */
app.get('/get-selected-players/:userId', (request, response) => {
    const userId = request.params.userId;
    if (!userId) {
        response.statusMessage = "Bad Request";
        response.sendStatus(400);
    }
    const SelectQuery = " SELECT * FROM selected_players WHERE userId = "+userId;
        db.query(SelectQuery, (err, result) => {
            if (err) {
                response.status(200).json({
                    'error':err,
                     players: []
                })
            } else {
                response.status(200).json({
                    statusCode: 200,                    
                    players:  result
                })
            }
        })
})

/* Get all competitions */
app.get('/get-competitions', async (request, response) =>{
    const plan = request.query.plan;
    const area = request.query.area;
    try {
        const result = await getData(
            'competitions',
            {
                competitionId: '',
                teamId: '',
                playerId:''
            },
            {
                plan: plan ? plan : '',
                area: area ? area : '' 
            }
        );
        if (result.status === 200) {
            if (result.data.count > 0) {
                response.status(200).json({
                    statusCode: 200,                    
                    competitions:  result.data.competitions,
                    count: result.data.count
                })
            } else {
                response.status(200).json({
                    statusCode: 200,
                    competitions:[],
                    count: 0
                })
            }        
            response.end();
        } else {
            response.status(result.status).json({
                statusCode: result.status,
                competitions:[],
                count: 0
            })
        }
    } catch (error) {
        console.log(error.response);
        if (error.response) {
            response.sendStatus(error.response.status).json(
                error.response.data
            );
        } else {
            response.sendStatus(500);
        }
    }
})

/* Get all teams participated in given competition */
app.get('/get-football-teams/:competitionId', async (request, response) => {

    const competitionId = request.params.competitionId;
    if (!competitionId) {
        response.statusMessage = "Bad Request";
        response.sendStatus(400);
    }
    try {
        const result = await getData(
            'competitions-team',
            {
                competitionId: competitionId,
                teamId: '',
                playerId:''
            },
            {
                limit: ''
            }
        );
        if (result.status === 200) {
            if (result.data.count > 0) {
                response.status(200).json({
                    statusCode: 200,
                    data: result.data.teams
                })
            } else {
                response.status(200).json({
                    statusCode: 200,
                    data: []
                })
            }        
            response.end();
        } else {
            response.status(result.status).json({
                statusCode: result.status,
                data: result.data
            })
        }
    } catch (error) {
        console.log(error);
        if (error.response) {
            response.sendStatus(error.response.status).json(
                error.response.data
            );
        } else {
            response.sendStatus(500);
        }
    }

});

/* Get teams detail by team id*/
app.get('/get-team-detail/:teamId', async (request, response) => {

    const teamId = request.params.teamId;
    if (!teamId) {
        response.statusMessage = "Bad Request";
        response.sendStatus(400);
    }
    try {
        const result = await getData(
            'team-detail',
            {
                competitionId: '',
                teamId: teamId,
                playerId:''
            },
            {
                limit: ''
            }
        );
        if (result.status === 200) {
            response.status(200).json({
                statusCode: 200,
                data: result.data
            })
            response.end();
        } else {
            response.status(result.status).json({
                statusCode: result.status,
                data: result.data
            })
        }
    } catch (error) {
        console.log(error);
        response.sendStatus(500);
    }

});

/* Get player detail by player id*/
app.get('/get-player-detail/:playerId', async (request, response) => {

    const playerId = request.params.playerId;
    if (!playerId) {
        response.statusMessage = "Bad Request";
        response.sendStatus(400);
    }
    try {
        const result = await getData(
            'player-detail',
            {
                competitionId: '',
                teamId: '',
                playerId:playerId
            },
            {
                limit: ''
            }
        );
        if (result.status === 200) {
            response.status(200).json({
                statusCode: 200,
                data: result.data
            })
            response.end();
        } else {
            response.status(result.status).json({
                statusCode: result.status,
                data: result.data
            })
        }
    } catch (error) {
        console.log(error);
        response.sendStatus(500);
    }

});

async function getData (type, data, filter) {
    let url;
    let {competitionId, teamId, playerId} = data;
    console.log('/competitions?plan='+filter.plan+'&area='+filter.area);
    switch (type) {
        case 'competitions':
            url = '/competitions?plan='+filter.plan+'&area='+filter.area;
            break;
        case 'competitions-team':
            url = '/competitions/'+competitionId+'/teams';
            break;
        case 'team-detail':
            url = '/teams/'+teamId;
            break;
        case 'player-detail':
            url = '/players/'+playerId;
        default:
            break;
    }
    let options = {
        'method': 'GET',
        'url': FOOTBALL_API+url,
        'headers': {
          'X-Auth-Token': AUTH_TOKEN
        }
      };
    return await axios(options);
}

app.listen(3001, () => console.log('API is running on http://localhost:3001/'));

