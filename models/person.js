const mongoose = require('mongoose');
const url = process.env.MONGO_URI;

mongoose
  .connect(url)
  .then(() => {
    console.log('connected to MongoDB');
  })
  .catch((error) => {
    console.log('error connecting to MongoDB:', error.message);
  });

const personsSchema = new mongoose.Schema({
  name: String,
  number: Number,
});
personsSchema.set('toJSON', {
  transform: (_, returnedObject) => {
    returnedObject.id = returnedObject._id.toString();
    delete returnedObject._id;
    delete returnedObject.__v;
  },
});
module.exports = mongoose.model('Person', personsSchema);
