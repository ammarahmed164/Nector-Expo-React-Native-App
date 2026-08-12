import { useState } from "react";
import { View, Text, TextInput, Pressable, Alert } from "react-native";
import { useRouter } from "expo-router";
import Header from "@/components/Header";
import Button from "@/components/Button";
import ProfileAvatar from "@/components/ProfileAvatar";
import ConfirmDialog from "@/components/ConfirmDialog";
import { useAuthStore } from "@/store/useAuthStore";
import { pickProfileImage } from "@/lib/pickImage";
import { removeProfileAvatar, saveStoredProfile, setProfileAvatar } from "@/lib/profileAvatarStorage";
import { syncUserToBackend } from "@/lib/syncUser";

export default function AccountDetails() {
  const router = useRouter();
  const { user, updateUser } = useAuthStore();
  const [name, setName] = useState(user?.name ?? "");
  const [email, setEmail] = useState(user?.email ?? "");
  const [phone, setPhone] = useState(user?.phone ?? "");
  const [avatarUri, setAvatarUri] = useState(user?.avatarUri ?? "");
  const [showRemoveDialog, setShowRemoveDialog] = useState(false);
  const [saving, setSaving] = useState(false);

  const changePhoto = async () => {
    const uri = await pickProfileImage();
    if (!uri || !user?.id) return;
    try {
      await setProfileAvatar(user.id, uri);
      setAvatarUri(uri);
      updateUser({ avatarUri: uri });
    } catch {
      Alert.alert("Photo not saved", "We could not save this photo. Please try another image.");
    }
  };

  const save = async () => {
    if (!user || saving) return;
    const patch = {
      name: name.trim(),
      email: email.trim().toLowerCase(),
      phone: phone.trim(),
      ...(avatarUri ? { avatarUri } : {}),
    };

    setSaving(true);
    try {
      const updatedUser = { ...user, ...patch };
      await saveStoredProfile(updatedUser);
      updateUser(patch);
      await syncUserToBackend(updatedUser);
      router.back();
    } catch {
      Alert.alert("Profile not saved", "Please try again. Your previous profile details are still safe.");
    } finally {
      setSaving(false);
    }
  };

  const removePhoto = () => setShowRemoveDialog(true);

  const confirmRemovePhoto = async () => {
    if (!user?.id) return;
    try {
      await removeProfileAvatar(user.id);
      setAvatarUri("");
      updateUser({ avatarUri: undefined });
      setShowRemoveDialog(false);
    } catch {
      Alert.alert("Photo not removed", "Please try again.");
    }
  };

  return (
    <View className="flex-1 bg-canvas pt-14 px-5">
      <Header title="My details" subtitle="Keep your profile up to date" />

      <View className="items-center my-6">
        <ProfileAvatar uri={avatarUri || undefined} size={112} iconSize={56} />
        <Pressable onPress={changePhoto} className="mt-3">
          <Text className="text-primary text-base font-medium">Change Photo</Text>
        </Pressable>
        {!!avatarUri && (
          <Pressable onPress={removePhoto} className="mt-2">
            <Text className="text-muted text-sm">Remove Photo</Text>
          </Pressable>
        )}
      </View>

      <Text className="text-dark font-medium mb-2 text-sm">Full name</Text>
      <TextInput value={name} onChangeText={setName} className="bg-white border border-line rounded-2xl px-4 h-14 mb-5 text-dark text-base" />

      <Text className="text-dark font-medium mb-2 text-sm">Email address</Text>
      <TextInput
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
        keyboardType="email-address"
        className="bg-white border border-line rounded-2xl px-4 h-14 mb-5 text-dark text-base"
      />

      <Text className="text-dark font-medium mb-2 text-sm">Mobile number</Text>
      <TextInput
        value={phone}
        onChangeText={setPhone}
        keyboardType="phone-pad"
        placeholder="+92 3XX XXXXXXX"
        className="bg-white border border-line rounded-2xl px-4 h-14 mb-8 text-dark text-base"
      />

      <Button
        title="Save changes"
        icon="checkmark-circle-outline"
        loading={saving}
        disabled={saving || !name.trim() || !email.trim()}
        onPress={save}
      />

      <ConfirmDialog
        visible={showRemoveDialog}
        title="Remove Photo"
        message="Remove your profile picture from your account?"
        confirmLabel="Remove"
        cancelLabel="Cancel"
        destructive
        onConfirm={confirmRemovePhoto}
        onCancel={() => setShowRemoveDialog(false)}
      />
    </View>
  );
}
