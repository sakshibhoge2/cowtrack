import dbConnect from '../../../lib/mongodb';
import Cow from '../../../models/Cow';
import crypto from 'crypto';

export default async function handler(req, res) {
  await dbConnect();
  const { id } = req.query;

  try {
    const cow = await Cow.findById(id);
    if (!cow) return res.status(404).json({ message: 'Cow not found' });

    // 📄 GET single cow
    if (req.method === 'GET') {
      return res.status(200).json(cow);
    }

    // ✏️ PUT — Edit cow details (with passkey check)
    if (req.method === 'PUT') {
      const { passkey, ...updatedData } = req.body;

      if (!passkey) {
        return res.status(400).json({ message: 'Passkey required' });
      }

      // 🔐 Generate SHA-256 hash of entered passkey
      const hash = crypto.createHash('sha256').update(passkey).digest('hex');

      // ✅ Allow both old plain-text & new hashed passkeys
      const isValid = cow.passkey === passkey || cow.passkey === hash;

      if (!isValid) {
        return res.status(403).json({ message: 'Invalid passkey' });
      }

      Object.assign(cow, updatedData);
      await cow.save();

      return res.status(200).json({
        success: true,
        message: 'Cow updated successfully',
        cow,
      });
    }

    // 🗑️ DELETE — Remove cow (with passkey check)
    if (req.method === 'DELETE') {
      const { passkey } = req.body;

      if (!passkey) {
        return res.status(400).json({ message: 'Passkey required' });
      }

      const hash = crypto.createHash('sha256').update(passkey).digest('hex');
      const isValid = cow.passkey === passkey || cow.passkey === hash;

      if (!isValid) {
        return res.status(403).json({ message: 'Invalid passkey' });
      }

      await Cow.findByIdAndDelete(id);
      return res.status(200).json({ success: true, message: 'Cow deleted successfully' });
    }

    // ❌ Method not allowed
    res.status(405).json({ message: 'Method not allowed' });

  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message,
    });
  }
}
