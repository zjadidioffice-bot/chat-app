const moongose = require("mongoose");

const userSchema = new moongose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    }
}
    ,
    {
        timestamps: true
    }
);

module.exports=moongose.model("User",userSchema);