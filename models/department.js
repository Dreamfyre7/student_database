var mongoose=require("mongoose");

var departmentschema=new mongoose.Schema({
    name:String,
    about:String,
    image:String,
    hod:String,
    students:[
        {
            type:mongoose.Schema.Types.ObjectId,
            ref:"student"
        },
    ],
    courses:[
        {
            type:mongoose.SchemaTypes.ObjectId,
            ref:"course"
        },
    ]
});

module.exports=mongoose.model("department",departmentschema);