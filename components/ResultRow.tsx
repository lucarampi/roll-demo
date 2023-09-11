interface ResultRowProps {
  name: string;
  value: string;
  showValue: boolean;
}

export default function ResultRow({
  name,
  value,
  showValue = false,
}: ResultRowProps) {
  return (
    <div
      className={`flex items-center justify-between w-full transition-colors rounded  ${
        showValue ? "hover:bg-stone-200 " : ""
      }`}>
      <div className='flex w-64 text-left pl-4 truncate py-2'>{name}</div>
      {showValue ? (
        <div className='flex flex-1 justify-end pr-4 truncate py-2 '>
          {value}
        </div>
      ) : (
        <div className='flex flex-1 justify-end pr-4 truncate py-2 blur-[4px] '>
          {Math.floor(Math.random() * 100)}
        </div>
      )}
    </div>
  );
}
