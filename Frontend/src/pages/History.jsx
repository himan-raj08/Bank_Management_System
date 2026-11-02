import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";

function History() {
  const navigate = useNavigate();

  const [transactions, setTransactions] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchHistory();
  }, []);

  const fetchHistory = async () => {
    try {
      const res = await api.get("/transaction/history");

      console.log(res.data);

      setTransactions(res.data.transaction);
    } catch (error) {
      console.log(error);

      setError(
        error.response?.data?.message || "Failed to fetch history"
      );
    }
  };

  return (
    <div className="min-h-screen bg-black-100 p-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">
          Transaction History
        </h1>

        <button
          onClick={() => navigate("/dashboard")}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg"
        >
          Back
        </button>
      </div>

      {error && (
        <p className="text-red-600 mb-4">{error}</p>
      )}

      <div className="bg-green-300 rounded-xl shadow p-5">

        {transactions.length === 0 ? (
          <p className="text-center text-gray-500">
            No Transactions Found
          </p>
        ) : (
          transactions.map((tx) => (
            <div
              key={tx._id}
              className="border-b py-4"
            >
              <p className="font-semibold text-lg">
                {tx.fromAccount
                  ? "Money Transfer"
                  : "Initial Deposit"}
              </p>

              <p>
                <strong>Amount:</strong> ₹{tx.amount}
              </p>

              <p>
                <strong>Status:</strong> {tx.status}
              </p>

              <p>
                <strong>Date:</strong>{" "}
                {new Date(tx.createdAt).toLocaleString()}
              </p>

              <p>
                <strong>From:</strong>{" "}
                {tx.fromAccount || "SYSTEM"}
              </p>

              <p>
                <strong>To:</strong> {tx.toAccount}
              </p>
            </div>
          ))
        )}
        <p className="font-bold text-4xl text-red-700">Thanks</p>
      </div>
    </div>
  );
}

export default History;