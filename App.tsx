import React, { useState } from 'react';
import Header from './components/Header';
import Hero from './components/Hero';
import PlatformSection from './components/PlatformSection';
import PrivacySection from './components/PrivacySection';
import DatDecryptor from './components/DatDecryptor';
// import Antigravity from './components/Antigravity';
import { ChevronLeft } from 'lucide-react';

type ViewState = 'landing' | 'decryptor';

const App: React.FC = () => {
  const [view, setView] = useState<ViewState>('landing');

  return (
    <div className="h-screen w-full bg-bg flex flex-col font-sans selection:bg-black selection:text-white overflow-y-auto">
      {/* Antigravity Background */}
      {/* <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', zIndex: 0 }}>
        <Antigravity
          autoAnimate={false}
          color="#000000"
          count={800}
          particleSize={0.5}
          lerpSpeed={0.3}
          ringRadius={8}
          magnetRadius={20}
        />
      </div>

      {/* Content Layer */}
      <div style={{ position: 'relative', zIndex: 1, display: 'flex', flexDirection: 'column', height: '100%' }}>
        <Header onNavigate={() => setView('landing')} />

        <main className="flex-grow relative w-full h-full flex flex-col">
          {view === 'landing' ? (
            <div className="flex-1 flex flex-col h-full w-full max-w-[1600px] mx-auto px-6 lg:px-12 py-6">

              {/* Top: Hero Text - Pushes down */}
              {/* Top: Hero Text - Pushes down */}
              <div className="flex-none pt-0 mb-3">
                <Hero />
              </div>

              {/* Middle: Cards - Centered vertically in available space */}
              <div className="flex-1 flex items-start justify-center min-h-0 pt-4">
                <PlatformSection onSelect={(platform) => {
                  if (platform === 'DJI') {
                    window.open('https://aida-dat-decrypter.vercel.app/', '_blank');
                  } else if (platform === 'ARDU') {
                    window.open('https://aidroneforensicsbeta.cloudflareaccess.com/cdn-cgi/access/login/landing-forensics-test-network.aidrone.in?kid=decd6032de37e36b052e18ca8493429ddbe4c1486fb49ecea6a524f8df654eae&meta=eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiIsImtpZCI6IjlmODM4OTI2OGJmZmE0MmJlYWU0ODBhNGQzYjgwYzIyNGZiNDIwYTZmNDk3MTg0YjAxZmZjZDkyZjBkN2UyMjkifQ.eyJ0eXBlIjoibWV0YSIsImF1ZCI6ImRlY2Q2MDMyZGUzN2UzNmIwNTJlMThjYTg0OTM0MjlkZGJlNGMxNDg2ZmI0OWVjZWE2YTUyNGY4ZGY2NTRlYWUiLCJob3N0bmFtZSI6ImxhbmRpbmctZm9yZW5zaWNzLXRlc3QtbmV0d29yay5haWRyb25lLmluIiwicmVkaXJlY3RfdXJsIjoiLyIsInNlcnZpY2VfdG9rZW5fc3RhdHVzIjpmYWxzZSwiaXNfd2FycCI6ZmFsc2UsImlzX2dhdGV3YXkiOmZhbHNlLCJleHAiOjE3NjU2MjAwMzcsIm5iZiI6MTc2NTYxOTczNywiaWF0IjoxNzY1NjE5NzM3LCJhdXRoX3N0YXR1cyI6Ik5PTkUiLCJtdGxzX2F1dGgiOnsiY2VydF9pc3N1ZXJfZG4iOiIiLCJjZXJ0X3NlcmlhbCI6IiIsImNlcnRfaXNzdWVyX3NraSI6IiIsImNlcnRfcHJlc2VudGVkIjpmYWxzZSwiY29tbW9uX25hbWUiOiIiLCJhdXRoX3N0YXR1cyI6Ik5PTkUifSwicmVhbF9jb3VudHJ5IjoiSU4iLCJhcHBfc2Vzc2lvbl9oYXNoIjoiNmE1YjQyM2NhM2FjYTVhNTA1M2JkNjUzM2E2Yzk4MGFmM2EyOWY5N2E1MjA1ZTViYTZmYWVkNjVhMjQwNzNiNyJ9.dgjGeXfbwmFnypor1VtEFtzWPgN_WZNxxXEKgljd8MZCgq3cvPkn8D6HNCPRCu6X4JDcWIJ3H_E5v0s6NP0apEiPEZfvHoG5XuX_uH1-2-y_U0EgITugJEZyQN0EPmk_u2gsUTwFfT777Y8IppPXO6cQD3IhXKPstKSyrdapBF9tpP0j7ponLwhoVALM5NhQeOSDa4XdoOhVgI9SvA9el1RNzPRouNBVumi7sVcoO0hcE92unfPXByxETD1j_zT49aUSFPOADy5LTiQSOikd2MmI3ZQUv_p7JoADy57mZsmMPYJvNkBDcVXy5jywiqQXWUH6cmBJC_z3KiDR1mY7MQ&redirect_url=%2F', '_blank');
                  }
                }} />
              </div>


              {/* Bottom: Privacy & Footer - Pushes up */}
              <div className="flex-none mt-8 pb-4 md:pb-2">
                <PrivacySection />

                <div className="flex justify-between items-center text-[10px] md:text-xs text-subtle uppercase tracking-wider mt-6 pt-4 border-t border-border">
                  <span>&copy; {new Date().getFullYear()} AiDA Forensic</span>
                  <span className="opacity-60">v1.0.4 (Beta) &mdash; Local Environment</span>
                </div>
              </div>

            </div>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center p-6 animate-in fade-in zoom-in-95 duration-300">
              <div className="w-full max-w-4xl h-full max-h-[800px] flex flex-col">
                <div className="flex-none mb-6">
                  <button
                    onClick={() => setView('landing')}
                    className="group flex items-center text-sm font-medium text-muted hover:text-main transition-colors"
                  >
                    <ChevronLeft size={16} className="mr-1 group-hover:-translate-x-1 transition-transform" />
                    Return to Dashboard
                  </button>
                </div>

                <div className="flex-none text-center space-y-2 mb-8">
                  <h1 className="text-3xl font-semibold tracking-tight text-main">
                    AiDA DAT Decryptor
                  </h1>
                  <p className="text-muted text-base max-w-xl mx-auto">
                    Securely decrypt and analyze DJI flight logs locally.
                  </p>
                </div>

                <div className="flex-1 min-h-0 flex flex-col justify-center max-w-2xl mx-auto w-full">
                  <DatDecryptor />
                </div>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default App;