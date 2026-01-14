import { AuthService } from './auth.service';
import { RegisterDto, LoginDto } from '../../dto/user.dto';
export declare class AuthController {
    private authService;
    constructor(authService: AuthService);
    register(registerDto: RegisterDto): Promise<{
        message: string;
        user: Omit<import("./entities").User, "password">;
    }>;
    login(loginDto: LoginDto): Promise<{
        access_token: string;
    }>;
    getProfile(user: any): any;
}
