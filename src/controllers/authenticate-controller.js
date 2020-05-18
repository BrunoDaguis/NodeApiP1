'use strinct';

const repository = require('../repositories/user-respository');
const authService = require('../services/auth-services');
const md5 = require('md5');

exports.authenticate = async (req, res, next) => {
    try {
        let data = await repository.authenticate({
            login: req.body.login,
            password: md5(req.body.password + global.SALT_KEY)
        });

        if (!data) {
            res.status(404).send({
                message: 'Usuário ou senha inválidos'
            });
            return;
        }

        let token = await authService.generateToken({
            _id: data._id,
            name: data.name,
            email: data.email,
            login: data.login,
            roles: data.roles
        });

        res.status(200).send({
            token: token, data: {
                _id: data._id,
                name: data.name,
                email: data.email,
            }
        });
    } catch (e) {
        res.status(500).send({
            message: 'Falha ao processar requisição',
            data: e
        });
    }
}

exports.refresh = async (req, res, next) => {
    try {
        let token = await authService.decodeToken(req)

        let user = await repository.getById(token._id);

        if (!user) {
            res.status(404).send({
                message: 'Usuário não encontrado'
            });
            return;
        }

        let newToken = await authService.generateToken({
            _id: user._id,
            name: user.name,
            email: user.email,
            login: user.login,
            roles: user.roles
        });

        res.status(200).send({
            token: newToken, data: {
                _id: user._id,
                name: user.name,
                email: user.email,
            }
        });
    } catch (e) {
        res.status(500).send({
            message: 'Falha ao processar requisição',
            data: e
        });
    }
}