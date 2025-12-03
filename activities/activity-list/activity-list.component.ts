import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';

interface Activity {
  id: number;
  titulo: string;
  descripcion?: string;
  tipo?: string;
  fecha_inicio: string;
  fecha_fin?: string;
  ubicacion?: string;
  capacidad?: number;
  estado?: string;
  organizador_id?: number;
}

@Component({
  selector: 'app-activity-list',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatChipsModule,
    MatDialogModule,
    MatSnackBarModule
  ],
  templateUrl: './activity-list.component.html',
  styleUrls: ['./activity-list.component.scss']
})
export class ActivityListComponent implements OnInit {
  // ✅ Solo usamos HttpClient directamente (no servicios adicionales)
  private http = inject(HttpClient);
  private dialog = inject(MatDialog);
  private snackBar = inject(MatSnackBar);
  
  // Configuración de API (ajusta según tu backend)
  private apiUrl = 'http://localhost:3000/api/activities';
  
  activities: Activity[] = [];
  isLoading = false;

  ngOnInit(): void {
    this.loadActivities();
  }

  loadActivities(): void {
    this.isLoading = true;
    
    this.http.get<any>(this.apiUrl).subscribe({
      next: (response: any) => {
        // Manejo flexible de la respuesta
        if (Array.isArray(response)) {
          this.activities = response;
        } else if (response && response.data && Array.isArray(response.data)) {
          this.activities = response.data;
        } else if (response && response.activities && Array.isArray(response.activities)) {
          this.activities = response.activities;
        } else {
          this.activities = [];
        }
        this.isLoading = false;
      },
      error: (error: any) => {
        console.error('Error loading activities:', error);
        this.activities = [];
        this.isLoading = false;
        
        if (error.status !== 403) {
          this.snackBar.open('Error al cargar actividades', 'Cerrar', { duration: 3000 });
        }
      }
    });
  }

  openCreateDialog(): void {
    if (!this.canCreateActivity()) {
      this.snackBar.open('No tiene permisos para crear actividades', 'Cerrar', { duration: 3000 });
      return;
    }
    
    this.snackBar.open('Función de crear actividad disponible próximamente', 'Cerrar', { duration: 3000 });
  }

  editActivity(activity: Activity): void {
    if (!this.canEditActivity()) {
      this.snackBar.open('No tiene permisos para editar actividades', 'Cerrar', { duration: 3000 });
      return;
    }
    
    this.snackBar.open('Función de editar actividad disponible próximamente', 'Cerrar', { duration: 3000 });
  }

  cancelActivity(id: number): void {
    if (!this.canEditActivity()) {
      this.snackBar.open('No tiene permisos para cancelar actividades', 'Cerrar', { duration: 3000 });
      return;
    }
    
    if (confirm('¿Está seguro de cancelar esta actividad?')) {
      this.http.put(`${this.apiUrl}/${id}/cancel`, {}).subscribe({
        next: () => {
          this.snackBar.open('Actividad cancelada exitosamente', 'Cerrar', { duration: 3000 });
          this.loadActivities();
        },
        error: (error: any) => {
          console.error('Error canceling activity:', error);
          const message = error.error?.message || 'Error al cancelar actividad';
          this.snackBar.open(message, 'Cerrar', { duration: 3000 });
        }
      });
    }
  }

  exportToCSV(): void {
    if (!this.canEditActivity()) {
      this.snackBar.open('No tiene permisos para exportar', 'Cerrar', { duration: 3000 });
      return;
    }
    
    this.snackBar.open('Exportación disponible próximamente', 'Cerrar', { duration: 3000 });
  }

  // ✅ Métodos SIMPLES para verificar permisos (sin AuthService complejo)
  canCreateActivity(): boolean {
    const user = this.getUserFromLocalStorage();
    return user && (user.rol === 'Administrador' || user.rol === 'SuperAdmin');
  }

  canEditActivity(): boolean {
    const user = this.getUserFromLocalStorage();
    return user && (user.rol === 'Administrador' || user.rol === 'SuperAdmin');
  }

  // ✅ Método helper simple para obtener usuario
  private getUserFromLocalStorage(): any {
    try {
      const userStr = localStorage.getItem('user');
      return userStr ? JSON.parse(userStr) : null;
    } catch (error) {
      console.error('Error parsing user from localStorage:', error);
      return null;
    }
  }
}