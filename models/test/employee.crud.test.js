const Employee = require('../employee.model');
const expect = require('chai').expect;
const MongoMemoryServer = require('mongodb-memory-server').MongoMemoryServer;
const mongoose = require('mongoose');

describe('Employee', () => {

  before(async () => {

    try {
      const fakeDB = new MongoMemoryServer();

      const uri = await fakeDB.getUri();

      mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true });

    } catch (err) {
      console.log(err);
    }

  });

  describe('Reading data', () => {

    beforeEach(async () => {
      const testEmpOne = new Employee({ firstName: 'John', lastName: 'Doe', department: 'Department #1' });
      await testEmpOne.save();

      const testEmpTwo = new Employee({ firstName: 'Anna', lastName: 'Doe', department: 'Department #2' });
      await testEmpTwo.save();
    });

    it('should return all the data with "find" method', async () => {
      const employees = await Employee.find();
      const expectedLength = 2;
      expect(employees.length).to.be.equal(expectedLength);
    });

    it('should return a proper document by "firstName, lastName, department" with "findOne" method', async () => {
      const firstName = await Employee.findOne({ firstName: 'John' });
      const expectedFirstName = 'John';
      expect(firstName.firstName).to.be.equal(expectedFirstName);

      const lastName = await Employee.findOne({ lastName: 'Doe' });
      const expectedLastName = 'Doe';
      expect(lastName.lastName).to.be.equal(expectedLastName);

      const department = await Employee.findOne({ department: 'Department #1' });
      const expectedDepartment = 'Department #1';
      expect(department.department).to.be.equal(expectedDepartment);
    });

    afterEach(async () => {
      await Employee.deleteMany();
    });
  });

  describe('Creating data', () => {

    it('should insert new document with "insertOne" method', async () => {
      const employee = new Employee({ firstName: 'John', lastName: 'Doe', department: 'Department #1' });
      await employee.save();
      expect(employee.isNew).to.be.false;
    });

    after(async () => {
      await Employee.deleteMany();
    });
  });

  describe('Updating data', () => {
    beforeEach(async () => {
      const testEmpOne = new Employee({ firstName: 'John', lastName: 'Doe', department: 'Department #1' });
      await testEmpOne.save();

      const testEmpTwo = new Employee({ firstName: 'Anna', lastName: 'Doe', department: 'Department #2' });
      await testEmpTwo.save();
    });

    afterEach(async () => {
      await Employee.deleteMany();
    });

    it('should properly update one document with "updateOne" method', async () => {
      await Employee.updateOne({ firstName: 'John', lastName: 'Doe', department: 'Department #1' }, { $set: { firstName: 'Johnny', lastName: 'Does', department: 'Department #3' } });
      const updatedEmployee = await Employee.findOne({ firstName: 'Johnny', lastName: 'Does', department: 'Department #3' });
      expect(updatedEmployee).to.not.be.null;
    });

    it('should properly update one document with "save" method', async () => {
      const employee = await Employee.findOne({ firstName: 'John' });
      employee.firstName = 'Johnny';
      await employee.save();

      const updatedEmployee = await Employee.findOne({ firstName: 'Johnny' });
      expect(updatedEmployee).to.not.be.null;
    });

    it('should properly update multiple documents with "updateMany" method', async () => {
      await Employee.updateMany({}, { $set: { firstName: 'XXX', lastName: 'YYY', department: 'ZZZ' } });
      const employees = await Employee.find({ firstName: 'XXX' });
      expect(employees.length).to.be.equal(2);
    });
  });

  describe('Removing data', () => {
    beforeEach(async () => {
      const testEmpOne = new Employee({ firstName: 'John', lastName: 'Doe', department: 'Department #1' });
      await testEmpOne.save();

      const testEmpTwo = new Employee({ firstName: 'Anna', lastName: 'Doe', department: 'Department #2' });
      await testEmpTwo.save();
    });

    afterEach(async () => {
      await Employee.deleteMany();
    });

    it('should properly remove one document with "deleteOne" method', async () => {
      await Employee.deleteOne({ firstName: 'Anna' });
      const deleted = await Employee.findOne({ firstName: 'Anna' });
      expect(deleted).to.be.null
    });

    it('should properly remove one document with "remove" method', async () => {
      const employee = await Employee.findOne({ firstName: 'John' });
      await employee.remove();
      const removedEmployee = await Employee.findOne({ firstName: 'John' });
      expect(removedEmployee).to.be.null;
    });

    it('should properly remove multiple documents with "deleteMany" method', async () => {
      await Employee.deleteMany();
      const employee = await Employee.find();
      expect(employee.length).to.be.equal(0);
    });

  });
});