
const server = require('../index');
const mongoose = require('mongoose');
const supertest = require('supertest');
const request = supertest(server);
const { createEmployee, deleteEmployee } = require('../services/employee');

let id1 = "";
let id2 = "";
let id3 = "";
let adminToken = "";
let employeeReadToken = "";
let employeeWriteToken = "";
let testUserId = "";
describe('apis',() => {
    beforeAll(async() => {
        const { _id: _id1 } = await createEmployee({ name: 'admin', email: 'admin@gmail.com', password: '12345', team: 'dev', role: 'admin' });
        const { _id: _id2 } = await createEmployee({ name: 'employee1', email: 'employee1@gmail.com', password: '12345', team: 'dev', role: 'read' });
        const { _id: _id3 } = await createEmployee({ name: 'employee2', email: 'employee2@gmail.com', password: '12345', team: 'dev', role: 'write' });
        id1 = _id1;
        id2 = _id2;
        id3 = _id3;
    });
    afterAll(async() => {
        await deleteEmployee(id1);
        await deleteEmployee(id2);
        await deleteEmployee(id3);
        server.close();
        mongoose.disconnect();
    });
    describe("login(admin)", () => {
        test('should get 200 status for valid admin', (done) => {
            request
            .post('/api/login/admin')
            .send("email=admin@gmail.com&password=12345")
            .expect(200, done)
            .expect((res) => {
                adminToken = res.body.token;
            })
        })
        test('should get 400 status for invalid admin', (done) => {
            request
            .post('/api/login/admin')
            .send("email=admin1@gmail.com&password=12345")
            .expect(400, done)
        })
    })
    describe("login(employee)", () => {
        test('should get 200 status for valid employee', (done) => {
            request
            .post('/api/login')
            .send("email=employee1@gmail.com&password=12345")
            .expect(200, done)
            .expect((res) => {
                employeeReadToken = res.body.token;
            })
        })
        test('should get 200 status for valid employee', (done) => {
            request
            .post('/api/login')
            .send("email=employee2@gmail.com&password=12345")
            .expect(200, done)
            .expect((res) => {
                employeeWriteToken = res.body.token;
            })
        })
        test('should get 400 status for invalid employee', (done) => {
            request
            .post('/api/login/admin')
            .send("email=admin1@gmail.com&password=12345")
            .expect(400, done)
        })
    })
    describe("regiser(admin)", () => {
        test('should get 200 status for admin', (done) => {
            request
            .post('/api/register')
            .send("email=testuser@gmail.com&password=12345&name=testuser&team=dev&role=read")
            .set('authorisation', adminToken)
            .expect(200, done)
            .expect((res) => {
                testUserId = res.body._id;
            })
        })
        test('should get 403 status for employee', (done) => {
            request
            .post('/api/register')
            .send("email=testuser1@gmail.com&password=12345&name=testuser1&team=dev&role=read")
            .set('authorisation', employeeReadToken)
            .expect(403, done)
        })
    });
    describe("get all employees", () => {
        test('should get 200 status for admin', (done) => {
            request
            .get('/api/employees')
            .set('authorisation', adminToken)
            .expect(200, done)
        })
        test('should get 403 status for employee or other user', (done) => {
            request
            .get('/api/employees')
            .set('authorisation', employeeReadToken)
            .expect(403, done)
        })
    });
    describe("get all employees", () => {
        test('should get 200 status for admin', (done) => {
            request
            .get('/api/employees')
            .set('authorisation', adminToken)
            .expect(200, done)
        })
        test('should get 403 status for employee or other user', (done) => {
            request
            .get('/api/employees')
            .set('authorisation', employeeReadToken)
            .expect(403, done)
        })
    });
    describe("get employee details", () => {
        test('should get 200 status for admin', (done) => {
            request
            .get(`/api/employees/${id1}`)
            .set('authorisation', adminToken)
            .expect(200, done)
        })
        test('should get 403 status for employee or other user', (done) => {
            request
            .get(`/api/employees/${id2}`)
            .set('authorisation', employeeReadToken)
            .expect(200, done)
        })
    })
    describe("update employee details", () => {
        test('should get 200 status for admin', (done) => {
            request
            .put(`/api/employees/${testUserId}`)
            .send("name=testuser2")
            .set('authorisation', adminToken)
            .expect(200, done)
        })
        test('should get 200 status for employees with write permission', (done) => {
            request
            .put(`/api/employees/${id3}`)
            .send("name=abcde")
            .set('authorisation', employeeWriteToken)
            .expect(200, done)
        })
        test('should get 403 status for other users', (done) => {
            request
            .put(`/api/employees/${id2}`)
            .send("name=abcde")
            .set('authorisation', employeeReadToken)
            .expect(403, done)
        })
    })
    describe("get employee details", () => {
        test('should get 200 status for admin', (done) => {
            request
            .delete(`/api/employees/${testUserId}`)
            .set('authorisation', adminToken)
            .expect(200, done)
        })
        test('should get 403 status for employee or other user', (done) => {
            request
            .delete(`/api/employees/${id2}`)
            .set('authorisation', employeeReadToken)
            .expect(403, done)
        })
    })
})