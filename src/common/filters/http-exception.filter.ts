import {ExceptionFilter, Catch, ArgumentsHost, HttpException, Logger} from '@nestjs/common';
import {Response} from 'express';
import {HttpArgumentsHost} from "@nestjs/common/interfaces";

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
    private readonly logger = new Logger(HttpExceptionFilter.name);

    catch(exception: HttpException, host: ArgumentsHost) {
        const ctx: HttpArgumentsHost = host.switchToHttp();
        const response: Response = ctx.getResponse<Response>();

        const status: number = exception.getStatus();
        const errorResponse: string | object = exception.getResponse();

        this.logger.error(`HTTP Error: ${JSON.stringify(errorResponse)}`);

        response.status(status).json({
            statusCode: status,
            error: errorResponse,
        });
    }
}
