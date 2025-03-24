import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { User } from '../../../../types/user';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-user-profile',
  //standalone: true,
  imports: [CommonModule],
  templateUrl: './user-profile.component.html',
  styleUrl: './user-profile.component.css',
})
export class UserProfileComponent {
  user: User | null = null;
  userId: string | null = null;

  constructor(
    private userService: UserService,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.userId = this.route.snapshot.paramMap.get('userId');
    if (this.userId) {
      this.loadUserData(this.userId);
    }
  }

  loadUserData(id: string): void {
    this.userService.getSingleUser(id).subscribe({
      next: (data) => (this.user = data),
      error: (err) => console.error('Error fetching users:', err),
    });
  }

  getUserAvatar(): string {
    if (this.user?.profile_picture) {
      return this.user.profile_picture;
    }
    return `https://eu.ui-avatars.com/api/?name=${this.user?.firstName}+${this.user?.lastName}&size=200`;
  }
}
