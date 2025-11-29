// Ini kode baru ya
import { useState } from 'react';
import HomePage from './pages/HomePage.jsx';
import FishListPage from './pages/FishListPage.jsx';
import ProfilePage from './pages/ProfilePage.jsx';
import DetailFishPage from './pages/DetailFishPage.jsx';
import FavoritesPage from './pages/FavoritesPage.jsx';
import BottomNav from './components/BottomNav.jsx';
import Sidebar from './components/Sidebar.jsx';

export default function App() {
  const [currentPage, setCurrentPage] = useState('home');
  const [selectedFishId, setSelectedFishId] = useState(null);

  const handleNavigation = (page) => {
    setCurrentPage(page);
    setSelectedFishId(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleFishClick = (fishId) => {
    setSelectedFishId(fishId);
    setCurrentPage('detail');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleBack = () => {
    setSelectedFishId(null);
    setCurrentPage('home');
  };

  const renderPage = () => {
    if (currentPage === 'detail' && selectedFishId) {
      return <DetailFishPage fishId={selectedFishId} onBack={handleBack} />;
    }

    switch (currentPage) {
      case 'home':
        return <HomePage onFishClick={handleFishClick} onNavigate={handleNavigation} />;
      case 'freshwater':
        return <FishListPage waterType="air_tawar" onFishClick={handleFishClick} />;
      case 'saltwater':
        return <FishListPage waterType="air_laut" onFishClick={handleFishClick} />;
      case 'favorites':
        return <FavoritesPage onFishClick={handleFishClick} />;
      case 'profile':
        return <ProfilePage onFishClick={handleFishClick} />;
      default:
        return <HomePage onFishClick={handleFishClick} onNavigate={handleNavigation} />;
    }
  };

  // Cek apakah sedang di halaman detail untuk menyembunyikan navigasi
  const isDetailPage = currentPage === 'detail';

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#E3F8F3] via-[#F7FDFF] to-[#F0F9FF] text-[#1A2C42] font-sans selection:bg-[#6ECBD7] selection:text-white">
      
      {/* Sidebar - Hanya tampil di Desktop (md ke atas) dan bukan halaman detail */}
      {!isDetailPage && (
        <Sidebar currentPage={currentPage} onNavigate={handleNavigation} />
      )}

      {/* Main Content Area */}
      {/* md:pl-72 memberikan ruang padding kiri khusus desktop agar tidak tertutup sidebar */}
      <main className={`min-h-screen transition-all duration-300 ease-in-out ${!isDetailPage ? 'md:pl-72 pb-24 md:pb-8' : ''}`}>
        <div className="max-w-7xl mx-auto">
          {renderPage()}
        </div>
      </main>

      {/* Bottom Nav - Hanya tampil di Mobile (hidden di md) dan bukan halaman detail */}
      {!isDetailPage && (
        <BottomNav currentPage={currentPage} onNavigate={handleNavigation} />
      )}
    </div>
  );
}