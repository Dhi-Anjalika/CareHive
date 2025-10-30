const mongoose = require('mongoose');

const appointmentSchema = new mongoose.Schema({
  patientId: {
    type: String,
    required: true
  },
  doctorId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Doctor',
    required: true
  },
  date: {
    type: Date,
    required: true
  },
  note: String,
  status: {
    type: String,
    enum: ['scheduled', 'completed', 'cancelled', 'upcoming', 'done'],
    default: 'scheduled'
  },
  type: {
    type: String,
    enum: ['checkup', 'follow-up', 'emergency', 'routine'],
    default: 'checkup'
  }
}, { timestamps: true });

module.exports = mongoose.model('Appointment', appointmentSchema);