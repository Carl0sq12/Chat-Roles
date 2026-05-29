export class AppError extends Error {
  constructor(
    public readonly code: string,
    message: string,
    public readonly cause?: unknown
  ) {
    super(message);
    this.name = 'AppError';
  }
}

export class AuthError extends AppError {
  constructor(message: string, cause?: unknown) {
    super('AUTH_ERROR', message, cause);
  }
}

export class PetError extends AppError {
  constructor(message: string, cause?: unknown) {
    super('PET_ERROR', message, cause);
  }
}

export class RequestError extends AppError {
  constructor(message: string, cause?: unknown) {
    super('REQUEST_ERROR', message, cause);
  }
}

export class AssistantError extends AppError {
  constructor(message: string, cause?: unknown) {
    super('ASSISTANT_ERROR', message, cause);
  }
}

export class ChatError extends AppError {
  constructor(message: string, cause?: unknown) {
    super('CHAT_ERROR', message, cause);
  }
}