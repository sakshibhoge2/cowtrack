import { useEffect, useState } from "react";

export default function CowList() {
  const [cows, setCows] = useState([]);

  useEffect(() => {
    fetch("/api/cow")
      .then((res) => res.json())
      .then((data) => setCows(data))
      .catch(console.error);
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <h1 className="text-3xl font-bold text-center mb-6">
        Registered Cows 🐄
      </h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {cows.map((cow) => (
          <div
            key={cow._id}
            className="bg-white rounded-xl shadow-md p-4 text-center"
          >
            <h2 className="text-lg font-semibold">{cow.name}</h2>
            <p className="text-gray-600">Tag: {cow.tagNumber}</p>
            <p className="text-gray-600">Owner: {cow.ownerName}</p>

            {cow.qrCode ? (
              <img
                src={cow.qrCode}
                alt="QR Code"
                className="mx-auto mt-4 w-32 h-32 border"
              />
            ) : (
              <p className="text-sm text-red-500 mt-2">No QR generated</p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
