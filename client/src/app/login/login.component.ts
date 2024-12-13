import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Component } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-login',
  imports: [HttpClientModule, CommonModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {
  user: any;

  constructor(private http: HttpClient, private router: Router) {}
  ngOnDestroy(): void {
  }

	ngOnInit(): void {
		const urlParams = new URLSearchParams(window.location.search);
		const code = urlParams.get('code');

		if (code) {
			this.http.post<any>('http://localhost:3000/api/v1/auth/github/callback', { code }).subscribe(
			(response: any) => {
				// this.user = response.user;
			},
			(error: any) => {
				console.error('Error during GitHub authentication', error);
			}
			);
		}
	}

	loginWithGitHub(): void {
    	window.location.href = 'http://localhost:3000/api/v1/auth/github';
	}
}
