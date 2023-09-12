import ScrumPoker from "@/components/ScrumPoker";
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

interface PageProps {}

export default async function Page({}: PageProps) {
  const supabase = createServerComponentClient({ cookies });
  let profile = { name: null };

  const { data: roomData } = await supabase
    .from("scrum_rooms")
    .select("*")
    .eq("id", "02c67f16-2795-46c1-ae09-5dc6d4acccd1")
    .single();

  const {
    data: { session },
  } = await supabase.auth.getSession();
  if (!session) {
    return redirect("/login");
  } else {
    const { data } = await supabase
      .from("scrum_profiles")
      .select("*")
      .eq("id", session.user.id)
      .single();

    if (data && !data?.name) {
      return redirect("/profile");
    }
    profile = { ...data };
  }

  return (
    <ScrumPoker user={session.user} profile={profile} roomData={roomData} />
  );
}
