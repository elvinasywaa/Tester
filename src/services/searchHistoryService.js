import { supabase } from '../config/supabase';

class SearchHistoryService {
  async addSearchHistory(userIdentifier, searchQuery) {
    try {
      const { error } = await supabase
        .from('search_history')
        .insert([{
          user_identifier: userIdentifier,
          search_query: searchQuery
        }]);

      if (error) throw error;

      return { success: true };
    } catch (error) {
      return {
        success: false,
        message: error.message
      };
    }
  }

  async getSearchHistory(userIdentifier, limit = 10) {
    try {
      const { data, error } = await supabase
        .from('search_history')
        .select('*')
        .eq('user_identifier', userIdentifier)
        .order('created_at', { ascending: false })
        .limit(limit);

      if (error) throw error;

      return {
        success: true,
        data: data || []
      };
    } catch (error) {
      return {
        success: false,
        message: error.message,
        data: []
      };
    }
  }

  async clearSearchHistory(userIdentifier) {
    try {
      const { error } = await supabase
        .from('search_history')
        .delete()
        .eq('user_identifier', userIdentifier);

      if (error) throw error;

      return { success: true };
    } catch (error) {
      return {
        success: false,
        message: error.message
      };
    }
  }
}

export default new SearchHistoryService();