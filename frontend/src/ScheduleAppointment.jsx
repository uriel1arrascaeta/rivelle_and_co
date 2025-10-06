import React, { useState } from 'react';
import Navbar from './Navbar';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css'; // Estilos por defecto

export default function ScheduleAppointment() {
  const [date, setDate] = useState(new Date());

  return (
    <div className="bg-gray-50 min-h-screen">
      <Navbar />
      <div className="container mx-auto px-4 py-12">
        <h1 className="text-4xl font-bold text-gray-900 text-center mb-8">Agendar una Cita</h1>
        <div className="max-w-md mx-auto bg-white p-6 rounded-lg shadow-md">
          <p className="text-gray-700 text-center mb-4">
            Selecciona una fecha para tu visita.
          </p>
          <div className="flex justify-center">
            <Calendar onChange={setDate} value={date} />
          </div>
          <button className="w-full mt-6 bg-indigo-600 text-white font-semibold py-3 px-8 rounded-lg transition-colors duration-300 ease-in-out hover:bg-indigo-700">
            Confirmar Cita para {date.toLocaleDateString()}
          </button>
        </div>
      </div>
    </div>
  );
}