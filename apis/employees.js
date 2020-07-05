const express = require('express');
const _ = require('lodash');
const { validateForUpdate, validateForDelete, validateForGet } = require('../models/Employee')
const { getEmployeeByID, updateEmployee, deleteEmployee, getEmployees } = require('../services/employee');
const isAdmin = require('../middlewares/admin');
const canRead = require('../middlewares/read');
const canWrite = require('../middlewares/write');

const router = express.Router();

router.get('/', isAdmin, async (req, res) => {
    const employees = await getEmployees();
    res.send(employees)
});

router.get('/:id', canRead, async (req, res) => {
    const { params } = req;
    const { id } = params;
    const { error: { message = "" } = {} } = validateForGet(params);
    if(message) return res.status(400).send(message);
    if(!await getEmployeeByID(id)) return res.status(400).send("Employee doesn't exist");
    const employee = await getEmployeeByID(id)
    res.send(employee);
});

router.put('/:id', canWrite, async (req, res) => {
    const { body, params } = req;
    const { id } = params;
    const { error: { message = "" } = {} } = validateForUpdate({ ...body, id });
    if(message) return res.status(400).send(message);
    if(!await getEmployeeByID(id)) return res.status(400).send("Employee doesn't exist");
    const employee = await updateEmployee(id, body);
    res.send(employee);
});

router.delete('/:id', isAdmin, async (req, res) => {
    const { params } = req;
    const { id } = params;
    const { error: { message = "" } = {} } = validateForDelete(params)
    if(message) return res.status(400).send(message);
    if(!await getEmployeeByID(id)) return res.status(400).send("Employee doesn't exist");
    await deleteEmployee(id);
    res.send(`employee with ${id} has been removed`);
});

module.exports = router;
