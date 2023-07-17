import { AuthGuard } from '@nestjs/passport'

// Custom class guard
export class JwtGuard extends AuthGuard('jwt') {
    constructor() {
        super();
    }
}