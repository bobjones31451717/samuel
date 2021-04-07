let chai = require('chai');
let chaiHttp = require('chai-http');
let server = require('../todoServer.js');
// eslint-disable-next-line
let should = chai.should();
chai.use(chaiHttp);

require('dotenv').config();
const { DB }  = require('../connection.js');

function makeid(length) {
  var result           = '';
  var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  var charactersLength = characters.length;
  for ( var i = 0; i < length; i++ ) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
}

describe('/POST todos', function() {
  it('it should post a todo with random id', function(done) {
    const id = makeid(5);
    const route = '/todo/' + id;
    let todo = {
      messege:'walk the dog'
    };
    chai.request(server)
      .post(route)
      .send(todo)
      .end((err, res) => {
        res.should.have.status(200);
        res.body.should.have.property('messege').eql('walk the dog');
        res.body.should.have.property('_id').eql(id);
        res.body.should.have.property('checked').eql(false);
        done();
      });
  });
  it('check if it throw an error on any number of chars in id different then 5', function(done) {
    const id = makeid(6);
    const route = '/todo/' + id;
    let todo = {
      messege:'walk the dog'
    };
    chai.request(server)
      .post(route)
      .send(todo)
      .end((err, res) => {
        res.should.have.status(422);
        done();
      });
  });
  it('asserting with the same id, should throw exeption', function(done) {
    const id = makeid(5);
    const route = '/todo/' + id;
    let dataPreperetion = {
      _id: id,
      messege:'walk the dog',
      checked:false
    };
    let todo = {
      messege:'walk the dog'
    };
    DB.insertOne(process.env.DB_NAME, process.env.COLLECTION_NAME, dataPreperetion).then(() =>{
      chai.request(server)
        .post(route)
        .send(todo)
        .end((err, res) => {
          res.should.have.status(400);
          done();
        });
    });
  });
});
describe('/GET todos', function() {
  it('get zero documents for not adding to db enything', function(done) {
    const route = '/todos';
    chai.request(server)
      .get(route) 
      .end((err, res) => {
        res.should.have.status(200);
        res.body.should.eql({todos:[]});
        done();
      });
  });
  it('get one document after adding to db document', function(done) {
    const id = makeid(5);
    let dataPreperetion = {
      _id: id,
      messege:'walk the dog',
      checked:false
    };
    DB.insertOne(process.env.DB_NAME, process.env.COLLECTION_NAME, dataPreperetion).then(() =>{
      const getRoute = '/todos';
      chai.request(server)
        .get(getRoute) 
        .end((err, res) => {
          res.should.have.status(200);
          res.body.todos[0].should.have.property('messege').eql('walk the dog');
          res.body.todos[0].should.have.property('_id').eql(id);
          res.body.todos[0].should.have.property('checked').eql(false);
          done();
        });
    });
  });
});
describe('/patch todos', function() {
  it('test if massege updated', function(done) {
    const id = makeid(5);
    const route = '/todo/messege/' + id;
    let dataPreperetion = {
      _id: id,
      messege:'walk the dog',
      checked:false
    };
    let todo = {
      messege:'walk the hyena'
    };
    DB.insertOne(process.env.DB_NAME, process.env.COLLECTION_NAME, dataPreperetion).then(() =>{
      chai.request(server)
        .patch(route)
        .send(todo)
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.have.property('messege').eql('walk the hyena');
          done();
        });
    });
  });
  it('should return error if massege is less then 2 chars', function(done) {
    const id = makeid(5);
    const route = '/todo/messege/' + id;
    let dataPreperetion = {
      _id: id,
      messege:'walk the dog',
      checked:false
    };
    let todo = {
      messege:'q'
    };
    DB.insertOne(process.env.DB_NAME, process.env.COLLECTION_NAME, dataPreperetion).then(() =>{
      chai.request(server)
        .patch(route)
        .send(todo)
        .end((err, res) => {
          res.should.have.status(422);
          done();
        });
    });
  });
  it('should return error if massege is over 99 chars', function(done) {
    const id = makeid(5);
    const route = '/todo/messege/' + id;
    let dataPreperetion = {
      _id: id,
      messege:'walk the dog',
      checked:false
    };
    let todo = {
      messege:'happy passover! happy passover! happy passover! happy passover! happy passover! happy passover!happy passover! happy passover! happy passover! happy passover! happy passover! happy passover!happy passover! happy passover! happy passover! happy passover!happy passover! happy passover! happy passover! happy passover!happy passover! happy passover! happy passover! happy passover!happy passover! happy passover! happy passover! happy passover!happy passover! happy passover! happy passover! happy passover!'
    };
    DB.insertOne(process.env.DB_NAME, process.env.COLLECTION_NAME, dataPreperetion).then(() =>{
      chai.request(server)
        .patch(route)
        .send(todo)
        .end((err, res) => {
          res.should.have.status(422);
          done();
        });
    });
  });
  it('should return error if massege is not in the body of the request', function(done) {
    const id = makeid(5);
    const route = '/todo/messege/' + id;
    let dataPreperetion = {
      _id: id,
      messege:'walk the dog',
      checked:false
    };
    let todo = {

    };
    DB.insertOne(process.env.DB_NAME, process.env.COLLECTION_NAME, dataPreperetion).then(() =>{
      chai.request(server)
        .patch(route)
        .send(todo)
        .end((err, res) => {
          res.should.have.status(422);
          done();
        });
    });
  });
  it('test if checked updated', function(done) {
    const id = makeid(5);
    const route = '/todo/checked/' + id;
    let dataPreperetion = {
      _id: id,
      messege:'walk the dog',
      checked:false
    };
    let todo = {
      checked:true
    };
    DB.insertOne(process.env.DB_NAME, process.env.COLLECTION_NAME, dataPreperetion).then(() =>{
      chai.request(server)
        .patch(route)
        .send(todo)
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.have.property('checked').eql(true);
          done();
        });
    });
  });
  it('test if we get an error if not supply boolean in checked property', function(done) {
    const id = makeid(5);
    const route = '/todo/checked/' + id;
    let dataPreperetion = {
      _id: id,
      messege:'walk the dog',
      checked:false
    };
    let todo = {
      checked:'notBoll'
    };
    DB.insertOne(process.env.DB_NAME, process.env.COLLECTION_NAME, dataPreperetion).then(() =>{
      chai.request(server)
        .patch(route)
        .send(todo)
        .end((err, res) => {
          res.should.have.status(422);
          done();
        });
    });
  });
  it('test if we dont get any checked property, should throw an error', function(done) {
    const id = makeid(5);
    const route = '/todo/checked/' + id;
    let dataPreperetion = {
      _id: id,
      messege:'walk the dog',
      checked:false
    };
    let todo = {

    };
    DB.insertOne(process.env.DB_NAME, process.env.COLLECTION_NAME, dataPreperetion).then(() =>{
      chai.request(server)
        .patch(route)
        .send(todo)
        .end((err, res) => {
          res.should.have.status(422);
          done();
        });
    });
  });
  it('test if returns an error on id that not in db', function(done) {
    const id = makeid(5);
    const route = '/todo/messege/' + id;
    const shiftedId = id.substr(1) + id.substr(0, 1);
    let dataPreperetion = {
      _id: shiftedId,
      messege:'walk the dog',
      checked:false
    };
    let todo = {
      messege:'walk the hyena'
    };
    DB.insertOne(process.env.DB_NAME, process.env.COLLECTION_NAME, dataPreperetion).then(() =>{
      chai.request(server)
        .patch(route)
        .send(todo)
        .end((err, res) => {
          res.should.have.status(400);
          done();
        });
    });
  });
});

describe('/delete todos', function() {
  it('tryng to delete an object from db', function(done) {
    const id = makeid(5);
    const route = '/todo/' + id;
    let dataPreperetion = {
      _id: id,
      messege:'walk the dog',
      checked:false
    };
    DB.insertOne(process.env.DB_NAME, process.env.COLLECTION_NAME, dataPreperetion).then(() =>{
      chai.request(server)
        .delete(route)
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.have.property('_id').eql(id);
          done();
        });
    });
  });
  it('test if returns an error on id that not in db', function(done) {
    const id = makeid(5);
    const route = '/todo/' + id;
    const shiftedId = id.substr(1) + id.substr(0, 1);
    let dataPreperetion = {
      _id: shiftedId,
      messege:'walk the dog',
      checked:false
    };
    let todo = {
      messege:'walk the hyena'
    };
    DB.insertOne(process.env.DB_NAME, process.env.COLLECTION_NAME, dataPreperetion).then(() =>{
      chai.request(server)
        .delete(route)
        .send(todo)
        .end((err, res) => {
          res.should.have.status(400);
          done();
        });
    });
  });
});