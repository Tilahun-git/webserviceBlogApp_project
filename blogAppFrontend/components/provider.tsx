'use client';

import { Provider } from 'react-redux';
import { store, persistor } from '@/redux/store';
import { ThemeProvider } from '@/components/ThemeProvider';
import { PersistGate } from 'redux-persist/integration/react';

export default function ClientProvider({ children }: { children: React.ReactNode }) {
  return (
    <PersistGate persistor={persistor}>
    <Provider store={store}>
      <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
        {children}
      </ThemeProvider>
    </Provider>
    </PersistGate>
  );
}
