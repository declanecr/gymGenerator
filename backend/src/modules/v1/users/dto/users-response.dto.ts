// This file is used for OUTGOING DATA when returning user information to the client
// - as of creation: this is only being used to hide the user's password when it's returned to the client
// - this is to prevent a DB model from being returned DIRECTLY

export class UserResponseDto {
  id: number;
  email: string;
  name?: string | null;
  createdAt: Date;

  constructor(user: {
    id: number;
    email: string;
    name?: string | null;
    createdAt: Date;
  }) {
    this.id = user.id;
    this.email = user.email;
    this.name = user.name;
    this.createdAt = user.createdAt;
  }
}
