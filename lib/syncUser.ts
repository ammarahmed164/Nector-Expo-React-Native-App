import { API_URL } from "@/lib/api";
import type { User } from "@/store/useAuthStore";

export async function syncUserToBackend(user: NonNullable<User>) {
  try {
    await fetch(`${API_URL}/app/users/sync`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        id: user.id,
        name: user.name,
        email: user.email,
        phone: user.phone,
      }),
    });
  } catch {
    // offline — local app still works
  }
}
