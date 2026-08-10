import AsyncStorage from "@react-native-async-storage/async-storage";

const avatarKey = (userId: string) => `nectar-avatar:${userId}`;

export async function getProfileAvatar(userId: string): Promise<string | undefined> {
  try {
    const uri = await AsyncStorage.getItem(avatarKey(userId));
    return uri ?? undefined;
  } catch {
    return undefined;
  }
}

export async function setProfileAvatar(userId: string, uri: string) {
  await AsyncStorage.setItem(avatarKey(userId), uri);
}

export async function removeProfileAvatar(userId: string) {
  await AsyncStorage.removeItem(avatarKey(userId));
}

export async function attachStoredAvatar<T extends { id: string; avatarUri?: string }>(profile: T): Promise<T> {
  if (profile.avatarUri) return profile;
  const avatarUri = await getProfileAvatar(profile.id);
  return avatarUri ? { ...profile, avatarUri } : profile;
}
