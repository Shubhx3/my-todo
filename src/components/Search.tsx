

export const Search = () => {
  return (
    <div className="relative z-10">
      <input
        type="text"
        placeholder="Search todos..."
        className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
    </div>
  );
}