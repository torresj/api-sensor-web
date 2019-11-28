import { Component, OnInit, Inject } from "@angular/core";
import { MatDialogRef } from "@angular/material";
import { MAT_DIALOG_DATA } from "@angular/material/dialog";

@Component({
  selector: "app-delete-user-dialog",
  templateUrl: "./delete-user-dialog.component.html",
  styleUrls: ["./delete-user-dialog.component.css"]
})
export class DeleteUserDialogComponent implements OnInit {
  constructor(
    public dialogRef: MatDialogRef<DeleteUserDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  ngOnInit() {}
}
