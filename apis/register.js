const express = require('express');
const { validateForRegister } = require('../models/Employee')
const { createEmployee, getEmployeeByEmail } = require('../services/employee');
const isAdmin = require('../middlewares/admin');
const router = express.Router();

router.post('/', isAdmin, async (req, res) => {
    const { body } = req;
    const { email } = body;
    const { error: { message = "" } = {} } = validateForRegister(body);
    if(message) return res.status(400).send(message);
    if(await getEmployeeByEmail(email)) return res.status(400).send("Employee already exists");
    const employee = await createEmployee(body);
    res.send(employee);
})

module.exports = router;