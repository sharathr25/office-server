const express = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const _ = require('lodash');
const { validateForLogin } = require('../models/employee')
const { getEmployeeByEmailWithPassword, getEmployeeByEmail } = require('../services/employee');

const router = express.Router();

router.post('/', async (req, res) => {
    const { body } = req;
    const { email, password } = body;
    const { error: { message = "" } = {} } = validateForLogin(body);
    if(message) return res.status(400).send(message);
    if(!await getEmployeeByEmail(email)) return res.status(400).send("Invalid name or password");
    const employee = await getEmployeeByEmailWithPassword(email);
    try {
        await bcrypt.compare(password, employee.password)   
        const token = jwt.sign({employee}, process.env.JWT_SECRET_KEY)
        return res.send({token, employee: _.pick(employee, ['name', 'email', '_id', 'role', 'team'])})
    } catch (error) {
        return res.status(400).send("Invalid name or password");
    }
})

router.post('/admin', async (req, res) => {
    const { body } = req;
    const { email, password } = body;
    const { error: { message = "" } = {} } = validateForLogin(body);
    if(message) return res.status(400).send(message);
    if(!await getEmployeeByEmail(email)) return res.status(400).send("Invalid name or password");
    const employee = await getEmployeeByEmailWithPassword(email);
    if(employee.role !== 'admin') return res.status(400).send("Invalid name or password")
    try {
        const match = await bcrypt.compare(password, employee.password)
        if(match) {
            const token = employee.generateAuthToken();   
            return res.send({token, employee: _.pick(employee, ['name', 'email', '_id', 'role', 'team'])})
        }
        return res.status(400).send("Invalid name or password")
    } catch (error) {
        return res.status(400).send("Invalid name or password");
    }
})

module.exports = router;