import { Home, Droplet, Waves, Heart, User } from 'lucide-react';

export default function BottomNav({ currentPage, onNavigate }) {
  const navItems = [
    { id: 'home', label: 'Beranda', icon: Home },
    { id: 'freshwater', label: 'Tawar', icon: Droplet },
    { id: 'saltwater', label: 'Laut', icon: Waves },
    { id: 'favorites', label: 'Favorit', icon: Heart },
    { id: 'profile', label: 'Profil', icon: User }
  ];

  return (
    // PERBAIKAN: z-[100] ditambahkan agar navigasi selalu di atas PWA Badge/Toast
    <nav className="md:hidden fixed bottom-6 left-4 right-4 h-20 bg-white/75 backdrop-blur-xl border border-white/50 rounded-3xl z-[100] shadow-[0_8px_32px_0_rgba(31,38,135,0.15)] flex justify-between items-center px-4 transition-all">
      {navItems.map((item) => {
        const Icon = item.icon;
        const isActive = currentPage === item.id;

        return (
          <button
            key={item.id}
            onClick={() => onNavigate(item.id)}
            className={`relative flex flex-col items-center justify-center w-12 h-12 transition-all duration-500 ease-out group ${
              isActive ? '-translate-y-3' : ''
            }`}
          >
            {/* Background Indikator Aktif */}
            <div className={`absolute inset-0 rounded-2xl transition-all duration-500 ${
              isActive 
                ? 'bg-[#6ECBD7] shadow-[0_8px_16px_rgba(110,203,215,0.4)] rotate-12 scale-110' 
                : 'bg-transparent rotate-0 scale-0'
            }`} />
            
            {/* Ikon */}
            <Icon
              size={24}
              strokeWidth={2.5}
              className={`relative z-10 transition-colors duration-500 ${
                isActive ? 'text-white' : 'text-gray-400 group-hover:text-[#6ECBD7]'
              }`}
            />
            
            {/* Label (Pill) */}
            <span className={`absolute -bottom-8 text-[10px] font-bold text-[#1A2C42] bg-white/90 px-2 py-0.5 rounded-full shadow-sm whitespace-nowrap transition-all duration-500 ${
               isActive ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 -translate-y-2 scale-50 pointer-events-none'
            }`}>
              {item.label}
            </span>
          </button>
        );
      })}
    </nav>
  );
}