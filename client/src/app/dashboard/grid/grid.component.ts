import { HttpClient } from '@angular/common/http';
import { Component, Input, OnInit } from '@angular/core';
import { Module } from '@ag-grid-community/core';

import { ClientSideRowModelModule } from '@ag-grid-community/client-side-row-model';
import { AgGridModule, AgGridAngular } from '@ag-grid-community/angular';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { forkJoin } from 'rxjs';

@Component({
	selector: 'app-grid',
	imports: [ AgGridAngular, FormsModule, CommonModule ],
	templateUrl: './grid.component.html',
	styleUrl: './grid.component.scss'
})
export class GridComponent implements OnInit {
  @Input() integrations: any = [];
	columnDefs: any[] = [];
	rowData: any[] = [];
  columns: any[] = [];
  totalRecords: number = 0;
  currentPage: number = 1;
  pageSize: number = 10;
  searchKeyword: string = '';
  sortField: string = 'name';
  sortOrder: string = 'asc';
	selectedRepo: string | null = null;
  _integration: string = 'abhishekkatara';
  selectedCollection: string = '';
  collections: any = []
	modules: Module[] = [ ClientSideRowModelModule ];
	constructor(private http: HttpClient) {}

	ngOnInit(): void {
		this.fetchCollections();
	}

  onIntegrationSelect(event: Event): void {
    this.integrations = (event.target as HTMLSelectElement).value;
  }

  onCollectionSelect(event: Event): void {
    this.selectedCollection = (event.target as HTMLSelectElement).value;
    this.fetchData();
  }

   onSearch(event: Event): void {
    this.searchKeyword = (event.target as HTMLInputElement).value;
    this.currentPage = 1;
    this.fetchData();
  }

  onPageChange(page: number): void {
    this.currentPage = page;
    this.fetchData();
  }

  onSortChanged(event: any): void {
    const sortModel = event.api.getSortModel();
    if (sortModel.length > 0) {
      this.sortField = sortModel[0].colId;
      this.sortOrder = sortModel[0].sort;
    } else {
      this.sortField = 'name';
      this.sortOrder = 'asc';
    }
    this.fetchData();
  }

  fetchCollections(): void {
    this.http.get<string[]>('http://localhost:3000/api/v1/github/collections').subscribe(
      (data) => {
        this.collections = data;
      },
      (error) => {
        console.error('Error fetching collections:', error);
      }
    );
  }

  fetchData(): void {
    const columnsUrl = `http://localhost:3000/api/v1/github/columns/${this.selectedCollection}`;
    const dataUrl = `http://localhost:3000/api/v1/github/data/${this.selectedCollection}`;

    if (!this.selectedCollection) {
      return;
    }

    const params = { search: this.searchKeyword };

    forkJoin({
      columns: this.http.post<any[]>(columnsUrl, { collection: this.selectedCollection }),
      data: this.http.get<any[]>(dataUrl, { params }),
    }).subscribe(
      (response: any) => {
        console.log('Columns:', response.columns);
        console.log('Data:', response.data);

        this.columnDefs = response.columns.columns
        this.rowData = response.data;
      },
      (error) => {
        console.error('Error fetching columns and data:', error);
      }
    );

    // this.http.get<any[]>(`http://localhost:3000/api/v1/github/data/${this.selectedCollection}`, { params }).subscribe(
    //   (data) => {
    //     if (data.length > 0) {
    //       // Dynamically set columns based on the first document
    //       this.columnDefs = Object.keys(data[0]).map((key) => ({
    //         field: key,
    //         headerName: key.toUpperCase(),
    //         sortable: true,
    //         filter: true,
    //         resizable: true,
    //       }));
    //     }
    //     this.rowData = data;
    //   },
    //   (error) => {
    //     console.error('Error fetching data:', error);
    //   }
    // );
  }

	onGridReady(params: any): void {
		params.api.sizeColumnsToFit(); // Auto-adjust column widths
	}
}
