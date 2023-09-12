import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { redirect} from "next/navigation";
import { cookies } from "next/headers";
import LoginForm from "@/components/LoginForm";

export default async function Login() {
  const supabase = createServerComponentClient({ cookies });
  const {data: {session}} = await supabase.auth.getSession();
  if (!!session) {
    return redirect("/");
  }

  return <LoginForm />;
}
