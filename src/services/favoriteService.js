import { supabase } from '../config/supabase';

class FavoriteService {
  async getFavorites(userIdentifier) {
    try {
      const { data, error } = await supabase
        .from('fish_favorites')
        .select(`
          *,
          fishes!fk_favorites_fish (*) 
        `) 
      
        .eq('user_identifier', userIdentifier)
        .order('created_at', { ascending: false });

      if (error) throw error;

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

  // ... sisa fungsi lain (toggleFavorite, isFavorited) biarkan tetap sama
  async toggleFavorite(fishId, userIdentifier) {
    try {
      const { data: existing } = await supabase
        .from('fish_favorites')
        .select('id')
        .eq('fish_id', fishId)
        .eq('user_identifier', userIdentifier)
        .maybeSingle();

      if (existing) {
        const { error } = await supabase
          .from('fish_favorites')
          .delete()
          .eq('id', existing.id);

        if (error) throw error;
        return { success: true, data: { isFavorited: false } };
      } else {
        const { error } = await supabase
          .from('fish_favorites')
          .insert([{ fish_id: fishId, user_identifier: userIdentifier }]);

        if (error) throw error;
        return { success: true, data: { isFavorited: true } };
      }
    } catch (error) {
      return { success: false, message: error.message };
    }
  }

  async isFavorited(fishId, userIdentifier) {
    try {
      const { data } = await supabase
        .from('fish_favorites')
        .select('id')
        .eq('fish_id', fishId)
        .eq('user_identifier', userIdentifier)
        .maybeSingle();

      return { success: true, data: { isFavorited: !!data } };
    } catch (error) {
      return { success: true, data: { isFavorited: false } };
    }
  }
}

export default new FavoriteService();