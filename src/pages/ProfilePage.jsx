// Kode baru
import { useState, useEffect } from 'react';
import { User, Camera, Edit2, Heart, History, Trash2, Save, X, Sparkles } from 'lucide-react';
import userService from '../services/userService';
import { useFavorites } from '../hooks/useFavorite';
import { useSearchHistory } from '../hooks/useSearchHistory';
import FishCard from '../components/FishCard';

export default function ProfilePage({ onFishClick }) {
  const [profile, setProfile] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editedUsername, setEditedUsername] = useState('');
  const [activeTab, setActiveTab] = useState('favorites');

  const { favorites, loading: favLoading, refetch: refetchFavorites } = useFavorites();
  const { history, loading: historyLoading, clearHistory } = useSearchHistory();

  useEffect(() => {
    const userProfile = userService.getUserProfile();
    setProfile(userProfile);
    setEditedUsername(userProfile.username);
  }, []);

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (file.size > 2 * 1024 * 1024) {
      alert('Ukuran file maksimal 2MB');
      return;
    }

    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    if (!allowedTypes.includes(file.type)) {
      alert('Format file harus .jpg, .jpeg, .png, atau .webp');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const result = userService.updateAvatar(event.target.result);
      if (result.success) {
        setProfile(result.data);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleSaveUsername = () => {
    if (!editedUsername.trim()) {
      alert('Username tidak boleh kosong');
      return;
    }

    const result = userService.updateUsername(editedUsername);
    if (result.success) {
      setProfile(result.data);
      setIsEditing(false);
    }
  };

  const handleClearHistory = async () => {
    if (window.confirm('Apakah Anda yakin ingin menghapus semua riwayat pencarian?')) {
      await clearHistory();
    }
  };

  if (!profile) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center bg-white/50 backdrop-blur-xl rounded-3xl p-12 border border-white/60 shadow-glass">
          <div className="w-16 h-16 border-4 border-aqua-main/30 border-t-aqua-main rounded-full animate-spin mx-auto mb-4" />
          <p className="text-aqua-dark font-semibold">Memuat profil...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pb-24">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-10 right-10 w-72 h-72 bg-aqua-main/10 rounded-full blur-3xl animate-pulse" />
          <div className="absolute bottom-20 left-10 w-96 h-96 bg-aqua-soft/20 rounded-full blur-3xl animate-pulse" />
        </div>

        <div className="relative bg-gradient-to-br from-aqua-main/20 via-aqua-soft/30 to-white/40 backdrop-blur-2xl border-b border-white/60 py-16 px-4">
          <div className="max-w-5xl mx-auto text-center">
            <div className="inline-block mb-4">
              <div className="w-16 h-16 bg-gradient-to-br from-aqua-main to-aqua-dark rounded-2xl flex items-center justify-center shadow-lg shadow-aqua-main/30">
                <User className="w-8 h-8 text-white" />
              </div>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-4 text-aqua-dark">
              Profil Saya
            </h1>
            <p className="text-lg text-aqua-dark/70">
              Kelola profil dan preferensi Anda
            </p>
          </div>
        </div>
      </div>

      <main className="max-w-5xl mx-auto px-4 py-12 space-y-8">
        {/* Profile Card */}
        <div className="bg-white/50 backdrop-blur-xl rounded-3xl p-8 border border-white/60 shadow-glass">
          <div className="flex flex-col md:flex-row items-center gap-8">
            {/* Avatar */}
            <div className="relative group">
              <div className="w-32 h-32 rounded-full bg-gradient-to-br from-aqua-main to-aqua-dark flex items-center justify-center overflow-hidden shadow-lg shadow-aqua-main/30">
                {profile.avatar ? (
                  <img
                    src={profile.avatar}
                    alt={profile.username}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <User className="w-16 h-16 text-white" />
                )}
              </div>
              <label className="absolute bottom-0 right-0 p-3 bg-white/90 backdrop-blur-sm rounded-full shadow-lg cursor-pointer hover:bg-white hover:scale-110 transition-all border border-white/60">
                <Camera className="w-5 h-5 text-aqua-main" />
                <input
                  type="file"
                  accept="image/jpeg,image/jpg,image/png,image/webp"
                  onChange={handleAvatarChange}
                  className="hidden"
                />
              </label>
            </div>

            {/* User Info */}
            <div className="flex-1 text-center md:text-left">
              {isEditing ? (
                <div className="flex items-center gap-3 mb-4">
                  <input
                    type="text"
                    value={editedUsername}
                    onChange={(e) => setEditedUsername(e.target.value)}
                    className="flex-1 px-4 py-3 bg-white/70 backdrop-blur-md border border-white/60 rounded-2xl focus:ring-2 focus:ring-aqua-main/50 focus:border-aqua-main text-aqua-dark"
                    placeholder="Nama pengguna"
                  />
                  <button
                    onClick={handleSaveUsername}
                    className="p-3 bg-gradient-to-r from-emerald-500 to-emerald-600 text-white rounded-2xl hover:shadow-lg hover:scale-105 transition-all"
                  >
                    <Save className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => {
                      setIsEditing(false);
                      setEditedUsername(profile.username);
                    }}
                    className="p-3 bg-gradient-to-r from-rose-500 to-rose-600 text-white rounded-2xl hover:shadow-lg hover:scale-105 transition-all"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              ) : (
                <div className="flex items-center justify-center md:justify-start gap-3 mb-4">
                  <h2 className="text-3xl font-bold text-aqua-dark">
                    {profile.username}
                  </h2>
                  <button
                    onClick={() => setIsEditing(true)}
                    className="p-2 bg-white/70 backdrop-blur-md rounded-xl hover:bg-white hover:scale-110 transition-all border border-white/60"
                  >
                    <Edit2 className="w-4 h-4 text-aqua-main" />
                  </button>
                </div>
              )}
              <p className="text-aqua-dark/60 mb-6">User ID: {profile.userId}</p>
              
              <div className="flex flex-wrap gap-4 justify-center md:justify-start">
                <div className="bg-gradient-to-br from-aqua-soft/50 to-white/50 backdrop-blur-md px-6 py-4 rounded-2xl border border-white/60 shadow-soft">
                  <p className="text-sm text-aqua-dark/60 mb-1">Ikan Favorit</p>
                  <p className="text-3xl font-bold text-aqua-main">{favorites.length}</p>
                </div>
                <div className="bg-gradient-to-br from-aqua-accent/30 to-white/50 backdrop-blur-md px-6 py-4 rounded-2xl border border-white/60 shadow-soft">
                  <p className="text-sm text-aqua-dark/60 mb-1">Riwayat Pencarian</p>
                  <p className="text-3xl font-bold text-aqua-main">{history.length}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white/50 backdrop-blur-xl rounded-3xl shadow-glass border border-white/60 overflow-hidden">
          <div className="flex border-b border-white/40">
            <button
              onClick={() => setActiveTab('favorites')}
              className={`flex-1 flex items-center justify-center gap-3 px-6 py-5 font-semibold transition-all ${
                activeTab === 'favorites'
                  ? 'bg-gradient-to-r from-aqua-main to-cyan-500 text-white shadow-lg'
                  : 'text-aqua-dark/70 hover:bg-white/40'
              }`}
            >
              <Heart className={`w-5 h-5 ${activeTab === 'favorites' ? 'fill-current' : ''}`} />
              Ikan Favorit
            </button>
            <button
              onClick={() => setActiveTab('history')}
              className={`flex-1 flex items-center justify-center gap-3 px-6 py-5 font-semibold transition-all ${
                activeTab === 'history'
                  ? 'bg-gradient-to-r from-aqua-main to-cyan-500 text-white shadow-lg'
                  : 'text-aqua-dark/70 hover:bg-white/40'
              }`}
            >
              <History className="w-5 h-5" />
              Riwayat Pencarian
            </button>
          </div>

          <div className="p-8">
            {/* Favorites Tab */}
            {activeTab === 'favorites' && (
              <div>
                <div className="flex items-center justify-between mb-8">
                  <h3 className="text-2xl font-bold text-aqua-dark">
                    Ikan Favorit Saya
                  </h3>
                  {favorites.length > 0 && (
                    <button
                      onClick={refetchFavorites}
                      className="text-sm text-aqua-main hover:text-cyan-600 font-semibold hover:underline"
                    >
                      Refresh
                    </button>
                  )}
                </div>

                {favLoading ? (
                  <div className="flex items-center justify-center py-16">
                    <div className="w-12 h-12 border-4 border-aqua-main/30 border-t-aqua-main rounded-full animate-spin" />
                  </div>
                ) : favorites.length === 0 ? (
                  <div className="text-center py-16 bg-white/30 backdrop-blur-xl rounded-3xl border border-white/60">
                    <Heart className="w-20 h-20 text-aqua-main/30 mx-auto mb-4" />
                    <p className="text-aqua-dark text-xl font-semibold mb-2">
                      Belum ada ikan favorit
                    </p>
                    <p className="text-aqua-dark/60">
                      Tambahkan ikan ke favorit untuk melihatnya di sini
                    </p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {favorites.map((fish) => (
                      <FishCard key={fish.id} fish={fish} onClick={onFishClick} />
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* History Tab */}
            {activeTab === 'history' && (
              <div>
                <div className="flex items-center justify-between mb-8">
                  <h3 className="text-2xl font-bold text-aqua-dark">
                    Riwayat Pencarian
                  </h3>
                  {history.length > 0 && (
                    <button
                      onClick={handleClearHistory}
                      className="flex items-center gap-2 px-5 py-3 bg-gradient-to-r from-rose-500 to-rose-600 text-white rounded-2xl hover:shadow-lg hover:scale-105 transition-all font-semibold"
                    >
                      <Trash2 className="w-4 h-4" />
                      Hapus Semua
                    </button>
                  )}
                </div>

                {historyLoading ? (
                  <div className="flex items-center justify-center py-16">
                    <div className="w-12 h-12 border-4 border-aqua-main/30 border-t-aqua-main rounded-full animate-spin" />
                  </div>
                ) : history.length === 0 ? (
                  <div className="text-center py-16 bg-white/30 backdrop-blur-xl rounded-3xl border border-white/60">
                    <History className="w-20 h-20 text-aqua-main/30 mx-auto mb-4" />
                    <p className="text-aqua-dark text-xl font-semibold mb-2">
                      Belum ada riwayat pencarian
                    </p>
                    <p className="text-aqua-dark/60">
                      Pencarian Anda akan muncul di sini
                    </p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {history.map((item) => (
                      <div
                        key={item.id}
                        className="flex items-center justify-between p-5 bg-white/40 backdrop-blur-xl rounded-2xl hover:bg-white/60 transition-all border border-white/60 shadow-soft"
                      >
                        <div className="flex items-center gap-4">
                          <div className="w-10 h-10 bg-gradient-to-br from-aqua-soft to-white rounded-xl flex items-center justify-center">
                            <History className="w-5 h-5 text-aqua-main" />
                          </div>
                          <div>
                            <p className="font-semibold text-aqua-dark">
                              {item.search_query}
                            </p>
                            <p className="text-sm text-aqua-dark/60">
                              {new Date(item.created_at).toLocaleDateString('id-ID', {
                                day: 'numeric',
                                month: 'long',
                                year: 'numeric',
                                hour: '2-digit',
                                minute: '2-digit'
                              })}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* About App */}
        <div className="relative bg-white/40 backdrop-blur-xl rounded-3xl p-8 border border-white/60 shadow-soft overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-aqua-main/10 rounded-full -mr-32 -mt-32 blur-3xl" />
          <div className="relative flex items-start gap-6">
            <div className="w-12 h-12 bg-gradient-to-br from-aqua-main to-aqua-dark rounded-2xl flex items-center justify-center shadow-lg shadow-aqua-main/30 flex-shrink-0">
              <Sparkles className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="text-2xl font-bold text-aqua-dark mb-3">
                Tentang Fishpedia
              </h3>
              <p className="text-aqua-dark/70 leading-relaxed text-lg mb-4">
                Fishpedia adalah aplikasi katalog ikan hias yang membantu Anda menemukan dan mempelajari berbagai jenis ikan air tawar dan air laut. Dilengkapi dengan informasi lengkap tentang karakteristik, cara perawatan, tingkat kesulitan, dan kisaran harga pasar.
              </p>
              <div className="flex flex-wrap gap-2">
                <span className="px-4 py-2 bg-gradient-to-r from-aqua-soft/50 to-white/50 backdrop-blur-md text-aqua-dark rounded-full text-sm font-semibold border border-white/60">
                  v1.0.0
                </span>
                <span className="px-4 py-2 bg-gradient-to-r from-aqua-soft/50 to-white/50 backdrop-blur-md text-aqua-dark rounded-full text-sm font-semibold border border-white/60">
                  PWA
                </span>
                <span className="px-4 py-2 bg-gradient-to-r from-aqua-soft/50 to-white/50 backdrop-blur-md text-aqua-dark rounded-full text-sm font-semibold border border-white/60">
                  Offline Ready
                </span>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}