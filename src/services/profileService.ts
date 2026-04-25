import { supabase } from "@/integrations/supabase/client";

export type Profile = {
  id: string;
  display_name: string;
  avatar_url: string | null;
  bio: string | null;
  level: number;
  xp: number;
};

export const profileService = {
  async get(userId: string): Promise<Profile | null> {
    const { data, error } = await supabase
      .from("profiles")
      .select("id,display_name,avatar_url,bio,level,xp")
      .eq("id", userId)
      .maybeSingle();
    if (error) throw error;
    return data;
  },

  async update(userId: string, patch: Partial<Omit<Profile, "id">>) {
    const { data, error } = await supabase
      .from("profiles")
      .update(patch)
      .eq("id", userId)
      .select()
      .single();
    if (error) throw error;
    return data;
  },

  async addXp(userId: string, xp: number) {
    const current = await this.get(userId);
    if (!current) return null;
    const nextXp = current.xp + xp;
    const nextLevel = Math.max(1, Math.floor(nextXp / 100) + 1);
    return this.update(userId, { xp: nextXp, level: nextLevel });
  },
};
