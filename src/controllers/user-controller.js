'use strinct';

const ValidationContract = require('../validators/fluent-validator');
const repository = require('../repositories/user-respository');
const emailService = require('../services/email-service');
const authService = require('../services/auth-services');

const md5 = require('md5');

exports.get = async (req, res, next) => {
    try {
        let data = await repository.get();
        res.status(200).send(data);
    } catch (e) {
        res.status(500).send({
            message: 'Falha ao processar requisição',
            data: e
        });
    }
}

exports.getById = async (req, res, next) => {
    try {
        let data = await repository.getById(req.params.id);
        res.status(200).send(data);
    } catch (e) {
        res.status(500).send({
            message: 'Falha ao processar requisição',
            data: e
        });
    }

}

exports.post = async (req, res, next) => {
    try {
        let contract = new ValidationContract();
        contract.isRequired(req.body.name, 'Nome é obrigatório')
        contract.hasMinLen(req.body.name, 3, 'Nome deve ter minimo de 3 caracteres');

        contract.isRequired(req.body.login, 'Login é obrigatório')
        contract.hasMinLen(req.body.login, 3, 'Login deve ter minimo de 3 caracteres');

        contract.isEmail(req.body.email, 'Email inválido');

        contract.isRequired(req.body.password, 'Senha é obrigatório')
        contract.hasMinLen(req.body.password, 6, 'Senha deve ter minimo de 6 caracteres');

        if (!contract.isValid()) {
            res.status(400).send(contract.erros()).end();
            return;
        }

        let data = await repository.create({
            name: req.body.name,
            login: req.body.login,
            password: md5(req.body.password + global.SALT_KEY),
            email: req.body.email,
            roles: req.body.roles
        });

        emailService.send(
            req.body.email,
            'Bem vindo ao Node Teste',
            global.EMAIL_TMPL.replace('{0}', req.body.name)
        );

        res.status(201).send(req.body);

    } catch (e) {
        res.status(500).send({
            message: 'Falha ao processar requisição',
            data: e
        });
    }
}

exports.put = async (req, res, next) => {
    try {
        let contract = new ValidationContract();
        contract.isRequired(req.params.id, 'Id é obrigatório');

        contract.isRequired(req.body.name, 'Nome é obrigatório')
        contract.hasMinLen(req.body.name, 3, 'Nome deve ter minimo de 3 caracteres');

        if (!contract.isValid()) {
            res.status(400).send(contract.erros()).end();
            return;
        }

        await repository.update(req.params.id, { name: req.body.name });
        res.status(200).send({ message: 'Usuario atualizado com sucesso' });
    } catch (e) {
        res.status(500).send({
            message: 'Falha ao processar requisição',
            data: e
        });
    }

}

exports.delete = async (req, res, next) => {
    try {
        await repository.delete(req.body.id);
        res.status(200).send({ message: 'Usuario removido com sucesso' });
    } catch (e) {
        res.status(500).send({
            message: 'Falha ao processar requisição',
            data: e
        });
    }
};