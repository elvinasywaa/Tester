import { useFavorites } from '../hooks/useFavorite.js';
import FishCard from '../components/FishCard.jsx';
import { Heart, Loader } from 'lucide-react';

export default function FavoritesPage({ onFishClick }) {
  const { favorites, loading, refetch } = useFavorites();

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-red-50 pb-24">
      {/* Header */}
      <div className="bg-gradient-to-r from-pink-500 to-red-500 text-white py-8 px-4 shadow-lg mb-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center gap-3">
            <Heart className="w-8 h-8 fill-current" />
            <h1 className="text-3xl font-bold">Koleksi Favorit</h1>
          </div>
          <p className="mt-2 opacity-90">Ikan-ikan impian yang telah Anda simpan</p>
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-4">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <Loader className="w-10 h-10 text-pink-500 animate-spin mb-4" />
            <p className="text-gray-500">Memuat favorit...</p>
          </div>
        ) : favorites.length === 0 ? (
          <div className="text-center py-20 bg-white/50 backdrop-blur-sm rounded-3xl border border-pink-100">
            <div className="w-20 h-20 bg-pink-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Heart className="w-10 h-10 text-pink-400" />
            </div>
            <h3 className="text-xl font-bold text-gray-800 mb-2">Belum ada favorit</h3>
            <p className="text-gray-500 max-w-sm mx-auto">
              Jelajahi katalog dan tekan ikon hati untuk menyimpan ikan yang Anda sukai di sini.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {favorites.map((fish) => (
              <FishCard 
                key={fish.id} 
                fish={fish} 
                onClick={onFishClick} 
              />
            ))}
          </div>
        )}
      </main>
    </div>
  );
}