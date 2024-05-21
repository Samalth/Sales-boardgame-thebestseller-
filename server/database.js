const mysql = require('mysql');

// MySQL Connection
const connection = mysql.createConnection({
    host: "localhost",
    user: "deb148678_thebestseller",
    password: "password",
    database: "deb148678_thebestseller"
});
connection.connect();

const questionIDs = {
    yellow: [1, 2],
    green: [3, 4],
    purple: [5, 6],
    orange: [7, 8],
    red: [9, 10],
    blue: [11, 12],
    sales: [13, 14, 15],
    megatrends: [16, 17, 18],
    chance: [19, 20, 21],
    rainbow: [1]
};

async function modulePopUp(color, sort = 'en') {
    let number;

    switch (color) {
        case 'yellow':
        case 'green':
        case 'purple':
        case 'orange':
        case 'red':
        case 'blue':
        case 'sales':
        case 'megatrends':
        case 'chance':
        case 'rainbow':
            if (questionIDs.hasOwnProperty(color)) {
                const ids = questionIDs[color];
                const randomIndex = Math.floor(Math.random() * ids.length);
                number = ids[randomIndex];
            } else {
                number = 1;
            }
            break;
        default:
            number = 1;
            break;
    }

    let queryMod;
    switch (sort) {
        case 'en':
            queryMod = 'SELECT QEnglish AS question, AEnglish AS answer FROM questionstable WHERE ID=?';
            break;
        case 'dk':
            queryMod = 'SELECT QDanish AS question, ADanish AS answer FROM questionstable WHERE ID=?';
            break;
        case 'nl':
            queryMod = 'SELECT QDutch AS question, ADutch AS answer FROM questionstable WHERE ID=?';
            break;
        default:
            queryMod = 'SELECT QEnglish AS question, AEnglish AS answer FROM questionstable WHERE ID=?';
            break;
    }

    return new Promise((resolve, reject) => {
        connection.query(queryMod, [number], (error, results) => {
            if (error) {
                reject(error);
                return;
            }

            const { question, answer } = results[0];
            resolve({ question, answer });
        });
    });
}

module.exports = modulePopUp;