//Kode baru ya
import { useState, useEffect, useCallback } from 'react';
import favoriteService from '../services/favoriteService.js';
import userService from '../services/userService.js';

const getUserIdentifier = () => {
  return userService.getUserId();
};

export function useFavorites() {
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const userIdentifier = getUserIdentifier();

  const fetchFavorites = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await favoriteService.getFavorites(userIdentifier);
      
      if (response.success) {
        setFavorites(response.data || []);
      } else {
        setError(response.message || 'Gagal memuat favorit');
      }
    } catch (err) {
      setError(err.message || 'Terjadi kesalahan saat memuat favorit');
      setFavorites([]);
    } finally {
      setLoading(false);
    }
  }, [userIdentifier]);

  useEffect(() => {
    fetchFavorites();
  }, [fetchFavorites]);

  return {
    favorites,
    loading,
    error,
    refetch: fetchFavorites,
  };
}

export function useToggleFavorite() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const userIdentifier = getUserIdentifier();

  const toggleFavorite = async (fishId) => {
    try {
      setLoading(true);
      setError(null);
      const response = await favoriteService.toggleFavorite(fishId, userIdentifier);
      
      if (response.success) {
        return response.data;
      } else {
        setError(response.message || 'Gagal mengubah favorit');
        return null;
      }
    } catch (err) {
      setError(err.message || 'Terjadi kesalahan');
      return null;
    } finally {
      setLoading(false);
    }
  };

  return {
    toggleFavorite,
    loading,
    error,
  };
}

export function useIsFavorited(fishId) {
  const { favorites, loading: fetchLoading, refetch } = useFavorites();
  const { toggleFavorite: toggle, loading: toggleLoading } = useToggleFavorite();

  const isFavorited = favorites.some(fav => fav.id === fishId);

  const toggleFavorite = async () => {
    const result = await toggle(fishId);
    if (result) {
      await refetch();
    }
    return result;
  };

  return {
    isFavorited,
    loading: fetchLoading || toggleLoading,
    toggleFavorite,
  };
}

export { getUserIdentifier };
