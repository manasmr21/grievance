import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import dotenv from 'dotenv';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

dotenv.config();

const PORT = process.env.PORT;

async function bootstrap() {

  const app = await NestFactory.create(AppModule);
  app.enableCors({
    origin: true,
    credentials: true,
  });

  // Swagger Config
  const config = new DocumentBuilder()
    .setTitle('Grievance Management API')
    .setDescription('API documentation')
    .setVersion('1.0')
    .addBearerAuth()
    .build();

  // Create Swagger Document
  const document = SwaggerModule.createDocument(
    app,
    config,
  );

  // Swagger Route
  SwaggerModule.setup(
    'api/docs',
    app,
    document,
  );


  await app.listen(PORT ?? 8080, () => {
    console.log(`Server is running on http://localhost:${PORT}`)
    console.log(`Swagger Documentation is running on http://localhost:${PORT}/api/docs`)
  });
}
void bootstrap();
