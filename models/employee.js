const mongoose = require('mongoose');
const Joi = require('@hapi/joi');
Joi.objectId = require('joi-objectid')(Joi);

const Schema = mongoose.Schema;

const Employee = mongoose.model('Employee', new Schema({
    email: { type: String, required: true, minlength: 5, maxlength: 50 },
    name: { type: String, required: true, minlength: 5, maxlength: 50 },
    password: { type: String, required: true, minlength: 5, maxlength: 1000 },
    team: { type: String, required: true, minlength: 3, maxlength: 50 },
    role: { type: String, required: true, minlength:3, maxlength: 50 },
}));

const schemaForRegister = Joi.object({
    email: Joi.string()
        .required()
        .min(5)
        .max(50),
    name:  Joi.string()
        .required()
        .min(5)
        .max(50),
    password: Joi.string()
        .required()
        .min(5)
        .max(255),
    team: Joi.string()
        .required()
        .min(3)
        .max(50),
    role: Joi.string()
        .required()
        .min(3)
        .max(50)
})

const validateForRegister = (employee) => schemaForRegister.validate(employee);

const schemaForLogin = Joi.object({
    email:  Joi.string()
        .required()
        .min(5)
        .max(50),
    password: Joi.string()
        .required()
        .min(5)
        .max(255)
})

const validateForLogin = (employee) => schemaForLogin.validate(employee);

const schemaForUpdate = Joi.object({
    email:  Joi.string()
        .min(5)
        .max(50),
    name:Joi.string()
        .min(5)
        .max(50),
    password:Joi.string()
        .allow('', null)
        .min(5)
        .max(255),
    id: Joi.objectId()
        .required(),
    team: Joi.string()
        .min(3)
        .max(50),
    role: Joi.string()
        .min(3)
        .max(50)
})

const validateForUpdate = (employee) => schemaForUpdate.validate(employee)

const SchemaForDelete = Joi.object({
    id: Joi.objectId()
        .required()
})

const validateForDelete = (employee) => SchemaForDelete.validate(employee)

const SchemaForGet = Joi.object({
    id: Joi.objectId()
        .required()
})

const validateForGet = (employee) => SchemaForGet.validate(employee)

module.exports = {
    Employee,
    validateForRegister,
    validateForUpdate,
    validateForDelete,
    validateForGet,
    validateForLogin
}