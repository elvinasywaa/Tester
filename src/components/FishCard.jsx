//Kode baru ya
import { Heart, Sword, Leaf, AlertTriangle } from 'lucide-react';
import { useIsFavorited } from "../hooks/useFavorite.js";

export default function FishCard({ fish, onClick }) {
  const { isFavorited, toggleFavorite } = useIsFavorited(fish.id);

  const handleFavoriteClick = async (e) => {
    e.stopPropagation();
    await toggleFavorite();
  };

  const formatPrice = (min, max) => {
    if (!min && !max) return 'Hubungi penjual';
    if (min && max) {
      return `Rp ${parseInt(min).toLocaleString('id-ID')} - ${parseInt(max).toLocaleString('id-ID')}`;
    }
    return `Mulai Rp ${parseInt(min || max).toLocaleString('id-ID')}`;
  };

  const getDifficultyBadge = (level) => {
    const levels = {
      1: { text: 'Mudah', color: 'bg-emerald-100/80 text-emerald-700 backdrop-blur-sm' },
      2: { text: 'Mudah', color: 'bg-emerald-100/80 text-emerald-700 backdrop-blur-sm' },
      3: { text: 'Sedang', color: 'bg-amber-100/80 text-amber-700 backdrop-blur-sm' },
      4: { text: 'Sulit', color: 'bg-orange-100/80 text-orange-700 backdrop-blur-sm' },
      5: { text: 'Ahli', color: 'bg-rose-100/80 text-rose-700 backdrop-blur-sm' },
    };
    const diff = levels[level] || levels[3];
    
    return (
      <span className={`text-xs font-semibold px-3 py-1 rounded-full ${diff.color} border border-white/40`}>
        {diff.text}
      </span>
    );
  };

  // Badge Temperamen
  const getTemperamentBadge = (type) => {
    switch(type) {
      case 'predator':
        return (
          <span className="flex items-center gap-1 text-[10px] font-bold px-2 py-1 rounded-full bg-rose-500/90 text-white shadow-sm border border-rose-400">
            <Sword size={10} /> Predator
          </span>
        );
      case 'semi-agresif':
        return (
          <span className="flex items-center gap-1 text-[10px] font-bold px-2 py-1 rounded-full bg-orange-500/90 text-white shadow-sm border border-orange-400">
            <AlertTriangle size={10} /> Semi-Agresif
          </span>
        );
      default: // damai
        return (
          <span className="flex items-center gap-1 text-[10px] font-bold px-2 py-1 rounded-full bg-emerald-500/90 text-white shadow-sm border border-emerald-400">
            <Leaf size={10} /> Damai
          </span>
        );
    }
  };

  return (
    <div
      onClick={() => onClick(fish.id)}
      className="group relative bg-white/40 backdrop-blur-xl rounded-3xl overflow-hidden border border-white/60 hover:border-aqua-main/40 transition-all duration-500 cursor-pointer hover:shadow-glass hover:scale-[1.02] flex flex-col h-full"
    >
      {/* Image Container with Gradient Overlay */}
      <div className="relative aspect-[4/3] overflow-hidden bg-gradient-to-br from-aqua-soft/30 to-white/50">
        <img
          src={fish.image_url || '/placeholder-fish.jpg'}
          alt={fish.name}
          loading="lazy"
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
        />
        
        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
        
        {/* Favorite Button */}
        <button
          onClick={handleFavoriteClick}
          className={`absolute top-3 right-3 p-2 rounded-full backdrop-blur-md transition-all duration-300 active:scale-90 ${
            isFavorited 
              ? 'bg-rose-500/90 text-white shadow-lg shadow-rose-500/30' 
              : 'bg-white/80 text-gray-400 hover:bg-white hover:text-rose-500'
          }`}
        >
          <Heart className={`w-5 h-5 ${isFavorited ? 'fill-current' : ''}`} />
        </button>

        {/* Badges Container Top Left */}
        <div className="absolute top-3 left-3 flex flex-col gap-2 items-start">
          <span className={`px-3 py-1.5 rounded-full text-xs font-bold backdrop-blur-md border border-white/60 ${
            fish.water_type === 'air_tawar' 
              ? 'bg-emerald-100/80 text-emerald-700' 
              : 'bg-cyan-100/80 text-cyan-700'
          }`}>
            {fish.water_type === 'air_tawar' ? '💧 Air Tawar' : '🌊 Air Laut'}
          </span>
          {/* Tampilkan badge temperamen jika data tersedia */}
          {fish.temperament && getTemperamentBadge(fish.temperament)}
        </div>
      </div>

      {/* Content Section */}
      <div className="p-4 flex flex-col flex-grow bg-white/30 backdrop-blur-sm">
        <div className="mb-2">
          <h3 className="font-bold text-aqua-dark text-lg leading-snug line-clamp-1 group-hover:text-aqua-main transition-colors duration-300">
            {fish.name}
          </h3>
          {fish.scientific_name && (
            <p className="text-xs text-gray-500 italic mt-1 line-clamp-1">
              {fish.scientific_name}
            </p>
          )}
        </div>

        {/* Difficulty Badge */}
        <div className="flex items-center gap-2 mb-3">
          {getDifficultyBadge(fish.difficulty_level)}
        </div>

        {/* Price Section */}
        <div className="mt-auto pt-3 border-t border-white/40">
          <p className="text-[10px] text-gray-400 font-semibold uppercase tracking-wider mb-1">
            Estimasi Harga
          </p>
          <div className="flex items-center justify-between">
            <p className="text-sm font-bold text-aqua-dark">
              {formatPrice(fish.price_min, fish.price_max)}
            </p>
            
            {/* Arrow Icon */}
            <div className="w-8 h-8 rounded-full bg-aqua-main/10 flex items-center justify-center text-aqua-main group-hover:bg-aqua-main group-hover:text-white transition-all duration-300">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M5 12h14" />
                <path d="m12 5 7 7-7 7" />
              </svg>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
