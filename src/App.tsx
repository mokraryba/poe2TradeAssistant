import { useEffect, useRef } from 'react';
import { useHotkeys } from './hooks/useHotkeys';

export default function App() {
  const { registerHotkeys } = useHotkeys();
  const isRegistered = useRef(false)

  useEffect(() => {
    if (!isRegistered.current) {
      registerHotkeys();
      isRegistered.current = true;
    }
  }, []);

  return (
    <div className="min-h-screen bg-gray-900 text-white p-4">
      <header className="mb-4">
        <h1 className="text-2xl font-bold">PoE Trade Helper</h1>
        <p className="text-gray-400">Press Ctrl+D to price check items</p>
      </header>
    </div>
  );
}
