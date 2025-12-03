const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Residence = sequelize.define('Residence', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  numero_unidad: {
    type: DataTypes.STRING(20),
    allowNull: false,
    unique: true
  },
  bloque: {
    type: DataTypes.STRING(10),
    allowNull: false
  },
  piso: {
    type: DataTypes.INTEGER
  },
  metros_cuadrados: {
    type: DataTypes.DECIMAL(10, 2)
  },
  habitaciones: {
    type: DataTypes.INTEGER
  },
  banos: {
    type: DataTypes.INTEGER
  },
  estacionamientos: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },
  precio_compra: {
    type: DataTypes.DECIMAL(12, 2)
  },
  precio_renta_mensual: {
    type: DataTypes.DECIMAL(10, 2)
  },
  
  tipo_ocupacion: {
    type: DataTypes.ENUM('Comprada', 'Rentada'),
    allowNull: false,
    defaultValue: 'Comprada'
  },
  fecha_compra: {
    type: DataTypes.DATE,
    allowNull: true
  },
  fecha_inicio_renta: {
    type: DataTypes.DATE,
    allowNull: true
  },
  fecha_fin_renta: {
    type: DataTypes.DATE,
    allowNull: true
  },
  meses_renta: {
    type: DataTypes.INTEGER,
    allowNull: true
  },
  renovacion_automatica: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  
  estado: {
    type: DataTypes.ENUM('Disponible', 'Ocupada', 'En Mantenimiento'),
    defaultValue: 'Disponible'
  },
  descripcion: {
    type: DataTypes.TEXT
  },
  usuario_id: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: {
      model: 'users',
      key: 'id'
    },
    onDelete: 'SET NULL',
    onUpdate: 'CASCADE'
  }
}, {
  tableName: 'residences',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at'
});

module.exports = Residence;