import { useState } from 'react';

export default function RegisterCow() {
  const [form, setForm] = useState({
    name: '',
    tagNumber: '',
    breed: '',
    ownerName: '',
    ownerContact: '',
  });
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  // 🗣️ Speech-to-text function
  const startSpeech = (field) => {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    recognition.lang = 'en-IN';
    recognition.start();
    recognition.onresult = (e) => {
      setForm({ ...form, [field]: e.results[0][0].transcript });
    };
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch('/api/cow', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (res.ok) {
        setMessage('✅ Cow registered successfully!');
      } else {
        setMessage('❌ ' + data.message);
      }
    } catch (err) {
      setMessage('❌ Error connecting to server');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center">
      <h1 className="text-2xl font-bold mb-4">Register Cow 🐄</h1>

      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 rounded-xl shadow-lg w-96 space-y-3"
      >
        {['name', 'tagNumber', 'breed', 'ownerName', 'ownerContact'].map((f) => (
          <div key={f} className="flex gap-2 items-center">
            <input
              type="text"
              name={f}
              placeholder={f.charAt(0).toUpperCase() + f.slice(1)}
              value={form[f]}
              onChange={handleChange}
              className="flex-1 border p-2 rounded"
            />
            <button
              type="button"
              onClick={() => startSpeech(f)}
              className="px-2 py-1 bg-green-500 text-white rounded"
            >
              🎙️
            </button>
          </div>
        ))}

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-green-700 text-white py-2 rounded mt-3"
        >
          {loading ? 'Saving...' : 'Register Cow'}
        </button>
      </form>

      {message && <p className="mt-4 text-lg">{message}</p>}
    </div>
  );
}
