import { supabase } from '../config/supabase';

class FavoriteService {
  async getFavorites(userIdentifier) {
    try {
      const { data, error } = await supabase
        .from('fish_favorites')
        .select(`
          *,
          fishes (
            *,
            fish_categories (
              id,
              name,
              type
            )
          )
        `)
        .eq('user_identifier', userIdentifier)
        .order('created_at', { ascending: false });

      if (error) throw error;

      return {
        success: true,
        data: data?.map(fav => fav.fishes) || []
      };
    } catch (error) {
      return {
        success: false,
        message: error.message,
        data: []
      };
    }
  }

  async toggleFavorite(fishId, userIdentifier) {
    try {
      // Check if already favorited
      const { data: existing } = await supabase
        .from('fish_favorites')
        .select('id')
        .eq('fish_id', fishId)
        .eq('user_identifier', userIdentifier)
        .single();

      if (existing) {
        // Remove from favorites
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
        // Add to favorites
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
        .single();

      return {
        success: true,
        data: { isFavorited: !!data }
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