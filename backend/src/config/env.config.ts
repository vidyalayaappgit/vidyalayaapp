import { plainToInstance } from 'class-transformer';
import {
  IsString,
  IsNumber,
  IsOptional,
  validateSync,
  registerDecorator,
} from 'class-validator';
import type { ValidationOptions } from 'class-validator';
import ms from 'ms';

/**
 * 🔥 Custom validator for ms time format (e.g., 1h, 2d)
 */
function IsMsString(validationOptions?: ValidationOptions) {
  return function (target: object, propertyName: string) {
    registerDecorator({
      name: 'isMsString',
      target: target.constructor,
      propertyName,
      options: (validationOptions ?? {}) as any,
      validator: {
        validate(value: unknown): boolean {
          if (typeof value !== 'string') return false;

          try {
            const parsed = ms(
              value as unknown as Parameters<typeof ms>[0]
            );
            return typeof parsed === 'number';
          } catch {
            return false;
          }
        },
      },
    });
  };
}

export class EnvironmentVariables {
  // 🔹 App
  @IsString()
  NODE_ENV: string = 'development';

  @IsNumber()
  @IsOptional()
  PORT: number = 3001;

  // 🔹 JWT
  @IsString()
  JWT_SECRET!: string;

  // ⚠️ IMPORTANT: use string (NOT StringValue) in decorated class
  @IsOptional()
  @IsMsString({ message: 'JWT_EXPIRES_IN must be valid (e.g. 1h, 2d)' })
  JWT_EXPIRES_IN: string = '8h';

  // 🔹 Frontend
  @IsString()
  @IsOptional()
  FRONTEND_URL: string = 'http://localhost:3000';

  // 🔹 Database
  @IsString()
  @IsOptional()
  DB_HOST: string = 'localhost';

  @IsNumber()
  @IsOptional()
  DB_PORT: number = 5432;

  @IsString()
  DB_USER!: string;

  @IsString()
  DB_PASS!: string;

  @IsString()
  DB_NAME!: string;
}

/**
 * 🔥 Validation function used by ConfigModule
 */
export function validate(config: Record<string, unknown>) {
  const validatedConfig = plainToInstance(EnvironmentVariables, config, {
    enableImplicitConversion: true,
  });

  const errors = validateSync(validatedConfig, {
    skipMissingProperties: false,
  });

  if (errors.length > 0) {
    const formattedErrors = errors.map((error) => ({
      property: error.property,
      constraints: error.constraints,
    }));

    throw new Error(
      `❌ Environment validation failed:\n${JSON.stringify(
        formattedErrors,
        null,
        2,
      )}`,
    );
  }

  return validatedConfig;
}