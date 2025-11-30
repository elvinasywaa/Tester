import { Home, Droplet, Waves, Heart, User } from 'lucide-react';
import { useState, useEffect } from 'react';
import userService from '../services/userService';

export default function Sidebar({ currentPage, onNavigate }) {
  // State untuk menyimpan data profil user
  const [userProfile, setUserProfile] = useState({ username: 'Pengguna', avatar: null });

  // Efek untuk memperbarui data profil setiap kali halaman berubah
  useEffect(() => {
    const data = userService.getUserProfile();
    if (data) {
      setUserProfile(data);
    }
  }, [currentPage]);

  const navItems = [
    { id: 'home', label: 'Beranda', icon: Home },
    { id: 'freshwater', label: 'Air Tawar', icon: Droplet },
    { id: 'saltwater', label: 'Air Laut', icon: Waves },
    { id: 'favorites', label: 'Favorit', icon: Heart },
    { id: 'profile', label: 'Profil', icon: User }
  ];

  return (
    <aside className="hidden md:flex flex-col w-72 h-screen fixed left-0 top-0 bg-white/65 backdrop-blur-xl border-r border-white/50 z-50 pt-8 pb-6 px-6 shadow-[4px_0_24px_rgba(0,0,0,0.02)]">
      
      {/* --- LOGO AREA (OPSI 1: MEMENUHI BORDER) --- */}
      <div 
        className="flex items-center gap-3 mb-10 px-2 cursor-pointer group" 
        onClick={() => onNavigate('home')}
      >
        {/* Perubahan: 
           1. bg-[#6ECBD7] dihapus diganti bg-white (agar transparan/bersih).
           2. Gambar menggunakan w-full h-full object-cover (memenuhi kotak).
        */}
        <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-lg shadow-[#6ECBD7]/30 transition-transform group-hover:scale-110 duration-300 overflow-hidden">
          <img 
            src="/Fish-logo.png" 
            alt="Fishpedia Logo" 
            className="w-full h-full object-cover"
          />
        </div>
        <div>
          <h1 className="text-xl font-bold text-[#1A2C42] tracking-tight group-hover:text-[#6ECBD7] transition-colors">Fishpedia</h1>
          <p className="text-xs text-gray-500 font-medium">Katalog Ikan Hias</p>
        </div>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 space-y-2">
        <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-4 px-2">Menu Utama</p>
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentPage === item.id;
          
          return (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id)}
              className={`w-full flex items-center gap-4 px-4 py-3.5 rounded-2xl transition-all duration-300 group relative overflow-hidden ${
                isActive 
                  ? 'bg-[#6ECBD7] text-white shadow-lg shadow-[#6ECBD7]/25' 
                  : 'text-gray-500 hover:bg-white/60 hover:text-[#6ECBD7]'
              }`}
            >
              <Icon 
                size={22} 
                strokeWidth={isActive ? 2.5 : 2}
                className={`relative z-10 transition-transform duration-300 ${isActive ? 'scale-110' : 'group-hover:scale-110'}`} 
              />
              <span className="font-semibold relative z-10">{item.label}</span>
              
              {!isActive && (
                <div className="absolute inset-0 bg-white/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              )}
            </button>
          );
        })}
      </nav>

      {/* --- USER CARD --- */}
      <div className="mt-auto pt-6 border-t border-white/50">
        <div 
          onClick={() => onNavigate('profile')}
          className="flex items-center gap-3 p-3 bg-white/50 rounded-2xl border border-white/60 shadow-sm hover:shadow-md transition-shadow cursor-pointer"
        >
          <div className="w-10 h-10 rounded-full bg-[#E3F8F3] flex items-center justify-center text-[#6ECBD7] overflow-hidden">
            {userProfile.avatar ? (
              <img src={userProfile.avatar} alt="User" className="w-full h-full object-cover" />
            ) : (
              <User size={20} />
            )}
          </div>
          <div className="flex-1 overflow-hidden">
            <p className="text-sm font-bold text-[#1A2C42] truncate">
              {userProfile.username || 'Pengguna'}
            </p>
            <p className="text-xs text-gray-500 truncate">Pencinta Ikan</p>
          </div>
        </div>
      </div>
    </aside>
  );
}