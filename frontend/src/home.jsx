import React from 'react';

import Navbar from '../components/Navbar';
import Hero from '../components/Hero';
import Benefit from '../components/Benefit';
import Testimonials from '../components/Testimonials';
import Footer from '../components/Footer';

const benefits = [
  {
    icon: '🏡',
    title: 'Organiza tus propiedades',
    description: 'Mantén un control total y centralizado de todos tus inmuebles.',
  },
  {
    icon: '👥',
    title: 'Gestiona tus leads',
    description: 'Atrae y administra clientes potenciales de manera eficiente.',
  },
  {
    icon: '📅',
    title: 'Agenda visitas fácilmente',
    description: 'Coordina visitas y reuniones con clientes en segundos.',
  },
];

export default function Home() {
  return (
    <div className="bg-white antialiased">
      <Navbar />
      <Hero />

      {/* Benefits Section */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
              Todo lo que necesitas, en un solo lugar
            </h2>
            <p className="text-lg text-gray-600 mt-2 max-w-2xl mx-auto">
              HomeOS simplifica cada paso del proceso inmobiliario para que te enfoques en cerrar tratos.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12">
            {benefits.map((benefit) => (
              <Benefit
                key={benefit.title}
                icon={benefit.icon}
                title={benefit.title}
                description={benefit.description}
              />
            ))}
          </div>
        </div>
      </section>

      <Testimonials />
      
      <Footer />
    </div>
  );
}