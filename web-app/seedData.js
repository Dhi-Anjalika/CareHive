 const mongoose = require('mongoose');
const User = require('../models/User');
const Patient = require('../models/Patient');
const MedicalRecord = require('../models/MedicalRecord');
const Appointment = require('../models/Appointment');
require('dotenv').config();

const seedData = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB for seeding...');

    // Clear existing data - FIXED: using {} instead of {{}}
    await User.deleteMany({});
    await Patient.deleteMany({});
    await MedicalRecord.deleteMany({});
    await Appointment.deleteMany({});

    console.log('🗑️  Cleared existing data...');

    // Create doctor
    const doctor = await User.create({
      name: 'Dr. Smith',
      email: 'dr.smith@hospital.com',
      password: 'password123',
      role: 'doctor',
      specialization: 'General Physician',
      phone: '+94 77 123 4567'
    });

    // Create patient (matching your frontend mock data)
    const patient = await Patient.create({
      patientId: 'P001',
      name: 'Janaka Perera',
      age: 72,
      bloodGroup: 'O+',
      phone: '+94 77 123 4567',
      allergies: ['Penicillin'],
      conditions: ['Hypertension', 'Type 2 Diabetes'],
      assignedDoctor: doctor._id
    });

    // Create medical records
    await MedicalRecord.create([
      {
        patientId: 'P001',
        type: 'report',
        name: 'Blood Test.pdf',
        date: new Date('2025-09-01'),
        description: 'Blood test results',
        uploadedBy: doctor._id
      },
      {
        patientId: 'P001',
        type: 'report',
        name: 'Chest X-Ray.png',
        date: new Date('2025-09-10'),
        description: 'Chest X-Ray image',
        uploadedBy: doctor._id
      },
      {
        patientId: 'P001',
        type: 'note',
        name: 'Doctor Note',
        date: new Date(),
        description: 'Continue current BP medication',
        uploadedBy: doctor._id
      }
    ]);

    // Create appointments
    await Appointment.create([
      {
        patientId: 'P001',
        doctorId: doctor._id,
        date: new Date('2025-10-03'),
        note: 'Follow-up',
        status: 'upcoming'
      },
      {
        patientId: 'P001',
        doctorId: doctor._id,
        date: new Date('2025-09-10'),
        note: 'BP review',
        status: 'done'
      }
    ]);

    console.log('✅ Seed data created successfully!');
    console.log('\n🔑 Login Credentials:');
    console.log('   Email: dr.smith@hospital.com');
    console.log('   Password: password123');
    console.log('\n📋 Sample Patient ID: P001');
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding data:', error);
    process.exit(1);
  }
};

seedData();