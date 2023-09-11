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

export default function Home() {
  const [selectedValue, setSelectedValue] = useState<string | null>(null);
  const [showValues, setShowValues] = useState(false);
  const [users, setUsers] = useState<any[]>([]);

  function generateUsers() {
    const fakeUsers = [
      {
        name: faker.person.firstName(),
        value: faker.number.int({ max: 100, min: 0 }).toString(),
      },
      {
        name: faker.person.firstName(),
        value: "SKULL",
      },
      {
        name: faker.person.firstName(),
        value: faker.number.int({ max: 100, min: 0 }).toString(),
      },
    
    ];
    return [...fakeUsers];
  }

  function handleSubmitSelectedValue() {
    const isValidValue = selectedValue ?? false;
    if (isValidValue) {
      alert("Selected value: " + selectedValue);
    }
  }

  function calculateAverage() {
    const validNumbers = users.filter((item) => !isNaN(Number(item.value)));

    const average =
      (validNumbers.reduce((acc, val) => acc + Number(val.value), 0) || 0) /
      validNumbers.length;

    if (isNaN(average) || !showValues) {
      return 0;
    }
    return average.toFixed(1) || 0;
  }

  function calculateTotal() {
    const validNumbers = users.filter((item) => !isNaN(Number(item.value)));
    console.log(
      "🚀 ~ file: page.tsx:125 ~ calculateTotal ~ validNumbers:",
      validNumbers
    );
    const sum =
      validNumbers.reduce((acc, item) => acc + Number(item.value), 0) || 0;

    if (isNaN(sum) || !showValues) {
      return 0;
    }
    return sum.toFixed(1) || 0;
  }

  return (
    <main className='flex flex-col lg:flex-row min-h-screen max-w-[1440px] mx-auto  justify-start p-6 lg:px-24 lg:py-12 gap-8'>
      <div className='w-full flex flex-1 flex-col items-start gap-4'>
        <div className='flex flex-col w-full justify-between items-baseline gap-2'>
          <div className='text-4xl h-fit max-h-fit font-semibold'>
            Story points
          </div>
          <div className='flex-col'>
            <div className='text-stone-400 text-sm'>Pontuando como: Luca</div>
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
                  setUsers(generateUsers());
                }
              }}
              className='px-4 py-2 bg-transparent text-red-600 font-semibold rounded hover:text-white hover:bg-red-600 transition-colors text-xl'>
              <PiTrashBold />
            </button>
            <button
              type='button'
              onClick={() => setShowValues((old) => !old)}
              className='px-4 py-2 bg-stone-900 text-xl text-white rounded hover:bg-stone-800 transition-colors duration-[25ms]'>
              {showValues ? <PiEye /> : <PiEyeSlash />}
            </button>
          </div>
        </div>
        <div className='flex flex-col w-full mt-2 '>
          <div className='flex items-center justify-between w-full bg-stone-950 text-stone-50 rounded '>
            <div className='flex w-64 text-left pl-4 truncate py-2 px-4 font-semibold'>
              Nome
            </div>
            <div className='flex justify-end pr-4 truncate py-2 px-4 font-semibold'>
              Story points
            </div>
          </div>
          {/* Users selections */}
          {!!users && !!users.length ? (
            users.map((user, index) => (
              <ResultRow
                name={user.name}
                value={user.value}
                showValue={showValues}
                key={index}
              />
            ))
          ) : (
            <div className='truncate py-4 text-center text-stone-600'>
              Estranho... Parace que não temos nada por aqui!
            </div>
          )}
          <div className='flex items-center justify-between w-full border-t-2 border-stone-950  '>
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
