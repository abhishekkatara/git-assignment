import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../shared/shared.module';
import { GridComponent } from "./grid/grid.component";

@Component({
  selector: 'app-dashboard',
  imports: [HttpClientModule, CommonModule, SharedModule, GridComponent],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})

export class DashboardComponent implements OnInit {
  user: any;
  integrations: any[] = [];
  loading = true;

  constructor(private route: ActivatedRoute, private http: HttpClient) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe((params) => {
      const accessToken = params['access_token'];
      if (accessToken) {
        this.fetchUserDetails(accessToken);
        this.fetchIntegrations();
      }
    });
  }

  fetchUserDetails(accessToken: string): void {
    this.http
      .get('https://api.github.com/user', {
        headers: { Authorization: `Bearer ${accessToken}` },
      })
      .subscribe(
        (response) => {
          this.user = response;
        },
        (error) => {
          console.error('Error fetching user details:', error);
        }
      );
  }
  fetchIntegrations(): void {
    this.http.get('http://localhost:3000/api/v1/github/integration/github').subscribe(
      (response: any) => {
        this.integrations = response//.map((integration: any) => { return integration.username; });
        this.loading = false;
      },
      (error) => {
        console.error('Failed to fetch integrations:', error);
        this.loading = false;
      }
    );
  }

  removeIntegration(username: string): void {
    this.http.delete(`http://localhost:3000/api/v1/github/integration/github/${username}`).subscribe(
      () => {
        this.integrations = this.integrations.filter((integration) => integration.username !== username);
      },
      (error) => console.error('Failed to remove integration:', error)
    );
  }
}
