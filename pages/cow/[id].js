import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';

export default function CowProfile() {
  const router = useRouter();
  const { id } = router.query;
  const [cow, setCow] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    async function fetchCow() {
      try {
        const res = await fetch(`/api/cow/${id}`);
        const data = await res.json();
        setCow(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    fetchCow();
  }, [id]);

  if (loading) return <p className="text-center mt-10 text-lg">Loading cow data...</p>;
  if (!cow) return <p className="text-center mt-10 text-red-500">Cow not found.</p>;

  return (
    <div className="max-w-3xl mx-auto mt-10 bg-white shadow-xl rounded-xl p-8">
      <h1 className="text-3xl font-bold mb-6 text-purple-700">🐄 {cow.name}</h1>
      <div className="space-y-4 text-lg">
        <p><strong>Tag Number:</strong> {cow.tagNumber}</p>
        <p><strong>Breed:</strong> {cow.breed}</p>
        <p><strong>Owner Name:</strong> {cow.ownerName}</p>
        <p><strong>Owner Contact:</strong> {cow.ownerContact}</p>
        <p><strong>Medical History:</strong> {cow.medicalHistory}</p>
        <p><strong>Next Vaccination Date:</strong> {cow.nextVaccinationDate ? new Date(cow.nextVaccinationDate).toLocaleDateString() : 'N/A'}</p>
      </div>
      {cow.qrCode && (
        <div className="mt-8 text-center">
          <h2 className="text-xl font-semibold mb-2 text-gray-700">QR Code</h2>
          <img src={cow.qrCode} alt="Cow QR Code" className="mx-auto w-48 h-48" />
        </div>
      )}
    </div>
  );
}
