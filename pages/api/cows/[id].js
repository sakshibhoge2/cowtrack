import dbConnect from '../../../lib/mongodb';
import Cow from '../../../models/Cow';
export default async function handler(req, res){
  await dbConnect();
  const { id } = req.query;
  if(req.method === 'GET'){
    const cow = await Cow.findById(id).lean();
    if(!cow) return res.status(404).json({ error: 'Not found' });
    return res.status(200).json(cow);
  } else if(req.method === 'PUT'){
    try { const body = req.body; const updated = await Cow.findByIdAndUpdate(id, body, { new: true }); return res.status(200).json({ ok:true, cow: updated }); } catch(err){ console.error(err); return res.status(500).json({ ok:false, error: err.message }); }
  }
  res.status(405).json({ error: 'Method not allowed' });
}
