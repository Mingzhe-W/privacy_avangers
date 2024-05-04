const mongoose = require('mongoose');

const ChanllangeSchema = new mongoose.Schema({
  Model: {
    type: String,
    required: true
  }, 
  Status: {
    type: Number, //0:wait to unlearn, 1:unlearn done
    default:"0" 
  },
  Address: {
    type: String //smart contract address
  }
})

UnlearningSchema.statics = {
  // find card by email and tokenId
  findAll: function() {
    return this.findAll().exec()
  },
  // insert card deletion
  insertByModel: function(Model, Status,Address) {
    let newModel = {
        Model: model,
        Status: Status,
        Address: Address
    }
    return this.create(newModel)
  },
  // set card deletion failed
  updateByModel: function(Model, Status,Address) {
    return this.findOneAndUpdate({Model:Model, Status:Status,Address:Address}, {failed: true}).exec()
  }
}

//暴露出去的方法
module.exports = UnlearningSchema