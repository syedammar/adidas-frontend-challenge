const mysql = require('mysql2');

const db = mysql.createPool({
    multipleStatements: true,
    host: 'localhost', // the host name MYSQL_DATABASE
    //port: '', // uncomment add port number on which MYSQL is running , default is 3306 
    user: 'root', // database user MYSQL_USER
    password: '', // database user password MYSQL_PASSWORD
})

db.getConnection(function(err, connection){
    if (err) throw err;
    /* connection.query("DROP DATABASE football_worldcup", function(err, data){
        if (err) throw err;
        console.log("Database dropped");
    });
    return; */
    connection.query("CREATE DATABASE IF NOT EXISTS football_worldcup", function(err, data){
        if (err) throw err;
        console.log("Database created");
        connection.changeUser({database : "football_worldcup"});
        if (data) {
            let sqlQueries = `CREATE TABLE IF NOT EXISTS users ( 
                id int(11) NOT NULL AUTO_INCREMENT,
                name varchar(50) NOT NULL, 
                email varchar(100) NOT NULL,
                password varchar(255) NOT NULL, 
                PRIMARY KEY (id)
                ) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8;`;
                sqlQueries += `CREATE TABLE IF NOT EXISTS selected_players (
                    id int(11) NOT NULL AUTO_INCREMENT,
                    userId varchar(11) NOT NULL,
                    teamId varchar(11) NOT NULL,
                    teamName varchar(100) NOT NULL,
                    playerId varchar(11) NOT NULL, 
                    name varchar(50) NOT NULL, 
                    nationality varchar(30) NOT NULL, 
                    position varchar(30) NOT NULL, 
                    PRIMARY KEY (id)
                    ) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8;`;
                sqlQueries += `CREATE TABLE IF NOT EXISTS teams (
                    id int(11) NOT NULL AUTO_INCREMENT,
                    userId varchar(11) NOT NULL,
                    userTeamName varchar(50) NOT NULL,
                    userTeamPlayersIds varchar(50) NOT NULL,
                    PRIMARY KEY (id)
                    ) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8;`;
                connection.query(sqlQueries, function(err, results, fields) {
                if (err) {
                    console.log('Data migration failed '+err.message);
                } else {
                    let insertUser = `INSERT INTO users (name, email, password) VALUES ('Test User', 'user@test.com', '123456')`;

                    connection.query(insertUser, function(err, results, fields) {
                        if (err) {
                        console.log(err.message);
                        }
                        console.log('1 log inserted');
                    });
                }
            });
        }
    });
});

