"use client";

import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { User, UserResponse } from "@supabase/supabase-js";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";

interface ProfileFormType {
  user: User;
  profile: { name: string | null };
}

export default function ProfileForm({ user, profile }: ProfileFormType) {
  const [name, setName] = useState(profile?.name || "");
  const router = useRouter();
  const supabase = createClientComponentClient();

  const handleUdateName = async () => {
    const { data, error } = await supabase
      .from("scrum_profiles")
      .update({ name: name.trim() })
      .eq("id", user?.id);
    if (error) {
      console.log(error);
    } else {
      router.push("/");
    }
  };

  return (
    <form
      onSubmit={(ev) => {
        ev.preventDefault()
        handleUdateName();
      }}
      className='flex flex-col min-w-[300px] max-w-[300px] h-fit bg-white mx-auto absolute top-1/3 -translate-y-1/2 left-1/2 -translate-x-1/2 p-6 gap-4 shadow border rounded-lg'>
      <h1 className='font-bold text-2xl'>Profile</h1>
      <input
        className='border rounded text-sm bg-stone-50 p-2 '
        name='text'
        minLength={1}
        placeholder="What's your name?"
        onChange={(e) => setName(e.target.value)}
        value={name}
      />

      <div className='flex flex-col gap-2 h-fit'>
        <button
          type='submit'
          className='bg-stone-950 text-stone-50 hover:bg-stone-800  rounded p-2 font-semibold'>
          Update name
        </button>
        {/* <button
          onClick={handleSignIn}
          className='border-2 border-stone-950 text-stone-950 hover:bg-stone-100 rounded p-2 font-semibold'>
          Sign in
        </button> */}

        <span className='text-sm text-stone-500 mt-2 text-center'>
          This name will be visible to other users.
        </span>
      </div>
      {/* <button onClick={handleSignOut}>Sign out</button> */}
    </form>
  );
}
