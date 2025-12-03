const express = require('express');
const router = express.Router();
const amenityController = require('../controllers/amenityController');
const { authenticateToken, authorizeRoles } = require('../middlewares/auth');
const { ROLES } = require('../config/constants');

// Todas las rutas requieren autenticación
router.use(authenticateToken);

// ===== RUTAS EXISTENTES (mantener) =====

// Obtener todas las amenidades (todos los usuarios)
router.get('/', amenityController.getAllAmenities);

// Obtener amenidad por ID (todos los usuarios)
router.get('/:id', amenityController.getAmenityById);

// Crear amenidad (solo administradores)
router.post('/',
  authorizeRoles(ROLES.ADMINISTRADOR, ROLES.SUPER_ADMIN),
  amenityController.createAmenity
);

// Actualizar amenidad (solo administradores)
router.put('/:id',
  authorizeRoles(ROLES.ADMINISTRADOR, ROLES.SUPER_ADMIN),
  amenityController.updateAmenity
);

// Eliminar amenidad (solo administradores)
router.delete('/:id',
  authorizeRoles(ROLES.ADMINISTRADOR, ROLES.SUPER_ADMIN),
  amenityController.deleteAmenity
);

// ===== ✅ AGREGAR ESTAS RUTAS NUEVAS =====

// Reservar amenidad (solo administradores)
router.post('/:id/reserve',
  authorizeRoles(ROLES.ADMINISTRADOR, ROLES.SUPER_ADMIN),
  amenityController.reserveAmenity
);

// Liberar amenidad (solo administradores)
router.post('/:id/release',
  authorizeRoles(ROLES.ADMINISTRADOR, ROLES.SUPER_ADMIN),
  amenityController.releaseAmenity
);

// Verificar disponibilidad (todos los usuarios)
router.get('/:id/availability',
  amenityController.checkAvailability
);

module.exports = router;