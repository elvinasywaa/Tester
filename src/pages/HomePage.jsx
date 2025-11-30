import { useState } from 'react';
import { useFishes } from '../hooks/useFish';
import { useSearchHistory } from '../hooks/useSearchHistory'; // 1. Import Hook
import FishCard from '../components/FishCard';
import SearchBar from '../components/SearchBar';
import { Waves, Droplet, Sparkles, Loader, Search, ArrowRight } from 'lucide-react';

export default function HomePage({ onFishClick, onNavigate }) {
  const [searchQuery, setSearchQuery] = useState('');
  
  // 2. Ambil fungsi addToHistory
  const { addToHistory } = useSearchHistory(); 

  // ... (Kode useFishes untuk freshwaterFishes & saltwaterFishes tetap sama) ...
  const {
    fishes: freshwaterFishes,
    loading: loadingFreshwater,
  } = useFishes({
    water_type: 'air_tawar',
    limit: 4,
    sort_by: 'created_at',
    order: 'desc'
  });

  const {
    fishes: saltwaterFishes,
    loading: loadingSaltwater,
  } = useFishes({
    water_type: 'air_laut',
    limit: 4,
    sort_by: 'created_at',
    order: 'desc'
  });

  // ... (Kode useFishes untuk searchResults tetap sama) ...
  const {
    fishes: searchResults,
    loading: loadingSearch,
  } = useFishes({
    search: searchQuery,
    limit: 20,
    sort_by: 'name',
    order: 'asc'
  });

  const handleSearch = (query) => {
    setSearchQuery(query);
  };

  // 3. Buat Handler untuk Enter
  const handleSearchEnter = (query) => {
    if (query && query.trim() !== '') {
      addToHistory(query); // Simpan ke database
      console.log("Disimpan ke riwayat:", query); // Debugging
    }
  };

  return (
    <div className="min-h-screen pb-4">
      {/* ... Hero Section ... */}
      <div className="relative overflow-hidden">
        {/* ... Background elements ... */}
        
        <div className="relative bg-gradient-to-br from-aqua-main/20 via-aqua-soft/30 to-white/40 backdrop-blur-2xl border-b border-white/60 pt-20 pb-10 px-4 md:px-8">
          <div className="max-w-7xl mx-auto text-center">
            {/* ... Logo & Title ... */}
            <div className="inline-block mb-6">
              <div className="text-7xl animate-bounce drop-shadow-md">🐠</div>
            </div>
            <h1 className="text-5xl md:text-6xl font-bold mb-6 text-aqua-dark tracking-tight">
              Fishpedia
            </h1>
            <p className="text-lg md:text-xl text-aqua-dark/80 max-w-3xl mx-auto leading-relaxed mb-12 font-medium">
              Katalog lengkap ikan hias air tawar dan air laut. <br className="hidden md:block"/>
              Temukan ikan impianmu dan pelajari cara merawatnya!
            </p>

            {/* --- GLOBAL SEARCH BAR --- */}
            <div className="w-full max-w-5xl mx-auto transform transition-all duration-300 hover:scale-[1.01]">
              <div className="bg-white/60 p-2 rounded-3xl shadow-glass border border-white/60 backdrop-blur-xl">
                <SearchBar 
                  onSearch={handleSearch} 
                  onEnter={handleSearchEnter} // 4. Pasang Prop di sini
                  placeholder="Cari nama ikan (cth: Koi, Clown Fish)..." 
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ... Sisa konten HomePage (Section Featured dll) biarkan sama ... */}
      <div className="max-w-7xl mx-auto px-4 md:px-8 pt-12 pb-4 space-y-16">
        {searchQuery ? (
          <section className="animate-in fade-in slide-in-from-bottom-4 duration-500">
             {/* ... Tampilan Hasil Search ... */}
             <div className="flex items-center gap-4 mb-8 bg-white/40 p-4 rounded-2xl border border-white/50 w-fit">
              <div className="w-12 h-12 bg-aqua-main/20 rounded-xl flex items-center justify-center text-aqua-dark">
                <Search className="w-6 h-6" />
              </div>
              <div>
                <p className="text-sm text-aqua-dark/60 font-medium">Hasil Pencarian</p>
                <h2 className="text-2xl font-bold text-aqua-dark">
                  "{searchQuery}"
                </h2>
              </div>
            </div>

            {loadingSearch ? (
              <div className="flex flex-col items-center justify-center py-20">
                <Loader className="w-12 h-12 text-aqua-main animate-spin mb-4" />
                <p className="text-aqua-dark/60 font-medium">Sedang mencari ikan...</p>
              </div>
            ) : searchResults.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {searchResults.map((fish) => (
                  <FishCard key={fish.id} fish={fish} onClick={onFishClick} />
                ))}
              </div>
            ) : (
              <div className="text-center py-20 bg-white/40 backdrop-blur-xl rounded-3xl border border-white/60 border-dashed">
                <div className="text-6xl mb-4 grayscale opacity-50">🐡</div>
                <h3 className="text-xl font-bold text-aqua-dark mb-2">Ikan tidak ditemukan</h3>
                <p className="text-aqua-dark/70 max-w-md mx-auto">
                  Maaf, kami tidak dapat menemukan ikan dengan nama "{searchQuery}". 
                  Coba kata kunci lain atau periksa ejaan Anda.
                </p>
              </div>
            )}
          </section>
        ) : (
          /* ... Tampilan Default (Kategori & Featured) ... */
          <>
            {/* ... Paste sisa konten original HomePage di sini ... */}
            <div className="grid md:grid-cols-2 gap-8 animate-in fade-in duration-700">
               {/* ... Card Category ... */}
               <button onClick={() => onNavigate('freshwater')} className="group relative bg-white/40 backdrop-blur-xl rounded-3xl p-8 border border-white/60 overflow-hidden shadow-soft hover:shadow-glass transition-all duration-500 hover:scale-[1.01] text-left">
                  {/* ... isi card ... */}
                  <div className="relative z-10 flex items-start justify-between">
                    <div>
                        <div className="inline-flex items-center justify-center w-14 h-14 bg-emerald-100 text-emerald-600 rounded-2xl mb-4 shadow-sm group-hover:scale-110 transition-transform duration-300">
                        <Droplet className="w-7 h-7" />
                        </div>
                        <h2 className="text-2xl font-bold text-aqua-dark mb-2 group-hover:text-emerald-700 transition-colors">Ikan Air Tawar</h2>
                        <p className="text-aqua-dark/60 font-medium">Koleksi ikan sungai dan danau</p>
                    </div>
                    <ArrowRight className="w-5 h-5 text-emerald-600" />
                  </div>
               </button>
               <button onClick={() => onNavigate('saltwater')} className="group relative bg-white/40 backdrop-blur-xl rounded-3xl p-8 border border-white/60 overflow-hidden shadow-soft hover:shadow-glass transition-all duration-500 hover:scale-[1.01] text-left">
                  {/* ... isi card ... */}
                  <div className="relative z-10 flex items-start justify-between">
                    <div>
                        <div className="inline-flex items-center justify-center w-14 h-14 bg-cyan-100 text-cyan-600 rounded-2xl mb-4 shadow-sm group-hover:scale-110 transition-transform duration-300">
                        <Waves className="w-7 h-7" />
                        </div>
                        <h2 className="text-2xl font-bold text-aqua-dark mb-2 group-hover:text-cyan-700 transition-colors">Ikan Air Laut</h2>
                        <p className="text-aqua-dark/60 font-medium">Koleksi ikan terumbu karang eksotis</p>
                    </div>
                    <ArrowRight className="w-5 h-5 text-cyan-600" />
                  </div>
               </button>
            </div>

            {/* Featured Freshwater */}
            <section>
                <div className="flex items-center justify-between mb-8 px-2">
                    <h2 className="text-2xl md:text-3xl font-bold text-aqua-dark">Air Tawar Terbaru</h2>
                    <button onClick={() => onNavigate('freshwater')} className="text-emerald-600 font-bold text-sm">Lihat Semua</button>
                </div>
                {loadingFreshwater ? <Loader className="animate-spin" /> : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {freshwaterFishes.map(fish => <FishCard key={fish.id} fish={fish} onClick={onFishClick} />)}
                    </div>
                )}
            </section>

            {/* Featured Saltwater */}
            <section>
                <div className="flex items-center justify-between mb-8 px-2">
                    <h2 className="text-2xl md:text-3xl font-bold text-aqua-dark">Air Laut Terbaru</h2>
                    <button onClick={() => onNavigate('saltwater')} className="text-cyan-600 font-bold text-sm">Lihat Semua</button>
                </div>
                {loadingSaltwater ? <Loader className="animate-spin" /> : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {saltwaterFishes.map(fish => <FishCard key={fish.id} fish={fish} onClick={onFishClick} />)}
                    </div>
                )}
            </section>

            {/* Info Section */}
            <section className="relative bg-white/40 backdrop-blur-xl rounded-3xl p-8 md:p-10 border border-white/60 shadow-soft overflow-hidden group hover:border-aqua-main/30 transition-all">
                <div className="relative flex flex-col md:flex-row items-start gap-6">
                    <div className="w-16 h-16 bg-gradient-to-br from-aqua-main to-aqua-dark rounded-2xl flex items-center justify-center shadow-lg shadow-aqua-main/30 flex-shrink-0">
                        <Sparkles className="w-8 h-8 text-white" />
                    </div>
                    <div>
                        <h3 className="text-2xl font-bold text-aqua-dark mb-3">Tentang Fishpedia</h3>
                        <p className="text-aqua-dark/70 leading-relaxed text-lg font-medium">
                            Fishpedia adalah panduan lengkap untuk penggemar ikan hias.
                        </p>
                    </div>
                </div>
            </section>
          </>
        )}
      </div>
    </div>
  );
}