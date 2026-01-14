import { UserRole } from '../common/enums/user-role.enum';
export interface UserDto {
    id: string;
    name: string;
    email: string;
    role: UserRole;
}
export interface CreateUserDto {
    name: string;
    email: string;
    role: UserRole;
}
export interface UpdateUserDto {
    name?: string;
    email?: string;
    role?: UserRole;
}
export declare class RegisterDto {
    email: string;
    password: string;
    name: string;
    nic?: string;
}
export declare class LoginDto {
    email: string;
    password: string;
}
export interface AuthResponseDto {
    access_token: string;
    user: UserDto;
}
