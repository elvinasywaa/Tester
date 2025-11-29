// Kode baru ya
import { useState, useEffect } from "react";
import { getAllFish, getFishById } from "../services/fishService";

// Hook untuk mengambil daftar ikan
export function useFishes(params = {}) {
  const [fishes, setFishes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState({
    total: 0,
    page: params.page || 1,
    total_pages: 0
  });

  const { 
    search, 
    water_type, 
    difficulty_level,
    temperament, // Parameter baru
    sort_by, 
    order, 
    page,
    limit = 12 
  } = params;

  useEffect(() => {
    let isMounted = true;

    async function fetchFish() {
      try {
        setLoading(true);
        setError(null);
        
        // Panggil service dengan parameter baru
        const { data, count } = await getAllFish({
          search,
          water_type,
          difficulty_level,
          temperament,
          sort_by,
          order,
          page,
          limit
        });

        if (isMounted) {
          setFishes(data || []);
          setPagination({
            total: count,
            page: page || 1,
            total_pages: Math.ceil((count || 0) / limit)
          });
        }
      } catch (err) {
        if (isMounted) {
          console.error("useFishes error:", err);
          setError("Gagal memuat data ikan");
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    }

    const timeoutId = setTimeout(() => {
      fetchFish();
    }, 500);

    return () => {
      isMounted = false;
      clearTimeout(timeoutId);
    };
  }, [search, water_type, difficulty_level, temperament, sort_by, order, page, limit]);

  return { fishes, loading, error, pagination };
}

// Hook detail ikan (tidak berubah, tapi disertakan agar lengkap)
export function useFish(id) {
  const [fish, setFish] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!id) return;

    async function fetchFish() {
      try {
        setLoading(true);
        const result = await getFishById(id);
        setFish(result);
      } catch (err) {
        console.error("useFish error:", err);
        setError("Gagal memuat detail ikan");
      } finally {
        setLoading(false);
      }
    }

    fetchFish();
  }, [id]);

  return { fish, loading, error };
}