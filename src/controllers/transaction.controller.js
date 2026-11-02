const transactionModel = require("../models/transaction.model");
const ledgerModel = require("../models/ledgermodel");
const accountModel = require("../models/account.model");
const emailService = require("../services/email.services");

async function createTransaction(req, res) {
  try {
   
    console.log(req.body);
    const { toAccount, amount, idempotencyKey } = req.body;
 
    if (!toAccount || !amount || !idempotencyKey) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    // Logged-in user's account
    const fromUserAccount = await accountModel.findOne({
      user: req.user._id,
    });

    if (!fromUserAccount) {
      return res.status(404).json({
        message: "Sender account not found",
      });
    }

    // Receiver account
    const toUserAccount = await accountModel.findById(toAccount);

    if (!toUserAccount) {
      return res.status(404).json({
        message: "Receiver account not found",
      });
    }

    // Prevent self transfer
    if (fromUserAccount._id.toString() === toUserAccount._id.toString()) {
      return res.status(400).json({
        message: "Cannot transfer to same account",
      });
    }


    // Idempotency check
    const existingTransaction = await transactionModel.findOne({
      idempotencyKey,
    });

    if (existingTransaction) {
      return res.status(200).json({
        message: "Transaction already processed",
        transaction: existingTransaction,
      });
    }

    // Account status check
    if (
      fromUserAccount.status !== "ACTIVE" ||
      toUserAccount.status !== "ACTIVE"
    ) {
      return res.status(400).json({
        message: "Both accounts must be ACTIVE",
      });
    }

    // Balance check
    const balance = await fromUserAccount.getBalance();

    if (balance < amount) {
      return res.status(400).json({
        message: `Insufficient funds. Current balance is ₹${balance}`,
      });
    }

    // Create transaction
    const transaction = await transactionModel.create({
      fromAccount: fromUserAccount._id,
      toAccount,
      amount,
      idempotencyKey,
      status: "PENDING",
    });

    // Debit entry
    await ledgerModel.create({
      account: fromUserAccount._id,
      amount,
      transaction: transaction._id,
      type: "DEBIT",
    });

    // Credit entry
    await ledgerModel.create({
      account: toAccount,
      amount,
      transaction: transaction._id,
      type: "CREDIT",
    });

    transaction.status = "COMPLETED";
    await transaction.save();

    // Email (optional)
    // await emailService.sendTransactionEmail(
    //   req.user.email,
    //   req.user.name,
    //   amount,
    //   toAccount
    // );

    return res.status(201).json({
      success: true,
      message: "Transaction completed successfully",
      transaction,
    });
  } catch (error) {
    console.log(error);

    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
}
async function createInitialFund(req, res) {
  try {
    const { accountId, amount, idempotencyKey } = req.body;

    if (!accountId || !amount || !idempotencyKey) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    const account = await accountModel.findById(accountId);

    if (!account) {
      return res.status(404).json({
        success: false,
        message: "Account not found",
      });
    }

    if (account.status !== "ACTIVE") {
      return res.status(400).json({
        success: false,
        message: "Account is not ACTIVE",
      });
    }

    const existingTransaction = await transactionModel.findOne({
      idempotencyKey,
    });

    if (existingTransaction) {
      return res.status(200).json({
        success: true,
        message: "Transaction already processed",
        transaction: existingTransaction,
      });
    }

    const transaction = await transactionModel.create({
      fromAccount: null, // System funding
      toAccount: account._id,
      amount,
      idempotencyKey,
      status: "PENDING",
    });

    await ledgerModel.create({
      account: account._id,
      amount,
      transaction: transaction._id,
      type: "CREDIT",
    });

    transaction.status = "COMPLETED";
    await transaction.save();

    return res.status(201).json({
      success: true,
      message: "Initial funds added successfully",
      transaction,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
}
async function getTransactionHistory(req, res) {
  try{



    const account =await accountModel.findOne({
      user: req.user._id
    });
    if(!account) {
      return res.status(404).json({
        message: "Account not found"
      })
    }


    const transaction =await transactionModel.find({
      $or: [
        {fromAccount: account._id},
        {toAccount: account._id}
      ]
    })
    .sort({
      createdAt:-1
    });


    return res.status(200).json({
      success:true,
      transaction
    });
  }
  catch(error){

    console.log(error);

    res.status(500).json({
      message:"Internal Server Error"
    });

  }
}

module.exports = {
  getTransactionHistory,
  createTransaction,
 createInitialFund
};