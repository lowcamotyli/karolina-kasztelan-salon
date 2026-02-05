import React from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import ServiceIcons from './components/ServiceIcons';
import Team from './components/Team';
import Booking from './components/Booking';
import Portfolio from './components/Portfolio';
import Contact from './components/Contact';
import Footer from './components/Footer';

function App() {
  return (
    <div className="min-h-screen">
      <Navbar />
      <main>
        <Hero />
        <ServiceIcons />
        <Team />
        <Booking />
        <Portfolio />
        <Contact />
      </main>
      <Footer />
    </div>
  );
}

export default App;