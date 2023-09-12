"use client";
import CardComponent from "@/components/CardComponent";
import ResultRow from "@/components/ResultRow";
import Image from "next/image";
import { faker } from "@faker-js/faker";
import { useState, useEffect } from "react";
import {
  PiEye,
  PiEyeSlash,
  PiTrashBold,
  PiSkull,
  PiRocketLaunch,
} from "react-icons/pi";
import PopUpModal from "@/components/PopUpModal";
import {
  User,
  createClientComponentClient,
} from "@supabase/auth-helpers-nextjs";

export enum ValueIcons {
  SKULL = "SKULL",
  ROCKET = "ROCKET",
}

const options = [
  { value: ValueIcons.SKULL },
  { value: ValueIcons.ROCKET },
  { value: 0.5 },
  { value: 1 },
  { value: 2 },
  { value: 3 },
  { value: 5 },
  { value: 8 },
  { value: 13 },
  { value: 20 },
  { value: 40 },
  { value: 100 },
];

interface ScrumPokerProps {
  user: User;
  profile: { name: string | null };
  roomData: { id: string };
}

export default function ScrumPoker({
  user,
  profile,
  roomData,
}: ScrumPokerProps) {
  const [selectedValue, setSelectedValue] = useState<string | null>(null);
  const [showValues, setShowValues] = useState(false);
  const [players, setPlayers] = useState<any[]>([]);
  console.log("🚀 ~ file: ScrumPoker.tsx:54 ~ players:", players);
  const supabase = createClientComponentClient();

  async function handleSubmitSelectedValue() {
    const isValidValue = selectedValue ?? false;
    if (isValidValue) {
      const { data } = await supabase
        .from("scrum_users")
        .update({ name: profile.name, vote: selectedValue })
        .eq("user_id", user.id);
    }
  }

  function calculateAverage() {
    const validNumbers = players.filter(
      (player: { vote: string }) => !isNaN(Number(player.vote))
    );

    const average =
      (validNumbers.reduce(
        (acc: number, player: { vote: string }) => acc + Number(player.vote),
        0
      ) || 0) / validNumbers.length;

    if (isNaN(average) || !showValues) {
      return 0;
    }
    return average.toFixed(1) || 0;
  }

  function calculateTotal() {
    const validNumbers = players.filter(
      (item: { value: any }) => !isNaN(Number(item.vote))
    );

    const sum =
      validNumbers.reduce(
        (acc: number, item: { value: any }) => acc + Number(item.vote),
        0
      ) || 0;

    if (isNaN(sum) || !showValues) {
      return 0;
    }
    return sum.toFixed(1) || 0;
  }

  useEffect(() => {
    const channel = supabase
      .channel("scrum users data")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "scrum_users",
        },
        async (payload) => {
          const { data: socreData, error } = await supabase
            .from("scrum_users")
            .select("*")
            .eq("room_id", roomData.id)
            .order("name", { ascending: true });
          if (error) {
            console.log(error);
            return;
          }
          setPlayers(socreData);
        }
      )
      .subscribe();
    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  return (
    <main className='flex flex-col lg:flex-row min-h-screen max-w-[1440px] mx-auto  justify-start p-6 lg:px-24 lg:py-12 gap-8'>
      <div className='w-full flex flex-1 flex-col items-start gap-4'>
        <div className='flex flex-col w-full justify-between items-baseline gap-2'>
          <div className='text-4xl h-fit max-h-fit font-semibold'>
            Story points
          </div>
          <div className='flex-col'>
            <div className='text-stone-400 text-sm'>
              Pontuando como: {profile.name}
            </div>
          </div>
        </div>
        <div className=' flex flex-wrap w-full gap-4 justify-start'>
          {options.map((option, index) => (
            <CardComponent
              key={index}
              value={option.value.toString()}
              isSelected={selectedValue == option.value.toString()}
              onClick={() => {
                setSelectedValue(option.value.toString());
                console.log(selectedValue);
              }}
            />
          ))}
        </div>
        <div className='flex justify-start w-full gap-2'>
          <button
            type='button'
            onClick={() => {
              {
                handleSubmitSelectedValue();
              }
            }}
            className='px-4 py-2 text-stone-50 bg-stone-950  font-semibold rounded hover:text-white hover:bg-stone-800 transition-colors'>
            Submit points
          </button>
        </div>
      </div>
      <div className='w-full flex flex-1 flex-col bg-stone-50 rounded-lg p-4 select-none h-fit'>
        <div className='flex justify-between'>
          <div className='text-2xl font-semibold '>Pontuação</div>
          <div className='flex gap-2'>
            <button
              type='button'
              onClick={() => {
                {
                  setShowValues(false);
                  // setPlayers(generateUsers());
                }
              }}
              className='px-4 py-2 bg-transparent text-red-600 font-semibold rounded hover:text-white hover:bg-red-600 transition-colors text-xl'>
              <PiTrashBold />
            </button>
            <button
              type='button'
              onClick={() => setShowValues((old: any) => !old)}
              className='px-4 py-2 bg-stone-900 text-xl text-white rounded hover:bg-stone-800 transition-colors duration-[25ms]'>
              {showValues ? <PiEye /> : <PiEyeSlash />}
            </button>
          </div>
        </div>
        <div className='flex flex-col w-full'>
          <div className='flex uppercase text-sm items-center justify-between w-full bg-stone-950 text-stone-50 rounded  mt-2 mb-1  '>
            <div className='flex w-64 text-left pl-4 truncate py-2 px-4 font-semibold'>
              Nome
            </div>
            <div className='flex justify-end pr-4 truncate py-2 px-4 font-semibold'>
              Story points
            </div>
          </div>
          {/* Users selections */}
          {!!players && !!players.length ? (
            [
              ...players.map(
                (user: { name: string; vote: string }, index: any) => (
                  <ResultRow
                    name={user.name}
                    value={user.vote}
                    showValue={showValues}
                    key={index}
                  />
                )
              ),
              ...players.map(
                (user: { name: string; vote: string }, index: any) => (
                  <ResultRow
                    name={user.name}
                    value={user.vote}
                    showValue={showValues}
                    key={index}
                  />
                )
              ),
              ...players.map(
                (user: { name: string; vote: string }, index: any) => (
                  <ResultRow
                    name={user.name}
                    value={user.vote}
                    showValue={showValues}
                    key={index}
                  />
                )
              ),
            ]
          ) : (
            <div className='truncate py-2 text-center text-stone-600'>
              Parace que não temos nada por aqui!
            </div>
          )}
          <div className='flex items-center justify-between w-full border-t-2 border-stone-950 mt-1  '>
            <div className='flex w-64 text-left pl-4 truncate py-2 px-4 font-semibold'>
              Média: {calculateAverage()}
            </div>
            <div className='flex justify-end pr-4 truncate py-2 px-4 font-semibold'>
              Soma: {calculateTotal()}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
