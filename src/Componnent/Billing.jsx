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
  // Add other languages here if needed
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
  const t = languages[lang];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setClient({ ...client, [name]: value });
    setErrors({ ...errors, [name]: "" }); // Clear error on change
  };

  const validate = () => {
    let newErrors = {};

    if (!client.name.trim()) newErrors.name = t.required;
    if (!client.email.trim()) {
      newErrors.email = t.required;
    } else if (!/^\S+@\S+\.\S+$/.test(client.email)) {
      newErrors.email = t.invalidEmail;
    }

    if (!client.address.trim()) newErrors.address = t.required;
    if (!client.service.trim()) newErrors.service = t.required;

    if (!client.amount) {
      newErrors.amount = t.required;
    } else if (isNaN(client.amount) || parseFloat(client.amount) <= 0) {
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
    pdf.save(`Invoice_${client.name || "Client"}.pdf`);
  };

  return (
    <div className="max-w-5xl mx-auto mt-16 px-4 py-10 font-sans">
      {/* Language Selection */}
      <div className="flex justify-end flex-wrap gap-2 mb-4">
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

      {/* Invoice View */}
      <div id="invoice-section" className="bg-white rounded-xl shadow-lg overflow-hidden border text-sm md:text-base">
        {/* Header */}
        <div className="bg-gradient-to-r from-slate-800 to-slate-900 text-white p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <img src={Logo} alt="Logo" className="w-20 h-auto" />
          <div className="text-center sm:text-right text-xs md:text-sm">
            <p className="font-bold text-lg">Poeage Technology Pvt. Ltd.</p>
            <p>Namakkal, Tamil Nadu, India</p>
            <p>info@poeagetech.com</p>
            <p>GSTIN: 33ABCDE1234F1Z2</p>
          </div>
        </div>

        {/* Watermark */}
        <div className="relative p-6 space-y-6 text-gray-700">
          <div className="absolute text-6xl md:text-8xl font-extrabold opacity-5 rotate-45 top-1/2 left-1/4 pointer-events-none z-0">
            POEAGE
          </div>

          {/* Invoice Header */}
          <div className="flex flex-col md:flex-row justify-between border-b pb-4 relative z-10">
            <h3 className="text-xl font-bold">{t.invoice}</h3>
            <div className="text-right space-y-1">
              <p><strong>{t.date}:</strong> {new Date().toLocaleDateString()}</p>
              <p><strong>Invoice ID:</strong> INV-{Date.now().toString().slice(-6)}</p>
            </div>
          </div>

          {/* Client & Billing Info */}
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
          </div>

          {/* Footer */}
          <div className="border-t pt-4 text-center text-xs italic text-gray-500 relative z-10">
            {t.thanks}
          </div>
        </div>
      </div>
    </div>
  );
}
