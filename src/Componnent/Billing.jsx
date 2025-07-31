import { useState } from "react";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import Logo from "../Asset/Poeage Logo.png";

const languages = {
  en: {
    invoice: "Invoice",
    clientName: "Client Name",
    email: "Email",
    service: "Service",
    amount: "Total Amount",
    date: "Billing Date",
    address: "Client Address",
    thanks: "*This is a system-generated invoice from Poeage Technology Pvt. Ltd.",
    enter: "Enter Client Details",
    billingInfo: "Billing Info",
    clientInfo: "Client Info",
    required: "This field is required",
    invalidEmail: "Invalid email address",
    invalidAmount: "Enter a valid amount",
  },
  // Add more languages here if needed
};

export default function Billing() {
  const [client, setClient] = useState({
    name: "",
    email: "",
    service: "",
    amount: "",
    address: "",
  });

  const [errors, setErrors] = useState({});
  const [lang, setLang] = useState("en");
  const [history, setHistory] = useState(() => {
    return JSON.parse(localStorage.getItem("billingHistory")) || [];
  });

  const t = languages[lang];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setClient({ ...client, [name]: value });
    setErrors({ ...errors, [name]: "" });
  };

  const validate = () => {
    const newErrors = {};
    if (!client.name.trim()) newErrors.name = t.required;
    if (!client.email.trim()) {
      newErrors.email = t.required;
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(client.email)) {
      newErrors.email = t.invalidEmail;
    }
    if (!client.address.trim()) newErrors.address = t.required;
    if (!client.service.trim()) newErrors.service = t.required;
    if (!client.amount || isNaN(client.amount) || Number(client.amount) <= 0) {
      newErrors.amount = t.invalidAmount;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const generatePDF = async () => {
    if (!validate()) return;

    const invoice = document.getElementById("invoice-section");
    if (!invoice) return;

    const canvas = await html2canvas(invoice, { scale: 2 });
    const imgData = canvas.toDataURL("image/png");

    const pdf = new jsPDF("p", "mm", "a4");
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

    pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);

    const fileName = `Invoice_${client.name || "Client"}.pdf`;
    pdf.save(fileName);

    const newEntry = {
      id: Date.now(),
      name: client.name,
      email: client.email,
      date: new Date().toLocaleDateString(),
      service: client.service,
      amount: client.amount,
      fileName,
    };

    const updatedHistory = [newEntry, ...history];
    localStorage.setItem("billingHistory", JSON.stringify(updatedHistory));
    setHistory(updatedHistory);
  };

  return (
    <div className="max-w-5xl mx-auto mt-16 px-4 py-10 font-sans">
      {/* Language Switch */}
      <div className="flex justify-end gap-2 mb-4">
        {Object.keys(languages).map((code) => (
          <button
            key={code}
            onClick={() => setLang(code)}
            className={`px-3 py-1 rounded text-xs border ${
              lang === code ? "bg-blue-600 text-white" : "bg-white text-gray-800"
            }`}
          >
            {code.toUpperCase()}
          </button>
        ))}
      </div>

      {/* Client Form */}
      <div className="bg-white rounded-xl shadow-md p-6 mb-8 border">
        <h2 className="text-xl font-semibold text-gray-800 mb-5">{t.enter}</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          {[
            { name: "name", type: "text", placeholder: t.clientName },
            { name: "email", type: "email", placeholder: t.email },
            { name: "address", type: "text", placeholder: t.address },
            { name: "service", type: "text", placeholder: t.service },
            { name: "amount", type: "number", placeholder: t.amount },
          ].map((field) => (
            <div key={field.name} className="flex flex-col">
              <input
                type={field.type}
                name={field.name}
                value={client[field.name]}
                onChange={handleChange}
                placeholder={field.placeholder}
                className={`border px-3 py-2 rounded ${
                  errors[field.name] ? "border-red-500" : ""
                }`}
              />
              {errors[field.name] && (
                <span className="text-xs text-red-500 mt-1">
                  {errors[field.name]}
                </span>
              )}
            </div>
          ))}
        </div>

        <div className="flex justify-center mt-6">
          <button
            onClick={generatePDF}
            className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded shadow-md transition duration-300"
          >
            Download PDF
          </button>
        </div>
      </div>

      {/* Invoice Display */}
      <div id="invoice-section" className="bg-white rounded-xl shadow-lg overflow-hidden border text-sm md:text-base">
        <div className="bg-gradient-to-r from-slate-800 to-slate-900 text-white p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <img src={Logo} alt="Logo" className="w-20 h-auto" />
          <div className="text-center sm:text-right text-xs md:text-sm">
            <p className="font-bold text-lg">Poeage Technology Pvt. Ltd.</p>
            <p>Namakkal, Tamil Nadu, India</p>
            <p>info@poeagetech.com</p>
            <p>GSTIN: 33ABCDE1234F1Z2</p>
          </div>
        </div>

        <div className="relative p-6 space-y-6 text-gray-700">
          <div className="absolute text-6xl md:text-8xl font-extrabold opacity-5 rotate-45 top-1/2 left-1/4 pointer-events-none z-0">
            POEAGE
          </div>

          <div className="flex flex-col md:flex-row justify-between border-b pb-4 relative z-10">
            <h3 className="text-xl font-bold">{t.invoice}</h3>
            <div className="text-right space-y-1">
              <p><strong>{t.date}:</strong> {new Date().toLocaleDateString()}</p>
              <p><strong>Invoice ID:</strong> INV-{Date.now().toString().slice(-6)}</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 relative z-10">
            <div>
              <h4 className="font-semibold mb-2">{t.clientInfo}</h4>
              <p><strong>{t.clientName}:</strong> {client.name}</p>
              <p><strong>{t.email}:</strong> {client.email}</p>
              <p><strong>{t.address}:</strong> {client.address}</p>
            </div>
            <div>
              <h4 className="font-semibold mb-2">{t.billingInfo}</h4>
              <p><strong>{t.service}:</strong> {client.service}</p>
              <p><strong>{t.amount}:</strong> ₹{client.amount}</p>
            </div>

            {history.length > 0 && (
              <div className="mt-10 bg-white border rounded-lg p-6 shadow-sm col-span-full">
                <h3 className="text-lg font-semibold mb-4 text-slate-800">Download History</h3>
                <div className="overflow-auto">
                  <table className="min-w-full text-sm">
                    <thead>
                      <tr className="text-left bg-slate-100">
                        <th className="p-2">Date</th>
                        <th className="p-2">Client</th>
                        <th className="p-2">Email</th>
                        <th className="p-2">Service</th>
                        <th className="p-2">Amount</th>
                        <th className="p-2">File</th>
                      </tr>
                    </thead>
                    <tbody>
                      {history.map((item) => (
                        <tr key={item.id} className="border-t hover:bg-slate-50">
                          <td className="p-2">{item.date}</td>
                          <td className="p-2">{item.name}</td>
                          <td className="p-2">{item.email}</td>
                          <td className="p-2">{item.service}</td>
                          <td className="p-2">₹{item.amount}</td>
                          <td className="p-2">{item.fileName}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>

          <div className="border-t pt-4 text-center text-xs italic text-gray-500 relative z-10">
            {t.thanks}
          </div>
        </div>
      </div>
    </div>
  );
}
