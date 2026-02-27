const mongoose = require("mongoose");

const orderItemSchema = new mongoose.Schema(
{
 product:{
  type:mongoose.Schema.Types.ObjectId,
  ref:"Product",
  required:true
 },
 name:{
  type:String,
  required:true
 },
 price:{
  type:Number,
  required:true,
  min:0
 },
 quantity:{
  type:Number,
  required:true,
  min:1
 }
},
{ _id:false }
);

const orderSchema = new mongoose.Schema(
{
 user:{
  type:mongoose.Schema.Types.ObjectId,
  ref:"User",
  required:true
 },

 items:{
  type:[orderItemSchema],
  required:true,
  validate:[arr=>arr.length>0,"Order must contain items"]
 },

 totalAmount:{
  type:Number,
  required:true,
  min:0
 },

 coinsUsed:{
  type:Number,
  default:0,
  min:0
 },

 coinsEarned:{
  type:Number,
  default:0,
  min:0,
  statusHistory:[
 { status:String, date:Date }
]
 },

 finalAmount:{
  type:Number,
  required:true,
  min:0
 },

 paymentMethod:{
  type:String,
  enum:["COD","ONLINE"],
  required:true
 },

 paymentStatus:{
  type:String,
  enum:["PENDING","PAID"],
  default:"PENDING"
 },

 status:{
  type:String,
  enum:["PLACED","CONFIRMED","OUT_FOR_DELIVERY","DELIVERED"],
  default:"PLACED"
 }

},
{timestamps:true}
);

module.exports = mongoose.model("Order",orderSchema);
