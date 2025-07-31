import React from "react";

export default function DownloadHistory() {
  const history = JSON.parse(localStorage.getItem("invoiceHistory")) || [];

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded shadow mt-6">
      <h2 className="text-2xl font-bold mb-4 text-blue-700">Download History</h2>
      {history.length === 0 ? (
        <p className="text-gray-500">No invoices generated yet.</p>
      ) : (
        <table className="w-full table-auto border">
          <thead>
            <tr className="bg-gray-100">
              <th className="p-2 border">Date</th>
              <th className="p-2 border">Client</th>
              <th className="p-2 border">Service</th>
              <th className="p-2 border">Amount</th>
            </tr>
          </thead>
          <tbody>
            {history.map((entry, i) => (
              <tr key={i} className="text-sm text-center">
                <td className="p-2 border">{entry.date}</td>
                <td className="p-2 border">{entry.name} ({entry.email})</td>
                <td className="p-2 border">{entry.service}</td>
                <td className="p-2 border">₹{entry.amount}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
