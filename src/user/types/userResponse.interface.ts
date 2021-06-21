import { UserType } from '@app/user/types/userType';

export interface UserResponseInterface {
  user: UserType & { token: string };
}
