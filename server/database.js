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
        case 'yellow':
            number = 1
            // let number = Math.floor(Math.random() * 1) + 1;
            break
        case 'blue':
            number = 2
            break
        case 'purple':
            number = 3
            break
        case 'red':
            number = 4
            break
        case 'green':
            number = 5
            break
        case 'orange':
            number = 6
            break
        case 'rainbow':
            number = 7
            break
        case 'chance':
            number = 8
            break
        case 'sales':
            number = 9
            break
        case 'megatrends':
            number = 10
            break
    }
    const query = 'SELECT QEnglish FROM questionstable where ID=?';

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