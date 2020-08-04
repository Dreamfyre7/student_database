var mongoose=require("mongoose");
var courseschema=mongoose.Schema(
{
    branch:{
        id:{
            type:mongoose.Schema.Types.ObjectId,
            ref:"department"
        },
        name:String
    },
    students:[
        {
            type:mongoose.Schema.Types.ObjectId,
            ref:"student"
        },
    ],
    sem:Number,
    course1:{
        type: {
            type: String
          },
        name:String,code:String,credit:Number,faculty:String,duration:Number
    },
    course2:{
        type: {
            type: String
          },
        name:String,
        code:String,
        credit:Number,
        faculty:String,
        duration:Number
    },
    course3:{
        type: {
            type: String
          },
        name:String,
        code:String,
        credit:Number,
        faculty:String,
        duration:Number
    },
    course4:{
        type: {
            type: String
          },
        name:String,
        code:String,
        credit:Number,
        faculty:String,
        duration:Number
    },
      
});
module.exports=mongoose.model("course",courseschema);