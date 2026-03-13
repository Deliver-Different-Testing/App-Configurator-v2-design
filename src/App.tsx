import { useState, useCallback } from 'react';
import Sidebar from './components/Sidebar';
import AppSetupPage from './components/AppSetupPage';
import { AutomationsPage } from './modules/automations';
import Toast from './components/Toast';

export type ToastFn = (msg: string) => void;

export type ActivePage = 'app-setup' | 'automations';

export default function App() {
  const [toastMsg, setToastMsg] = useState('');
  const [toastVisible, setToastVisible] = useState(false);
  const [activePage, setActivePage] = useState<ActivePage>('app-setup');

  const showToast: ToastFn = useCallback((msg: string) => {
    setToastMsg(msg);
    setToastVisible(true);
    setTimeout(() => setToastVisible(false), 2500);
  }, []);

  return (
    <>
      <Sidebar activePage={activePage} onNavigate={setActivePage} />
      {activePage === 'app-setup' && <AppSetupPage showToast={showToast} />}
      {activePage === 'automations' && (
        <div className="main" style={{ overflow: 'auto' }}>
          <AutomationsPage />
        </div>
      )}
      <Toast message={toastMsg} visible={toastVisible} />
    </>
  );
}
