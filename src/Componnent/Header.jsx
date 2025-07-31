import React from 'react';
import Logo from '../Asset/Poeage Logo.png';

export default function Header() {
  return (
    <header className="bg-white shadow-md py-4 fixed top-0 w-full px-6">
      <nav className="flex justify-between items-center max-w-7xl mx-auto">
        {/* Logo */}
        <a href="/">
          <img className="w-32" src={Logo} alt="Poeage Logo" />
        </a>

        {/* Navigation Link */}
        <div>
          <a
            href="/quotation"
            className="text-blue-600 hover:text-blue-800 font-semibold transition"
          >
            Download History
          </a>
        </div>
      </nav>
    </header>
  );
}
