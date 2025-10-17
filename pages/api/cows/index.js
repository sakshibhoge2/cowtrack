import dbConnect from '../../../lib/mongodb';
import Cow from '../../../models/Cow';
import bcrypt from 'bcryptjs';

export default async function handler(req, res){
  await dbConnect();
  if(req.method === 'POST'){
    try {
      const body = req.body;
      const pass = body.passkey || Math.random().toString(36).slice(2,8);
      const hash = bcrypt.hashSync(pass, 10);
      const cow = new Cow({ name: body.name, tagNumber: body.tagNumber, breed: body.breed, ownerName: body.ownerName, ownerContact: body.ownerContact, medicalHistory: body.medicalHistory, vaccinations: body.vaccinations || [], nextVaccinationDate: body.nextVaccinationDate || null, passkeyHash: hash, pregnancyRecords: body.pregnancyRecords || [], heatCycles: body.heatCycles || [] });
      await cow.save();
      return res.status(201).json({ _id: cow._id, _passkey: pass, ...cow.toObject() });
    } catch(err){ console.error(err); return res.status(500).json({ error: 'db error', detail: err.message }); }
  }
  res.status(405).json({ error: 'Method not allowed' });
}
