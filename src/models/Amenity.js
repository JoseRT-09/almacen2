const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Amenity = sequelize.define('Amenity', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  nombre: {
    type: DataTypes.STRING(100),
    allowNull: false
  },
  descripcion: {
    type: DataTypes.TEXT
  },
  tipo: {
    type: DataTypes.STRING(50)
  },
  ubicacion: {
    type: DataTypes.STRING(100)
  },
  capacidad: {
    type: DataTypes.INTEGER
  },
  horario_disponible: {
    type: DataTypes.STRING(100)
  },
  estado: {
    type: DataTypes.ENUM('Disponible', 'Ocupada', 'En Mantenimiento', 'Fuera de Servicio'),
    defaultValue: 'Disponible'
  },
  imagen_url: {
    type: DataTypes.STRING(255)
  },
  reservaciones_activas: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
    comment: 'Contador de reservas activas'
  },
  ultima_reserva: {
    type: DataTypes.DATE,
    allowNull: true,
    comment: 'Fecha de la última reserva'
  }
}, {
  tableName: 'amenities',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at'
});

module.exports = Amenity;