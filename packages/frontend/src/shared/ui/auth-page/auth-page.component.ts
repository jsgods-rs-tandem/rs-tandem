import { Component, input } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-auth-page',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './auth-page.component.html',
  styleUrl: './auth-page.component.scss',
})
export class AuthPageComponent {
  heading = input.required<string>();
  switchText = input.required<string>();
  switchRoute = input.required<string>();
  switchLinkText = input.required<string>();
}
