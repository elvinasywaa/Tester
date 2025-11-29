import { useState, useEffect, useCallback } from 'react';
import searchHistoryService from '../services/searchHistoryService';
import userService from '../services/userService';

export function useSearchHistory() {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const userIdentifier = userService.getUserId();

  const fetchHistory = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await searchHistoryService.getSearchHistory(userIdentifier);
      
      if (response.success) {
        setHistory(response.data || []);
      } else {
        setError(response.message || 'Gagal memuat riwayat pencarian');
      }
    } catch (err) {
      setError(err.message || 'Terjadi kesalahan');
      setHistory([]);
    } finally {
      setLoading(false);
    }
  }, [userIdentifier]);

  const addToHistory = async (searchQuery) => {
    if (!searchQuery.trim()) return;
    
    const response = await searchHistoryService.addSearchHistory(userIdentifier, searchQuery);
    if (response.success) {
      await fetchHistory();
    }
  };

  const clearHistory = async () => {
    const response = await searchHistoryService.clearSearchHistory(userIdentifier);
    if (response.success) {
      setHistory([]);
    }
  };

  useEffect(() => {
    fetchHistory();
  }, [fetchHistory]);

  return {
    history,
    loading,
    error,
    addToHistory,
    clearHistory,
    refetch: fetchHistory,
  };
}