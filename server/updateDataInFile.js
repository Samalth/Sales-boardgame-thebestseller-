// updateData.js

const updateDataInFile = (filePath, newData) => {
    // Fetch the existing data from the file
    fetch(filePath)
        .then(response => response.json())
        .then(data => {
            // Find the user with the name 'Samuel'
            const samuelUser = data.users.find(user => user.name === 'Samuel');

            // If Samuel exists, update his points
            if (samuelUser) {
                samuelUser.points = newData.points;

                // Now, write the updated data back to the file
                fetch(filePath, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(data)
                })
                    .then(response => response.json())
                    .then(updatedData => console.log('Data updated successfully:', updatedData))
                    .catch(error => console.error('Error updating data:', error));
            } else {
                console.error('User Samuel not found in the data.');
            }
        })
        .catch(error => console.error('Error fetching data:', error));
};
