'use client';

import { Provider } from 'react-redux';
import { store, persister} from '@/redux/store';
import { ThemeProvider } from '@/components/ThemeProvider';
import { PersistGate } from 'redux-persist/integration/react';

export default function ClientProvider({ children }: { children: React.ReactNode }) {
  return (
    <PersistGate persistor={persister}>
    <Provider store={store}>
      <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
        {children}
      </ThemeProvider>
    </Provider>
    </PersistGate>
  );
}
