import dbConnect from '../../../../../lib/mongodb';
import Cow from '../../../../../models/Cow';
import bcrypt from 'bcryptjs';
export default async function handler(req, res){
  await dbConnect();
  const { id } = req.query;
  if(req.method === 'POST'){
    const { passkey } = req.body;
    const cow = await Cow.findById(id);
    if(!cow) return res.status(404).json({ ok:false });
    const ok = bcrypt.compareSync(passkey, cow.passkeyHash || '');
    return res.status(200).json({ ok });
  }
  res.status(405).json({ error: 'Method not allowed' });
}
