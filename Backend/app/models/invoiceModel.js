const mongoose=require('mongoose')
const {Schema,model}=mongoose
const invoiceSchema=new Schema({
bloodBank:{
    type:Schema.Types.ObjectId,
    ref:'BloodBank'
},
user:{
    type:Schema.Types.ObjectId,
    ref:'User'
},
request:{
    type:Schema.Types.ObjectId,
    ref:'BloodRequest'
},
lineItems:[{
    description:{type:String,required:true},
    units:{type:String,required:true},
    price:{type:String,required:true},
}],
amount:String,
date:String
},{timestamps:true})
const Invoice=model('Invoice',invoiceSchema)
module.exports=Invoice