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
        console.error('User not found.');
    }
};

//   // Example usage
//   console.log('Initial data:');
//   console.log(readData());
  
//   // Adding a new user
//   addUser({ id: 3, name: 'Emily Johnson', age: 35 });
  
//   // Updating user with ID 2
//   updateUser(2, { name: 'Updated Name', age: 26 });
  
//   // Deleting user with ID 1
//   deleteUser(1);
  
//   console.log('Data after manipulation:');
//   console.log(readData());

function userLogger(method, socketid, info='temp'){
    switch(method){
        case 'log':
            addUser({id: socketid, language: 'NL', room: '0', user: '', name: '', points: 0, strategy:''})
            break
        case 'delete':
            deleteUser(socketid)
            break
        case 'updateName':
            updateUser(socketid, {name: info})
            break
        case 'updateRoom':
            updateUser(socketid, {room: info})
            break
        case 'updateStrategy':
            updateUser(socketid, {strategy: info})
            break
    }    
}

module.exports=userLogger;