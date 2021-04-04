let chai = require('chai');
let chaiHttp = require('chai-http');
let server = require('../todoServer.js');
var expect = chai.expect;
let should = chai.should();
chai.use(chaiHttp);

require('dotenv').config();
const {Connection}  = require("../connection.js")

let todos;
let db;

const run = async () => {
  try {
    db = await Connection.getDB();
    todos = db.db(process.env.DB_NAME).collection(process.env.COLLECTION_NAME);
  } catch (error) {
    console.error(error);    
  }
}

run();

function makeid(length) {
  var result           = '';
  var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  var charactersLength = characters.length;
  for ( var i = 0; i < length; i++ ) {
     result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
}

describe('/POST todos', () => {
    it('it should post a todo with random id', (done) => {
        const id = makeid(5);
        const route = '/todo/' + id
        let todo = {
           mssg:"walk the dog"
        }
        chai.request(server)
            .post(route)
            .send(todo)
            .end((err, res) => {
              res.should.have.status(200);
              res.body.should.have.property('mssg').eql('walk the dog');
              res.body.should.have.property('_id').eql(id);
              res.body.should.have.property('checked').eql(false);
            done();
            })
    });
    it('check if it throw an error on any number of chars in id different then 5', (done) => {
      const id = makeid(6);
      const route = '/todo/' + id
      let todo = {
         mssg:"walk the dog"
      }
      chai.request(server)
          .post(route)
          .send(todo)
          .end((err, res) => {
            res.should.have.status(422);
          done();
          })
  });
    it('asserting with the same id, should throw exeption', (done) => {
      const id = makeid(5);
      const route = '/todo/' + id
      let dataPreperetion = {
         _id: id,
         mssg:"walk the dog",
         checked:false
      }
      let todo = {
        mssg:"walk the dog"
      }
        todos.insertOne(dataPreperetion).then(() =>{
        chai.request(server)
        .post(route)
        .send(todo)
        .end((err, res) => {
          res.should.have.status(500);
          done()
        })
      })
    });
  });
describe('/GET todos', () => {
    it('get zero documents for not adding to db enything', (done) => {
      const route = '/todos'
      chai.request(server)
          .get(route) 
          .end((err, res) => {
            res.should.have.status(200);
            res.body.should.eql([])
          done();
          })
    });
    it('get one document after adding to db document', (done) => {
      const id = makeid(5);
      let todo = {
         mssg:"walk the dog"
      }
      let dataPreperetion = {
        _id: id,
        mssg:"walk the dog",
        checked:false
      }
      todos.insertOne(dataPreperetion).then(() =>{
            const getRoute = '/todos'
            chai.request(server)
                .get(getRoute) 
                .end((err, res) => {
                  res.should.have.status(200);
                  res.body[0].should.have.property('mssg').eql('walk the dog');
                  res.body[0].should.have.property('_id').eql(id);
                  res.body[0].should.have.property('checked').eql(false);
                  done();
                })
              })
  });
});
describe('/patch todos', () => {
  it('test if massege updated', (done) => {
    const id = makeid(5);
    const route = '/todo/mssg/' + id
    let dataPreperetion = {
       _id: id,
       mssg:"walk the dog",
       checked:false
    }
    let todo = {
      mssg:"walk the hyena"
    }
      todos.insertOne(dataPreperetion).then(() =>{
      chai.request(server)
      .patch(route)
      .send(todo)
      .end((err, res) => {
        res.should.have.status(200);
        res.body.should.have.property('mssg').eql('walk the hyena')
        done()
      })
    })
  });
  it('should return error if massege is less then 2 chars', (done) => {
    const id = makeid(5);
    const route = '/todo/mssg/' + id
    let dataPreperetion = {
       _id: id,
       mssg:"walk the dog",
       checked:false
    }
    let todo = {
      mssg:"q"
    }
      todos.insertOne(dataPreperetion).then(() =>{
      chai.request(server)
      .patch(route)
      .send(todo)
      .end((err, res) => {
        res.should.have.status(422);
        done()
      })
    })
  });
  it('should return error if massege is over 99 chars', (done) => {
    const id = makeid(5);
    const route = '/todo/mssg/' + id
    let dataPreperetion = {
       _id: id,
       mssg:"walk the dog",
       checked:false
    }
    let todo = {
      mssg:"happy passover! happy passover! happy passover! happy passover! happy passover! happy passover!happy passover! happy passover! happy passover! happy passover! happy passover! happy passover!happy passover! happy passover! happy passover! happy passover!happy passover! happy passover! happy passover! happy passover!happy passover! happy passover! happy passover! happy passover!happy passover! happy passover! happy passover! happy passover!happy passover! happy passover! happy passover! happy passover!"
    }
      todos.insertOne(dataPreperetion).then(() =>{
      chai.request(server)
      .patch(route)
      .send(todo)
      .end((err, res) => {
        res.should.have.status(422);
        done()
      })
    })
  });
  it('should return error if massege is not in the body of the request', (done) => {
    const id = makeid(5);
    const route = '/todo/mssg/' + id
    let dataPreperetion = {
       _id: id,
       mssg:"walk the dog",
       checked:false
    }
    let todo = {

    }
      todos.insertOne(dataPreperetion).then(() =>{
      chai.request(server)
      .patch(route)
      .send(todo)
      .end((err, res) => {
        res.should.have.status(422);
        done()
      })
    })
  });
  it('test if checked updated', (done) => {
    const id = makeid(5);
    const route = '/todo/checked/' + id
    let dataPreperetion = {
       _id: id,
       mssg:"walk the dog",
       checked:false
    }
    let todo = {
      checked:true
    }
      todos.insertOne(dataPreperetion).then(() =>{
      chai.request(server)
      .patch(route)
      .send(todo)
      .end((err, res) => {
        res.should.have.status(200);
        res.body.should.have.property('checked').eql(true)
        done()
      })
    })
  });
  it('test if we get an error if not supply boolean in checked property', (done) => {
    const id = makeid(5);
    const route = '/todo/checked/' + id
    let dataPreperetion = {
       _id: id,
       mssg:"walk the dog",
       checked:false
    }
    let todo = {
      checked:"notBoll"
    }
      todos.insertOne(dataPreperetion).then(() =>{
      chai.request(server)
      .patch(route)
      .send(todo)
      .end((err, res) => {
        res.should.have.status(422);
        done()
      })
    })
  });
  it('test if we dont get any checked property, should throw an error', (done) => {
    const id = makeid(5);
    const route = '/todo/checked/' + id
    let dataPreperetion = {
       _id: id,
       mssg:"walk the dog",
       checked:false
    }
    let todo = {

    }
      todos.insertOne(dataPreperetion).then(() =>{
      chai.request(server)
      .patch(route)
      .send(todo)
      .end((err, res) => {
        res.should.have.status(422);
        done()
      })
    })
  });
  });

  describe('/patch todos', () => {
    it('tryng to delete an object from db', (done) => {
      const id = makeid(5);
      const route = '/todo/' + id
      let dataPreperetion = {
         _id: id,
         mssg:"walk the dog",
         checked:false
      }
      todos.insertOne(dataPreperetion).then(() =>{
        chai.request(server)
        .delete(route)
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.have.property('_id').eql(id)
          done()
        })
      })
    });
  })