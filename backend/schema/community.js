const mongoose = require('mongoose');

const CommunitySchema = new mongoose.Schema({
  model: {
    type: String,
    required: true
  },
  privacyAvengers: {
    type: Number,
    required: true
  },
  status: {
    type: Number,//1:under attack, 0:expired, 2:attack done
  }
})

CommunitySchema.statics = {
  // find card by email and tokenId
  findAll: function() {
    return this.findAll().exec()
  },
  // insert card deletion
  insertByModel: function(model, privacyAvengers,status) {
    let newModel = {
      model: model,
      privacyAvengers: privacyAvengers,
      status: status
    }
    return this.create(newModel)
  },
  // set card deletion failed
  updateByModel: function(model, privacyAvengers,status) {
    return this.findOneAndUpdate({model:model, privacyAvengers:privacyAvengers,status:status}, {failed: true}).exec()
  }
}

//暴露出去的方法
module.exports = CommunitySchema