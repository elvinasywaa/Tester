//Kode baru ya
import { useState } from 'react';
import { useFishes } from '../hooks/useFish';
import FishCard from '../components/FishCard';
import SearchBar from '../components/SearchBar';
import { Waves, Droplet, Sparkles, Loader, Search, ArrowRight } from 'lucide-react';

export default function HomePage({ onFishClick, onNavigate }) {
  // State untuk pencarian global
  const [searchQuery, setSearchQuery] = useState('');

  // 1. Data untuk Tampilan Default (Tanpa Search)
  // Mengambil 4 ikan air tawar terbaru
  const {
    fishes: freshwaterFishes,
    loading: loadingFreshwater,
  } = useFishes({
    water_type: 'air_tawar',
    limit: 4,
    sort_by: 'created_at',
    order: 'desc'
  });

  // Mengambil 4 ikan air laut terbaru
  const {
    fishes: saltwaterFishes,
    loading: loadingSaltwater,
  } = useFishes({
    water_type: 'air_laut',
    limit: 4,
    sort_by: 'created_at',
    order: 'desc'
  });

  // 2. Data untuk Hasil Pencarian Global (Tanpa filter air)
  // Hook ini akan otomatis refresh saat searchQuery berubah
  const {
    fishes: searchResults,
    loading: loadingSearch,
  } = useFishes({
    search: searchQuery, // Mengirim query pencarian
    limit: 20,           // Batasi hasil pencarian agar performa terjaga
    sort_by: 'name',
    order: 'asc'
  });

  // Handler saat user mengetik di search bar
  const handleSearch = (query) => {
    setSearchQuery(query);
  };

  return (
    <div className="min-h-screen pb-4">
      {/* --- HERO SECTION --- */}
      <div className="relative overflow-hidden">
        {/* Background Elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-10 right-10 w-72 h-72 bg-aqua-main/10 rounded-full blur-3xl animate-pulse" />
          <div className="absolute bottom-20 left-10 w-96 h-96 bg-aqua-soft/20 rounded-full blur-3xl animate-pulse delay-1000" />
        </div>

        {/* Hero Content */}
        <div className="relative bg-gradient-to-br from-aqua-main/20 via-aqua-soft/30 to-white/40 backdrop-blur-2xl border-b border-white/60 pt-20 pb-10 px-4 md:px-8">
          {/* Mengubah max-w-5xl menjadi max-w-7xl agar konten bisa lebih lebar */}
          <div className="max-w-7xl mx-auto text-center">
            {/* Logo Icon */}
            <div className="inline-block mb-6">
              <div className="text-7xl animate-bounce drop-shadow-md">🐠</div>
            </div>
            
            {/* Title */}
            <h1 className="text-5xl md:text-6xl font-bold mb-6 text-aqua-dark tracking-tight">
              Fishpedia
            </h1>
            
            {/* Description */}
            <p className="text-lg md:text-xl text-aqua-dark/80 max-w-3xl mx-auto leading-relaxed mb-12 font-medium">
              Katalog lengkap ikan hias air tawar dan air laut. <br className="hidden md:block"/>
              Temukan ikan impianmu dan pelajari cara merawatnya!
            </p>

            {/* --- GLOBAL SEARCH BAR (LEBIH LEBAR) --- */}
            {/* Mengubah max-w-3xl menjadi max-w-5xl untuk lebar yang lebih maksimal */}
            <div className="w-full max-w-5xl mx-auto transform transition-all duration-300 hover:scale-[1.01]">
              <div className="bg-white/60 p-2 rounded-3xl shadow-glass border border-white/60 backdrop-blur-xl">
                <SearchBar 
                  onSearch={handleSearch} 
                  placeholder="Cari nama ikan (cth: Koi, Clown Fish)..." 
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* --- MAIN CONTENT AREA --- */}
      <div className="max-w-7xl mx-auto px-4 md:px-8 pt-12 pb-4 space-y-16">
        
        {/* KONDISI: JIKA ADA PENCARIAN */}
        {searchQuery ? (
          <section className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            {/* Search Header */}
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

            {/* Search Content */}
            {loadingSearch ? (
              <div className="flex flex-col items-center justify-center py-20">
                <Loader className="w-12 h-12 text-aqua-main animate-spin mb-4" />
                <p className="text-aqua-dark/60 font-medium">Sedang mencari ikan...</p>
              </div>
            ) : searchResults.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {searchResults.map((fish) => (
                  <FishCard 
                    key={fish.id} 
                    fish={fish} 
                    onClick={onFishClick} 
                  />
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
          /* KONDISI: TAMPILAN DEFAULT (DASHBOARD) */
          <>
            {/* 1. Category Navigation Cards */}
            <div className="grid md:grid-cols-2 gap-8 animate-in fade-in duration-700">
              {/* Freshwater */}
              <button
                onClick={() => onNavigate('freshwater')}
                className="group relative bg-white/40 backdrop-blur-xl rounded-3xl p-8 border border-white/60 overflow-hidden shadow-soft hover:shadow-glass transition-all duration-500 hover:scale-[1.01] text-left"
              >
                <div className="absolute top-0 right-0 w-48 h-48 bg-emerald-300/10 rounded-full -mr-16 -mt-16 group-hover:scale-125 transition-transform duration-700" />
                <div className="relative z-10 flex items-start justify-between">
                  <div>
                    <div className="inline-flex items-center justify-center w-14 h-14 bg-emerald-100 text-emerald-600 rounded-2xl mb-4 shadow-sm group-hover:scale-110 transition-transform duration-300">
                      <Droplet className="w-7 h-7" />
                    </div>
                    <h2 className="text-2xl font-bold text-aqua-dark mb-2 group-hover:text-emerald-700 transition-colors">
                      Ikan Air Tawar
                    </h2>
                    <p className="text-aqua-dark/60 font-medium">
                      Koleksi ikan sungai dan danau
                    </p>
                  </div>
                  <div className="w-10 h-10 rounded-full bg-white/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transform translate-x-4 group-hover:translate-x-0 transition-all duration-300">
                    <ArrowRight className="w-5 h-5 text-emerald-600" />
                  </div>
                </div>
              </button>

              {/* Saltwater */}
              <button
                onClick={() => onNavigate('saltwater')}
                className="group relative bg-white/40 backdrop-blur-xl rounded-3xl p-8 border border-white/60 overflow-hidden shadow-soft hover:shadow-glass transition-all duration-500 hover:scale-[1.01] text-left"
              >
                <div className="absolute top-0 right-0 w-48 h-48 bg-cyan-300/10 rounded-full -mr-16 -mt-16 group-hover:scale-125 transition-transform duration-700" />
                <div className="relative z-10 flex items-start justify-between">
                  <div>
                    <div className="inline-flex items-center justify-center w-14 h-14 bg-cyan-100 text-cyan-600 rounded-2xl mb-4 shadow-sm group-hover:scale-110 transition-transform duration-300">
                      <Waves className="w-7 h-7" />
                    </div>
                    <h2 className="text-2xl font-bold text-aqua-dark mb-2 group-hover:text-cyan-700 transition-colors">
                      Ikan Air Laut
                    </h2>
                    <p className="text-aqua-dark/60 font-medium">
                      Koleksi ikan terumbu karang eksotis
                    </p>
                  </div>
                  <div className="w-10 h-10 rounded-full bg-white/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transform translate-x-4 group-hover:translate-x-0 transition-all duration-300">
                    <ArrowRight className="w-5 h-5 text-cyan-600" />
                  </div>
                </div>
              </button>
            </div>

            {/* 2. Featured Freshwater Section */}
            <section>
              <div className="flex items-center justify-between mb-8 px-2">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-emerald-100 rounded-xl flex items-center justify-center text-emerald-600">
                    <Droplet className="w-5 h-5" />
                  </div>
                  <h2 className="text-2xl md:text-3xl font-bold text-aqua-dark">
                    Air Tawar Terbaru
                  </h2>
                </div>
                <button
                  onClick={() => onNavigate('freshwater')}
                  className="group flex items-center gap-2 text-emerald-600 font-bold text-sm hover:bg-emerald-50 px-4 py-2 rounded-xl transition-all"
                >
                  Lihat Semua
                  <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                </button>
              </div>

              {loadingFreshwater ? (
                <div className="flex items-center justify-center py-16 bg-white/30 rounded-3xl">
                  <Loader className="w-8 h-8 text-aqua-main animate-spin" />
                </div>
              ) : freshwaterFishes.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  {freshwaterFishes.map((fish) => (
                    <FishCard key={fish.id} fish={fish} onClick={onFishClick} />
                  ))}
                </div>
              ) : (
                <div className="text-center py-16 bg-white/30 backdrop-blur-xl rounded-3xl border border-white/60">
                  <p className="text-aqua-dark/50 font-medium">Belum ada data ikan air tawar</p>
                </div>
              )}
            </section>

            {/* 3. Featured Saltwater Section */}
            <section>
              <div className="flex items-center justify-between mb-8 px-2">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-cyan-100 rounded-xl flex items-center justify-center text-cyan-600">
                    <Waves className="w-5 h-5" />
                  </div>
                  <h2 className="text-2xl md:text-3xl font-bold text-aqua-dark">
                    Air Laut Terbaru
                  </h2>
                </div>
                <button
                  onClick={() => onNavigate('saltwater')}
                  className="group flex items-center gap-2 text-cyan-600 font-bold text-sm hover:bg-cyan-50 px-4 py-2 rounded-xl transition-all"
                >
                  Lihat Semua
                  <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                </button>
              </div>

              {loadingSaltwater ? (
                <div className="flex items-center justify-center py-16 bg-white/30 rounded-3xl">
                  <Loader className="w-8 h-8 text-aqua-main animate-spin" />
                </div>
              ) : saltwaterFishes.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  {saltwaterFishes.map((fish) => (
                    <FishCard key={fish.id} fish={fish} onClick={onFishClick} />
                  ))}
                </div>
              ) : (
                <div className="text-center py-16 bg-white/30 backdrop-blur-xl rounded-3xl border border-white/60">
                  <p className="text-aqua-dark/50 font-medium">Belum ada data ikan air laut</p>
                </div>
              )}
            </section>

            {/* 4. Info Section */}
            <section className="relative bg-white/40 backdrop-blur-xl rounded-3xl p-8 md:p-10 border border-white/60 shadow-soft overflow-hidden group hover:border-aqua-main/30 transition-all">
              <div className="absolute top-0 right-0 w-64 h-64 bg-aqua-main/10 rounded-full -mr-32 -mt-32 blur-3xl group-hover:bg-aqua-main/20 transition-colors" />
              <div className="relative flex flex-col md:flex-row items-start gap-6">
                <div className="w-16 h-16 bg-gradient-to-br from-aqua-main to-aqua-dark rounded-2xl flex items-center justify-center shadow-lg shadow-aqua-main/30 flex-shrink-0">
                  <Sparkles className="w-8 h-8 text-white" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-aqua-dark mb-3">
                    Tentang Fishpedia
                  </h3>
                  <p className="text-aqua-dark/70 leading-relaxed text-lg font-medium">
                    Fishpedia adalah panduan lengkap untuk penggemar ikan hias. Temukan berbagai jenis ikan air tawar dan air laut, lengkap dengan informasi karakteristik, cara perawatan, tingkat kesulitan, dan kisaran harga pasar untuk membantu perjalanan hobi akuarium Anda.
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
