import { useState } from "react";
import { View, Text, TextInput, Pressable } from "react-native";
import { useRouter } from "expo-router";
import Header from "@/components/Header";
import Button from "@/components/Button";
import ProfileAvatar from "@/components/ProfileAvatar";
import ConfirmDialog from "@/components/ConfirmDialog";
import { useAuthStore } from "@/store/useAuthStore";
import { pickProfileImage } from "@/lib/pickImage";
import { setProfileAvatar, removeProfileAvatar } from "@/lib/profileAvatarStorage";
import { syncUserToBackend } from "@/lib/syncUser";

export default function AccountDetails() {
  const router = useRouter();
  const { user, updateUser } = useAuthStore();
  const [name, setName] = useState(user?.name ?? "");
  const [email, setEmail] = useState(user?.email ?? "");
  const [phone, setPhone] = useState(user?.phone ?? "");
  const [avatarUri, setAvatarUri] = useState(user?.avatarUri ?? "");
  const [showRemoveDialog, setShowRemoveDialog] = useState(false);

  const changePhoto = async () => {
    const uri = await pickProfileImage();
    if (!uri || !user?.id) return;
    setAvatarUri(uri);
    await setProfileAvatar(user.id, uri);
    updateUser({ avatarUri: uri });
  };

  const save = async () => {
    const patch = {
      name: name.trim(),
      email: email.trim().toLowerCase(),
      phone: phone.trim(),
      avatarUri: avatarUri || undefined,
    };
    if (user?.id) {
      if (avatarUri) await setProfileAvatar(user.id, avatarUri);
      else await removeProfileAvatar(user.id);
    }
    updateUser(patch);
    if (user) await syncUserToBackend({ ...user, ...patch, avatarUri: avatarUri || undefined });
    router.back();
  };

  const removePhoto = () => setShowRemoveDialog(true);

  const confirmRemovePhoto = async () => {
    setAvatarUri("");
    if (user?.id) await removeProfileAvatar(user.id);
    updateUser({ avatarUri: undefined });
    setShowRemoveDialog(false);
  };

  return (
    <View className="flex-1 bg-white pt-14 px-5">
      <Header title="Account & Settings" />

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

      <Text className="text-muted mb-1">First Name</Text>
      <TextInput value={name} onChangeText={setName} className="border-b border-line pb-2 mb-6 text-dark text-base" />

      <Text className="text-muted mb-1">Email</Text>
      <TextInput
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
        keyboardType="email-address"
        className="border-b border-line pb-2 mb-6 text-dark text-base"
      />

      <Text className="text-muted mb-1">Mobile Number</Text>
      <TextInput
        value={phone}
        onChangeText={setPhone}
        keyboardType="phone-pad"
        placeholder="+92 3XX XXXXXXX"
        className="border-b border-line pb-2 mb-8 text-dark text-base"
      />

      <Button title="Update" onPress={save} />

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
