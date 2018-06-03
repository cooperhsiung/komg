/**
 * Created by Cooper on 2018/6/2.
 */
const mongoose = require('mongoose');
mongoose.connect('mongodb://127.0.0.1:27017/komg');
const Schema = mongoose.Schema;

const targetSchema = new Schema(
  {
    url: {
      type: String,
      validate: {
        validator: function(v) {
          return /^http(s|):\/\/\S+/.test(v);
        },
        message: '{VALUE} is not a required url!',
      },
      required: true,
    },
    weight: { type: Number, required: true },
    status: {
      type: Number,
      validate: {
        validator: function(v) {
          return /[1|0|\-1]/.test(v);
        },
        message: '{VALUE} is not a required status!',
      },
      required: true,
    },
  },
  { _id: false },
);

const consumerSchema = new Schema(
  {
    apikey: { type: String, required: true },
    status: {
      type: Number,
      validate: {
        validator: function(v) {
          return /[1|0|\-1]/.test(v);
        },
        message: '{VALUE} is not a required status!',
      },
      required: true,
    },
  },
  { _id: false },
);

const apiSchema = new Schema(
  {
    _id: String,
    name: { type: String, required: true },
    path: {
      type: String,
      validate: {
        validator: function(v) {
          return /^\/\S/.test(v);
        },
        message: '{VALUE} is not a required path!',
      },
      required: true,
    },
    targets: { type: [targetSchema], required: true },
    consumers: { type: [consumerSchema], required: true },
    order: { type: Number, required: true },
  },
  { _id: false, collection: 'apis' },
);

const db = require('./local').db;
apiSchema.post('save', api => {
  console.log('========= save');
  let exist = db
    .get('komg')
    .find({ _id: api._id })
    .value();
  console.log(!!exist);
  if (exist) {
    db
      .get('komg')
      .find({ _id: api._id })
      .assign(api.toObject())
      .write();
  } else {
    db
      .get('komg')
      .push(api)
      .write();
  }
});

apiSchema.post('remove', api => {
  db
    .get('komg')
    .remove({ _id: api._id })
    .write();
});

module.exports = mongoose.model('Api', apiSchema);
