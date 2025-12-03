// Frontend/src/app.ts (CORREGIDO)
import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router'; // Importación correcta para RouterOutlet

@Component({
  selector: 'app-root',
  imports: [RouterOutlet], // RouterOutlet ahora se importa correctamente
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
  protected readonly title = signal('FrontEnd');
}