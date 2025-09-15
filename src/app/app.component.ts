import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { NavbarComponent } from "./pages/header/navbar/navbar.component";
@Component({
  selector: 'app-root',
  imports: [RouterOutlet, ButtonModule, NavbarComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'food-pos-frontend';
}
