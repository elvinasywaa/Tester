import { supabase } from '../config/supabase';

class FavoriteService {
  
  // 1. Mengambil Daftar Favorit
  async getFavorites(userIdentifier) {
    try {
      const { data, error } = await supabase
        .from('fish_favorites')
        .select(`
          *,
          fishes!fk_favorites_fish (*)
        `) 
        // Catatan: '!fk_favorites_fish' merujuk pada nama constraint foreign key di database.
        // Jika nanti error "relationship not found", ganti baris di atas menjadi: fishes (*)
        
        .eq('user_identifier', userIdentifier)
        .order('created_at', { ascending: false });

      if (error) throw error;

      // Filter data valid (jika ada ikan yang terhapus dari database master)
      const validFavorites = data
        ?.map(fav => fav.fishes)
        .filter(fish => fish !== null) || [];

      return {
        success: true,
        data: validFavorites
      };
    } catch (error) {
      console.error("Error fetching favorites:", error);
      return {
        success: false,
        message: error.message,
        data: []
      };
    }
  }

  // 2. Toggle (Tambah/Hapus) Favorit
  async toggleFavorite(fishId, userIdentifier) {
    try {
      // Cek apakah sudah ada (Gunakan limit 1 agar tidak error 406 jika duplikat)
      const { data: existingData } = await supabase
        .from('fish_favorites')
        .select('id')
        .eq('fish_id', fishId)
        .eq('user_identifier', userIdentifier)
        .limit(1);

      const existing = existingData && existingData.length > 0 ? existingData[0] : null;

      if (existing) {
        // HAPUS (Unfavorite)
        const { error } = await supabase
          .from('fish_favorites')
          .delete()
          .eq('id', existing.id);

        if (error) throw error;

        return {
          success: true,
          data: { isFavorited: false }
        };
      } else {
        // TAMBAH (Favorite)
        const { error } = await supabase
          .from('fish_favorites')
          .insert([{
            fish_id: fishId,
            user_identifier: userIdentifier
          }]);

        if (error) throw error;

        return {
          success: true,
          data: { isFavorited: true }
        };
      }
    } catch (error) {
      console.error("Error toggling favorite:", error);
      return {
        success: false,
        message: error.message
      };
    }
  }

  // 3. Cek Status Favorit (Untuk icon hati merah/putih)
  async isFavorited(fishId, userIdentifier) {
    try {
      const { data } = await supabase
        .from('fish_favorites')
        .select('id')
        .eq('fish_id', fishId)
        .eq('user_identifier', userIdentifier)
        .limit(1); // Gunakan limit 1 agar aman

      const isFav = data && data.length > 0;

      return {
        success: true,
        data: { isFavorited: isFav }
      };
    } catch (error) {
      return {
        success: true, 
        data: { isFavorited: false }
      };
    }
  }
}

export default new FavoriteService();