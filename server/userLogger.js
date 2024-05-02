const { json } = require('express');
const fs = require('fs');

const readData = () => {
    try {
      const data = fs.readFileSync('data.json', 'utf8');
      return JSON.parse(data);
    } catch (err) {
      console.error('Error reading file:', err);
      return null;
    }
};

// Write JSON file
const writeData = (jsonData) => {
    try {
        // jsonData['users'].forEach(user => {
        //     console.log(user['id']);
        // });
        fs.writeFileSync('data.json', JSON.stringify(jsonData, null, 2));
        // console.log('Data written to file successfully.');
    } catch (err) {
        console.error('Error writing to file:', err);
    }
};

// Delete user by ID
const deleteUser = (userId) => {
    let data = readData();
    if (!data) return;

    data.users = data.users.filter(user => user.id !== userId);

    writeData(data);
};

// Add a new user
const addUser = (user) => {
    let data = readData();
    if (!data) return;

    data.users.push(user);

    writeData(data);
};

// Update user by ID
const updateUser = (userId, newData) => {
    let data = readData();
    if (!data) return;

    const index = data.users.findIndex(user => user.id === userId);
    if (index !== -1) {
        data.users[index] = { ...data.users[index], ...newData };
        writeData(data);
    } else {
        console.error('User not found1.');
    }
};

function getRoom(socketid) {
    let data = readData();
    if (!data) return null;

    const user = data.users.find(user => user.id === socketid);
    if (user) {
        return user.room;
    } else {
        console.error('User not found2.');
        return null;
    }
};

// Get user by name
function getUserIDByName(name) {
    let data = readData();
    if (!data) return null;

    const user = data.users.find(user => user.name === name);
    if (user) {
        return user.id;
    } else {
        console.error('User not found!2');
        return null;
    }
}


function getPoints(id) {
    let data = readData();
    if (!data) return null;

    const user = data.users.find(user => user.id === id)
    if (user) {
        console.log(user.points + ' points test')
        return user.points;
    } else {
        console.error('User not found3.');
        return null;
    }
}

function availability(socketid, userName, userRoom, userStrat) {
    let data = readData();
    if (!data) return 'available';

    for (let user of data.users) {
        if (user.name === userName && user.room === userRoom) {
            return 'Name already in use';
        }
        if (user.strategy === userStrat && user.room === userRoom) {
            return 'Strategy already in use';
        }
    }
    return 'available';
}

function getData(socketid) {
    let data = readData();
    if (!data) return null;
    const user = data.users.find(user => user.id === socketid);
    const room = user.room;
    const users = data.users.filter(user => user.room === room);
    if (users) {
        return users
    } else {
        console.error('User not found4.');
        return null;
    }
}
function getStrategy(socketid) {
    let data = readData();
    if (!data) return null;
    const user = data.users.find(user => user.id === socketid);
    
    if (user) {
        var strategy = user.strategy.toLowerCase()
        switch (strategy) {
            case 'top of the world':
            strategy = 'world'
            break
        case 'jysk telepartner':
            strategy = 'jysk'
            break
        case 'domino house':
            strategy = 'domino'
            break
        default:
            strategy = strategy
            break
        }
        return strategy
    } else {
        console.error('User not found5.');
        return null;
    }
}

function getColor(socketid) {
    let data = readData();
    if (!data) return null;
    const user = data.users.find(user => user.id === socketid);

    if (user) {
        const strategy = user.strategy.toLowerCase()
        var color = ''
        switch (strategy) {
            case 'top of the world':
                color = 'green'
                break
            case 'jysk telepartner':
                color = 'orange'
                break
            case 'domino house':
                color = 'blue'
                break
            case 'lunar':
                color = 'yellow'
                break
            case 'klaphatten':
                color = 'purple'
                break
            case 'safeline':
                color = 'red'
                break
        }
        return color
    } else {
        console.error('User not found5.');
        return null;
    }
}

function getReceiver(room, questionColor) {
    let data = readData();
    if (!data) return null;
    const users = data.users.filter(user => user.room === room);

    for (let user of users) {
        var strategy = user.strategy.toLowerCase()
        var color = ''
        switch (strategy) {
            case 'top of the world':
                color = 'green'
                break
            case 'jysk telepartner':
                color = 'orange'
                break
            case 'domino house':
                color = 'blue'
                break
            case 'lunar':
                color = 'yellow'
                break
            case 'klaphatten':
                color = 'purple'
                break
            case 'safeline':
                color = 'red'
                break
        }

        if (questionColor === color) {
            return user.id
        }
    }
}

function userLogger(method, socketid, info=""){
    switch(method){
        case 'log':
            addUser({id: socketid, language: 'NL', room: '', name: '', points: 0, strategy:''})
            break
        case 'delete':
            deleteUser(socketid)
            break
        case 'updateName':
            updateUser(socketid, {name: info})
            break
        case 'updatePoints':
            updateUser(socketid, {points: info})
            break
        case 'updateRoom':
            updateUser(socketid, {room: info})
            break
        case 'updateStrategy':
            updateUser(socketid, {strategy: info})
            break
        case 'getRoom':
            return getRoom(socketid)
        case 'getPoints':
            return getPoints(info)
        case 'getStrategy':
            return getStrategy(socketid)
        case 'getUserIDByName':
            return getUserIDByName(info);
        case 'checkAvailability':
            return availability(socketid, info.name, info.room, info.strategy)
        case 'getData':
            return getData(socketid)
        case 'getColor':
            return getColor(socketid)
        case 'getReceiver':
            return getReceiver(info.room, info.color)
    }
}

module.exports=userLogger;