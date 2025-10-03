import React from 'react';

export default function Footer() {
  const links = ['Sobre nosotros', 'Blog', 'Contacto', 'Términos y Condiciones'];
  
  return (
    <footer className="bg-white">
      <div className="container mx-auto px-4 py-12">
        <div className="flex flex-col md:flex-row justify-between items-center text-center md:text-left">
          <div className="mb-4 md:mb-0">
            <a href="/" className="text-xl font-bold text-gray-800">
              HomeOS
            </a>
            <p className="text-sm text-gray-500 mt-1">
              &copy; {new Date().getFullYear()} Todos los derechos reservados.
            </p>
          </div>
          <div className="flex flex-wrap justify-center gap-x-6 gap-y-2">
            {links.map((link) => (
              <a key={link} href="#" className="text-gray-600 hover:text-indigo-600 transition-colors">
                {link}
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}