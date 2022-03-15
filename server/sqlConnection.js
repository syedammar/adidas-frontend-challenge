// Importing MySQL module
const mysql = require('mysql2');

/* const db = mysql.createPool({
    host: 'localhost', // the host name MYSQL_DATABASE
    user: 'root', // database user MYSQL_USER
    password: '', // database user password MYSQL_PASSWORD
    database:'football_worldcup'
}); */

const db = mysql.createPool({
    host: 'mysql_db', // the host name MYSQL_DATABASE: node_mysql
    user: 'MYSQL_USER', // database user MYSQL_USER: MYSQL_USER
    password: 'MYSQL_PASSWORD', // database user password MYSQL_PASSWORD: MYSQL_PASSWORD
    database:'football_worldcup'
});

module.exports = db;