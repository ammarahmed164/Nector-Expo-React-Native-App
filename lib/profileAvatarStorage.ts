import AsyncStorage from "@react-native-async-storage/async-storage";

export type StoredProfile = {
  id: string;
  name?: string;
  email?: string;
  phone?: string;
  avatarUri?: string;
};

const profileKey = (userId: string) => `nectar-profile:${userId}`;
const legacyAvatarKey = (userId: string) => `nectar-avatar:${userId}`;

function withoutEmptyValues(profile: StoredProfile): StoredProfile {
  return Object.fromEntries(
    Object.entries(profile).filter(([, value]) => value !== undefined && value !== null)
  ) as StoredProfile;
}

/**
 * Profile data is deliberately stored separately from the authenticated session.
 * Logging out may clear the session, but it must never clear user-owned profile data.
 */
export async function getStoredProfile(userId: string): Promise<StoredProfile | undefined> {
  try {
    const [rawProfile, legacyAvatar] = await Promise.all([
      AsyncStorage.getItem(profileKey(userId)),
      AsyncStorage.getItem(legacyAvatarKey(userId)),
    ]);

    const stored = rawProfile ? (JSON.parse(rawProfile) as StoredProfile) : undefined;
    if (stored && stored.id === userId) {
      if (!stored.avatarUri && legacyAvatar) {
        const migrated = { ...stored, avatarUri: legacyAvatar };
        await saveStoredProfile(migrated);
        return migrated;
      }
      return stored;
    }

    if (legacyAvatar) {
      const migrated = { id: userId, avatarUri: legacyAvatar };
      await saveStoredProfile(migrated);
      return migrated;
    }
  } catch {
    // A malformed or unavailable local entry must not block sign-in.
  }

  return undefined;
}

export async function saveStoredProfile(profile: StoredProfile) {
  if (!profile.id) return;
  const current = await getStoredProfileWithoutMigration(profile.id);
  const merged = withoutEmptyValues({ ...current, ...profile, id: profile.id });
  await AsyncStorage.setItem(profileKey(profile.id), JSON.stringify(merged));
}

async function getStoredProfileWithoutMigration(userId: string): Promise<StoredProfile | undefined> {
  const raw = await AsyncStorage.getItem(profileKey(userId));
  if (!raw) return undefined;
  try {
    const stored = JSON.parse(raw) as StoredProfile;
    return stored.id === userId ? stored : undefined;
  } catch {
    return undefined;
  }
}

export async function getProfileAvatar(userId: string): Promise<string | undefined> {
  const profile = await getStoredProfile(userId);
  return profile?.avatarUri;
}

export async function setProfileAvatar(userId: string, uri: string) {
  await Promise.all([
    saveStoredProfile({ id: userId, avatarUri: uri }),
    AsyncStorage.setItem(legacyAvatarKey(userId), uri),
  ]);
}

export async function removeProfileAvatar(userId: string) {
  const current = await getStoredProfileWithoutMigration(userId);
  if (current) {
    const { avatarUri: _removed, ...withoutAvatar } = current;
    await AsyncStorage.setItem(profileKey(userId), JSON.stringify(withoutAvatar));
  }
  await AsyncStorage.removeItem(legacyAvatarKey(userId));
}

export async function attachStoredProfile<T extends StoredProfile>(profile: T): Promise<T> {
  const stored = await getStoredProfile(profile.id);
  if (!stored) return profile;

  return {
    ...profile,
    ...stored,
    id: profile.id,
    email: stored.email || profile.email,
    name: stored.name || profile.name,
    phone: stored.phone !== undefined ? stored.phone : profile.phone,
    avatarUri: stored.avatarUri !== undefined ? stored.avatarUri : profile.avatarUri,
  } as T;
}

/** Backwards-compatible alias for older callers. */
export const attachStoredAvatar = attachStoredProfile;
