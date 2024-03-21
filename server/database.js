const mysql = require('mysql');

// MySQL Connection
const connection = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "questionstable"
});
connection.connect();

async function databaseQuestion(color) {
    let number = 1
    switch (color){
        case 'yellow': // Lunar
            number = Math.floor(Math.random()*2) + 10;
            break
        case 'blue': // Domino House
            number = 1
            break
        case 'purple': // Klaphatten
            number = 1
            break
        case 'red': // Safeline
            number = Math.floor(Math.random()*2) + 14;
            break
        case 'green': // Top of the world
            number = Math.floor(Math.random()*2) + 12;
            break
        case 'orange': // jysk
            number = 1
            break
        case 'rainbow':
            number = 1
            break
        case 'chance':
            number = Math.floor(Math.random() * 3) + 7;
            break
        case 'sales':
            number = Math.floor(Math.random() * 3) + 1;
            break
        case 'megatrends':
            number = Math.floor(Math.random() * 3) + 4;
            break
    }
    const query = 'SELECT QEnglish FROM questions where ID=?';

    // Wrap the query in a Promise
    return new Promise((resolve, reject) => {
        connection.query(query, [number], (error, results) => {
            if (error) {
                reject(error);
                return;
            }
            resolve(results);
        });
    });
}

module.exports=databaseQuestion;