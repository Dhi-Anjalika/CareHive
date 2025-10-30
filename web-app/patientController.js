const Patient = require('../models/Patient');
const MedicalRecord = require('../models/MedicalRecord');
const Appointment = require('../models/Appointment');

// Get patient by ID
exports.getPatientById = async (req, res) => {
  try {
    const patient = await Patient.findOne({ patientId: req.params.patientId })
      .populate('assignedDoctor', 'name specialization');
    
    if (!patient) {
      return res.status(404).json({ message: 'Patient not found' });
    }

    // Get related data
    const [reports, appointments, notes, timeline] = await Promise.all([
      MedicalRecord.find({ patientId: req.params.patientId, type: 'report' }),
      Appointment.find({ patientId: req.params.patientId }).populate('doctorId', 'name'),
      MedicalRecord.find({ patientId: req.params.patientId, type: 'note' }),
      MedicalRecord.find({ patientId: req.params.patientId })
        .sort({ createdAt: -1 })
        .limit(10)
    ]);

    res.json({
      ...patient.toObject(),
      reports,
      appointments,
      notes,
      timeline: timeline.map(item => ({
        date: item.createdAt,
        text: `${item.type}: ${item.name}`
      }))
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Search patients
exports.searchPatients = async (req, res) => {
  try {
    const { query } = req.query;
    const patients = await Patient.find({
      $or: [
        { patientId: { $regex: query, $options: 'i' } },
        { name: { $regex: query, $options: 'i' } },
        { phone: { $regex: query, $options: 'i' } }
      ]
    }).select('patientId name age phone');

    res.json(patients);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Add doctor note
exports.addDoctorNote = async (req, res) => {
  try {
    const { patientId } = req.params;
    const { text } = req.body;

    const note = new MedicalRecord({
      patientId,
      type: 'note',
      name: 'Doctor Note',
      description: text,
      date: new Date(),
      uploadedBy: req.user.id
    });

    await note.save();
    res.status(201).json(note);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get patient trends
exports.getPatientTrends = async (req, res) => {
  try {
    // Mock trends data - you can replace with actual analytics
    const trends = [
      { date: '2025-09-01', compliance: 0.9 },
      { date: '2025-09-08', compliance: 0.8 },
      { date: '2025-09-15', compliance: 0.95 }
    ];
    
    res.json(trends);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};