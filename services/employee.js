const _ = require('lodash');
const bcrypt = require('bcryptjs');
const { Employee } = require("../models/Employee");

const createEmployee = async (employeeToAdd) => {
    const { password } = employeeToAdd;
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt)
    const employee = await Employee.create({ ...employeeToAdd, role:employeeToAdd.role, password: hashedPassword })
    return _.pick(employee, ['_id']);
}

const getEmployees = async () => {
    const employees = await Employee.find({});
    return employees.map(({ name, team, role, _id, email }) => ({ name, team, role, _id, email }));
}

const getEmployeeByEmail = async (employeeEmail) => {
    const employee = await Employee.findOne({ email: employeeEmail })
    return employee && _.pick(employee, ['name', '_id', 'team', 'role', 'email'])
}

const getEmployeeByEmailWithPassword = async (employeeEmail) => {
    const employee = await Employee.findOne({ email: employeeEmail })
    return employee;
}

const getEmployeeByID = async (employeeID) => {
    const employee = await Employee.findById(employeeID)
    return employee && _.pick(employee, ['name', '_id', 'team', 'role', 'email'])
}

const updateEmployee = async (employeeID, newEmployeeData) => {
    let { password } = newEmployeeData;
    if(password) {
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt)
        newEmployeeData.password = hashedPassword;
    }
    const employee = await Employee.findByIdAndUpdate(
        { _id: employeeID }, 
        password ? newEmployeeData : _.pick(newEmployeeData, ['name', '_id', 'team', 'role', 'email']) , 
        { new: true }
    );
    return employee && _.pick(employee, ['name', '_id', 'team', 'role', 'email'])
}

const deleteEmployee = async (employeeID) => {
    const employee = await Employee.deleteOne({ _id: employeeID })
    return employee && _.pick(employee, ['name', '_id', 'team', 'role', 'email'])
}

module.exports = {
    createEmployee,
    getEmployees,
    getEmployeeByEmail,
    getEmployeeByID,
    getEmployeeByEmailWithPassword,
    updateEmployee,
    deleteEmployee
}