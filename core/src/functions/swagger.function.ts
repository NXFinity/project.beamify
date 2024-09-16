import { INestApplication } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

export function setupSwagger(app: INestApplication) {
  const options = new DocumentBuilder()
    .setTitle('BEAMIFY ME')
    .setLicense('BEME LICENSE', 'https:/beamify.me/license')
    .setVersion('1.0')
    .setDescription('Nothing interesting here')
    .setContact('BEME Support Team', 'mailto:support@beamify.me', '')
    .setTermsOfService('https://beamify.me/legal/terms')
    .setExternalDoc('BEME Documentation', 'https://docs.beamify.me')
    .addSecurity('bearer', {
      type: 'http',
      scheme: 'bearer',
      bearerFormat: 'JWT',
    })
    .addSecurityRequirements('bearer')
    .addBearerAuth()
    .addTag('BEME: API', 'Frontend: BEAMIFY.ME')
    .build();
  const document = SwaggerModule.createDocument(app, options);
  const extraOptions = {
    swaggerOptions: {
      persistAuthorization: true,
    },
    customFavicon: 'https://oneorg.uk/favicon.ico',
    customSiteTitle: 'BEME: API',
    url: 'https://api.beamify.me/v1',
    servers: [
      {
        url: 'https://api.beamify.me/v1',
        description: 'Production',
      },
      {
        url: 'http://localhost:3021/v1',
        description: 'Development',
      },
    ],
  };
  SwaggerModule.setup('/v1', app, document, extraOptions);
}
