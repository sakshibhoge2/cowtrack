import dbConnect from '../../../lib/mongodb';
import Cow from '../../../models/Cow';

export default async function handler(req, res) {
  await dbConnect();
  const { id } = req.query;

  try {
    const cow = await Cow.findById(id);
    if (!cow) return res.status(404).json({ message: 'Cow not found' });
    res.status(200).json(cow);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
}
