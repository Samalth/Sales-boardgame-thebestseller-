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
            addMods({id: socketid, language: 'NL', room: ''
                // , user: '', name: '', points: 0, strategy:''
            })
            break
        case 'delete':
            deleteMods(socketid)
            break
        case 'updateRoom':
            updateMods(socketid, {room: info})
            break

        case 'getRoom':
            return getRoom(socketid)
    }
}

module.exports=modLogger;