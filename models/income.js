import mongoose from 'mongoose';
const {ObjectId } = mongoose.Schema;


const incomeSchema = new mongoose.Schema(
    {
        title:{
            type:String,
            trim:true,
            required:true,
            maxlength:32
        },
        description:{
            type:String,
            trim:true,
            required:true,
            maxlength:2000
        },
        amount:{
            type:Number,
            trim:true,
            required:true,
            maxlength:32
        },
        category:{
            type:ObjectId,
            ref:'Category',
            require:true
        },
       icon:{
            data:Buffer,
            conentType: String            
        },
        createdBy:{
            type: ObjectId,
            ref: 'USer'
        },
           
         reviews: [
                {
                text: String,
                created: { type: Date, default: Date.now },
                createdBy: { type: ObjectId, ref: 'USer' }
                }
            ],  


    },
      { timestamps: true }
);



module.exports = mongoose.model("Income", incomeSchema);