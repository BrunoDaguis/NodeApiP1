'use strict';

const mongoose = require('mongoose');
const User = mongoose.model('User');

exports.get = async () => {
    const res = await User.find({ active: true }, 'name email login');
    return res;
}

exports.authenticate = async (data) => {
    return await User.findOne({ login: data.login, password: data.password }, '_id name email login date_create roles');
}

exports.getById = async (id) => {
    return await User.findById(id, '_id name email login password date_create roles');
}

exports.create = async (data) => {
    var user = new User(data);
    return await user.save();
}

exports.update = async (id, data) => {
    await User.findOneAndUpdate({ _id: id }, {
        $set: {
            name: data.name
        }
    });
}

exports.delete = async (id) => {
    await User.findOneAndRemove(id);
};