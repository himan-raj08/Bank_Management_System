const mongoose =require('mongoose')

 const ledgerSchema =new mongoose.Schema({
    account:{
        type: mongoose.Schema.Types.ObjectId,
         ref: "account",
         required: [true, "Ledger must be associated with an account"],
         index: true,
          immutable:true
    },
      amount:{
        type:Number,
          required: [true, "Amount is required for a ledger entry"],
            index:true,
              immutable: true
      },
      transaction:{
          type: mongoose.Schema.Types.ObjectId,
           ref: "Transaction",
             required: [true, "Ledger must be associated with a transaction"],
               index: true,
                 immutable: true
      },
        type:{
            type:String,
              enum:{
                  values: ["CREDIT", "DEBIT"],
                    message: "Type can be either credit or debit"
              },
              required: [true, "Ledger type is required"],
                immutable: true
        }
 })


  function preventLedgermodification(){
  throw new Error("Ledger entries are immutable and cannot be modifed");
  }
    ledgerSchema.pre('findOneAndUpdate', preventLedgermodification);
      ledgerSchema.pre('updateOne', preventLedgermodification);
    ledgerSchema.pre('deleteOne', preventLedgermodification);
    ledgerSchema.pre('remove', preventLedgermodification);
    ledgerSchema.pre('deleteMany', preventLedgermodification);
        ledgerSchema.pre('updateMany', preventLedgermodification);
    ledgerSchema.pre('findOneAndDelete', preventLedgermodification);
    ledgerSchema.pre('findOneAndReplace', preventLedgermodification);




    const ledgermodel = mongoose.model("ledger", ledgerSchema);

     module.exports =ledgermodel;