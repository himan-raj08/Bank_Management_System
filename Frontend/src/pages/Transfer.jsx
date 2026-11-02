import { useState } from "react";
import api from "../api/axios";

function Transfer() {

  const [formData, setFormData] = useState({
    toAccount: "",
    amount: "",
  });

  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);


  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };


  const handleTransfer = async (e) => {
    e.preventDefault();

    const data = {
      toAccount: formData.toAccount,
      amount: Number(formData.amount),
      idempotencyKey: crypto.randomUUID(),
    };


    try {

      setLoading(true);
      setMessage("");

      const res = await api.post("/transaction", data);

      console.log("SUCCESS:", res.data);

      setMessage("Transfer Successful ✅");


      setFormData({
        toAccount: "",
        amount: "",
      });


    } catch (error) {

      console.log("ERROR:", error);

      setMessage(
        error.response?.data?.message || "Transfer Failed"
      );


    } finally {

      setLoading(false);

    }
  };


  return (

    <div className="min-h-screen bg-green-300 flex justify-center items-center">

      <div className="bg-black p-8 rounded-xl shadow-lg w-96">

        <h1 className="text-3xl font-bold text-center mb-6 text-blue-800">
          Transfer Money
        </h1>


        {
          message && (
            <p className="text-center font-bold mb-4">
              {message}
            </p>
          )
        }


        <form onSubmit={handleTransfer}>


          <input
            type="text"
            name="toAccount"
            placeholder="Receiver Account ID"
            value={formData.toAccount}
            onChange={handleChange}
            className="w-full border p-3 text-blue-500 rounded-lg mb-4"
          />


          <input
            type="number"
            name="amount"
            placeholder="Amount"
            value={formData.amount}
            onChange={handleChange}
            className="w-full border p-3 rounded-lg text-blue-500 mb-4"
          />


          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700"
          >

            {
              loading ? "Processing..." : "Transfer"
            }

          </button>


        </form>


      </div>

    </div>

  );
}

export default Transfer;