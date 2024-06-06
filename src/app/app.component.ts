import { Component, OnInit, ViewChild } from '@angular/core';
import { ApiService } from './services/api.service';
import { DialogComponent } from './dialog/dialog.component';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { MatDialog } from '@angular/material/dialog';
import { DeleteConfirmationComponent } from './delete-confirmation/delete-confirmation.component';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'user_management_task';

  displayedColumns: string[] = ['Name', 'Email', 'Role', 'Action'];
  dataSource: MatTableDataSource<any> = new MatTableDataSource();

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(private api: ApiService, private dialog: MatDialog) { }

  ngOnInit(): void {
    this.getAllUser();
  }

  getAllUser() {
    this.api.getUser().subscribe({
      next: (res) => {
        this.dataSource.data = res;
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
      },
      error: (err) => {
        alert("Error while fetching the records");
      }
    });
  }

  EditUser(row: any) {
    this.dialog.open(DialogComponent, {
      width: '80%',
      data: row
    }).afterClosed().subscribe(val => {
      if (val === 'update') {
        this.getAllUser();
      }
    });
  }

  deleteUser(id: number) {
    const dialogRef = this.dialog.open(DeleteConfirmationComponent);
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.api.deleteUser(id).subscribe({
          next: (res) => {
            alert("User Deleted Successfully");
            this.getAllUser();
          },
          error: () => {
            alert("Error while deleting user");
          }
        });
      }
    });
  }


  // deleteUser(id: number) {
  //   this.api.deleteUser(id).subscribe({
  //     next: (res) => {
  //       alert("User Deleted Successfully");
  //       this.getAllUser();
  //     },
  //     error: () => {
  //       alert("Error while deleting user");
  //     }
  //   });
  // }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  openDialog() {
    this.dialog.open(DialogComponent, {
      width: '70%'
    }).afterClosed().subscribe(value => {
      if (value === 'save') {
        this.getAllUser();
      }
    });
  }
}
