const { Amenity, User } = require('../models');
const { Op } = require('sequelize');

// ===== MÉTODOS EXISTENTES (mantener como están) =====

exports.getAllAmenities = async (req, res) => {
  try {
    const { page = 1, limit = 10, tipo, estado } = req.query;
    const offset = (page - 1) * limit;

    const where = {};
    if (tipo) where.tipo = tipo;
    if (estado) where.estado = estado;

    const { count, rows } = await Amenity.findAndCountAll({
      where,
      limit: parseInt(limit),
      offset: parseInt(offset),
      order: [['nombre', 'ASC']]
    });

    res.json({
      data: rows,
      total: count,
      pages: Math.ceil(count / limit),
      currentPage: parseInt(page)
    });
  } catch (error) {
    console.error('Error al obtener amenidades:', error);
    res.status(500).json({ message: 'Error al obtener amenidades', error: error.message });
  }
};

exports.getAmenityById = async (req, res) => {
  try {
    const { id } = req.params;
    const amenity = await Amenity.findByPk(id);

    if (!amenity) {
      return res.status(404).json({ message: 'Amenidad no encontrada' });
    }

    res.json({ amenity });
  } catch (error) {
    console.error('Error al obtener amenidad:', error);
    res.status(500).json({ message: 'Error al obtener amenidad', error: error.message });
  }
};

exports.createAmenity = async (req, res) => {
  try {
    const amenityData = req.body;
    const newAmenity = await Amenity.create(amenityData);

    res.status(201).json({
      message: 'Amenidad creada exitosamente',
      amenity: newAmenity
    });
  } catch (error) {
    console.error('Error al crear amenidad:', error);
    res.status(500).json({ message: 'Error al crear amenidad', error: error.message });
  }
};

exports.updateAmenity = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    const amenity = await Amenity.findByPk(id);
    if (!amenity) {
      return res.status(404).json({ message: 'Amenidad no encontrada' });
    }

    await amenity.update(updateData);

    res.json({
      message: 'Amenidad actualizada exitosamente',
      amenity
    });
  } catch (error) {
    console.error('Error al actualizar amenidad:', error);
    res.status(500).json({ message: 'Error al actualizar amenidad', error: error.message });
  }
};

exports.deleteAmenity = async (req, res) => {
  try {
    const { id } = req.params;

    const amenity = await Amenity.findByPk(id);
    if (!amenity) {
      return res.status(404).json({ message: 'Amenidad no encontrada' });
    }

    await amenity.destroy();
    res.json({ message: 'Amenidad eliminada exitosamente' });
  } catch (error) {
    console.error('Error al eliminar amenidad:', error);
    res.status(500).json({ message: 'Error al eliminar amenidad', error: error.message });
  }
};

// ===== ✅ AGREGAR ESTOS MÉTODOS NUEVOS PARA RESERVAS =====

// Reservar amenidad (solo administradores)
exports.reserveAmenity = async (req, res) => {
  try {
    const { id } = req.params;
    const { fecha_reserva, hora_inicio, hora_fin, notas } = req.body;
    const usuario_id = req.user.id;

    // Verificar que amenidad existe
    const amenity = await Amenity.findByPk(id);
    if (!amenity) {
      return res.status(404).json({ message: 'Amenidad no encontrada' });
    }

    // Verificar estado de la amenidad
    if (amenity.estado === 'En Mantenimiento' || amenity.estado === 'Fuera de Servicio') {
      return res.status(400).json({
        message: `No se puede reservar. La amenidad está en estado: ${amenity.estado}`
      });
    }

    // Actualizar estado de amenidad a "Ocupada"
    await amenity.update({ 
      estado: 'Ocupada',
      reservaciones_activas: (amenity.reservaciones_activas || 0) + 1,
      ultima_reserva: new Date()
    });

    // Nota: Si no quieres crear tabla de reservas, simplemente cambia el estado
    // Si más adelante quieres tracking completo, crea la tabla AmenityReservation

    res.status(201).json({
      message: 'Amenidad reservada exitosamente',
      amenity,
      reservationInfo: {
        fecha_reserva,
        hora_inicio,
        hora_fin,
        usuario_id,
        notas
      }
    });

  } catch (error) {
    console.error('Error al reservar amenidad:', error);
    res.status(500).json({ message: 'Error al crear reserva', error: error.message });
  }
};

// Liberar amenidad (cambiar estado a Disponible)
exports.releaseAmenity = async (req, res) => {
  try {
    const { id } = req.params;

    const amenity = await Amenity.findByPk(id);
    if (!amenity) {
      return res.status(404).json({ message: 'Amenidad no encontrada' });
    }

    await amenity.update({ 
      estado: 'Disponible',
      reservaciones_activas: Math.max(0, (amenity.reservaciones_activas || 1) - 1)
    });

    res.json({ 
      message: 'Amenidad liberada exitosamente',
      amenity 
    });
  } catch (error) {
    console.error('Error al liberar amenidad:', error);
    res.status(500).json({ message: 'Error al liberar amenidad', error: error.message });
  }
};

// Verificar disponibilidad
exports.checkAvailability = async (req, res) => {
  try {
    const { id } = req.params;

    const amenity = await Amenity.findByPk(id);
    if (!amenity) {
      return res.status(404).json({ message: 'Amenidad no encontrada' });
    }

    const available = amenity.estado === 'Disponible' || amenity.estado === 'Ocupada';
    
    res.json({
      available,
      estado: amenity.estado,
      message: available ? 'Amenidad disponible para reservar' : `Amenidad no disponible: ${amenity.estado}`
    });
  } catch (error) {
    console.error('Error al verificar disponibilidad:', error);
    res.status(500).json({ message: 'Error al verificar disponibilidad', error: error.message });
  }
};