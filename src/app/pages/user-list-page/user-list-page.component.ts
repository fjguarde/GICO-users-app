import { UsersFormComponent } from 'src/app/components/users-form/users-form.component';
import { UsersTableComponent } from './../../components/users-table/users-table.component';
import { Component } from '@angular/core';

@Component({
  selector: 'gico-user-list-page',
  standalone: true,
  imports: [UsersTableComponent, UsersFormComponent],
  templateUrl: './user-list-page.component.html',
  styleUrls: ['./user-list-page.component.scss']
})
export class UserListPageComponent {

}