const { json } = require('express');
const fs = require('fs');
const { get } = require('http');

function generateGamepin() {
    const characters = '01234A5S678T9M';
    const length = 5;
    let pin = '';
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

const writeData = (jsonData) => {
    try {
        fs.writeFileSync('data.json', JSON.stringify(jsonData, null, 2));
    } catch (err) {
        console.error('Error writing to file:', err);
    }
};

const deleteMods = (modsId) => {
    let data = readData();
    if (!data) return;
    data.mods = data.mods.filter(mods => mods.id !== modsId);
    writeData(data);
};

const addMods = (mods) => {
    let data = readData();
    if (!data) return;
    data.mods.push(mods);
    writeData(data);
};

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

const checkRoom = (roomcode) => {
    let data = readData();
    if (!data) return null;
    const roomExists = data.mods.some(mod => mod.room === roomcode);
    if (roomExists) {
        return 'exists';
    } else {
        return 'does not exist';
    }
}

const modID = (roomcode) => {
    let data = readData();
    if (!data) return null;
    const modID = data.mods.find(mod => mod.room === roomcode);
    if (modID) {
        return modID.id;
    } else {
        return null;
    }
}

const addPlayerToMod = (socketid, strategy) => {
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
    let data = readData();
    if (!data) return null;
    for (let i = 0; i < data.mods.length; i++) {
        if (data.mods[i].id === socketid) {
            data.mods[i].players_joined.push(strategy);
            writeData(data);
            return 'added';
        }
    }
}

const addPlayerNameToMod = (socketid, name) => {
    let data = readData();
    if (!data) return null;
    for (let i = 0; i < data.mods.length; i++) {
        if (data.mods[i].id === socketid) {
            data.mods[i].player_names.push(name);
            writeData(data);
            return 'added';
        }
    }
}

const nextTurn = (socketid) => {
    let data = readData();
    if (!data) return null;
    const mod = data.mods.find(mods => mods.id === socketid)
    mod.turn += 1
    if (mod.players_joined.length === mod.turn) {
        mod.turn = 0
        mod.current_round += 1
    }
    writeData(data)
}

const getPlayerTurn = (socketid) => {
    let data = readData();
    if (!data) return null;
    const mod = data.mods.find(mods => mods.id === socketid);
    if (!mod) return null;
    const playerArray = mod.players_joined;
    const turn = mod.turn;
    if (typeof turn !== 'number' || turn < 0 || turn >= playerArray.length) return null;
    const name = playerArray[turn];
    return name;
}

const getPlayerName = (socketid) => {
    let data = readData();
    if (!data) return null;
    const mod = data.mods.find(mods => mods.id === socketid);
    if (!mod) return null;
    const playerArray = mod.player_names;
    const turn = mod.turn;
    if (typeof turn !== 'number' || turn < 0 || turn >= playerArray.length) return null;
    const name = playerArray[turn];
    return name;
}

const getRound = (socketid) => {
    let data = readData();
    if (!data) return null;
    const mod = data.mods.find(mods => mods.id === socketid);
    if (!mod) return null;
    return {currentRound: mod.current_round, totalRounds: mod.total_rounds}
}


function modLogger(method, socketid, info='temp'){
    switch(method){
        case 'log':
            const gamepin = generateGamepin();
            addMods({id: socketid, language: 'NL', room: gamepin, player_names: [], players_joined: [], total_players: info.playerCount,turn: 0, current_round: 1, total_rounds: info.roundsCount});
            return gamepin
        case 'delete':
            deleteMods(socketid)
            break
        case 'checkExists':
            const exists = checkRoom(info)
            return exists
        case 'getRoom':
            const roomCode = generateGamepin();
            addMods(socketid)
            updateMods(socketid, {room: roomCode})
            return roomCode
        case 'getMod':
            return modID(info)
        case 'addPlayer':
            addPlayerToMod(socketid, info)
            break
        case 'getPieces':
            var playerPieces
            try{
                playerPieces = readData().mods.find(mod => mod.id === socketid).players_joined
            } catch (TypeError){
                playerPieces = 'No players found'
            }
            return playerPieces
        case 'room':
            const room = readData().mods.find(mod => mod.id === socketid).room
            return room
        case 'nextTurn':
            nextTurn(socketid)
            break
        case 'getPlayerTurn':
            return getPlayerTurn(socketid)
            break
        case 'addPlayerName':
            addPlayerNameToMod(socketid, info)
            break
        case 'getPlayerName':
            return getPlayerName(socketid)
            break
        case 'getRound':
            return getRound(socketid)
            break
    }
}

module.exports=modLogger;