const sequelize = require('../config/database');
const User = require('./User');
const Residence = require('./Residence');
const Activity = require('./Activity');
const Amenity = require('./Amenity');
const AmenityReservation = require('./AmenityReservation');
const Report = require('./Report');
const Complaint = require('./Complaint');
const Payment = require('./Payment');
const ServiceCost = require('./ServiceCost');

// ===== RELACIONES =====

// User - Residence (Un usuario puede tener una residencia)
User.hasOne(Residence, {
  foreignKey: 'usuario_id',
  as: 'residence'
});
Residence.belongsTo(User, {
  foreignKey: 'usuario_id',
  as: 'resident'
});

// User - Activity (Un usuario organiza actividades)
User.hasMany(Activity, {
  foreignKey: 'organizador_id',
  as: 'organized_activities'
});
Activity.belongsTo(User, {
  foreignKey: 'organizador_id',
  as: 'organizer'
});

// Amenity - AmenityReservation
Amenity.hasMany(AmenityReservation, {
  foreignKey: 'amenidad_id',
  as: 'reservations'
});
AmenityReservation.belongsTo(Amenity, {
  foreignKey: 'amenidad_id',
  as: 'amenity'
});

// User - AmenityReservation
User.hasMany(AmenityReservation, {
  foreignKey: 'usuario_id',
  as: 'amenity_reservations'
});
AmenityReservation.belongsTo(User, {
  foreignKey: 'usuario_id',
  as: 'user'
});

// User - Report
User.hasMany(Report, {
  foreignKey: 'reportado_por',
  as: 'reports'
});
Report.belongsTo(User, {
  foreignKey: 'reportado_por',
  as: 'reporter'
});

// Residence - Report
Residence.hasMany(Report, {
  foreignKey: 'residencia_id',
  as: 'reports'
});
Report.belongsTo(Residence, {
  foreignKey: 'residencia_id',
  as: 'residence'
});

// User - Complaint
User.hasMany(Complaint, {
  foreignKey: 'usuario_id',
  as: 'complaints'
});
Complaint.belongsTo(User, {
  foreignKey: 'usuario_id',
  as: 'user'
});

// Residence - Complaint
Residence.hasMany(Complaint, {
  foreignKey: 'residencia_id',
  as: 'complaints'
});
Complaint.belongsTo(Residence, {
  foreignKey: 'residencia_id',
  as: 'residence'
});

// User - Payment
User.hasMany(Payment, {
  foreignKey: 'usuario_id',
  as: 'payments'
});
Payment.belongsTo(User, {
  foreignKey: 'usuario_id',
  as: 'user'
});

// Residence - Payment
Residence.hasMany(Payment, {
  foreignKey: 'residencia_id',
  as: 'payments'
});
Payment.belongsTo(Residence, {
  foreignKey: 'residencia_id',
  as: 'residence'
});

// Residence - ServiceCost
Residence.hasMany(ServiceCost, {
  foreignKey: 'residencia_id',
  as: 'service_costs'
});
ServiceCost.belongsTo(Residence, {
  foreignKey: 'residencia_id',
  as: 'residence'
});

// Exportar modelos
module.exports = {
  sequelize,
  User,
  Residence,
  Activity,
  Amenity,
  AmenityReservation,
  Report,
  Complaint,
  Payment,
  ServiceCost
};