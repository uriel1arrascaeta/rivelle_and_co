import React from 'react';

const testimonialsData = [
  {
    quote:
      'HomeOS ha revolucionado la forma en que gestiono mis propiedades. ¡Es una herramienta indispensable!',
    author: 'Ana Pérez',
    role: 'Corredora Inmobiliaria, InmoFuturo',
    avatar: 'https://i.pravatar.cc/150?img=1',
  },
  {
    quote:
      'La facilidad para agendar visitas y comunicarme con los clientes ha mejorado mi eficiencia en un 200%.',
    author: 'Carlos Gómez',
    role: 'Agente Inmobiliario, Bienes Raíces Premium',
    avatar: 'https://i.pravatar.cc/150?img=2',
  },
];

const TestimonialCard = ({ quote, author, role, avatar }) => (
  <div className="bg-white p-8 rounded-lg shadow-lg transform hover:scale-105 transition-transform duration-300">
    <p className="text-gray-600 italic mb-6">"{quote}"</p>
    <div className="flex items-center">
      <img className="w-12 h-12 rounded-full mr-4" src={avatar} alt={author} />
      <div>
        <p className="font-bold text-gray-900">{author}</p>
        <p className="text-sm text-gray-500">{role}</p>
      </div>
    </div>
  </div>
);

export default function Testimonials() {
  return (
    <section className="bg-white py-20">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl md:text-4xl font-bold text-center text-gray-900 mb-12">Lo que dicen nuestros clientes</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12">
          {testimonialsData.map((testimonial) => <TestimonialCard key={testimonial.author} {...testimonial} />)}
        </div>
      </div>
    </section>
  );
}
