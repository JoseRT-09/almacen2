const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const AmenityReservation = sequelize.define('AmenityReservation', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  amenidad_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'amenities',
      key: 'id'
    },
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE'
  },
  usuario_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'users',
      key: 'id'
    },
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE'
  },
  fecha_reserva: {
    type: DataTypes.DATEONLY,
    allowNull: false,
    comment: 'Fecha de la reserva'
  },
  hora_inicio: {
    type: DataTypes.TIME,
    allowNull: false,
    comment: 'Hora de inicio de la reserva'
  },
  hora_fin: {
    type: DataTypes.TIME,
    allowNull: false,
    comment: 'Hora de fin de la reserva'
  },
  estado_reserva: {
    type: DataTypes.ENUM('Activa', 'Completada', 'Cancelada'),
    defaultValue: 'Activa',
    comment: 'Estado actual de la reserva'
  },
  notas: {
    type: DataTypes.TEXT,
    comment: 'Notas o comentarios adicionales sobre la reserva'
  }
}, {
  tableName: 'amenity_reservations',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at'
});

module.exports = AmenityReservation;