const mongoose =require("mongoose")

const transactionSchema = new mongoose.Schema({
   
fromAccount: {
    type: mongoose.Schema.Types.ObjectId,
    default: null,
    index: true
},
    toAccount: {
        type: mongoose.Schema.Types.ObjectId,
        required: [true, "Transaction must be associated with a to account"],
        index: true
    },
    status: {
        type: String,
        enum: ["PENDING", "COMPLETED", "FAILED", "REVERSED"],
        default: "PENDING"
    },
    amount: {
        type: Number,
        required: true,
        min: 0
    },
    idempotencyKey: {
        type: String,
        required: true,
        unique: true,
        index: true
    }
}, {
    timestamps: true
});

  const transactionModel =mongoose.model("transaction", transactionSchema);

  module.exports =transactionModel;