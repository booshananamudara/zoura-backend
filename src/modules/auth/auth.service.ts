import { Injectable, UnauthorizedException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { User } from './entities/user.entity';
import { RegisterDto, LoginDto } from '../../dto/user.dto';
import { SubscriptionTier } from '../../common/enums';

@Injectable()
export class AuthService {
    constructor(
        @InjectRepository(User)
        private userRepository: Repository<User>,
        private jwtService: JwtService,
    ) { }

    /**
     * Register a new user (mobile app only)
     * @param registerDto - Contains email, password, name, nic (optional)
     * @returns The new user without password
     */
    async register(registerDto: RegisterDto): Promise<Omit<User, 'password'>> {
        const { email, password, name, nic } = registerDto;

        // Check if user exists
        const existingUser = await this.userRepository.findOne({
            where: { email },
        });

        if (existingUser) {
            throw new ConflictException('User with this email already exists');
        }

        // Hash password using bcrypt
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create user
        const user = this.userRepository.create({
            email,
            name,
            password: hashedPassword,
            nic: nic || '',
            subscription_tier: SubscriptionTier.FREE,
        });

        // Save to DB
        const savedUser = await this.userRepository.save(user);

        // Return user without password
        const { password: _, ...userWithoutPassword } = savedUser;
        return userWithoutPassword;
    }

    /**
     * Login a user (mobile app only)
     * @param loginDto - Contains email and password
     * @returns Object with access_token
     */
    async login(loginDto: LoginDto): Promise<{ access_token: string }> {
        const { email, password } = loginDto;

        // Find user with password field
        const user = await this.userRepository.findOne({
            where: { email },
            select: ['id', 'email', 'name', 'password'],
        });

        if (!user) {
            throw new UnauthorizedException('Invalid credentials');
        }

        // Compare password hash
        const isPasswordValid = await bcrypt.compare(password, user.password);

        if (!isPasswordValid) {
            throw new UnauthorizedException('Invalid credentials');
        }

        // Generate JWT token
        const payload = {
            sub: user.id,
            email: user.email,
            role: 'USER', // Role-based authentication
        };

        const access_token = this.jwtService.sign(payload);

        return {
            access_token,
        };
    }

    /**
     * Validate user by JWT payload (used by JWT strategy)
     * @param payload - JWT payload containing sub (user ID)
     * @returns User object or null
     */
    async validateUser(payload: any): Promise<User | null> {
        const user = await this.userRepository.findOne({
            where: { id: payload.sub },
        });

        return user;
    }

    /**
     * Validate user credentials (used by Local strategy)
     * @param email - User email
     * @param password - User password
     * @returns User object without password or null
     */
    async validateUserCredentials(email: string, password: string): Promise<any> {
        const user = await this.userRepository.findOne({
            where: { email },
            select: ['id', 'email', 'name', 'password'],
        });

        if (user && (await bcrypt.compare(password, user.password))) {
            const { password: _, ...result } = user;
            return result;
        }
        return null;
    }

    /**
     * Find user by email
     * @param email - User email
     * @returns User object or null
     */
    async findByEmail(email: string): Promise<User | null> {
        return this.userRepository.findOne({ where: { email } });
    }

    /**
     * Find user by ID
     * @param id - User ID
     * @returns User object or null
     */
    async findById(id: string): Promise<User | null> {
        return this.userRepository.findOne({ where: { id } });
    }
}
