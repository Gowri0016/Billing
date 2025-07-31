import React from "react";

export default function DownloadHistory() {
  const history = JSON.parse(localStorage.getItem("billingHistory")) || [];

  const exportCSV = () => {
    const csvRows = [
      ["Date", "Client", "Email", "Service", "Amount", "File Name"],
      ...history.map((h) => [
        h.date,
        h.name,
        h.email,
        h.service,
        h.amount,
        h.fileName || `Invoice_${h.name?.replace(/\s+/g, "_") || "Client"}.pdf`,
      ]),
    ];

    const blob = new Blob(
      [csvRows.map((row) => row.join(",")).join("\n")],
      { type: "text/csv" }
    );

    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "Download_History.csv";
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="max-w-4xl mx-auto p-4 md:p-6 mt-28 bg-white rounded shadow">
      <h2 className="text-xl md:text-2xl font-bold mb-4 text-blue-700">Download History</h2>

      <button
        onClick={exportCSV}
        className="mb-4 px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
      >
        Export History to CSV
      </button>

      {history.length === 0 ? (
        <p className="text-gray-500 text-sm md:text-base">No invoices generated yet.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full table-auto border text-xs md:text-sm">
            <thead>
              <tr className="bg-gray-100 text-gray-700">
                <th className="p-2 md:p-3 border">Date</th>
                <th className="p-2 md:p-3 border">Client</th>
                <th className="p-2 md:p-3 border">Service</th>
                <th className="p-2 md:p-3 border">Amount</th>
              </tr>
            </thead>
            <tbody>
              {history.map((entry, i) => (
                <tr key={i} className="text-center hover:bg-gray-50 transition">
                  <td className="p-2 md:p-3 border">{entry.date}</td>
                  <td className="p-2 md:p-3 border">
                    {entry.name}
                    <br className="md:hidden" />
                    <span className="text-gray-500 hidden md:inline"> ({entry.email})</span>
                  </td>
                  <td className="p-2 md:p-3 border">{entry.service}</td>
                  <td className="p-2 md:p-3 border">₹{entry.amount}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
