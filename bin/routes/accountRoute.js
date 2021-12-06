const route = require('express').Router();
const accountSchema = require('../schemas/accountSchema');
const {compareSync, hashSync} = require('bcrypt');
const {verify} = require('jsonwebtoken');

const SALT_PREFIX = process.env.SALT_PREFIX || "my_tasks_nodejs";
const SALT_ROUNDS = process.env.SALT_ROUNDS || 10;
const TOKEN_EXPIRES_IN = process.env.TOKEN_EXPIRES_IN || "1h";
const TOKEN_SECRET_KEY = process.env.TOKEN_SECRET_KEY || "my_tasks_nodejs";


route.post('/signIn', (req, res) => {
    const {email, password} = req.body;
    if (!email || !password) {
        return res.status(401).send('email or password not found!');
    }
    accountSchema.findOne({email: email})
        .then((r) => {
            if (compareSync(`${SALT_PREFIX}${password}`, r.password)) {
                const payload = {_id: r._id, email: r.email, firstName: r.firstName, lastName: r.lastName};
                const token = verify(payload, TOKEN_SECRET_KEY, {expiresIn: TOKEN_EXPIRES_IN});
                res.status(200).send({token});
            } else {
                res.status(401).send('email or password invalid!');
            }
        })
        .catch((e) => res.status(401).send(e));

});

route.post('/signUp', (req, res) => {
    const {email, password, firstName, lastName} = req.body;

    accountSchema.create({
        email: email,
        firstName: firstName,
        lastName: lastName,
        password: hashSync(`${SALT_PREFIX}${password}`, SALT_ROUNDS),
    })
        .then(() => res.status(201).send('account created!'))
        .catch((e) => res.status(500).send(e));
});

module.exports = route;