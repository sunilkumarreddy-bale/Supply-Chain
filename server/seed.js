import 'dotenv/config';import mongoose from 'mongoose';import bcrypt from 'bcryptjs';import {User} from './models.js';
if(!process.env.SEED_ADMIN_PASSWORD||process.env.SEED_ADMIN_PASSWORD.length<10)throw Error('Set SEED_ADMIN_PASSWORD (at least 10 characters)');
await mongoose.connect(process.env.MONGO_URI||'mongodb://127.0.0.1:27017/scm');
await User.updateOne({email:'admin@scm.local'},{$setOnInsert:{name:'SCM Administrator',email:'admin@scm.local',role:'admin',passwordHash:await bcrypt.hash(process.env.SEED_ADMIN_PASSWORD,12)}},{upsert:true});
console.log('Administrator seeded: admin@scm.local');await mongoose.disconnect();
