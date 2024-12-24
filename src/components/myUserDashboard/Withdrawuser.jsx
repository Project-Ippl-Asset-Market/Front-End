import React, { useState } from "react";
import axios from "axios";

const WithdrawForm = () => {
  const [amount, setAmount] = useState("");
  const [bankAccount, setBankAccount] = useState("");
  const [bankName, setBankName] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleWithdraw = async () => {
    setLoading(true);
    try {
      const response = await axios.post("/api/withdraw-fund", {
        userId: "idPenggunaUpdateDiSini", // Ganti dengan ID pengguna yang sesungguhnya
        amount: parseFloat(amount),
        bankAccount,
        bankName,
      });

      setMessage("Permintaan pencairan berhasil: " + response.data.message);
    } catch (error) {
      setMessage("Terjadi kesalahan: " + error.response.data.error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h2>Pencairan Dana</h2>
      <input
        type="text"
        placeholder="Nama Bank"
        value={bankName}
        onChange={(e) => setBankName(e.target.value)}
        required
      />
      <input
        type="text"
        placeholder="Nomor Rekening"
        value={bankAccount}
        onChange={(e) => setBankAccount(e.target.value)}
        required
      />
      <input
        type="number"
        placeholder="Jumlah"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
        required
      />
      <button onClick={handleWithdraw} disabled={loading}>
        {loading ? "Mengirim..." : "Tarik Dana"}
      </button>
      {message && <p>{message}</p>}
    </div>
  );
};

export default WithdrawForm;
