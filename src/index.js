const express = require("express");
// const { AbilityBuilder, Ability } = require('@casl/ability');
const app = express();
const PORT = 3000;
const { defineAbility } = require('@casl/ability');

// Define abilities for 'admin' and 'user' roles
const adminAbility = defineAbility((can, cannot) => {
    // can('create', 'Post');
    // can('update', 'Post');
    // can('delete', 'Post');
    // can('read','Post');

    //one liner
    can('manage','Post');
});

const userAbility = defineAbility((can, cannot) => {
    can('read','Post');
});



// console.log(adminAbility.can('read','Post'));  //true
// console.log(userAbility.can('create','Post'));  //false


//dummy user object
const user = {
    userID:1,
    firstName : "akshar",
    lastName : "parmar",
    bearerToken : 'fjahfesoifjADOIhfeFE',
    role : "user"
}
//middleWare to check permissions
function checkPermission(action,resource){
    let ability;
    return (req,res,next) =>{

        //we can get the user object once bearer token is extracted and verified
        const userRole = user.role;
        //user is admin then load adminAbility
        if(userRole=='admin'){
            ability = adminAbility;
        }
        //if user is normal then load userAbility
        else if(userRole == 'user'){
            ability = userAbility;
        }

        if(ability.can(action,resource)){
            //true means they have access
            next();  //go forward 
        }
        else{
            res.status(403).json({
                message : "permission denied"
            })
        }
    }
}


//routes

//welcome route for checking
app.get("/home",(req,res)=>{
    return res.json({
        message : "hello welcome home"
    })
});


//read route
app.get("/post",(req,res)=>{
    return res.json({
        message : "Viewing all post"
    })
})

//delete route
app.delete("/post/:id",checkPermission('delete','Post'),(req,res)=>{
    return res.json({
        message : "deleting the post"
    })
})

//update route
app.put("/post/:id",checkPermission('update','Post'),(req,res)=>{
    return res.json({
        message : "updating the post"
    })
});

//create route
app.post("/post",checkPermission('create','Post'),(req,res)=>{
    return res.json({
        message : "creating the post"
    })
})



app.listen(PORT,()=>{
    console.log(`server is running on ${PORT}`);
});