import dbConnect from '../../../lib/mongodb';
import Cow from '../../../models/Cow';
import QRCode from 'qrcode';

export default async function handler(req, res) {
  await dbConnect();

  if (req.method === 'GET') {
    const cows = await Cow.find({});
    return res.status(200).json(cows);
  }

  if (req.method === 'POST') {
    try {
      const cowData = req.body;
      const newCow = await Cow.create(cowData);

      // ✅ QR links directly to cow's detail page
      const qrData = `https://cowtrack.onrender.com/cow/${newCow._id}`;




      const qrImage = await QRCode.toDataURL(qrData);

      newCow.qrCode = qrImage;
      await newCow.save();

      return res.status(201).json({
        success: true,
        message: 'Cow registered successfully with QR code',
        cow: newCow,
      });
    } catch (error) {
      console.error('QR Error:', error);
      return res.status(500).json({
        success: false,
        message: 'Error generating QR code',
        error: error.message,
      });
    }
  }

  res.status(405).json({ message: 'Method not allowed' });
}
