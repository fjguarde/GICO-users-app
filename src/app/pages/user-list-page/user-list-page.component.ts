import { UsersFormComponent } from 'src/app/components/users-form/users-form.component';
import { UsersTableComponent } from './../../components/users-table/users-table.component';
import { Component, OnInit } from '@angular/core';
import { User } from 'src/app/models/user';
import { UsersService } from '@services/users.service';
import { HttpClientModule } from '@angular/common/http';
import { ACTION_TYPE } from 'src/app/enums/action-type.enum';
import { UserTableAction } from '@models/table-action';
import { ConfirmationService } from 'primeng/api';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { CommonModule } from '@angular/common';
import { DialogService, DynamicDialogModule, DynamicDialogRef } from 'primeng/dynamicdialog';
import { UserEditModalComponent } from '@components/user-edit-modal/user-edit-modal.component';
import { take } from 'rxjs';
import { CardModule } from 'primeng/card';
const PRIME_NG_MODULES = [CardModule, DynamicDialogModule, ConfirmDialogModule];

@Component({
  selector: 'gico-user-list-page',
  standalone: true,
  imports: [
    CommonModule,
    UsersTableComponent,
    UsersFormComponent,
    HttpClientModule,
    PRIME_NG_MODULES
  ],
  providers: [UsersService, ConfirmationService, DialogService],
  templateUrl: './user-list-page.component.html',
  styleUrls: ['./user-list-page.component.scss'],
})
export class UserListPageComponent implements OnInit {
  public userList: User[] = [];
  public ACTION_TYPE = ACTION_TYPE;
  private ref!: DynamicDialogRef;

  constructor(
    private readonly userService: UsersService,
    private readonly confirmationService: ConfirmationService,
    private readonly dialogService: DialogService
  ) {}

  ngOnInit(): void {
    this.getUsers();
  }

  public onTableAction({ action, user }: UserTableAction): void {
    switch (action) {
      case 'delete':
        this.confirmDelete(user.id);
        break;
      case 'edit':
        this.openModalEditUser(user);
        break;

      default:
        break;
    }
  }

  public createUser(user: User): void {
    const newUser = {
      ...user,
      id: this.calculateNextId(this.userList),
    };
    this.userService.postUser(newUser).subscribe((userId) => {
      //Show toast
      this.getUsers();
    });
  }

  private confirmDelete(value: any): void {
    this.confirmationService.confirm({
      message: 'Are you sure that you want to proceed?',
      header: 'Confirmation',
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: 'Yes',
      rejectLabel: 'No',
      accept: () => this.deleteUser(value),
      reject: () => console.log('no'),
    });
  }

  private getUsers(): void {
    this.userService
      .getUsers()
      .subscribe((users: User[]) => (this.userList = users));
  }

  private openModalEditUser(user: User) {
    this.ref = this.dialogService.open(UserEditModalComponent, {
      header: `Edit user ${user.id}`,
      width: '30vw',
      modal:true,
      breakpoints: {
          '960px': '75vw',
          '640px': '90vw'
      },
      data: {user}
  });
  this.ref.onClose.pipe(take(1)).subscribe(()=> {
    this.getUsers();
  })
  }

  private deleteUser(value: string) {
    this.userService.deleteUserById(value).subscribe((userId) => {
      //Show toast
      this.getUsers();
    });
  }

  private calculateNextId(userList: User[]): string {
    const sortedUsers = userList
      .slice()
      .sort((a, b) => Number(b.id) - Number(a.id));
    return sortedUsers.length > 0 ? String(Number(sortedUsers[0].id) + 1) : '1';
  }
}
