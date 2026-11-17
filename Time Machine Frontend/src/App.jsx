import React from 'react';
import { AppRouter } from './router';
import { ToastProvider } from './components/ui/Toast';
import { WarpProvider } from './motion/warp';

/**
 * Theming, the backdrop and the page furniture all belong to PageShell, which
 * each route renders for itself — a route declares which world it is in, and
 * everything else follows. The only thing that has to live above the router is
 * the toast viewport and the warp overlay, both of which have to survive a
 * navigation — the warp because it is what hides the route change.
 */
export function App() {
  return (
    <ToastProvider>
      <WarpProvider>
        <AppRouter />
      </WarpProvider>
    </ToastProvider>
  );
}

export default App;
