import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import {Logger, ValidationPipe} from "@nestjs/common";
import {ConfigService} from "@nestjs/config";
import {DocumentBuilder, SwaggerModule} from "@nestjs/swagger";

async function bootstrap() {
  const logger = new Logger('Bootstrap');
  const app = await NestFactory.create(AppModule, {
    cors: true
  });
  app.useGlobalPipes(new ValidationPipe({
    transform: true,
  }));
  const configService = app.get(ConfigService);
  const PORT = configService.get('PORT') || 3000;

  const config = new DocumentBuilder()
      .setTitle('TopTickets')
      .setDescription('TopTickets api')
      .setVersion('1.0')
      .build();
  const documentFactory = () => SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('swagger', app, documentFactory);

  await app.listen(PORT, ()=> {
    logger.log(`Test Application is running on port: ${PORT}`)
  });
}
bootstrap();
