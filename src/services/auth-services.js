'use strict';
const jwt = require('jsonwebtoken');

exports.generateToken = async (data) => {
    return await jwt.sign(data, global.SALT_KEY, { expiresIn: '1d' })
}

exports.decodeToken = async (req) => {
    let token = req.body.token || req.query.token || req.headers['x-access-token'];

    var data = await jwt.verify(token, global.SALT_KEY);
    return data;
}

exports.authorize = (req, res, next) => {
    let token = req.body.token || req.query.token || req.headers['x-access-token'];

    if (!token) {
        res.status(401).json({
            message: 'Acesso Restrito'
        });
        return;
    }

    jwt.verify(token, global.SALT_KEY, (error, decoded) => {
        if (error) {
            res.status(401).json({
                message: 'Token Inválido'
            });
            return;
        }

        next();
    });
}

exports.getToken = async (req) => {
    return req.body.token || req.query.token || req.headers['x-access-token'];
}

exports.isAdmin = (req, res, next) => {
    let token = req.body.token || req.query.token || req.headers['x-access-token'];

    if (!token) {
        res.status(401).json({
            message: 'Acesso Restrito'
        });
        return;
    }

    jwt.verify(token, global.SALT_KEY, (error, decoded) => {
        if (error) {
            res.status(401).json({
                message: 'Token Inválido'
            });
            return;
        }

        if (decoded.roles.includes('admin')) {
            next();
            return;
        }
        res.status(401).json({
            message: 'Você não tem permissão de Admin'
        });
    });
}