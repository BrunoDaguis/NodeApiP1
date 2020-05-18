'use strinct';

const mongoose = require('mongoose');
const Article = mongoose.model('Article');

exports.get = async () => {
    return await Article.find({}, '_id date_create title description')
        .populate('user', '_id name email');
}

exports.create = async (data) => {
    let article = new Article(data);
    return await article.save();
}