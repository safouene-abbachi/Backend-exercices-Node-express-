const mongoose = require('mongoose');

const password = process.argv[2];
const name = process.argv[3];
const number = process.argv[4];

const url = `mongodb+srv://safouene:${password}@cluster0.2oe0iau.mongodb.net/?retryWrites=true&w=majority`;
const personsSchema = new mongoose.Schema({
  name: String,
  number: Number,
});
const Person = mongoose.model('Person', personsSchema);

mongoose
  .connect(url, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then((res) => {
    console.log('Established connection to MongoDB');
    if (!name || !number) {
      console.log('phonebook:');
      Person.find({}).then((result) => {
        result.forEach((person) => {
          console.log(`${person.name} ${person.number}`);
        });

        mongoose.connection.close();
      });
    } else {
      const person = new Person({
        name: name,
        number: number,
      });
      return person.save().then((result) => {
        console.log(
          `added ${result.name} number ${result.number} to phonebook`
        );
        mongoose.connection.close();
      });
    }
  })

  .catch((err) => {
    console.log(err);
  });
