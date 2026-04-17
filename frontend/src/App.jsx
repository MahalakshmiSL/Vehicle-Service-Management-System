import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar';
import { ToastProvider } from './components/UI';
import Landing from './pages/Landing';
import Components from './pages/Components';
import Vehicles from './pages/Vehicles';
import Issues from './pages/Issues';
import Payments from './pages/Payments';
import Dashboard from './pages/Dashboard';
import './index.css';

function AppInner() {
  const location = useLocation();
  const isLanding = location.pathname === '/';

  return (
    <>
      {!isLanding && <Navbar />}
      {isLanding ? (
        <>
          {/* Minimal top bar on landing */}
          <div style={{ position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100, background: 'rgba(10,10,10,0.85)', backdropFilter: 'blur(12px)', borderBottom: '1px solid rgba(255,255,255,0.06)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 40px', height: 64 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <svg width="32" height="32" viewBox="0 0 36 36" fill="none">
                <rect width="36" height="36" rx="8" fill="#cc2200"/>
                <path d="M9 26 L13 14 L18 21 L23 11 L27 26" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
                <circle cx="18" cy="18" r="3.5" fill="white" opacity="0.9"/>
              </svg>
              <div>
                <span style={{ display: 'block', fontFamily: 'var(--font-display)', fontSize: 30, fontWeight: 800, color: 'white', letterSpacing: 3 }}>GARAGE</span>
                <span style={{ display: 'block', fontSize: 15, color: 'white', letterSpacing: 2, textTransform: 'uppercase' }}>Service Management</span>
              </div>
            </div>
            <div style={{ display: 'flex', gap: 8 }}>
              {[{to:'/components',label:'Components'},{to:'/vehicles',label:'Vehicles'},{to:'/dashboard',label:'Dashboard'}].map(l => (
                <a key={l.to} href={l.to} style={{ color: 'rgba(255,255,255,0.5)', fontSize: 13, fontWeight: 500, padding: '6px 14px', borderRadius: 6, textDecoration: 'none', transition: 'all 0.2s' }}
                  onMouseEnter={e => e.target.style.color='white'}
                  onMouseLeave={e => e.target.style.color='rgba(255,255,255,0.5)'}
                >{l.label}</a>
              ))}
              <a href="/vehicles" style={{ background: '#cc2200', color: 'white', fontSize: 13, fontWeight: 700, padding: '7px 18px', borderRadius: 6, textDecoration: 'none' }}>Open App →</a>
            </div>
          </div>
          <Landing />
        </>
      ) : (
        <main style={{ maxWidth: 1200, margin: '0 auto', padding: '32px 24px', minHeight: 'calc(100vh - 68px)' }}>
          <Routes>
            <Route path="/components" element={<Components />} />
            <Route path="/vehicles" element={<Vehicles />} />
            <Route path="/issues" element={<Issues />} />
            <Route path="/payments" element={<Payments />} />
            <Route path="/dashboard" element={<Dashboard />} />
          </Routes>
        </main>
      )}
      <ToastProvider />
    </>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/*" element={<AppInner />} />
      </Routes>
    </BrowserRouter>
  );
}