import { AuthError } from '../../../../shared/domain/errors/AppError';
import { User } from '../../domain/entities/User';
import { IAuthRepository } from '../../domain/repositories/IAuthRepository';
//Valida reglas antes de llamar al repositorio.//logica se encuentra aquí-FR
export class LoginUseCase {
    constructor(private readonly authRepo: IAuthRepository) {}

    async execute(email: string, password: string): Promise<User> {  //Regla del negocio
        if (!email || !password) 
            throw new AuthError('Email y contraseña son requeridos');
        try {
            return await this.authRepo.login(email, password); //Llama a la interfaz para realizar el login
        } catch (error) {
            throw new AuthError('Credenciales inválidas', error);
        }
    }
};