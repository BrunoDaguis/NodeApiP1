'use strinct';

const ValidationContract = require('../validators/fluent-validator');
const repository = require('../repositories/article-repository');
const authService = require('../services/auth-services');

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

exports.post = async (req, res, next) => {
    try {

        let contract = new ValidationContract();

        contract.isRequired(req.body.title, 'Titulo é obrigatório')
        contract.hasMinLen(req.body.title, 3, 'Titulo deve ter minimo de 3 caracteres');

        contract.isRequired(req.body.slug, 'Slug é obrigatório')
        contract.hasMinLen(req.body.slug, 3, 'Slug deve ter minimo de 3 caracteres');

        contract.isRequired(req.body.description, 'Descrição é obrigatório')
        contract.hasMinLen(req.body.description, 10, 'Descrição deve ter minimo de 10 caracteres');

        contract.isRequired(req.body.content, 'Conteudo é obrigatório')

        if (!contract.isValid()) {
            res.status(400).send(contract.erros()).end();
            return;
        }

        let userLogged = await authService.decodeToken(req);

        await repository.create({
            user: userLogged._id,
            title: req.body.title,
            slug: req.body.slug,
            description: req.body.description,
            content: req.body.content
        });

        res.status(201).send(req.body);

    } catch (e) {
        res.status(500).send({
            message: 'Falha ao processar requisição',
            data: e
        });
    }
}