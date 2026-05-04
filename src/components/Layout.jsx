import { Link, useLocation } from 'react-router-dom';

export default function Layout({ children, title }) {
  const location = useLocation();

  const navItems = [
    { name: 'Tableau de bord', path: '/', icon: 'dashboard' },
    { name: 'Prospection', path: '/recherche', icon: 'search' },
    { name: 'Prospects', path: '/leads', icon: 'group' },
  ];

  return (
    <>
      {/* SideNavBar Shell (Desktop) */}
      <aside className="hidden md:flex fixed left-0 top-0 h-screen w-64 border-r border-zinc-100 bg-white flex-col p-4 gap-2 z-50">
        <div className="mb-8 px-2">
          <h1 className="text-xl font-black text-zinc-900 tracking-tighter">Command Center</h1>
          <p className="text-zinc-500 font-label-sm uppercase tracking-widest text-[10px]">Suite Agence v1.0</p>
        </div>
        <nav className="flex-1 flex flex-col gap-1">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path || (item.path !== '/' && location.pathname.startsWith(item.path));
            return (
              <Link
                key={item.name}
                to={item.path}
                className={`flex items-center gap-3 px-3 py-2 transition-all duration-200 rounded-md font-label-md ${
                  isActive
                    ? 'bg-[#FFD700] text-black shadow-sm font-bold'
                    : 'text-zinc-500 hover:bg-zinc-50'
                }`}
              >
                <span className="material-symbols-outlined" style={{ fontVariationSettings: isActive ? "'FILL' 1" : "'FILL' 0" }}>
                  {item.icon}
                </span>
                {item.name}
              </Link>
            );
          })}
        </nav>
        <div className="mt-auto flex flex-col gap-1 pt-4 border-t border-zinc-100">
          <a className="flex items-center gap-3 px-3 py-2 text-zinc-500 hover:bg-zinc-50 transition-all duration-200 rounded-md font-label-md" href="#">
            <span className="material-symbols-outlined">settings</span>
            Paramètres
          </a>
          <a className="flex items-center gap-3 px-3 py-2 text-zinc-500 hover:bg-zinc-50 transition-all duration-200 rounded-md font-label-md" href="#">
            <span className="material-symbols-outlined">contact_support</span>
            Support
          </a>
        </div>
      </aside>

      {/* Mobile Bottom Navigation */}
      <nav className="md:hidden fixed bottom-0 left-0 w-full bg-white border-t border-zinc-100 z-50 flex justify-around p-2 pb-[env(safe-area-inset-bottom)] shadow-[0_-4px_20px_rgba(0,0,0,0.03)]">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path || (item.path !== '/' && location.pathname.startsWith(item.path));
          return (
            <Link
              key={item.name}
              to={item.path}
              className={`flex flex-col items-center justify-center p-2 rounded-lg transition-colors ${
                isActive ? 'text-[#D4AF37]' : 'text-zinc-400 hover:text-zinc-600'
              }`}
            >
              <span className="material-symbols-outlined text-2xl" style={{ fontVariationSettings: isActive ? "'FILL' 1" : "'FILL' 0" }}>
                {item.icon}
              </span>
              <span className="text-[10px] mt-1 font-bold">{item.name}</span>
            </Link>
          );
        })}
      </nav>

      {/* Main Content Canvas */}
      <main className="md:ml-64 min-h-screen pb-20 md:pb-0">
        {/* TopAppBar Shell */}
        <header className="sticky top-0 z-40 h-16 px-4 md:px-6 bg-white/80 backdrop-blur-md border-b border-zinc-100 flex items-center justify-between shadow-[0_4px_20px_rgba(0,0,0,0.03)]">
          <div className="flex items-center gap-2 md:gap-4">
            <span className="text-lg font-black tracking-tighter text-zinc-900 hidden sm:inline">PROSPECT_FLOW</span>
            <span className="text-lg font-black tracking-tighter text-zinc-900 sm:hidden">PF</span>
            <div className="h-4 w-[1px] bg-zinc-200"></div>
            <h2 className="font-headline-sm md:font-headline-md text-zinc-900 truncate max-w-[150px] sm:max-w-none">{title}</h2>
          </div>
          <div className="flex items-center gap-4 md:gap-6">
            <div className="hidden lg:flex items-center gap-2">
              <div className="relative">
                <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400 text-[18px]">search</span>
                <input 
                  type="text" 
                  placeholder="Recherche globale (ex: 'leads', 'dashboard')..." 
                  className="pl-10 pr-4 py-1.5 bg-zinc-50 border border-zinc-200 rounded-full text-sm w-80 focus:outline-none focus:ring-2 focus:ring-[#FFD700] transition-all"
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      const q = e.target.value.toLowerCase();
                      if (q.includes('dash') || q.includes('accueil')) {
                        window.location.href = '/';
                      } else if (q.includes('prospect') || q.includes('recherche')) {
                        window.location.href = '/recherche';
                      } else {
                        window.location.href = '/leads';
                      }
                    }
                  }}
                />
              </div>
            </div>
            <div className="flex items-center gap-3 ml-0 lg:ml-4">
              <span className="material-symbols-outlined text-zinc-400 cursor-pointer hover:text-zinc-900 hidden sm:block">notifications</span>
              <span className="material-symbols-outlined text-zinc-400 cursor-pointer hover:text-zinc-900 hidden sm:block">help_outline</span>
              <div className="w-8 h-8 rounded-full bg-zinc-200 overflow-hidden border border-zinc-100">
                <img alt="Administrateur Agence" className="w-full h-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuC5RqPJry61Lzset8gTn4t7usMwQ6gQ34vDkEc0gdxJFB-2IaVr-fJgJSd8MwV31lbbVQvAPKeyKnKgahsGGsDdEcsZ6NBwvCYWHcxfSWxs7kbeDpyU06wR_xfXx2k1OtPJydOSN5LJonVeJWDiGDV9PvCdx9LTicyIexfndFRRbtIhCHLw1UKqYBaDm1FAPDhXptZQm2E2znt71900weHDlvKEuUxdpc24w3IOsEbkZwKL1yM6W0KBK5JauOF-IpWuqLbg2z15WfPf" />
              </div>
            </div>
          </div>
        </header>

        <section className="p-4 md:p-8 max-w-7xl mx-auto">
          {children}
        </section>
      </main>
    </>
  );
}
