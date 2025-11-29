import { supabase } from '../config/supabase';

class FavoriteService {
  async getFavorites(userIdentifier) {
    try {
      const { data, error } = await supabase
        .from('fish_favorites')
        .select(`
          *,
          fishes (*)
        `) // <-- PERBAIKAN: Hanya ambil data fishes, hapus fish_categories
        .eq('user_identifier', userIdentifier)
        .order('created_at', { ascending: false });

      if (error) throw error;

      // Filter jika ada data fishes yang null (misal ikan sudah dihapus admin)
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

  async toggleFavorite(fishId, userIdentifier) {
    try {
      // 1. Cek apakah sudah ada di favorit
      const { data: existing } = await supabase
        .from('fish_favorites')
        .select('id')
        .eq('fish_id', fishId)
        .eq('user_identifier', userIdentifier)
        .maybeSingle(); // Gunakan maybeSingle agar tidak error jika kosong

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

  async isFavorited(fishId, userIdentifier) {
    try {
      const { data, error } = await supabase
        .from('fish_favorites')
        .select('id')
        .eq('fish_id', fishId)
        .eq('user_identifier', userIdentifier)
        .maybeSingle();

      if (error && error.code !== 'PGRST116') throw error;

      return {
        success: true,
        data: { isFavorited: !!data }
      };
    } catch (error) {
      return {
        success: true, // Return true sukses tapi datanya false
        data: { isFavorited: false }
      };
    }
  }
}

export default new FavoriteService();