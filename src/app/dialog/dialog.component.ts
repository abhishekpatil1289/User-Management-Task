import { Component, Inject, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ApiService } from '../services/api.service';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-dialog',
  templateUrl: './dialog.component.html',
  styleUrls: ['./dialog.component.css']
})
export class DialogComponent implements OnInit {

  UserForm!: FormGroup;
  actionBTN: string = "Save";

  constructor(
    private formBuilder: FormBuilder,
    private api: ApiService,
    @Inject(MAT_DIALOG_DATA) public editData: any,
    private dialogRef: MatDialogRef<DialogComponent>
  ) { }

  ngOnInit(): void {
    this.UserForm = this.formBuilder.group({
      Name: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(50)]],
      Email: ['', [Validators.required, Validators.email]],
      Role: ['', Validators.required]
    });

    if (this.editData) {
      this.actionBTN = "Update";
      this.UserForm.controls['Name'].setValue(this.editData.Name);
      this.UserForm.controls['Email'].setValue(this.editData.Email);
      this.UserForm.controls['Role'].setValue(this.editData.Role);
    }
  }

  addUser() {
    if (!this.editData) {
      // Adding a new user
      if (this.UserForm.valid) {
        this.api.postUser(this.UserForm.value).subscribe({
          next: (response) => {
            alert("User Added Successfully");
            this.UserForm.reset();
            this.dialogRef.close('save');
          },
          error: () => {
            alert("Error while adding the user");
          }
        });
      }
    } else {
      // Updating an existing user
      this.updateUser();
      this.UserForm.markAllAsTouched();
    }
  }

  updateUser() {
    if (this.UserForm.valid) {
      this.api.putUser(this.UserForm.value, this.editData.id).subscribe({
        next: (res) => {
          alert("User Updated Successfully");
          this.UserForm.reset();
          this.dialogRef.close('update');
        },
        error: () => {
          alert("Error while updating the user");
        }
      });
    }
  }


  getErrorMessage(controlName: string): string {
    const control = this.UserForm.get(controlName);
    if (control!.hasError('required')) {
      return `${controlName} is required`;
    } else if (control!.hasError('email')) {
      return 'Not a valid email';
    } else if (control!.hasError('minlength')) {
      return `${controlName} must be at least ${control!.errors!['minlength'].requiredLength} characters long`;
    } else if (control!.hasError('maxlength')) {
      return `${controlName} cannot be more than ${control!.errors!['maxlength'].requiredLength} characters long`;
    }
    return '';
  }
}
