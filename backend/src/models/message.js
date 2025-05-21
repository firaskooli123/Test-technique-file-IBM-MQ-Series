const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Message = sequelize.define('Message', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    content: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    partner_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'partners',
        key: 'id'
      }
    }
  }, {
    tableName: 'messages',
    underscored: true,
    timestamps: true
  });

  Message.associate = (models) => {
    Message.belongsTo(models.Partner, {
      foreignKey: 'partner_id',
      as: 'partner'
    });
  };

  return Message;
}; 