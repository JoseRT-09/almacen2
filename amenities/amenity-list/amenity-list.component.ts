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

interface Amenity {
  id: number;
  nombre: string;
  descripcion?: string;
  tipo?: string;
  ubicacion?: string;
  capacidad?: number;
  horario_disponible?: string;
  estado: 'Disponible' | 'Ocupada' | 'En Mantenimiento' | 'Fuera de Servicio';
  imagen_url?: string;
}

@Component({
  selector: 'app-amenity-list',
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
  templateUrl: './amenity-list.component.html',
  styleUrls: ['./amenity-list.component.scss']
})
export class AmenityListComponent implements OnInit {
  private http = inject(HttpClient);
  private dialog = inject(MatDialog);
  private snackBar = inject(MatSnackBar);
  
  private apiUrl = 'http://localhost:3000/api/amenities';
  
  amenities: Amenity[] = [];
  isLoading = false;

  ngOnInit(): void {
    this.loadAmenities();
  }

  loadAmenities(): void {
    this.isLoading = true;
    
    this.http.get<any>(this.apiUrl).subscribe({
      next: (response: any) => {
        if (Array.isArray(response)) {
          this.amenities = response;
        } else if (response && response.data && Array.isArray(response.data)) {
          this.amenities = response.data;
        } else if (response && response.amenities && Array.isArray(response.amenities)) {
          this.amenities = response.amenities;
        } else {
          this.amenities = [];
        }
        this.isLoading = false;
      },
      error: (error: any) => {
        console.error('Error loading amenities:', error);
        this.amenities = [];
        this.isLoading = false;
        
        if (error.status !== 403) {
          this.snackBar.open('Error al cargar amenidades', 'Cerrar', { duration: 3000 });
        }
      }
    });
  }

  openCreateDialog(): void {
    if (!this.canCreateAmenity()) {
      this.snackBar.open('No tiene permisos para crear amenidades', 'Cerrar', { duration: 3000 });
      return;
    }
    
    this.snackBar.open('Función de crear amenidad disponible próximamente', 'Cerrar', { duration: 3000 });
  }

  editAmenity(amenity: Amenity): void {
    if (!this.canEditAmenity()) {
      this.snackBar.open('No tiene permisos para editar amenidades', 'Cerrar', { duration: 3000 });
      return;
    }
    
    this.snackBar.open('Función de editar amenidad disponible próximamente', 'Cerrar', { duration: 3000 });
  }

  reserveAmenity(amenity: Amenity): void {
    if (!this.canReserveAmenity()) {
      this.snackBar.open('No tiene permisos para reservar amenidades', 'Cerrar', { duration: 3000 });
      return;
    }

    if (!this.canReserveNow(amenity)) {
      this.snackBar.open(
        `No se puede reservar. Estado: ${amenity.estado}`,
        'Cerrar',
        { duration: 3000 }
      );
      return;
    }

    const fecha = prompt('Fecha de reserva (YYYY-MM-DD):');
    const horaInicio = prompt('Hora de inicio (HH:MM):');
    const horaFin = prompt('Hora de fin (HH:MM):');

    if (fecha && horaInicio && horaFin) {
      const reservationData = {
        fecha_reserva: fecha,
        hora_inicio: horaInicio,
        hora_fin: horaFin,
        notas: ''
      };

      this.http.post(`${this.apiUrl}/${amenity.id}/reserve`, reservationData).subscribe({
        next: () => {
          this.snackBar.open('Amenidad reservada exitosamente', 'Cerrar', { duration: 3000 });
          this.loadAmenities();
        },
        error: (error: any) => {
          const message = error.error?.message || 'Error al reservar amenidad';
          this.snackBar.open(message, 'Cerrar', { duration: 5000 });
        }
      });
    }
  }

  exportToCSV(): void {
    if (!this.canEditAmenity()) {
      this.snackBar.open('No tiene permisos para exportar', 'Cerrar', { duration: 3000 });
      return;
    }

    // Generar CSV
    const headers = ['ID', 'Nombre', 'Tipo', 'Ubicación', 'Capacidad', 'Estado'];
    const rows = this.amenities.map(a => [
      a.id,
      a.nombre,
      a.tipo || '',
      a.ubicacion || '',
      a.capacidad || '',
      a.estado
    ]);

    let csvContent = headers.join(',') + '\n';
    rows.forEach(row => {
      csvContent += row.join(',') + '\n';
    });

    // Descargar archivo
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `amenidades_${new Date().getTime()}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    this.snackBar.open('CSV exportado exitosamente', 'Cerrar', { duration: 3000 });
  }

  // ✅ Métodos SIMPLES para verificar permisos
  canCreateAmenity(): boolean {
    const user = this.getUserFromLocalStorage();
    return user && (user.rol === 'Administrador' || user.rol === 'SuperAdmin');
  }

  canEditAmenity(): boolean {
    const user = this.getUserFromLocalStorage();
    return user && (user.rol === 'Administrador' || user.rol === 'SuperAdmin');
  }

  canReserveAmenity(): boolean {
    // Solo admins pueden reservar
    const user = this.getUserFromLocalStorage();
    return user && (user.rol === 'Administrador' || user.rol === 'SuperAdmin');
  }

  canReserveNow(amenity: Amenity): boolean {
    // Solo se puede reservar si está Disponible o Ocupada
    return amenity.estado === 'Disponible' || amenity.estado === 'Ocupada';
  }

  // ✅ Estados de reserva correctos
  getStatusSlug(estado: string): string {
    const statusMap: Record<string, string> = {
      'Disponible': 'disponible',
      'Ocupada': 'ocupada',
      'En Mantenimiento': 'mantenimiento',
      'Fuera de Servicio': 'fuera-servicio'
    };
    return statusMap[estado] || 'disponible';
  }

  getStatusMessage(estado: string): string {
    switch (estado) {
      case 'Disponible': return 'Disponible para reservar';
      case 'Ocupada': return 'Ocupada - Puede reservar en otro horario';
      case 'En Mantenimiento': return 'En mantenimiento - No disponible';
      case 'Fuera de Servicio': return 'Fuera de servicio - No disponible';
      default: return estado;
    }
  }

  getStatusIcon(estado: string): string {
    switch (estado) {
      case 'Disponible': return 'check_circle';
      case 'Ocupada': return 'event_busy';
      case 'En Mantenimiento': return 'build';
      case 'Fuera de Servicio': return 'block';
      default: return 'help';
    }
  }

  // Helper method
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