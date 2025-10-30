const Patient = require('../models/Patient');
const Appointment = require('../models/Appointment');

// Get assigned patients
exports.getAssignedPatients = async (req, res) => {
  try {
    const doctor = await Doctor.findOne({ userId: req.user.id });
    const patients = await Patient.find({
      patientId: { $in: doctor.assignedPatients }
    });

    res.json(patients);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get doctor dashboard
exports.getDoctorDashboard = async (req, res) => {
  try {
    const doctor = await Doctor.findOne({ userId: req.user.id })
      .populate('userId', 'name');
    
    const today = new Date();
    const upcomingAppointments = await Appointment.find({
      doctorId: doctor._id,
      date: { $gte: today },
      status: { $in: ['scheduled', 'upcoming'] }
    }).populate('patientId', 'name age')
      .sort({ date: 1 })
      .limit(5);

    const patientCount = doctor.assignedPatients.length;

    res.json({
      doctor: doctor.userId.name,
      upcomingAppointments,
      patientCount,
      specialization: doctor.specialization
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};