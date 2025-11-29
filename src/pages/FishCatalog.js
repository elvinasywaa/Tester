const API_URL = "https://pktehftnpthdzjtzfmwf.supabase.co/rest/v1/fish";
const API_KEY = "sb_publishable_5cyfbTwaVZm6EbsGXfKDxA_JtiuYxoG";

export async function loadFish() {
  const res = await fetch(API_URL, {
    headers: {
      apikey: API_KEY,
      Authorization: `Bearer ${API_KEY}`,
    },
  });

  const data = await res.json();
  return data;
}
