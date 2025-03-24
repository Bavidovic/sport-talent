export interface User {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  account_type: string;
  resetToken?: string;
  resetTokenExpiry?: Date;
  profile_picture?: string; // Add this line
}

/*export interface User {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  account_type: string;
  resetToken?: string;
  resetTokenExpiry?: Date;
}
*/