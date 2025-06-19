import { useState } from "react";

export default function SearchBar({ onSearch }) {
  const [value, setValue] = useState('');
  const [key, setKey] = useState('');


  const searchHandling = () => {
    onSearch([key, value]);
  };

  const onKeyPress = (e) => {
    if (e.key === 'Enter') {
      searchHandling();
    }
  };

  return (
    <div className="flex justify-around">
      <input
        className="w-[80%] border px-2 py-1 rounded"
        type="text"
        value={value}
        onChange={(e) => {
          const {name, value} = e.target
          setValue(value)
          setKey('name')
        }}
        onKeyDown={onKeyPress}
        placeholder="Nhập từ khóa tìm kiếm..."
      />
      <button
        className="w-[20%] bg-blue-600 text-white rounded"
        type="button"
        onClick={searchHandling}
      >
        Tìm
      </button>
    </div>
  );
}
