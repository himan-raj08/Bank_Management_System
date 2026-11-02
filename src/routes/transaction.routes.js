const express = require("express");
const { createTransaction,createInitialFund, getTransactionHistory } = require("../controllers/transaction.controller");
const { authMiddleware } = require("../middleware/auth.middleware");

const router = express.Router();

router.post("/", authMiddleware, createTransaction);
router.post(
  "/initial-fund",
  authMiddleware,
  createInitialFund
);
router.get("/history",
    authMiddleware,
    getTransactionHistory
)

module.exports = router;