const mongoose = require('mongoose');

const medicalRecordSchema = new mongoose.Schema({
  patientId: {
    type: String,
    required: true
  },
  type: {
    type: String,
    enum: ['report', 'prescription', 'note', 'lab_result'],
    required: true
  },
  name: {
    type: String,
    required: true
  },
  date: {
    type: Date,
    required: true
  },
  fileUrl: String,
  description: String,
  doctorNotes: String,
  uploadedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  tags: [String]
}, { timestamps: true });

module.exports = mongoose.model('MedicalRecord', medicalRecordSchema);