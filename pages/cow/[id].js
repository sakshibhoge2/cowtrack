import { useRouter } from "next/router";
import { useEffect, useState } from "react";

export default function CowProfile() {
  const router = useRouter();
  const { id } = router.query;

  const [cow, setCow] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!router.isReady || !id) return;

    async function fetchCow() {
      try {
        const res = await fetch(`/api/cow/${id}`);
        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }

        const data = await res.json();
        if (data.message === "Cow not found") {
          setError("Cow not found.");
        } else {
          setCow(data);
        }
      } catch (err) {
        console.error("Error fetching cow:", err);
        setError("Failed to load cow data. Please try again later.");
      } finally {
        setLoading(false);
      }
    }

    fetchCow();
  }, [router.isReady, id]);

  if (loading)
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-lg text-gray-600 animate-pulse">
          Loading cow data...
        </p>
      </div>
    );

  if (error)
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-red-600 text-lg font-semibold">{error}</p>
      </div>
    );

  if (!cow)
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-gray-500 text-lg">No cow data found.</p>
      </div>
    );

  return (
    <div className="max-w-3xl mx-auto mt-10 bg-white shadow-xl rounded-xl p-8">
      <h1 className="text-3xl font-bold mb-6 text-purple-700">
        🐄 {cow.name || "Unnamed Cow"}
      </h1>
      <div className="space-y-4 text-lg">
        <p>
          <strong>Tag Number:</strong> {cow.tagNumber || "N/A"}
        </p>
        <p>
          <strong>Breed:</strong> {cow.breed || "N/A"}
        </p>
        <p>
          <strong>Owner Name:</strong> {cow.ownerName || "N/A"}
        </p>
        <p>
          <strong>Owner Contact:</strong> {cow.ownerContact || "N/A"}
        </p>
        <p>
          <strong>Medical History:</strong> {cow.medicalHistory || "N/A"}
        </p>
        <p>
          <strong>Next Vaccination Date:</strong>{" "}
          {cow.nextVaccinationDate
            ? new Date(cow.nextVaccinationDate).toLocaleDateString()
            : "N/A"}
        </p>
      </div>

      {cow.qrCode && (
        <div className="mt-8 text-center">
          <h2 className="text-xl font-semibold mb-2 text-gray-700">
            QR Code
          </h2>
          <img
            src={cow.qrCode}
            alt="Cow QR Code"
            className="mx-auto w-48 h-48 border rounded-xl shadow-md"
          />
          <p className="text-gray-500 mt-2 text-sm">
            Scan this code to view this cow’s record directly.
          </p>
        </div>
      )}
    </div>
  );
}
