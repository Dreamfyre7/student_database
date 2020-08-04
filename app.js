var express=require("express");
var app=express();
var methodoverride=require("method-override");
var mongoose=require("mongoose");
var flash=require("connect-flash")
var passport=require("passport");
var localstrategy=require("passport-local");
var bodyParser=require("body-parser");
var student=require("./models/student");
var department=require("./models/department");
var course=require("./models/course");
var umodel=require("./models/user");


app.use(express.static(__dirname+"/public"));
app.use(bodyParser.urlencoded({extended:true}));
app.use(methodoverride("_method"));
app.use(flash());

mongoose.connect("mongodb://localhost/student6",{ useNewUrlParser: true, useUnifiedTopology: true});
app.set("view engine","ejs");


//=============================================================
//passport configuration
app.use(require("express-session")({
    secret:"Horcruxes",
    resave:false,
    saveUninitialized:false
}));

app.use(passport.initialize());
app.use(passport.session());
passport.use(new localstrategy(umodel.authenticate()));
passport.serializeUser(umodel.serializeUser());
passport.deserializeUser(umodel.deserializeUser());
app.use(function(req,res,next){
    res.locals.currentuser=req.user;
    res.locals.error=req.flash("error");
    res.locals.success=req.flash("success");
    next();
});
//===================================================================

//========================================================================================================================================
//creating a new student
app.get("/new",isLoggedIn,function(req,res){
    department.find({},function(err,alldepartment){
        if(err){
            console.log(err)
        }
        else{
            res.render("newstudent",{department:alldepartment});
        }
    });
});

app.post("/students",isLoggedIn,function(req,res){
    department.findOne({"name":req.body.department},function(err,department)
    {
        if(err){
            console.log(err);
        }
        else{
            var dept={
                id:department._id,
                name:department.name
            }
            course.findOne({"branch.name":req.body.department,"sem":req.body.sem},function(err,course){
                if(err){
                    console.log(err)
                }
                else
                {
                    var c={
                        id:course._id,
                        course1:course.course1,
                        course2:course.course2,
                        course3:course.course3,
                        course4:course.course4,
                    }
                    var newstudent={
                        name:req.body.name,
                        age:req.body.age,
                        dob:req.body.dob,
                        num:req.body.num,
                        email:req.body.email,
                        gender:req.body.gender,
                        country:req.body.country,
                        state:req.body.state,
                        city:req.body.city,
                        area:req.body.area,
                        landmark:req.body.landmark,
                        pincode:req.body.pincode,
                        image:req.body.image,
                        fname:req.body.fname,
                        mname:req.body.mname,
                        gname:req.body.gname,
                        gnum:req.body.gnum,
                        gemail:req.body.gemail,
                        degree:req.body.degree,
                        occupation:req.body.occupation,
                        income:req.body.income,
                        marks10:req.body.marks10,
                        school10:req.body.school10,
                        board10:req.body.board10,
                        py10:req.body.py10,
                        marks12:req.body.marks12,
                        school12:req.body.school12,
                        board12:req.body.board12,
                        py12:req.body.py12,
                        usn:req.body.usn,
                        branch:dept,
                        course:c,
                        sem:req.body.sem,
                        roll:req.body.roll
                    }
                    student.findOne({"usn":req.body.usn},function(err,sfound){
                        if(sfound){
                            req.flash("error","found a student with same USN");
                            res.redirect("/new")
                        }
                        else{
                            student.create(newstudent,function(err,student){
                                if(err){
                                    console.log(err);
                                }
                                else{
                                    course.students.push(student);
                                    course.save();
                                    department.students.push(student);
                                    department.save();
                                    req.flash("success","new student added"); 
                                    res.redirect("/students");
                                }
                            })
                        }
                    })
                }
            })

        }
    });
    
});

