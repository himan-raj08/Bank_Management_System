const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const UserSchema = new mongoose.Schema({
    email:{
        type:String,
        required:true,
        unique:true,
        lowercase:true
    },
    name:{
        type:String,
        required:true
    },
    password:{
        type:String,
        required:true,
        minlength:6,
        select:false
    },
     systemUser:{
          type:Boolean,
           default: false,
            immutable: true,
              select: false
     }
},{timestamps:true})

UserSchema.pre("save", async function(next){

    if(!this.isModified("password")){
        return
    }

    this.password = await bcrypt.hash(this.password,10);

    
})

UserSchema.methods.comparePassword = async function(password){
    return await bcrypt.compare(password,this.password);
}

module.exports = mongoose.model("User",UserSchema);