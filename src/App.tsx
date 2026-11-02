import { useEffect } from 'react';
import { Footer, Header } from './components/Chrome';
import { WolofNotice } from './components/ui';
import { useHashRoute } from './lib/hooks';
import { Concept, Home, Story } from './pages/Pages';
import { FightDetail } from './sections/Glory';

export function App() {
  const route = useHashRoute();
  const fight = route.match(/^\/combats\/([\w-]+)/)?.[1];
  const page = route.startsWith('/histoire') ? 'story' : route.startsWith('/concept') ? 'concept' : 'home';

  useEffect(() => {
    document.documentElement.classList.add('js-ready');
  }, []);

  return (
    <>
      <Header />
      <WolofNotice />
      <main id="main" tabIndex={-1}>
        {page === 'story' ? <Story /> : page === 'concept' ? <Concept /> : <Home />}
      </main>
      <Footer />
      {fight && <FightDetail id={fight} />}
    </>
  );
}
