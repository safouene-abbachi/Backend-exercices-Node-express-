require('dotenv').config();
const express = require('express');
const logger = require('morgan');
const cors = require('cors');
const PORT = process.env.PORT;
const app = express();
const Person = require('./models/person');
app.use(cors());
app.use(express.static('build'));
app.use(express.json());

logger.token('method', function (req) {
  return req.method;
});
logger.token('url', function (req) {
  return req.url;
});
logger.token('status', function (res) {
  return res.statusCode;
});
logger.token('response-time', function (res) {
  const responseTime = res.get('X-Response-Time');
  return responseTime;
});
logger.token('postRequest', function (req) {
  if (req.method === 'POST') {
    return JSON.stringify(req.body);
  }
});

app.use(
  logger(
    ':method :url :status :response-time ms - :res[content-length] :postRequest'
  )
);

app.get('/api/persons', (res) => {
  Person.find({})
    .then((result) => {
      console.log('🚀 ~ result', result);
      res.json(result);
    })
    .catch((error) => {
      console.log(error);
    });
});

app.get('/api/info', (res) => {
  Person.find({})
    .then((result) => {
      const persons = result.length;
      const date = new Date();
      const message = `<p>Phonebook has info for ${persons} people</p><p>${date}</p>`;
      res.send(message);
    })
    .catch((error) => {
      console.log(error);
    });
});

app.get('/api/persons/:id', (req, res) => {
  const id = req.params.id;
  Person.findById(id)
    .then((result) => {
      if (!result) {
        return res.status(404).end();
      } else {
        res.status(200).send(result);
      }
    })
    .catch((error) => {
      console.log(error);
    });
});

app.delete('/api/persons/:id', (req, res, next) => {
  const id = req.params.id;
  console.log(req.params);
  Person.findByIdAndRemove(id)
    .then((result) => {
      console.log('🚀 ~ result', result);
      if (result) {
        res.status(200).json('Deleted successfully');
      }
    })
    .catch((error) => {
      next(error);
    });
});

app.post('/api/persons', (req, res, next) => {
  const newPerson = req.body;
  if (newPerson.name === '' || newPerson.number === '') {
    return res.status(400).json({ error: 'Name or number missing' });
  }
  Person.findOne({ name: newPerson.name })
    .then((result) => {
      console.log('🚀 ~ result', result);
      if (result) {
        return res.status(400).send({ error: 'Name must be unique' });
      } else {
        const newEntry = new Person({
          name: newPerson.name,
          number: newPerson.number,
        });
        newEntry
          .save()
          .then(() => {
            res.status(201).json(newEntry);
          })
          .catch((error) => {
            console.log(error);
            next(error);
          });
      }
    })
    .catch((error) => {
      console.log(error);
      next(error);
    });
});

app.put('/api/persons/:id', (req, res, next) => {
  const id = req.params.id;
  const number = req.body.number;
  Person.findByIdAndUpdate(
    id,
    { number: number },
    { new: true, runValidators: true, context: 'query' }
  )
    .then((updatedPerson) => {
      res.status(200).send(updatedPerson);
    })
    .catch((error) => {
      console.log(error);
      next(error);
    });
});

const errorHandlerMiddleware = (error, res) => {
  console.log('==================================>', error);
  if (error.name === 'CastError') {
    return res.status(400).json({ error: 'malformatted id' });
  }
  if (error.name === 'ValidationError') {
    return res.status(400).json({ error: error.message });
  }
};
app.use(errorHandlerMiddleware);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