app.get("/students",isLoggedIn,function(req,res)
{
    if(req.query.search && !req.query.sort)
    {
        var regex = new RegExp(escapeRegex(req.query.search), 'gi');
        student.find({name:regex}).sort({department:+1}).exec(function(err,allstudents)
        {
            if(err)
            { 
                console.log(err)
            }
            else
            {
                var count=0;
                allstudents.forEach(function(allstudents)
                {
                    count=count+1;
                })
                if(count<1)
                {
                    student.find({usn:regex}).sort({department:+1}).exec(function(err,allstudents)
                    {
                        if(err)
                        {
                            console.log(err)
                        }
                        else
                        {
                            var count=0;
                            allstudents.forEach(function(allstudents)
                            {
                            count=count+1;
                            });
                            var category="You searched for "+"\""+req.query.search+"\"";
                            var result=+","+count+" results found";
                            res.render("students",{students:allstudents,category:category,result:result});
                        }   
                    });
                }
                else
                {
                    var category="You searched for "+"\""+req.query.search+"\"";
                    var result=","+count+" results found";
                    res.render("students",{students:allstudents,category:category,result:result});
                }      
            }
        });  
    }
    else if(req.query.sort && !req.query.search)
    {
        if(req.query.sort=="name")
        {
            student.find({}).sort({name:+1}).exec(function(err,allstudents)
                {
                    if(err)
                    {
                        console.log(err)
                    }
                    else
                    {
                        var category="";
                        var result="";
                        res.render("students",{students:allstudents,category:category,result:result});
                    }   
                });
        }
        else if(req.query.sort=="usn")
        {
            student.find({}).sort({usn:+1}).exec(function(err,allstudents)
            {
                if(err)
                {
                    console.log(err)
                }
                else
                {
                    var category="";
                    var result="";
                    res.render("students",{students:allstudents,category:category,result:result});
                }   
            });
        }
        else if(req.query.sort=="department")
        {
            student.find({}).sort({branch:+1}).exec(function(err,allstudents)
            {
                if(err)
                {
                    console.log(err)
                }
                else
                {
                    var category="";
                    var result="";
                    res.render("students",{students:allstudents,category:category,result:result});
                }   
            });
        }
        else if(req.query.sort=="sem")
        {
            student.find({}).sort({sem:+1}).exec(function(err,allstudents)
            {
                if(err)
                {
                    console.log(err)
                }
                else
                {
                    var category="";
                    var result="";
                    res.render("students",{students:allstudents,category:category,result:result});
                }   
            });
        }
    }
    else if(req.query.search && req.query.sort)
    {
        if(req.query.sort=="name")
        {
            var regex = new RegExp(escapeRegex(req.query.search), 'gi');
            student.find({name:regex}).sort({name:+1}).exec(function(err,allstudents)
            {
                if(err)
                { 
                    console.log(err)
                }
                else
                {
                    var count=0;
                    allstudents.forEach(function(allstudents)
                    {
                        count=count+1;
                    })
                    if(count<1)
                    {
                        student.find({usn:regex}).sort({name:+1}).exec(function(err,allstudents)
                        {
                            if(err)
                            {
                                console.log(err)
                            }
                            else
                            {
                                var count=0;
                                allstudents.forEach(function(allstudents)
                                {
                                count=count+1;
                                });
                                var category="You searched for "+"\""+req.query.search+"\"";
                                var result=","+count+" results found";
                                res.render("students",{students:allstudents,category:category,result:result});
                            }   
                        });
                    }
                    else
                    {
                        var category="You searched for "+"\""+req.query.search+"\"";
                        var result=","+count+" results found";
                        res.render("students",{students:allstudents,category:category,result:result});
                    }      
                }
            })
        }
        else if(req.query.sort=="usn")
        {
            var regex = new RegExp(escapeRegex(req.query.search), 'gi');
            student.find({name:regex}).sort({usn:+1}).sort({department:+1}).exec(function(err,allstudents)
            {
                if(err)
                { 
                    console.log(err)
                }
                else
                {
                    var count=0;
                    allstudents.forEach(function(allstudents)
                    {
                        count=count+1;
                    })
                    if(count<1)
                    {
                        student.find({usn:regex}).sort({usn:+1}).exec(function(err,allstudents)
                        {
                            if(err)
                            {
                                console.log(err)
                            }
                            else
                            {
                                var count=0;
                                allstudents.forEach(function(allstudents)
                                {
                                count=count+1;
                                });
                                var category="You searched for "+"\""+req.query.search+"\"";
                                var result=","+count+" results found";
                                res.render("students",{students:allstudents,category:category,result:result});
                            }   
                        });
                    }
                    else
                    {
                        var category="You searched for "+"\""+req.query.search+"\"";
                        var result=","+count+" results found";
                        res.render("students",{students:allstudents,category:category,result:result});
                    }      
                }
            })
        }
        if(req.query.sort=="sem")
        {
            var regex = new RegExp(escapeRegex(req.query.search), 'gi');
            student.find({name:regex}).sort({sem:+1}).exec(function(err,allstudents)
            {
                if(err)
                { 
                    console.log(err)
                }
                else
                {
                    var count=0;
                    allstudents.forEach(function(allstudents)
                    {
                        count=count+1;
                    })
                    if(count<1)
                    {
                        student.find({usn:regex}).sort({sem:+1}).exec(function(err,allstudents)
                        {
                            if(err)
                            {
                                console.log(err)
                            }
                            else
                            {
                                var count=0;
                                allstudents.forEach(function(allstudents)
                                {
                                count=count+1;
                                });
                                var category="You searched for "+"\""+req.query.search+"\"";
                                var result=","+count+" results found";
                                res.render("students",{students:allstudents,category:category,result:result});
                            }   
                        });
                    }
                    else
                    {
                        var category="You searched for "+"\""+req.query.search+"\"";
                        var result=","+count+" results found";
                        res.render("students",{students:allstudents,category:category,result:result});
                    }      
                }
            })
        }
        if(req.query.sort=="department")
        {
            var regex = new RegExp(escapeRegex(req.query.search), 'gi');
            student.find({name:regex}).sort({branch:+1}).exec(function(err,allstudents)
            {
                if(err)
                { 
                    console.log(err)
                }
                else
                {
                    var count=0;
                    allstudents.forEach(function(allstudents)
                    {
                        count=count+1;
                    })
                    if(count<1)
                    {
                        student.find({usn:regex}).sort({branch:+1}).exec(function(err,allstudents)
                        {
                            if(err)
                            {
                                console.log(err)
                            }
                            else
                            {
                                var count=0;
                                allstudents.forEach(function(allstudents)
                                {
                                count=count+1;
                                });
                                var category="You searched for "+"\""+req.query.search+"\"";
                                var result=","+count+" results found";
                                res.render("students",{students:allstudents,category:category,result:result});
                            }   
                        });
                    }
                    else
                    {
                        var category="You searched for "+"\""+req.query.search+"\"";
                        var result=count+", results found";
                        res.render("students",{students:allstudents,category:category,result:result});
                    }      
                    if(req.query.sort=="name")
                    {
                        var regex = new RegExp(escapeRegex(req.query.search), 'gi');
                        student.find({name:regex}).sort({name:+1}).exec(function(err,allstudents)
                        {
                            if(err)
                            { 
                                console.log(err)
                            }
                            else
                            {
                                var count=0;
                                allstudents.forEach(function(allstudents)
                                {
                                    count=count+1;
                                })
                                if(count<1)
                                {
                                    student.find({usn:regex}).sort({name:+1}).exec(function(err,allstudents)
                                    {
                                        if(err)
                                        {
                                            console.log(err)
                                        }
                                        else
                                        {
                                            var count=0;
                                            allstudents.forEach(function(allstudents)
                                            {
                                            count=count+1;
                                            });
                                            var category="You searched for "+"\""+req.query.search+"\"";
                                            var result=","+count+" results found";
                                            res.render("students",{students:allstudents,category:category,result:result});
                                        }   
                                    });
                                }
                                else
                                {
                                    var category="You searched for "+"\""+req.query.search+"\"";
                                    var result=","+count+" results found";
                                    res.render("students",{students:allstudents,category:category,result:result});
                                }      
                            }
                        })
                    } 
                }
            })
        }  
    }
    else{
        student.find({}).sort({department:+1}).exec(function(err,allstudents)
        {
            if(err){
                console.log(err)
            }
            else{
                result="";
                category="";
                res.render("students",{students:allstudents,result:result});
            }
        })
    }        
});

