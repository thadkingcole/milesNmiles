const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Car extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Car.hasMany(models.Trip, {
        foreignKey: {
          allowNull: false,
        },
      });
    }
  }
  Car.init(
    {
      make: { type: DataTypes.STRING, allowNull: false },
      model: { type: DataTypes.STRING, allowNull: false },
      year: {
        type: DataTypes.DECIMAL(4).UNSIGNED,
        allowNull: false,
        validate: {
          min: 1908, // year of the first Ford Model T
          max: new Date().getFullYear() + 1, // highest model year available
        },
      },
      color: { type: DataTypes.STRING, allowNull: false },
      userId: { type: DataTypes.STRING, allowNull: false },
      startDate: {
        type: DataTypes.DATEONLY,
        allowNull: false,
        defaultValue: new Date(),
      },
      startOdo: {
        type: DataTypes.INTEGER.UNSIGNED,
        allowNull: false,
        defaultValue: 0,
      },
    },
    {
      sequelize,
      modelName: "Car",
    }
  );
  return Car;
};
