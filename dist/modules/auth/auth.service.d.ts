import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import { User } from './entities/user.entity';
import { RegisterDto, LoginDto } from '../../dto/user.dto';
export declare class AuthService {
    private userRepository;
    private jwtService;
    constructor(userRepository: Repository<User>, jwtService: JwtService);
    register(registerDto: RegisterDto): Promise<Omit<User, 'password'>>;
    login(loginDto: LoginDto): Promise<{
        access_token: string;
    }>;
    validateUser(payload: any): Promise<User | null>;
    validateUserCredentials(email: string, password: string): Promise<any>;
    findByEmail(email: string): Promise<User | null>;
    findById(id: string): Promise<User | null>;
}