//=======================================================================================================================================

//=======================================================================================================================================
//show page for each student
app.get("/student/:id",isLoggedIn,function(req,res){
    //find the campground with provide id
    //render show template with that campground
    student.findById(req.params.id,function(err,foundstudent){
        if(err){
            console.log(err);
        }else{
            //console.log(foundcampground);
            res.render("show",{student:foundstudent});
        } 
    });
});

//=======================================================================================================================================

//=======================================================================================================================================
//Update Student
app.get("/student/:id/edit",isLoggedIn,function(req,res){
    department.find({},function(err,founddepartment){
        if(err){
            console.log(err);
        }
        else{
            student.findById(req.params.id,function(err,foundstudent){
                res.render("edit",{student:foundstudent,department:founddepartment});
            });
        }
    })    
});
    

app.put("/student/:id",isLoggedIn,function(req,res){
//find and update the current campground and then redirect to show page
student.findByIdAndUpdate(req.params.id,req.body.s,function(err,updatedstudent){
    if(err){
        res.redirect("/student");
    }
    else{
        req.flash("success"," student updated"); 
        res.redirect("/student/"+req.params.id);
    }
});
});

//=======================================================================================================================================

//=======================================================================================================================================
//remove student

app.delete("/student/:id",isLoggedIn,function(req,res){
    student.findByIdAndRemove(req.params.id,function(err){
        if(err){
            res.redirect("/students");
        }
        else{
            req.flash("success","student deleted"); 
            res.redirect("/students");
        }
    })
});
//=======================================================================================================================================

//=======================================================================================================================================
//creating departments
app.get("/newdepartment",isLoggedIn,function(req,res){
            res.render("newdep");
});

