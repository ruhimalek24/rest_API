const express = require('express');
const fs = require('fs');
const users = require('./MOCK_DATA.json');
const app = express();

const port = 8002;


app.use(express.urlencoded({ extended: false }));

app.get('/users', (req, res) => {
    const html = `
     <ul>
     ${users.map((user) => `<li>${user.first_name}</li>`).join("")}
     </ul>
     `;
    res.send(html);
})

app.get('/api/users', (req, res) => {
    return res.json(users);
})

app.get('/api/users/:id', (req, res) => {
    const id = Number(req.params.id);
    const user = users.find((user) => user.id === id);
    return res.json(user);
})

app.post('/api/users', (req, res) => {
    //create user
    const body = req.body;
    console.log("Body", body);
    users.push({ id: users.length + 1, ...body });
    fs.writeFile('./MOCK_DATA.json', JSON.stringify(users), (err, data) => {
        return res.json({ Status: 'Success', Message: `User with ${id} added` });
    })

})

app.patch('/api/Updtusers/:id', (req, res) => {
    //update user
    const id = Number(req.params.id);
    console.log(`requested ${id}`);
    const body = req.body;
    const userIndex = users.findIndex((user) => {
        return user.id === id;
    })
    if (userIndex !== -1) {
        const deletedUser = users.splice(userIndex, 1);
        fs.writeFile('./MOCK_DATA.json', JSON.stringify(users), (err, data) => {
            return res.json({ Status: 'Success', Message: `User with ID ${id} deleted.` });
        })
        users.push({ ...body });
        fs.writeFile('./MOCK_DATA.json', JSON.stringify(users), (err, data) => {
            return res.json({ Status: 'Success', Message: `User with ${id} updated` });
        });
    }
    else {
        return res.json({ Status: 'Error' });
    }

})

app.delete('/api/Delusers/:id', (req, res) => {
    const id = Number(req.params.id);
    const userIndex = users.findIndex((user) => {
        return user.id === id;
    });
    if (userIndex !== -1) {
        const deletedUser = users.splice(userIndex, 1);
        fs.writeFile('./MOCK_DATA.json', JSON.stringify(users), (err, data) => {
            return res.json({ Status: 'Success', Message: `User with ID ${id} deleted.` });
        })

    } else {
        return res.status(404).json({ Status: 'Error', Message: `User with ID ${id} not found.` });
    }
});


app.listen(port, () => {
    console.log('Server Listenes the port 8002');
})