/**
 * Created by Cooper on 2018/6/2.
 */
const mongoose = require('mongoose');
mongoose.connect('mongodb://127.0.0.1:27017/komg');

var Schema = mongoose.Schema;

var apiSchema = new Schema(
  {
    _id: String,
    name: { type: String, required: true },
    path: { type: String, required: true },
    targets: { type: [{ url: String, weight: Number, status: Number, _id: false }], required: true },
    consumers: { type: [{ apikey: String, status: Number, _id: false }], required: true },
    order: { type: Number, required: true },
  },
  { _id: false, collection: 'apis' },
);

// apiSchema.index({ name: 1});

var Api = mongoose.model('Api', apiSchema);

module.exports = Api;

// Api.find()
// .then(ret => {
//     console.log(ret);
// })
// .catch(err => {
//     console.log(err);
// })

// const kitty = new Api({_id: 'test', name: 'test', path: '/test', order: 8});
//
// kitty
//   .save()
//   .then(ret => {
//     console.log(ret);
//   })
//   .catch(err => {
//     console.log(err);
//   });
