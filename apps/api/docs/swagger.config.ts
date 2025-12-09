/**
 * Main Swagger/OpenAPI configuration
 * This file combines all documentation parts into a complete OpenAPI specification
 */
import envConfig from '../src/config/envConfig';

import { components, tags } from './components';
import { paths } from './paths';

import type { Options } from 'swagger-jsdoc';

const swaggerConfig: Options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Team Collaboration API',
      version: '1.0.0',
      description:
        'A comprehensive API for team collaboration, project management, and task tracking',
      contact: {
        name: 'API Support'
      },
      license: {
        name: 'MIT',
        url: 'https://opensource.org/licenses/MIT'
      }
    },
    servers: [
      {
        url: `http://localhost:${envConfig.PORT}/api/v1`,
        description: 'Development server'
      }
    ],
    components,
    tags,
    paths
  },
  apis: []
};

export default swaggerConfig;
