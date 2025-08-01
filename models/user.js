import { DataTypes } from "sequelize";
import sequelize from "../config/db.js";   

const User = sequelize.define("User",{
    name:{type: DataTypes.STRING, allowNull:false},
    email:{type:DataTypes.STRING, unique:true, allowNull:false},
    password:{type:DataTypes.STRING, allowNull:false, validate:{len:[6, 100],}}
})

export default User