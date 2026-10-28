import React from 'react';
import { Navbar } from './components/common/Navbar';
import { Footer } from './components/common/Footer';
import { AppRouter } from './router';
import { CelestialCanvas3D } from './components/3d/CelestialCanvas3D';

export function App() {
  return (
    <>
      {/* 3D Celestial Starfield Canvas Background */}
      <CelestialCanvas3D />

      <Navbar />
      <main style={{ flex: 1, position: 'relative', zIndex: 1 }}>
        <AppRouter />
      </main>
      <Footer />
    </>
  );
}

export default App;
