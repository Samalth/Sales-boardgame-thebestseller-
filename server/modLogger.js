const { json } = require('express');
const fs = require('fs');

function generateGamepin() {
    const characters = '01234A5S6789M';
    const length = 5; // Lengte gamepin
    let pin = '#';
    for (let i = 0; i < length; i++) {
        const randomIndex = Math.floor(Math.random() * characters.length);
        pin += characters[randomIndex];
    }
    return pin;
}

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
        fs.writeFileSync('data.json', JSON.stringify(jsonData, null, 2));
    } catch (err) {
        console.error('Error writing to file:', err);
    }
};

// Delete mod by ID
const deleteMods = (modsId) => {
    let data = readData();
    if (!data) return;

    data.mods = data.mods.filter(mods => mods.id !== modsId);

    writeData(data);
};

// Add a new user
const addMods = (mods) => {
    let data = readData();
    if (!data) return;

    data.mods.push(mods);

    writeData(data);
};

// Update mod by ID
const updateMods = (modsId, newData) => {
    let data = readData();
    if (!data) return;

    const index = data.mods.findIndex(mods => mods.id === modsId);
    if (index !== -1) {
        data.mods[index] = { ...data.mods[index], ...newData };
        writeData(data);
    } else {
        console.error('Mod(s) not found.');
    }
};

function getRoom(socketid) {
    let data = readData();
    if (!data) return null;

    const mods = data.mods.find(mods => mods.id === socketid);
    if (mods) {
        return mods.room;
    } else {
        console.error('Mod(s) not found.');
        return null;
    }
}

function modLogger(method, socketid, info='temp'){
    switch(method){
        case 'log':
            // addMods({id: socketid, language: 'NL', room: ''
            const gamepin = generateGamepin(); // Assuming generateGamepin() is accessible here
            addMods({id: socketid, language: 'NL', room: gamepin});
            return gamepin
        case 'delete':
            deleteMods(socketid)
            break
        case 'updateRoom':
            updateMods(socketid, {room: info})
            break

        case 'getRoom':
            const roomCode = generateGamepin();
            addMods(socketid)
            updateMods(socketid, {room: roomCode})
            return roomCode
    }
}

module.exports=modLogger;