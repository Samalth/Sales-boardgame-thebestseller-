const mysql = require('mysql');

// MySQL Connection
const connection = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "thebestseller"
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

async function modulePopUp(color, sort='question') {
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

    switch (sort) {
        case 'question':
            queryMod = 'SELECT QEnglish FROM questionstable where ID=?';
            break
        case 'answer':
            queryMod = 'SELECT QDanish FROM questionstable where ID=?';
            break
    }

            return new Promise((resolve, reject) => {
                connection.query(queryMod, [number], (error, results) => {
                    if (error) {
                        reject(error);
                        return;
                    }

                    const resultsString = JSON.stringify(results);
                    const values = results.map(entry => Object.values(entry)[0]);
                    const resultsString2 = values.join('');
                    const stringWithoutBrackets = resultsString2.replace(/^\[|\]$/g, '');
                    const stringWithoutNewlines = stringWithoutBrackets.replace(/\\n/g, '');
                    const stringFinal = stringWithoutNewlines.replace(/{|}/g, '');
                    resolve(stringFinal);
                });
            });

}

module.exports=modulePopUp;
