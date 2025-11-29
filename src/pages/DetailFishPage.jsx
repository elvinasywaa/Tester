import { useFish } from '../hooks/useFish.js';
import { 
  ArrowLeft, Waves, Droplet, Star, Calendar, 
  Sword, Leaf, Calculator, AlertTriangle, CheckCircle, 
  Info, FileText, Utensils, ShieldCheck 
} from 'lucide-react';
import { useState } from 'react';

export default function DetailFishPage({ fishId, onBack }) {
  const { fish, loading, error } = useFish(fishId);
  
  // State untuk Kalkulator Akuarium
  const [tankDims, setTankDims] = useState({ length: '', width: '', height: '' });
  const [calcResult, setCalcResult] = useState(null);

  // --- LOGIKA PARSING: Memisah Care Guide & Pakan ---
  const parseCareInfo = (careText) => {
    if (!careText) return { care: '', foodList: [] };

    // 1. Deteksi kata kunci "Pakan:" (case insensitive)
    const splitRegex = /Pakan:/i;
    
    if (splitRegex.test(careText)) {
      const parts = careText.split(splitRegex);
      const carePart = parts[0].trim().replace(/\.$/, ''); // Hapus titik di akhir tips
      const foodPart = parts[1].trim();

      // 2. Memecah item pakan berdasarkan koma (untuk tampilan chips/badge)
      // Contoh: "ikan kecil, udang" -> ["ikan kecil", "udang"]
      const foodItems = foodPart.split(',').map(item => item.trim());

      return {
        care: carePart,
        foodList: foodItems
      };
    }
    
    // Jika tidak ada kata "Pakan:", anggap semuanya tips perawatan
    return { care: careText, foodList: [] };
  };

  const calculateTank = () => {
    if (!tankDims.length || !tankDims.width || !tankDims.height) return;
    
    const volume = (parseInt(tankDims.length) * parseInt(tankDims.width) * parseInt(tankDims.height)) / 1000;
    const minNeeded = fish.min_tank_size || 0;
    
    setCalcResult({
      volume: Math.round(volume),
      isSuitable: volume >= minNeeded,
      minNeeded: minNeeded
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-aqua-soft/30 to-white/50">
        <div className="text-center bg-white/50 backdrop-blur-xl rounded-3xl p-12 border border-white/60 shadow-glass">
          <div className="w-16 h-16 border-4 border-aqua-main/30 border-t-aqua-main rounded-full animate-spin mx-auto mb-4" />
          <p className="text-aqua-dark font-semibold">Memuat detail ikan...</p>
        </div>
      </div>
    );
  }

  if (error || !fish) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-aqua-soft/30 to-white/50">
        <div className="text-center bg-white/50 backdrop-blur-xl rounded-3xl p-12 border border-white/60 shadow-glass max-w-md">
          <div className="text-6xl mb-4">😢</div>
          <p className="text-rose-600 font-bold text-xl mb-4">Gagal memuat detail ikan</p>
          <button onClick={onBack} className="px-8 py-3 bg-aqua-main text-white rounded-2xl">Kembali</button>
        </div>
      </div>
    );
  }

  // Eksekusi fungsi parsing
  const { care: careGuide, foodList } = parseCareInfo(fish.care_guide);
  const isSeawater = fish.water_type === 'air_laut';

  // Helper untuk bintang difficulty
  const getDifficultyStars = (level) => {
    const stars = [];
    for (let i = 0; i < 5; i++) {
      stars.push(
        <Star key={i} className={`w-5 h-5 ${i < level ? 'text-amber-400 fill-amber-400' : 'text-gray-300'}`} />
      );
    }
    return stars;
  };

  return (
    <div className="min-h-screen pb-20">
      {/* Back Button */}
      <div className="sticky top-0 z-50 bg-white/70 backdrop-blur-xl shadow-soft border-b border-white/40 px-4 py-4">
        <div className="max-w-4xl mx-auto">
          <button
            onClick={onBack}
            className="flex items-center gap-3 text-aqua-dark hover:text-aqua-main font-semibold transition-all px-4 py-2 rounded-xl hover:bg-white/50"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Kembali</span>
          </button>
        </div>
      </div>

      <main className="max-w-4xl mx-auto px-4 py-8">
        {/* Hero Image & Badges */}
        <div className="relative w-full h-80 overflow-hidden rounded-3xl bg-gradient-to-br from-aqua-soft/30 to-white/50 mb-8 shadow-glass border border-white/60">
          <img
            src={fish.image_url || '/placeholder-fish.jpg'}
            alt={fish.name}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
          
          <div className="absolute top-4 left-4 flex gap-2">
            <div className={`px-4 py-2 rounded-2xl backdrop-blur-xl font-bold text-sm flex items-center gap-2 border ${
              isSeawater ? 'bg-cyan-100/80 text-cyan-700 border-cyan-200/60' : 'bg-emerald-100/80 text-emerald-700 border-emerald-200/60'
            }`}>
              {isSeawater ? <Waves className="w-4 h-4" /> : <Droplet className="w-4 h-4" />}
              {isSeawater ? 'Air Laut' : 'Air Tawar'}
            </div>
            
            {fish.temperament && (
              <div className={`px-4 py-2 rounded-2xl backdrop-blur-xl font-bold text-sm flex items-center gap-2 border ${
                fish.temperament === 'predator' ? 'bg-rose-500/90 text-white border-rose-400' :
                fish.temperament === 'semi-agresif' ? 'bg-orange-500/90 text-white border-orange-400' :
                'bg-emerald-500/90 text-white border-emerald-400'
              }`}>
                {fish.temperament === 'predator' ? <Sword className="w-4 h-4" /> : <Leaf className="w-4 h-4" />}
                <span className="capitalize">{fish.temperament}</span>
              </div>
            )}
          </div>
        </div>

        {/* Title */}
        <div className="mb-6">
          <h1 className="text-4xl md:text-5xl font-bold text-aqua-dark mb-2">{fish.name}</h1>
          {fish.scientific_name && (
            <p className="text-xl text-aqua-dark/60 italic">{fish.scientific_name}</p>
          )}
        </div>

        {/* Quick Stats Grid */}
        <div className="grid md:grid-cols-2 gap-6 mb-8">
          <div className="bg-white/50 backdrop-blur-xl p-6 rounded-3xl border border-white/60 shadow-soft">
            <h2 className="text-lg font-bold text-aqua-dark mb-4 flex items-center gap-2">
              <Star className="w-5 h-5 text-amber-400" /> Tingkat Perawatan
            </h2>
            <div className="flex gap-1 mb-2">{getDifficultyStars(fish.difficulty_level)}</div>
            <p className="text-aqua-dark/70 text-sm">
              Level {fish.difficulty_level} dari 5
            </p>
          </div>

          <div className="bg-white/50 backdrop-blur-xl p-6 rounded-3xl border border-white/60 shadow-soft">
            <h2 className="text-lg font-bold text-aqua-dark mb-4">💰 Kisaran Harga</h2>
            <p className="text-2xl font-bold text-aqua-main">
              {fish.price_min && fish.price_max
                ? `Rp ${fish.price_min.toLocaleString('id-ID')} - ${fish.price_max.toLocaleString('id-ID')}`
                : 'Hubungi penjual'}
            </p>
          </div>
        </div>

        {/* Deskripsi */}
        {fish.description && (
          <div className="bg-white/50 backdrop-blur-xl p-8 rounded-3xl border border-white/60 shadow-soft mb-6">
            <h2 className="text-2xl font-bold text-aqua-dark mb-4 flex items-center gap-2">
              <Info className="w-6 h-6 text-aqua-main" /> Deskripsi
            </h2>
            <p className="text-aqua-dark/80 leading-relaxed text-lg whitespace-pre-line">{fish.description}</p>
          </div>
        )}

        {/* --- BAGIAN UTAMA: TIPS & PAKAN TERPISAH --- */}
        <div className="grid md:grid-cols-2 gap-6 mb-6">
            {/* Bagian Kiri: Tips Perawatan */}
            {careGuide && (
            <div className="bg-white/50 backdrop-blur-xl p-8 rounded-3xl border border-white/60 shadow-soft flex flex-col h-full">
                <h2 className="text-xl font-bold text-aqua-dark mb-4 flex items-center gap-2">
                  <ShieldCheck className="w-6 h-6 text-blue-500" />
                  Tips Perawatan
                </h2>
                <p className="text-aqua-dark/80 leading-relaxed capitalize text-lg">
                  {careGuide}.
                </p>
            </div>
            )}

            {/* Bagian Kanan: Rekomendasi Pakan (HIGHLIGHT BOLD) */}
            {foodList.length > 0 ? (
            <div className="bg-orange-50/60 backdrop-blur-xl p-8 rounded-3xl border border-orange-100 shadow-soft flex flex-col h-full">
                <h2 className="text-xl font-bold text-orange-800 mb-4 flex items-center gap-2">
                  <Utensils className="w-6 h-6 text-orange-500" />
                  Rekomendasi Pakan
                </h2>
                
                {/* Container Pakan */}
                <div className="bg-white/60 rounded-2xl p-5 border border-orange-200/50 flex-grow">
                    {/* Opsi 1: Tampilkan sebagai list chips (Lebih rapi) */}
                    <div className="flex flex-wrap gap-2">
                        {foodList.map((item, idx) => (
                            <span key={idx} className="px-3 py-1.5 bg-orange-100 text-orange-800 font-bold rounded-lg border border-orange-200 text-sm capitalize">
                                {item}
                            </span>
                        ))}
                    </div>

                    {/* Opsi 2 (Fallback Text Bold): Jika ingin teks kalimat biasa tapi bold */}
                    {/* <p className="text-orange-900 font-bold text-lg leading-relaxed capitalize">
                       {foodList.join(', ')}
                    </p> */}
                </div>
                
                <p className="mt-4 text-xs text-orange-800/60 flex gap-2 items-center">
                    <CheckCircle size={14} /> Berikan pakan bervariasi untuk nutrisi terbaik.
                </p>
            </div>
            ) : (
             <div className="bg-gray-50/50 backdrop-blur-xl p-8 rounded-3xl border border-gray-100 shadow-soft flex items-center justify-center text-gray-400 italic">
                 Info pakan spesifik belum tersedia.
             </div>
            )}
        </div>

        {/* Karakteristik */}
        {fish.characteristics && (
          <div className="bg-white/50 backdrop-blur-xl p-8 rounded-3xl border border-white/60 shadow-soft mb-6">
            <h2 className="text-2xl font-bold text-aqua-dark mb-4 flex items-center gap-2">
              <FileText className="w-6 h-6 text-aqua-main" /> Karakteristik Unik
            </h2>
            <p className="text-aqua-dark/80 leading-relaxed text-lg">{fish.characteristics}</p>
          </div>
        )}

        {/* Tank Mates */}
        {fish.compatible_with && fish.compatible_with.length > 0 && (
          <div className="bg-emerald-50/50 backdrop-blur-xl p-8 rounded-3xl border border-emerald-100 shadow-soft mb-6">
            <h2 className="text-2xl font-bold text-aqua-dark mb-4 flex items-center gap-2">
              <Leaf className="w-6 h-6 text-emerald-500" /> Teman Tangki yang Cocok
            </h2>
            <div className="flex flex-wrap gap-2">
              {fish.compatible_with.map((mate, idx) => (
                <span key={idx} className="px-4 py-2 bg-white/80 rounded-xl text-emerald-700 font-medium shadow-sm border border-emerald-100">
                  {mate}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Calculator */}
        <div className="bg-blue-50/50 backdrop-blur-xl p-8 rounded-3xl border border-blue-100 shadow-soft mb-6">
          <h2 className="text-2xl font-bold text-aqua-dark mb-4 flex items-center gap-2">
            <Calculator className="w-6 h-6 text-blue-500" /> Cek Ukuran Akuarium
          </h2>
          <p className="text-aqua-dark/70 mb-6">
            Min volume: <span className="font-bold text-blue-600">{fish.min_tank_size || '-'} Liter</span>
          </p>
          <div className="grid grid-cols-3 gap-4 mb-4">
            {['length', 'width', 'height'].map((dim) => (
              <div key={dim}>
                <label className="block text-xs font-bold text-gray-500 mb-1 capitalize">
                  {dim === 'length' ? 'Panjang' : dim === 'width' ? 'Lebar' : 'Tinggi'} (cm)
                </label>
                <input 
                  type="number" 
                  value={tankDims[dim]}
                  onChange={e => setTankDims({...tankDims, [dim]: e.target.value})}
                  className="w-full px-4 py-2 rounded-xl border border-blue-200 focus:ring-2 focus:ring-blue-400 focus:outline-none"
                />
              </div>
            ))}
          </div>
          <button 
            onClick={calculateTank}
            className="w-full py-3 bg-blue-500 text-white rounded-xl font-bold hover:bg-blue-600 transition-all shadow-lg shadow-blue-500/30"
          >
            Hitung Kelayakan
          </button>
          
          {calcResult && (
            <div className={`mt-6 p-4 rounded-2xl border flex items-start gap-4 ${
              calcResult.isSuitable ? 'bg-emerald-100/50 border-emerald-200 text-emerald-800' : 'bg-rose-100/50 border-rose-200 text-rose-800'
            }`}>
              <div className={`p-2 rounded-full ${calcResult.isSuitable ? 'bg-emerald-200 text-emerald-700' : 'bg-rose-200 text-rose-700'}`}>
                {calcResult.isSuitable ? <CheckCircle size={24} /> : <AlertTriangle size={24} />}
              </div>
              <div>
                <h4 className="font-bold text-lg mb-1">{calcResult.isSuitable ? 'Akuarium Cocok!' : 'Akuarium Terlalu Kecil!'}</h4>
                <p className="text-sm opacity-90">Volume Anda: <strong>{calcResult.volume} Liter</strong>. Butuh minimal <strong>{calcResult.minNeeded} Liter</strong>.</p>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}