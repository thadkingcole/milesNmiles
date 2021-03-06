const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Trip extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Trip.belongsTo(models.Car);
    }
  }
  Trip.init(
    {
      fillDay: {
        type: DataTypes.DATEONLY,
        allowNull: false,
        defaultValue: new Date(),
      },
      odoMiles: { type: DataTypes.INTEGER.UNSIGNED, allowNull: false },
      gallons: { type: DataTypes.FLOAT.UNSIGNED, allowNull: false },
      comments: { type: DataTypes.STRING },
    },
    {
      sequelize,
      modelName: "Trip",
    }
  );
  return Trip;
};
