import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";

function Dashboard() {
 const navigate =useNavigate();
  const [account, setAccount] = useState(null);
  const [balance, setBalance] = useState(0);

  useEffect(() => {
    fetchAccount();
  }, []);
const fetchAccount = async () => {
    try {
      // Get user's account
      const res = await api.get("/account");
      console.log(res.data);
      const userAccount = res.data.accounts[0];

      if (!userAccount) {
        alert("No account found");
        return;
      }

      setAccount(userAccount);

      // Get balance
      const balanceRes = await api.get(
        `/account/balance/${userAccount._id}`
      );

      setBalance(balanceRes.data.balance);
    } catch (err) {
      console.log(err);
      alert("Failed to load account details");
    }
  };
const handleLogout =async() =>{
    try{
  await api.post("/auth/logout");
  navigate("/");
    }
  catch(error){
   console.log(error);

 }
  }

  return (
    <div className="min-h-screen bg-black-100">

      {/* Navbar */}
      <nav className="bg-blue-700 text-white px-8 py-4 flex justify-between items-center shadow-lg">
  <div>
    <h1 className="text-3xl font-bold">🏦 Secure Bank</h1>
    <p className="text-sm text-blue-100">
      Fast • Secure • Reliable
    </p>
  </div>

  <button
    onClick={handleLogout}
    className="bg-red-500 hover:bg-red-600 px-5 py-2 rounded-lg font-semibold transition"
  >
    Logout
  </button>
</nav>
      {/* Main Content */}
      <div className="max-w-6xl mx-auto p-8">

     <div>
      <h2 className="text-4xl font-bold text-green-800">
         Welcome Back 👋
      </h2>
      <p className="text-white mt-2">
        Manage your account andtransactions securely.
      </p>
     </div>


        {/* Cards */}
        <div className="grid md:grid-cols-3 gap-6">

          {/* Balance */}
          <div className="bg-white rounded-xl hover:shadow-2xl  p-6">
            <h3 className="text-green-500">💰 Available Balance </h3>

            <h1 className="text-4xl font-bold mt-3 text-green-600">
              ₹ {balance}
            </h1>
          </div>

          {/* Status */}
          <div className="bg-white rounded-xl shadow p-6">
            <h3 className="text-gray-500">🟢 Account Status</h3>

            <h1 className="text-3xl font-bold mt-3">
              {account?.status}
            </h1>
          </div>

          {/* Currency */}
          <div className="bg-white rounded-xl shadow p-6">
            <h3 className="text-blue-500"> 💵 Currency</h3>

            <h1 className="text-3xl font-bold mt-3 text-black">
              {account?.currency}
            </h1>
          </div>

        </div>

        {/* Action Buttons */}
        <div className="mt-10 flex gap-5">

          <button 
          onClick={() => navigate("/transfer")}
          className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700">
            Transfer Money
          </button>

          <button onClick={()=>navigate("/history")}
           className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700">
            Transaction History
          </button>

        </div>

      </div>
    </div>
  );
}

export default Dashboard;