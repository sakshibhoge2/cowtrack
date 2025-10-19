import mongoose from 'mongoose';

const CowSchema = new mongoose.Schema({
  name: { type: String, required: true },
  tagNumber: { type: String, required: true, unique: true },
  breed: { type: String },
  ownerName: { type: String },
  ownerContact: { type: String },
  medicalHistory: { type: String },
  vaccinations: [{ name: String, date: Date }],
  nextVaccinationDate: { type: Date },
  passkeyHash: { type: String },
  pregnancyRecords: [{ startDate: Date, expectedCalvingDate: Date, notes: String }],
  heatCycles: [{ date: Date, notes: String }],
  qrCode: { type: String }, // 🆕 Add this field
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.models.Cow || mongoose.model('Cow', CowSchema);
