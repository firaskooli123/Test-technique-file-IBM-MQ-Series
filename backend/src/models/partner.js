const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Partner = sequelize.define('Partner', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    alias: {
      type: DataTypes.STRING,
      allowNull: false
    },
    type: {
      type: DataTypes.STRING,
      allowNull: false
    },
    direction: {
      type: DataTypes.ENUM('INBOUND', 'OUTBOUND'),
      allowNull: false
    },
    application: {
      type: DataTypes.STRING,
      allowNull: true
    },
    processed_flow_type: {
      type: DataTypes.ENUM('MESSAGE', 'ALERTING', 'NOTIFICATION'),
      allowNull: false
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: false
    }
  }, {
    tableName: 'partners',
    underscored: true,
    timestamps: true
  });

  Partner.associate = (models) => {
    Partner.hasMany(models.Message, {
      foreignKey: 'partner_id',
      as: 'messages'
    });
  };

  return Partner;
}; 