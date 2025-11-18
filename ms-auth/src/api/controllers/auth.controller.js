const authService = require('../../domain/services/auth.service');

const postToken = async (req, res, next) => {
    try {
        const { username, password } = req.body;
        if (!username || !password) {
            throw { statusCode: 400, message: 'Usuario y contraseña son requeridos' };
        }
        const token = await authService.login(username, password);
        res.status(200).json(token);
    } catch (error) {
        next(error);
    }
};

module.exports = { postToken };