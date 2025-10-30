  const mongoose = require('mongoose');

const patientSchema = new mongoose.Schema({
  patientId: {
    type: String,
    required: true,
    unique: true
  },
  name: {
    type: String,
    required: true
  },
  age: {
    type: Number,
    required: true
  },
  bloodGroup: {
    type: String,
    required: true
  },
  phone: {
    type: String,
    required: true
  },
  allergies: [String],
  conditions: [String],
  familyMembers: [{
    name: String,
    relationship: String,
    patientId: String
  }],
  assignedDoctor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Doctor'
  },
  emergencyContact: {
    name: String,
    phone: String,
    relationship: String
  }
}, { timestamps: true });

module.exports = mongoose.model('Patient', patientSchema);