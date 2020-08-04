var mongoose=require("mongoose");

var studentschema=new mongoose.Schema({
    name:String,
    age:String,
    dob:Date,
    num:Number,
    email:String,
    gender:String,
    country:String,
    state:String,
    city:String,
    area:String,
    landmark:String,
    pincode:Number,
    image:String,
    fname:String,
    mname:String,
    gname:String,
    gnum:Number,
    gemail:String,
    degree:String,
    occupation:String,
    income:Number,
    marks10:Number,
    school10:String,
    board10:String,
    py10:Number,
    marks12:Number,
    school12:String,
    board12:String,
    py12:Number,
    usn:String,
    branch:{
        id:{
            type:mongoose.Schema.Types.ObjectId,
            ref:"department"
        },
        name:String
    },
    course:{
        id:{
            type:mongoose.Schema.Types.ObjectId,
            ref:"course"
        },
        course1:Object,
        course2:Object,
        course3:Object,
        course4:Object,
    },
    sem:Number,
    roll:Number,
    date:{ type: Date, default: Date.now }
});

module.exports=mongoose.model("student",studentschema);