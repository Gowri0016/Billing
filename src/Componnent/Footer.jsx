import React from 'react';
import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white py-6 text-center">
      <p className="mb-2">&copy; {new Date().getFullYear()} Poeage Technology Pvt. Ltd.</p>
      <Link
        to="/billing"
        className="text-blue-400 hover:text-blue-300 underline text-sm"
      >
        Generate Invoice
      </Link>
    </footer>
  );
}
