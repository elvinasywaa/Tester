import { SlidersHorizontal, X, RotateCcw, Sword, Leaf } from 'lucide-react';
import { useState } from 'react';

export default function FilterBar({ onFilterChange }) {
  const [isOpen, setIsOpen] = useState(false);
  const [filters, setFilters] = useState({
    difficulty_level: '',
    temperament: '',
    sort_by: 'created_at',
    order: 'desc',
  });

  const handleFilterChange = (key, value) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    if (onFilterChange) {
      onFilterChange(newFilters);
    }
  };

  const handleReset = () => {
    const resetFilters = {
      difficulty_level: '',
      temperament: '',
      sort_by: 'created_at',
      order: 'desc',
    };
    setFilters(resetFilters);
    if (onFilterChange) {
      onFilterChange(resetFilters);
    }
  };

  const activeFilterCount = Object.values(filters).filter(
    v => v && v !== 'created_at' && v !== 'desc'
  ).length;

  return (
    <div className="space-y-4">
      {/* Filter Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-3 px-6 py-3 bg-white/50 backdrop-blur-xl border border-white/60 rounded-2xl hover:bg-white/70 hover:border-aqua-main/50 transition-all shadow-soft hover:shadow-glass"
      >
        <SlidersHorizontal className="w-5 h-5 text-aqua-main" />
        <span className="font-semibold text-aqua-dark">Filter & Urutkan</span>
        {activeFilterCount > 0 && (
          <span className="px-2.5 py-1 bg-gradient-to-r from-aqua-main to-cyan-500 text-white text-xs font-bold rounded-full shadow-lg shadow-aqua-main/30">
            {activeFilterCount}
          </span>
        )}
      </button>

      {/* Filter Panel */}
      {isOpen && (
        <div className="bg-white/50 backdrop-blur-xl border border-white/60 rounded-3xl p-6 shadow-glass space-y-6 animate-in fade-in slide-in-from-top-4 duration-300">
          {/* Header */}
          <div className="flex items-center justify-between pb-4 border-b border-white/40">
            <h3 className="text-xl font-bold text-aqua-dark flex items-center gap-2">
              <SlidersHorizontal className="w-5 h-5 text-aqua-main" />
              Filter & Urutkan
            </h3>
            <button
              onClick={handleReset}
              className="text-sm text-aqua-main hover:text-rose-500 font-semibold flex items-center gap-2 px-3 py-1.5 rounded-xl hover:bg-rose-50/50 transition-all"
            >
              <RotateCcw className="w-4 h-4" />
              Reset
            </button>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {/* Difficulty Level Filter */}
            <div>
              <label className="block text-sm font-semibold text-aqua-dark mb-3">
                Tingkat Perawatan
              </label>
              <select
                value={filters.difficulty_level}
                onChange={(e) => handleFilterChange('difficulty_level', e.target.value)}
                className="w-full px-4 py-3 bg-white/70 backdrop-blur-md border border-white/60 rounded-xl focus:ring-2 focus:ring-aqua-main/50 focus:border-aqua-main text-aqua-dark transition-all hover:border-aqua-main/50"
              >
                <option value="">Semua Tingkat</option>
                <option value="1">⭐ Sangat Mudah</option>
                <option value="2">⭐⭐ Mudah</option>
                <option value="3">⭐⭐⭐ Sedang</option>
                <option value="4">⭐⭐⭐⭐ Sulit</option>
                <option value="5">⭐⭐⭐⭐⭐ Sangat Sulit</option>
              </select>
            </div>

            {/* Temperament Filter (NEW) */}
            <div>
              <label className="block text-sm font-semibold text-aqua-dark mb-3">
                Sifat Ikan (Temperamen)
              </label>
              <div className="grid grid-cols-3 gap-2">
                <button
                  onClick={() => handleFilterChange('temperament', '')}
                  className={`px-3 py-3 rounded-xl text-sm font-semibold transition-all border ${
                    filters.temperament === ''
                      ? 'bg-aqua-main text-white border-aqua-main shadow-lg shadow-aqua-main/20'
                      : 'bg-white/70 text-gray-500 border-white/60 hover:bg-white'
                  }`}
                >
                  Semua
                </button>
                <button
                  onClick={() => handleFilterChange('temperament', 'damai')}
                  className={`px-3 py-3 rounded-xl text-sm font-semibold transition-all border flex items-center justify-center gap-1 ${
                    filters.temperament === 'damai'
                      ? 'bg-emerald-500 text-white border-emerald-500 shadow-lg shadow-emerald-500/20'
                      : 'bg-white/70 text-gray-500 border-white/60 hover:bg-white'
                  }`}
                >
                  <Leaf size={14} /> Damai
                </button>
                <button
                  onClick={() => handleFilterChange('temperament', 'predator')}
                  className={`px-3 py-3 rounded-xl text-sm font-semibold transition-all border flex items-center justify-center gap-1 ${
                    filters.temperament === 'predator'
                      ? 'bg-rose-500 text-white border-rose-500 shadow-lg shadow-rose-500/20'
                      : 'bg-white/70 text-gray-500 border-white/60 hover:bg-white'
                  }`}
                >
                  <Sword size={14} /> Predator
                </button>
              </div>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-6 pt-4 border-t border-white/40">
            {/* Sort By Filter */}
            <div>
              <label className="block text-sm font-semibold text-aqua-dark mb-3">
                Urutkan Berdasarkan
              </label>
              <select
                value={filters.sort_by}
                onChange={(e) => handleFilterChange('sort_by', e.target.value)}
                className="w-full px-4 py-3 bg-white/70 backdrop-blur-md border border-white/60 rounded-xl focus:ring-2 focus:ring-aqua-main/50 focus:border-aqua-main text-aqua-dark transition-all hover:border-aqua-main/50"
              >
                <option value="created_at">Terbaru</option>
                <option value="name">Nama (A-Z)</option>
                <option value="difficulty_level">Tingkat Perawatan</option>
                <option value="price_min">Harga</option>
              </select>
            </div>

            {/* Order Filter */}
            <div>
              <label className="block text-sm font-semibold text-aqua-dark mb-3">
                Urutan
              </label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={() => handleFilterChange('order', 'desc')}
                  className={`px-4 py-3 rounded-xl font-semibold transition-all ${
                    filters.order === 'desc'
                      ? 'bg-gradient-to-r from-aqua-main to-cyan-500 text-white shadow-lg shadow-aqua-main/30'
                      : 'bg-white/70 text-aqua-dark border border-white/60 hover:border-aqua-main/50'
                  }`}
                >
                  Menurun
                </button>
                <button
                  onClick={() => handleFilterChange('order', 'asc')}
                  className={`px-4 py-3 rounded-xl font-semibold transition-all ${
                    filters.order === 'asc'
                      ? 'bg-gradient-to-r from-aqua-main to-cyan-500 text-white shadow-lg shadow-aqua-main/30'
                      : 'bg-white/70 text-aqua-dark border border-white/60 hover:border-aqua-main/50'
                  }`}
                >
                  Menaik
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
