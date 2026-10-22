import mongoose from 'mongoose';
import {z} from 'zod';
import {analyzeJourney,descendants,STAGES} from './dna-rules.js';
const {Schema,model}=mongoose;
const eventSchema=new Schema({batch:{type:String,required:true,index:true},stage:{type:String,enum:STAGES,required:true},organization:{type:String,required:true},location:String,timestamp:{type:Date,required:true},quantity:{type:Number,min:0},recordedBy:{type:Schema.Types.ObjectId,ref:'User',required:true}}, {timestamps:true});
const lineageSchema=new Schema({parentBatch:{type:String,required:true,index:true},childBatch:{type:String,required:true,index:true},recordedBy:{type:Schema.Types.ObjectId,ref:'User',required:true}}, {timestamps:true});
lineageSchema.index({parentBatch:1,childBatch:1},{unique:true});
const Event=mongoose.models.DnaEvent||model('DnaEvent',eventSchema);
const Lineage=mongoose.models.DnaLineage||model('DnaLineage',lineageSchema);
const eventInput=z.object({batch:z.string().min(2).max(100),stage:z.enum(STAGES),organization:z.string().min(2),location:z.string().optional(),timestamp:z.string().datetime({offset:true}),quantity:z.number().nonnegative().optional()});
const lineageInput=z.object({parentBatch:z.string().min(2).max(100),childBatch:z.string().min(2).max(100)});
const safe=fn=>(req,res,next)=>Promise.resolve(fn(req,res,next)).catch(next);
export function registerDna(app){
 const canWrite=(req,res,next)=>['admin','manager','staff'].includes(req.user.role)?next():res.status(403).json({error:'Not authorized'});
 app.post('/api/dna/events',canWrite,safe(async(req,res)=>{const data=eventInput.parse(req.body);const result=await Event.create({...data,timestamp:new Date(data.timestamp),recordedBy:req.user._id});res.status(201).json(result)}));
 app.get('/api/dna/journey/:batch',safe(async(req,res)=>{const events=await Event.find({batch:req.params.batch}).sort({timestamp:1}).lean();res.json({batch:req.params.batch,events,analysis:analyzeJourney(events)})}));
 app.post('/api/dna/lineage',canWrite,safe(async(req,res)=>{const data=lineageInput.parse(req.body);if(data.parentBatch===data.childBatch)return res.status(400).json({error:'Batch cannot descend from itself'});const links=await Lineage.find().select('parentBatch childBatch').lean();if(descendants(data.childBatch,links).includes(data.parentBatch))return res.status(409).json({error:'Cyclic genealogy forbidden'});const link=await Lineage.create({...data,recordedBy:req.user._id});res.status(201).json(link)}));
 app.get('/api/dna/recall/:batch',safe(async(req,res)=>{const links=await Lineage.find().select('parentBatch childBatch').lean();const affected=descendants(req.params.batch,links);res.json({sourceBatch:req.params.batch,recordedDownstreamBatches:affected,count:affected.length,qualification:'Impact is based on entered lineage records only. Missing links may hide additional affected batches; a physical recall decision requires investigation.'})}));
 app.get('/api/dna/lineage',safe(async(req,res)=>res.json(await Lineage.find().sort({createdAt:-1}).limit(200).lean())));
}
