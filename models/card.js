import { DataTypes } from "sequelize";
import sequelize from "../config/db.js"
import User from "./user.js"


const Card = sequelize.define("Card", {
    summary:{
        type: DataTypes.TEXT,
        allowNull:false,
    },
    tags:{
        type: DataTypes.JSON,
        allowNull:false,
    },
    originalText:{
        type:DataTypes.TEXT,
        allowNull:false,
    },
    userId:{
        type:DataTypes.INTEGER,
        allowNull:false,
    }
});

User.hasMany(Card, {foreignKey: "userId"});
Card.belongsTo(User, {foreignKey:"userId"});

export default Card;