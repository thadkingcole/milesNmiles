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
        },
      },
      color: { type: DataTypes.STRING, allowNull: false },
      userid: { type: DataTypes.STRING, allowNull: false },
    },
    {
      sequelize,
      modelName: "Car",
    }
  );
  return Car;
};
