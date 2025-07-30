// src/memoryUsers.js
const users = [];

const findUserByUsername = (username) => {
    return users.find(user => user.username === username);
};

const createUser = (username, password) => {
    const newUser = { username, password };
    users.push(newUser);
    return newUser;
};

module.exports = {
    findUserByUsername,
    createUser
};