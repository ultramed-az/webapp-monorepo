import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import type { Request, Response } from 'express';
import { randomUUID } from 'crypto';
import { MulterError } from 'multer';

type ErrorContract = {
  success: false;
  statusCode: number;
  code: string;
  message: string;
  details: unknown;
  timestamp: string;
  path: string;
  requestId: string;
  error: {
    code: string;
    message: string;
    details: unknown;
  };
};

type NormalizedError = {
  statusCode: number;
  code: string;
  message: string;
  details: unknown;
  originalMessage?: string;
  stack?: string;
};

const STATUS_CODE_TO_ERROR_CODE: Record<number, string> = {
  [HttpStatus.BAD_REQUEST]: 'BAD_REQUEST',
  [HttpStatus.UNAUTHORIZED]: 'UNAUTHORIZED',
  [HttpStatus.FORBIDDEN]: 'FORBIDDEN',
  [HttpStatus.NOT_FOUND]: 'NOT_FOUND',
  [HttpStatus.METHOD_NOT_ALLOWED]: 'METHOD_NOT_ALLOWED',
  [HttpStatus.CONFLICT]: 'CONFLICT',
  [HttpStatus.UNPROCESSABLE_ENTITY]: 'UNPROCESSABLE_ENTITY',
  [HttpStatus.TOO_MANY_REQUESTS]: 'TOO_MANY_REQUESTS',
  [HttpStatus.INTERNAL_SERVER_ERROR]: 'INTERNAL_SERVER_ERROR',
  [HttpStatus.BAD_GATEWAY]: 'BAD_GATEWAY',
  [HttpStatus.SERVICE_UNAVAILABLE]: 'SERVICE_UNAVAILABLE',
  [HttpStatus.GATEWAY_TIMEOUT]: 'GATEWAY_TIMEOUT',
};

const INTERNAL_ERROR_MESSAGE = 'Unexpected internal server error';

@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(GlobalExceptionFilter.name);

  catch(exception: unknown, host: ArgumentsHost): void {
    const ctx = host.switchToHttp();
    const request = ctx.getRequest<Request>();
    const response = ctx.getResponse<Response>();

    const requestId = this.resolveRequestId(request);
    const normalized = this.normalizeException(exception);
    const payload = this.toErrorContract(normalized, request, requestId);

    response.setHeader('x-request-id', requestId);

    if (normalized.statusCode >= HttpStatus.INTERNAL_SERVER_ERROR) {
      this.logger.error(
        `[${requestId}] ${request.method} ${request.originalUrl} -> ${normalized.statusCode} (${normalized.code}) ${normalized.originalMessage ?? normalized.message}`,
        normalized.stack,
      );
    } else {
      this.logger.warn(
        `[${requestId}] ${request.method} ${request.originalUrl} -> ${normalized.statusCode} (${normalized.code}) ${normalized.message}`,
      );
    }

    response.status(normalized.statusCode).json(payload);
  }

  private normalizeException(exception: unknown): NormalizedError {
    if (exception instanceof HttpException) {
      const statusCode = exception.getStatus();
      const responseBody = exception.getResponse();
      const extracted = this.extractFromHttpExceptionResponse(responseBody);
      const fallbackCode = this.toErrorCode(statusCode);

      return {
        statusCode,
        code: extracted.code ?? fallbackCode,
        message: extracted.message ?? exception.message ?? 'Request failed',
        details: extracted.details,
      };
    }

    if (exception instanceof MulterError) {
      return {
        statusCode: HttpStatus.BAD_REQUEST,
        code: 'FILE_UPLOAD_ERROR',
        message: exception.message,
        details: {
          field: exception.field,
          code: exception.code,
        },
        originalMessage: exception.message,
        stack: exception.stack,
      };
    }

    if (exception instanceof Error) {
      return {
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        code: this.toErrorCode(HttpStatus.INTERNAL_SERVER_ERROR),
        message: INTERNAL_ERROR_MESSAGE,
        details: null,
        originalMessage: exception.message,
        stack: exception.stack,
      };
    }

    return {
      statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
      code: this.toErrorCode(HttpStatus.INTERNAL_SERVER_ERROR),
      message: INTERNAL_ERROR_MESSAGE,
      details: null,
    };
  }

  private extractFromHttpExceptionResponse(responseBody: unknown): {
    code?: string;
    message?: string;
    details: unknown;
  } {
    if (typeof responseBody === 'string') {
      return {
        message: responseBody,
        details: null,
      };
    }

    if (!responseBody || typeof responseBody !== 'object') {
      return {
        details: null,
      };
    }

    const body = responseBody as {
      code?: unknown;
      message?: unknown;
      error?: unknown;
      details?: unknown;
    };

    const message = this.extractMessage(body.message, body.error);
    const details =
      body.details ??
      (Array.isArray(body.message) ? body.message : null);

    return {
      code: typeof body.code === 'string' ? body.code : undefined,
      message,
      details,
    };
  }

  private extractMessage(message: unknown, fallback: unknown): string | undefined {
    if (typeof message === 'string' && message.length > 0) {
      return message;
    }

    if (Array.isArray(message)) {
      const list = message.filter((item): item is string => typeof item === 'string');
      if (list.length > 0) {
        return list.join(', ');
      }
    }

    if (typeof fallback === 'string' && fallback.length > 0) {
      return fallback;
    }

    return undefined;
  }

  private toErrorContract(
    normalized: NormalizedError,
    request: Request,
    requestId: string,
  ): ErrorContract {
    return {
      success: false,
      statusCode: normalized.statusCode,
      code: normalized.code,
      message: normalized.message,
      details: normalized.details ?? null,
      timestamp: new Date().toISOString(),
      path: request.originalUrl ?? request.url,
      requestId,
      error: {
        code: normalized.code,
        message: normalized.message,
        details: normalized.details ?? null,
      },
    };
  }

  private toErrorCode(statusCode: number): string {
    return STATUS_CODE_TO_ERROR_CODE[statusCode] ?? 'HTTP_ERROR';
  }

  private resolveRequestId(request: Request): string {
    const rawRequestId = request.headers['x-request-id'];
    if (typeof rawRequestId === 'string' && rawRequestId.trim().length > 0) {
      return rawRequestId.trim();
    }

    if (Array.isArray(rawRequestId) && rawRequestId.length > 0) {
      const first = rawRequestId[0]?.trim();
      if (first) {
        return first;
      }
    }

    return randomUUID();
  }
}
