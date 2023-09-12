import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import LoginForm from "@/components/LoginForm";
import ProfileForm from "@/components/ProfileForm";
import { data } from "autoprefixer";

export default async function Profile() {
  const supabase = createServerComponentClient({ cookies });
  let profile = null;
  const {
    data: { session },
  } = await supabase.auth.getSession();
  if (!session) {
    return redirect("/login");
  } else {
    const { data, error } = await supabase
      .from("scrum_profiles")
      .select("*")
      .eq("id", session.user.id)
      .single();

    profile = { ...data };
  }

  return <ProfileForm user={session.user} profile={profile} />;
}
