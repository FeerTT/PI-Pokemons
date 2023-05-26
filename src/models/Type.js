const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
sequelize.define('Type', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        unique:true,
    },
    nombre: {
        type: DataTypes.STRING,
        allowNull: false,
    },
}, {
    timestamps: false, // Esta opción desactiva los campos createdAt y updatedAt
  });
};