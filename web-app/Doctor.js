const mongoose = require('mongoose');

const doctorSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  specialization: String,
  licenseNumber: String,
  assignedPatients: [{
    type: String // patientId
  }],
  schedule: [{
    day: String,
    slots: [String]
  }]
}, { timestamps: true });

module.exports = mongoose.model('Doctor', doctorSchema);