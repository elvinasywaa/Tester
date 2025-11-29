import { useState } from 'react';
import { useFishes } from '../hooks/useFish';
import FishCard from '../components/FishCard';
import SearchBar from '../components/SearchBar';
import FilterBar from '../components/FilterBar';
import { Loader, Droplet, Waves } from 'lucide-react';

export default function FishListPage({ waterType, onFishClick }) {
  const [searchQuery, setSearchQuery] = useState('');
  
  // State untuk menyimpan filter aktif
  const [filters, setFilters] = useState({
    difficulty_level: '',
    sort_by: 'created_at',
    order: 'desc',
    temperament: '', // Pastikan state awal ini ada
  });
  
  const [page, setPage] = useState(1);

  // Hook untuk mengambil data (Request ke Supabase)
  const { fishes, loading, error, pagination } = useFishes({
    water_type: waterType,
    search: searchQuery || undefined,
    
    // Filter parameter yang dikirim ke Service
    difficulty_level: filters.difficulty_level || undefined,
    temperament: filters.temperament || undefined, // ✅ PERBAIKAN DI SINI (Sebelumnya hilang)
    
    page,
    limit: 6, // Menampilkan 6 item per halaman sesuai request
    sort_by: filters.sort_by,
    order: filters.order
  });

  const handleSearchChange = (query) => {
    setSearchQuery(query);
    setPage(1); // Reset ke halaman 1 saat search berubah
  };

  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
    setPage(1); // Reset ke halaman 1 saat filter berubah
  };

  const isSeawater = waterType === 'air_laut';

  return (
    <div className="min-h-screen pb-24">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 overflow-hidden">
          <div className={`absolute top-10 right-10 w-72 h-72 rounded-full blur-3xl animate-pulse ${
            isSeawater ? 'bg-cyan-400/10' : 'bg-emerald-400/10'
          }`} />
          <div className={`absolute bottom-20 left-10 w-96 h-96 rounded-full blur-3xl animate-pulse ${
            isSeawater ? 'bg-blue-300/20' : 'bg-green-300/20'
          }`} />
        </div>

        <div className={`relative backdrop-blur-2xl border-b border-white/60 py-16 px-4 ${
          isSeawater 
            ? 'bg-gradient-to-br from-cyan-400/20 via-blue-300/30 to-white/40' 
            : 'bg-gradient-to-br from-emerald-400/20 via-green-300/30 to-white/40'
        }`}>
          <div className="max-w-7xl mx-auto">
            <div className="flex items-center gap-4 mb-4">
              <div className={`w-16 h-16 rounded-2xl flex items-center justify-center shadow-lg ${
                isSeawater 
                  ? 'bg-gradient-to-br from-cyan-400 to-blue-600 shadow-cyan-500/30' 
                  : 'bg-gradient-to-br from-emerald-400 to-emerald-600 shadow-emerald-500/30'
              }`}>
                {isSeawater ? (
                  <Waves className="w-8 h-8 text-white" />
                ) : (
                  <Droplet className="w-8 h-8 text-white" />
                )}
              </div>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-4 text-aqua-dark">
              {isSeawater ? 'Ikan Air Laut' : 'Ikan Air Tawar'}
            </h1>
            <p className="text-lg text-aqua-dark/70">
              Koleksi lengkap ikan hias {isSeawater ? 'air laut' : 'air tawar'}
            </p>
          </div>
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-4 py-12 space-y-8">
        {/* Search and Filter */}
        <div className="space-y-6">
          <SearchBar
            onSearch={handleSearchChange}
            placeholder={`Cari ikan ${isSeawater ? 'air laut' : 'air tawar'}...`}
          />
          <FilterBar onFilterChange={handleFilterChange} />
        </div>

        {/* Loading State */}
        {loading && (
          <div className="flex flex-col items-center justify-center py-20">
            <div className={`w-16 h-16 border-4 rounded-full animate-spin mb-6 ${
              isSeawater 
                ? 'border-cyan-400/30 border-t-cyan-500' 
                : 'border-emerald-400/30 border-t-emerald-500'
            }`} />
            <p className="text-aqua-dark/70 font-semibold">Memuat data ikan...</p>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="bg-white/50 backdrop-blur-xl border border-white/60 rounded-3xl p-8 shadow-soft text-center">
            <div className="w-16 h-16 bg-rose-100/80 backdrop-blur-md rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-3xl">😢</span>
            </div>
            <p className="text-rose-600 font-bold text-xl mb-2">Terjadi Kesalahan</p>
            <p className="text-rose-500">{error}</p>
          </div>
        )}
        
        {/* Fish Grid */}
        {!loading && !error && (
          <>
            {fishes.length === 0 ? (
              <div className="text-center py-20 bg-white/40 backdrop-blur-xl rounded-3xl border border-white/60 shadow-soft">
                <div className="text-7xl mb-6">🐠</div>
                <h3 className="text-2xl font-bold text-aqua-dark mb-3">
                  Tidak ada ikan ditemukan
                </h3>
                <p className="text-aqua-dark/70 text-lg">
                  Coba ubah filter atau kata kunci pencarian
                </p>
              </div>
            ) : (
              <>
                {/* Results Count */}
                <div className="bg-white/40 backdrop-blur-xl rounded-2xl px-6 py-4 border border-white/60 shadow-soft">
                  <p className="text-aqua-dark font-semibold">
                    Menampilkan <span className={isSeawater ? 'text-cyan-600' : 'text-emerald-600'}>{fishes.length}</span> ikan
                    {pagination && ` dari ${pagination.total} total`}
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {fishes.map((fish) => (
                    <FishCard key={fish.id} fish={fish} onClick={onFishClick} />
                  ))}
                </div>

                {/* Pagination */}
                {pagination && pagination.total_pages > 1 && (
                  <div className="flex flex-col md:flex-row items-center justify-center gap-6 mt-12">
                    <button
                      onClick={() => setPage(p => Math.max(1, p - 1))}
                      disabled={page === 1}
                      className={`px-8 py-4 rounded-2xl font-semibold transition-all shadow-soft ${
                        page === 1
                          ? 'bg-gray-100 text-gray-400 cursor-not-allowed border border-gray-200'
                          : 'bg-white/70 backdrop-blur-md border border-white/60 text-aqua-dark hover:bg-white hover:scale-105 hover:shadow-glass'
                      }`}
                    >
                      ← Sebelumnya
                    </button>
                    
                    <div className="bg-white/70 backdrop-blur-md px-8 py-4 rounded-2xl border border-white/60 shadow-soft">
                      <span className="text-aqua-dark font-bold text-lg">
                        Halaman <span className={isSeawater ? 'text-cyan-600' : 'text-emerald-600'}>{pagination.page}</span> dari {pagination.total_pages}
                      </span>
                    </div>
                    
                    <button
                      onClick={() => setPage(p => p + 1)}
                      disabled={page === pagination.total_pages}
                      className={`px-8 py-4 rounded-2xl font-semibold transition-all shadow-soft ${
                        page === pagination.total_pages
                          ? 'bg-gray-100 text-gray-400 cursor-not-allowed border border-gray-200'
                          : 'bg-white/70 backdrop-blur-md border border-white/60 text-aqua-dark hover:bg-white hover:scale-105 hover:shadow-glass'
                      }`}
                    >
                      Selanjutnya →
                    </button>
                  </div>
                )}
              </>
            )}
          </>
        )}
      </main>
    </div>
  );
}