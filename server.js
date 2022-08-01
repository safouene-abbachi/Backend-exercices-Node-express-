const express = require('express');
const PORT = process.env.PORT || 3001;
const app = express();
app.use(express.json());

const data = [
  {
    id: 1,
    name: 'Arto Hellas',
    number: '040-123456',
  },
  {
    id: 2,
    name: 'Ada Lovelace',
    number: '39-44-5323523',
  },
  {
    id: 3,
    name: 'Dan Abramov',
    number: '12-43-234345',
  },
  {
    id: 4,
    name: 'Mary Poppendieck',
    number: '39-23-6423122',
  },
];

app.get('/api/persons', (req, res) => {
  res.json(data);
});

app.get('/api/info', (req, res) => {
  res.send(
    `<p>Phonebook has info for ${
      data.length
    } people</p><br/><p>${new Date()}</p>`
  );
});

app.get('/api/persons/:id', (req, res) => {
  const id = Number(req.params.id);
  const person = data.find((person) => person.id === id);
  if (person) {
    res.json(person);
  } else {
    res.status(404).end();
  }
});

app.delete('/api/persons/:id', (req, res) => {
  const id = Number(req.params.id);
  const person = data.find((person) => person.id === id);
  if (person) {
    const filtredPersons = data.filter((person) => person.id !== id);
    res.status(200).json(filtredPersons);
  } else {
    res.status(404).json('No such person').end();
  }
});

app.post('/api/persons', (req, res) => {
  const newPerson = req.body;
  if (newPerson.name === '' || newPerson.number === '') {
    return res.status(400).json({ error: 'Name or number missing' });
  }
  const person = data.find((person) => person.name === newPerson.name);
  if (person) {
    return res.status(400).json({ error: 'Name must be unique' });
  }
  const id = Math.floor((1 + Math.random()) * 0x10000)
    .toString(16)
    .substring(1);
  newPerson.id = id;
  data.push(newPerson);
  res.json(newPerson);
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
