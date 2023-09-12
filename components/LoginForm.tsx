"use client";

import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";

export default function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();
  const searchParams = useSearchParams();
  const supabase = createClientComponentClient();

  const handleSignUp = async () => {
    const targetRoomId = searchParams.get("redirect");
    console.log(
      "🚀 ~ file: LoginForm.tsx:25 ~ handleSignUp ~ location.origin:",
      location.origin
    );
    await supabase.auth
      .signUp({
        email,
        password,
        options: {
          emailRedirectTo: targetRoomId
            ? `${location.origin}/room/${targetRoomId}`
            : location.origin,
        },
      })
      .then(async (response) => {
        if (response.error) {
          if (response.error.message.includes("already registered")) {
            await handleSignIn();
          } else {
            alert(response.error.message);
          }
        }
        if (targetRoomId) {
          router.push(`/room/${targetRoomId}`);
        } else {
          router.push(`/`);
        }
      })
      .catch((error) => {
        console.log("🚀 ~ file: LoginForm.tsx:34 ~ handleSignUp ~ error:");
      });
  };

  const handleSignIn = async () => {
    const targetRoomId = searchParams.get("redirect");
    await supabase.auth
      .signInWithPassword({
        email,
        password,
      })
      .then((response) => {
        if (response.error) {
          alert(response.error.message);
          return;
        }
        if (targetRoomId) {
          router.push(`/room/${targetRoomId}`);
        } else {
          router.push("/");
        }
      })
      .catch((error) => {
        alert(error);
      });
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.refresh();
  };

  return (
    <div className='flex flex-col min-w-[300px] max-w-[300px] h-fit bg-white mx-auto absolute top-1/3 -translate-y-1/2 left-1/2 -translate-x-1/2 p-6 gap-4 shadow border rounded-lg'>
      <h1 className='font-bold text-2xl'>Let{`'`}s SCRUM!</h1>
      <input
        className='border rounded text-sm bg-stone-50 p-2 '
        name='email'
        onChange={(e) => setEmail(e.target.value)}
        value={email}
      />
      <input
        className='border rounded text-sm bg-stone-50 p-2 '
        type='password'
        name='password'
        onChange={(e) => setPassword(e.target.value)}
        minLength={8}
        maxLength={40}
        value={password}
      />
      <div className='flex flex-col gap-2 h-fit'>
        <button
          onClick={() => {
            handleSignUp();
          }}
          className='bg-stone-950 text-stone-50 hover:bg-stone-800  rounded p-2 font-semibold'>
          Access
        </button>
        {/* <button
          onClick={handleSignIn}
          className='border-2 border-stone-950 text-stone-950 hover:bg-stone-100 rounded p-2 font-semibold'>
          Sign in
        </button> */}

        <span className='text-sm text-stone-500 mt-2 text-center'>
          Don{"'"}t have an account? we will create one for you!
        </span>
      </div>
      {/* <button onClick={handleSignOut}>Sign out</button> */}
    </div>
  );
}
