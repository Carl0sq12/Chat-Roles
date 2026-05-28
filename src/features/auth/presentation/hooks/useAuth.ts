import { useMutation } from "@tanstack/react-query";
import { useRouter } from "expo-router";
import { LoginUseCase } from "../../application/use-cases/LoginUseCase";
import { RegisterUseCase } from "../../application/use-cases/RegisterUseCase";
//import { SupabaseAuthRepository } from "../../infrastructure/repositories/SupabaseAuthRepository";
import { AppwriteAuthRepository } from '../../infrastructure/repositories/AppwriteAuthRepository';
import { useAuthStore } from "../store/authStore";
import { UserRole } from "../../domain/entities/User";

type RegisterDto = { email: string; password: string; username: string; role: UserRole };

//const authRepo = new SupabaseAuthRepository();
const authRepo = new AppwriteAuthRepository();
const loginUseCase = new LoginUseCase(authRepo);
const registerUseCase = new RegisterUseCase(authRepo);

export function useAuth() {
  const { user, setUser } = useAuthStore();
  const router = useRouter();

  const loginMutation = useMutation({
    mutationFn: ({ email, password }: { email: string; password: string }) =>
      loginUseCase.execute(email, password), //usa el use case login
    onSuccess: (user) => {
      setUser(user);
      router.replace("/(app)");
    },
  });

  const registerMutation = useMutation({
    mutationFn: ({ email, password, username, role }: RegisterDto) =>
      registerUseCase.execute(email, password, username, role),  // ← pasar role
    onSuccess: (user) => {
      setUser(user);
      router.replace("/(app)");
    },
  });

  const logout = async () => {
    try { await authRepo.logout(); }
    finally {
      setUser(null);
      router.replace("/(auth)/login");
    }
  };

  return {
    user,
    login: loginMutation.mutate,
    register: registerMutation.mutate,
    logout,
    isLoading: loginMutation.isPending || registerMutation.isPending,
    error: loginMutation.error?.message ?? registerMutation.error?.message ?? null,
  };
}



//Single Responsibility (una única funcion )
// Login
//Supabase 
//Auth
//SendMessage



//OPEN/CLOSED

//Modificacion de base de datos

//L-Liskov Substitution

//Deben cumplir con los paramateros establecidos, para no romper promesas

//I — Interface Segregation

//IAuth
//Ichat

//D — Dependency Inversion

// LoginUseCase depende de IAuthRepository (abstracción) realiza 
//constructor(private readonly authRepo: IAuthRepository) {}

// NO hace esto :
//onstructor(private readonly authRepo: SupabaseAuthRepository) {} no realiza