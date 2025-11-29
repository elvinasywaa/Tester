// Kode baru ya
import { supabase } from "../config/supabase";

// Ambil ikan dengan fitur search, filter, sort, dan pagination yang BENAR
export async function getAllFish({ 
  search, 
  water_type, 
  difficulty_level, 
  temperament, // Filter baru
  sort_by = 'created_at', 
  order = 'desc', 
  page = 1, 
  limit = 12 
} = {}) {
  
  // PENTING: Gunakan tabel 'fishes', bukan 'fish'
  let query = supabase
    .from("fishes")
    .select("*", { count: 'exact' });

  // 1. Filter Search (Case insensitive)
  if (search) {
    query = query.ilike('name', `%${search}%`);
  }

  // 2. Filter Tipe Air (Memisahkan Tawar dan Laut)
  if (water_type) {
    // Mapping: UI mengirim 'freshwater', DB butuh 'air_tawar'
    const typeMap = {
      'freshwater': 'air_tawar',
      'saltwater': 'air_laut',
      'air_tawar': 'air_tawar',
      'air_laut': 'air_laut'
    };
    const dbValue = typeMap[water_type];
    if (dbValue) {
        query = query.eq('water_type', dbValue);
    }
  }

  // 3. Filter Tingkat Kesulitan
  if (difficulty_level) {
    query = query.eq('difficulty_level', parseInt(difficulty_level));
  }

  // 4. Filter Temperamen (Baru)
  if (temperament) {
    query = query.eq('temperament', temperament);
  }

  // 5. Sorting
  const sortColumn = sort_by === 'price' ? 'price_min' : sort_by;
  query = query.order(sortColumn, { ascending: order === 'asc' });

  // 6. Pagination
  const from = (page - 1) * limit;
  const to = from + limit - 1;
  query = query.range(from, to);

  const { data, error, count } = await query;

  if (error) {
    console.error("Error getAllFish():", error);
    throw error;
  }

  return { data, count };
}

// Ambil ikan berdasarkan ID
export async function getFishById(id) {
  const { data, error } = await supabase
    .from("fishes")
    .select("*") // Ambil data ikan saja, tanpa join kategori
    .eq("id", id)
    .single();

  if (error) {
    console.error("Error getFishById():", error);
    throw error;
  }

  return data;
}
