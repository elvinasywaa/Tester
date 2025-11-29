const USER_PROFILE_KEY = 'fishpedia_user_profile';
const USER_ID_KEY = 'fishpedia_user_id';

export const getUserId = () => {
  let userId = localStorage.getItem(USER_ID_KEY);
  if (!userId) {
    userId = `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    localStorage.setItem(USER_ID_KEY, userId);
  }
  return userId;
};

export const getUserProfile = () => {
  try {
    const profile = localStorage.getItem(USER_PROFILE_KEY);
    if (profile) {
      return JSON.parse(profile);
    }
    return {
      username: 'Pengguna Fishpedia',
      avatar: null,
      userId: getUserId()
    };
  } catch (error) {
    return {
      username: 'Pengguna Fishpedia',
      avatar: null,
      userId: getUserId()
    };
  }
};

export const saveUserProfile = (profile) => {
  try {
    const userId = getUserId();
    const profileData = {
      ...profile,
      userId,
      updatedAt: new Date().toISOString()
    };
    localStorage.setItem(USER_PROFILE_KEY, JSON.stringify(profileData));
    return { success: true, data: profileData };
  } catch (error) {
    return { success: false, message: error.message };
  }
};

export const updateAvatar = (avatarBase64) => {
  try {
    const profile = getUserProfile();
    profile.avatar = avatarBase64;
    return saveUserProfile(profile);
  } catch (error) {
    return { success: false, message: error.message };
  }
};

export const updateUsername = (username) => {
  try {
    const profile = getUserProfile();
    profile.username = username.trim() || 'Pengguna Fishpedia';
    return saveUserProfile(profile);
  } catch (error) {
    return { success: false, message: error.message };
  }
};

export default {
  getUserId,
  getUserProfile,
  saveUserProfile,
  updateAvatar,
  updateUsername
};