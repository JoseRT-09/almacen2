import { Injectable, inject } from '@angular/core';
import { Observable, BehaviorSubject } from 'rxjs';
import { Router } from '@angular/router';

export enum UserRole {
  RESIDENTE = 'Residente',
  ADMINISTRADOR = 'Administrador',
  SUPER_ADMIN = 'SuperAdmin'
}

export interface Permission {
  create?: boolean;
  read?: boolean;
  update?: boolean;
  delete?: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class AuthorizationService {
  private router = inject(Router);
  private currentUserRole$ = new BehaviorSubject<UserRole | null>(null);
  private currentUser$ = new BehaviorSubject<any>(null);

  constructor() {
    this.initializeFromStorage();
  }

  /**
   * Inicializar desde localStorage (compatible con sistema existente)
   */
  private initializeFromStorage(): void {
    const user = localStorage.getItem('user');
    if (user) {
      try {
        const userData = JSON.parse(user);
        this.setUser(userData);
      } catch (error) {
        console.error('Error parsing user data:', error);
      }
    }
  }

  /**
   * Establecer usuario y rol (llamar desde auth.service después del login)
   * Acepta cualquier tipo de objeto de usuario (any)
   */
  setUser(user: any): void {
    if (!user) return;
    
    this.currentUser$.next(user);
    
    // Extraer rol del usuario de forma segura
    const userRole = user.rol || user.role || null;
    this.currentUserRole$.next(userRole as UserRole);
  }

  /**
   * Limpiar usuario (llamar desde auth.service en logout)
   */
  clearUser(): void {
    this.currentUser$.next(null);
    this.currentUserRole$.next(null);
  }

  /**
   * Obtener datos del usuario actual
   */
  getCurrentUser(): any {
    return this.currentUser$.value;
  }

  /**
   * Obtener rol como observable
   */
  getUserRole(): Observable<UserRole | null> {
    return this.currentUserRole$.asObservable();
  }

  /**
   * Obtener rol actual
   */
  getCurrentRole(): UserRole | null {
    return this.currentUserRole$.value;
  }

  // ===== VERIFICADORES DE ROL =====

  isResidente(): boolean {
    return this.currentUserRole$.value === UserRole.RESIDENTE;
  }

  isAdministrador(): boolean {
    return this.currentUserRole$.value === UserRole.ADMINISTRADOR;
  }

  isSuperAdmin(): boolean {
    return this.currentUserRole$.value === UserRole.SUPER_ADMIN;
  }

  isAdminOrSuperAdmin(): boolean {
    return this.isAdministrador() || this.isSuperAdmin();
  }

  isAuthenticated(): boolean {
    return this.currentUserRole$.value !== null;
  }

  // ===== PERMISOS POR MÓDULO =====

  // RESIDENCIAS
  getResidencePermissions(): Permission {
    const role = this.getCurrentRole();
    
    switch (role) {
      case UserRole.SUPER_ADMIN:
      case UserRole.ADMINISTRADOR:
        return { create: true, read: true, update: true, delete: true };
      case UserRole.RESIDENTE:
        return { create: false, read: true, update: false, delete: false };
      default:
        return { create: false, read: false, update: false, delete: false };
    }
  }

  canCreateResidence(): boolean {
    return this.getResidencePermissions().create || false;
  }

  canEditResidence(): boolean {
    return this.getResidencePermissions().update || false;
  }

  canDeleteResidence(): boolean {
    return this.getResidencePermissions().delete || false;
  }

  canViewResidences(): boolean {
    return this.getResidencePermissions().read || false;
  }

  // ACTIVIDADES
  getActivityPermissions(): Permission {
    const role = this.getCurrentRole();
    
    switch (role) {
      case UserRole.SUPER_ADMIN:
      case UserRole.ADMINISTRADOR:
        return { create: true, read: true, update: true, delete: true };
      case UserRole.RESIDENTE:
        return { create: false, read: true, update: false, delete: false };
      default:
        return { create: false, read: false, update: false, delete: false };
    }
  }

  canCreateActivity(): boolean {
    return this.getActivityPermissions().create || false;
  }

  canEditActivity(): boolean {
    return this.getActivityPermissions().update || false;
  }

  canDeleteActivity(): boolean {
    return this.getActivityPermissions().delete || false;
  }

  canViewActivities(): boolean {
    return this.getActivityPermissions().read || false;
  }

  // AMENIDADES
  getAmenityPermissions(): Permission {
    const role = this.getCurrentRole();
    
    switch (role) {
      case UserRole.SUPER_ADMIN:
      case UserRole.ADMINISTRADOR:
        return { create: true, read: true, update: true, delete: true };
      case UserRole.RESIDENTE:
        return { create: false, read: true, update: false, delete: false };
      default:
        return { create: false, read: false, update: false, delete: false };
    }
  }

  canCreateAmenity(): boolean {
    return this.getAmenityPermissions().create || false;
  }

  canEditAmenity(): boolean {
    return this.getAmenityPermissions().update || false;
  }

  canDeleteAmenity(): boolean {
    return this.getAmenityPermissions().delete || false;
  }

  canViewAmenities(): boolean {
    return this.getAmenityPermissions().read || false;
  }

  canReserveAmenity(): boolean {
    return this.getCurrentRole() !== null;
  }

  // REPORTES
  getReportPermissions(): Permission {
    const role = this.getCurrentRole();
    
    switch (role) {
      case UserRole.SUPER_ADMIN:
      case UserRole.ADMINISTRADOR:
        return { create: true, read: true, update: true, delete: true };
      case UserRole.RESIDENTE:
        return { create: true, read: true, update: false, delete: false };
      default:
        return { create: false, read: false, update: false, delete: false };
    }
  }

  canCreateReport(): boolean {
    return this.getReportPermissions().create || false;
  }

  canEditReport(): boolean {
    return this.getReportPermissions().update || false;
  }

  canDeleteReport(): boolean {
    return this.getReportPermissions().delete || false;
  }

  canViewReports(): boolean {
    return this.getReportPermissions().read || false;
  }

  // QUEJAS
  getComplaintPermissions(): Permission {
    const role = this.getCurrentRole();
    
    switch (role) {
      case UserRole.SUPER_ADMIN:
      case UserRole.ADMINISTRADOR:
        return { create: true, read: true, update: true, delete: true };
      case UserRole.RESIDENTE:
        return { create: true, read: true, update: false, delete: false };
      default:
        return { create: false, read: false, update: false, delete: false };
    }
  }

  canCreateComplaint(): boolean {
    return this.getComplaintPermissions().create || false;
  }

  canEditComplaint(): boolean {
    return this.getComplaintPermissions().update || false;
  }

  canDeleteComplaint(): boolean {
    return this.getComplaintPermissions().delete || false;
  }

  canViewComplaints(): boolean {
    return this.getComplaintPermissions().read || false;
  }

  // PAGOS
  getPaymentPermissions(): Permission {
    const role = this.getCurrentRole();
    
    switch (role) {
      case UserRole.SUPER_ADMIN:
      case UserRole.ADMINISTRADOR:
        return { create: true, read: true, update: true, delete: true };
      case UserRole.RESIDENTE:
        return { create: true, read: true, update: false, delete: false };
      default:
        return { create: false, read: false, update: false, delete: false };
    }
  }

  canCreatePayment(): boolean {
    return this.getPaymentPermissions().create || false;
  }

  canViewPayments(): boolean {
    return this.getPaymentPermissions().read || false;
  }

  canViewAllPayments(): boolean {
    return this.isAdminOrSuperAdmin();
  }

  canDeletePayment(): boolean {
    return this.getPaymentPermissions().delete || false;
  }

  // USUARIOS
  getUserPermissions(): Permission {
    const role = this.getCurrentRole();
    
    switch (role) {
      case UserRole.SUPER_ADMIN:
        return { create: true, read: true, update: true, delete: true };
      case UserRole.ADMINISTRADOR:
        return { create: true, read: true, update: true, delete: false };
      case UserRole.RESIDENTE:
        return { create: false, read: false, update: false, delete: false };
      default:
        return { create: false, read: false, update: false, delete: false };
    }
  }

  canManageUsers(): boolean {
    return this.isAdminOrSuperAdmin();
  }

  canCreateUser(): boolean {
    return this.getUserPermissions().create || false;
  }

  canEditUser(): boolean {
    return this.getUserPermissions().update || false;
  }

  canDeleteUser(): boolean {
    return this.getUserPermissions().delete || false;
  }

  // DASHBOARD Y ESTADÍSTICAS
  canViewDashboard(): boolean {
    return this.getCurrentRole() !== null;
  }

  canViewStatistics(): boolean {
    return this.isAdminOrSuperAdmin();
  }

  canViewFinancialReports(): boolean {
    return this.isAdminOrSuperAdmin();
  }

  // SERVICE COSTS
  canManageServiceCosts(): boolean {
    return this.isAdminOrSuperAdmin();
  }

  canViewServiceCosts(): boolean {
    return this.getCurrentRole() !== null;
  }

  // NAVEGACIÓN Y GUARDS
  canNavigateTo(route: string): boolean {
    const role = this.getCurrentRole();
    if (!role) return false;

    // Rutas permitidas para residentes
    const residentRoutes = [
      '/dashboard',
      '/my-residence',
      '/activities',
      '/amenities',
      '/reports',
      '/complaints',
      '/payments',
      '/service-costs',
      '/profile'
    ];

    if (this.isResidente()) {
      return residentRoutes.some(r => route.startsWith(r));
    }

    if (this.isAdminOrSuperAdmin()) {
      return true; // Admins pueden acceder a todo
    }

    return false;
  }

  /**
   * Redirigir a ruta apropiada según rol
   */
  redirectToDefaultRoute(): void {
    if (this.isAdminOrSuperAdmin()) {
      this.router.navigate(['/dashboard']);
    } else if (this.isResidente()) {
      this.router.navigate(['/dashboard']);
    } else {
      this.router.navigate(['/auth/login']);
    }
  }
}