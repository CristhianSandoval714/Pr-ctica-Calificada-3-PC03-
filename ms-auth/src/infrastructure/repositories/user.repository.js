// ms-auth/src/infrastructure/repositories/user.repository.js

// Nota: Estos hashes se generan una sola vez cuando el usuario se registra.
// El hash para "password123" es:
// '$2a$10$f/32r.9g52g5jF7o1z.q2.xJ8Y1/a.b9S8g7h6kLd5e4f3g2h1iJ' (ejemplo)
const usersDB = [
    {
        id: "e12345",
        username: "ana.torres",
        passwordHash: "$2a$10$l9BWZgXLWxnVg.3B74PNi.0CTb93Wsin/XzzqGJLKT0/NrT7epiSm", // Contraseña: "password_ana"
        name: "Ana Torres",
        role: "student"
    },
    {
        id: "t09876",
        username: "elena.solano",
        passwordHash: "$2a$10$gKxWS9CIu7QUq9ySaw6cSuns8gXvY/x/ynjj/X.giRWgN4jBuQ46W", // Contraseña: "password_elena"
        name: "Dra. Elena Solano",
        role: "tutor"
    }
];

const findByUsername = async (username) => {
    return usersDB.find(user => user.username === username);
};

module.exports = { findByUsername };