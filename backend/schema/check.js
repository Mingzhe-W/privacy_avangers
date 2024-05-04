const mongoose = require('mongoose');

const CheckSchema = new mongoose.Schema({
  worldID: {
    type: String,
    required: true
  },
  model: {
    type: String,
    required: true
  },
  pattenExamples: {
    type: String,
    required: true
  },
  checkFeedback: {
    type: Number,// 2:not sure, 1:display the patten, 0:did not display the patten
    default:"2"
  },
  Status: {
    type: Number,//0:under check, 1:check done
    default:"0" 
  },
  conclusion:{
    type: String
  }
})

CheckSchema.statics = {
  // find card by email and tokenId
  findAll: function() {
    return this.findAll().exec()
  },
  // insert card deletion
  insertByModel: function(worldID,model, pattenExamples,checkFeedback,Status,conclusion) {
    let newModel = {
        worldID: worldID,
        model: model,
        pattenExamples: pattenExamples,
        checkFeedback: checkFeedback,
        Status: Status,
        conclusion: conclusion
    }
    return this.create(newModel)
  },
  // set card deletion failed
  updateByModel: function(worldID,model, pattenExamples,checkFeedback,Status,conclusion) {
    return this.findOneAndUpdate({worldID:worldID,model:model, pattenExamples:pattenExamples,checkFeedback:checkFeedback,Status:Status,conclusion:conclusion}, {failed: true}).exec()
  }
}

//暴露出去的方法
module.exports = CheckSchema