app.post("/department",isLoggedIn,function(req,res){
    var name=req.body.name;
    var hod=req.body.hod;
    var about=req.body.about;
    var image=req.body.image;
    var newdepartment={name:name,hod:hod,about:about,image:image}
    department.create(newdepartment,function(err,department){
        if(err){
            console.log(err);
        }
        else{
            res.redirect("/department");
        }
    })
})

app.get("/department",isLoggedIn,function(req,res){
    department.find({},function(err,alldepartment){
        if(err){
            console.log(err)
        }
        else{
            res.render("department",{department:alldepartment});
        }
    });
});
//=======================================================================================================================================

//=======================================================================================================================================
//show page for department
app.get("/department/:department_id",isLoggedIn,function(req,res){
    department.findById(req.params.department_id).populate("students").exec(function(err,founddepartment){
        if(err){
            console.log(err);
        }else{
            res.render("showdep",{department:founddepartment});
        }
    });
    
});
//=======================================================================================================================================

//=======================================================================================================================================
//create courses

app.get("/newcourse",isLoggedIn,function(req,res){
    department.find({},function(err,alldepartment){
        if(err){
            console.log(err)
        }
        else{
            res.render("newcourse",{department:alldepartment});
        }
    });
});

app.post("/course",isLoggedIn,function(req,res){
    department.findOne({"name":req.body.department},function(err,department)
    {
        if(err){
            console.log(err);
        }
        else{
            var dept={
                id:department._id,
                name:department.name
            }
            var course1={
                name:req.body.course1,
                code:req.body.course1code,
                credit:req.body.course1credit,
                faculty:req.body.course1faculty,
                duration:req.body.course1duration
            }
            var course2={
                name:req.body.course2,
                code:req.body.course2code,
                credit:req.body.course2credit,
                faculty:req.body.course2faculty,
                duration:req.body.course2duration
            }
            var course3={
                name:req.body.course3,
                code:req.body.course3code,
                credit:req.body.course3credit,
                faculty:req.body.course3faculty,
                duration:req.body.course3duration
            }
            var course4={
                name:req.body.course4,
                code:req.body.course4code,
                credit:req.body.course4credit,
                faculty:req.body.course4faculty,
                duration:req.body.course4duration
            }
            var newcourse={
                branch:dept,
                sem:req.body.sem,
                course1:course1,
                course2:course2,
                course3:course3,
                course4:course4,
            }
            course.create(newcourse,function(err,course){
                if(err){
                    console.log(err);
                }
                else{
                    department.courses.push(course);
                    department.save();
                    res.redirect("/course");
                }
            })
        }
    });
    
});

app.get("/course",isLoggedIn,function(req,res){
    course.find({},function(err,allcourse){
        if(err){
            console.log(err)
        }
        department.find({},function(err,alldepartment){
            if(err){
                console.log(err);
            }
            else{
                res.render("courses",{course:allcourse,department:alldepartment});
            }
        })
    });
});

app.get("/course/:c_name/:course_id",isLoggedIn,function(req,res){
    course.findById(req.params.course_id).populate("students").exec(function(err,foundcourse){
        if(err){
            console.log(err);
        }
        else{
            var c=req.params.c_name;
            res.render("showcourse",{course:foundcourse,name:c});
        }
    })
})
//=======================================================================================================================================

//authroutes
//show register form
app.get("/register",function(req,res){
    res.render("register");
})
//handle sign up logic
app.post("/register",function(req,res){
    var newuser=new umodel({username:req.body.username});
    umodel.register(newuser,req.body.password,function(err,user){
        if(err){
            console.log(err);
            return res.render("register");
        }
        passport.authenticate("local")(req,res,function(){
            req.flash("success","welcome to student database"); 
            res.redirect("/students");
        });
    });
});

// //login routes

app.get("/",notLoggedIn ,function(req,res){
    res.render("login");
});

app.post("/login",passport.authenticate("local", 
{
    successRedirect:"/students",
    failureRedirect:"/"
    }),function(req,res){
});

//logout routes
app.get("/logout",function(req,res){
    console.log("logged "+req.user.username+" out")
    req.logout();
    req.flash("success","logged you out");  
    res.redirect("/");
})

function isLoggedIn(req,res,next){
    if(req.isAuthenticated()){
        return next();
    }
    req.flash("error","please login first");
    res.redirect("/");
}
function notLoggedIn(req,res,next){
    if(! req.isAuthenticated()){
        return next();
    }
    else{
        req.flash("error","You are alredy Logged in,to login from different id you have to logout first");
        res.redirect("/depatment");
    }
}

function escapeRegex(text) {
    return text.replace(/[-[\]{}()*+?.,\\^$|#]/g, " ");
};

//=========================================================================
app.listen(3000,function(){
    console.log("student server started");
});