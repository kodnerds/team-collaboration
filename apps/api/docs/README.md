# API Documentation Structure

This folder contains the OpenAPI/Swagger documentation for the Team Collaboration API, organized in a modular and maintainable structure.

## Folder Structure

```
docs/
├── README.md                 # This file
├── swagger.config.ts         # Main configuration file
├── components.ts             # Security schemes, responses, tags
├── schemas/                  # Data model schemas
│   ├── index.ts             # Export all schemas
│   ├── common.schema.ts     # Common schemas (pagination, errors)
│   ├── user.schema.ts       # User-related schemas
│   ├── auth.schema.ts       # Authentication schemas
│   ├── project.schema.ts    # Project-related schemas
│   └── task.schema.ts       # Task-related schemas
└── paths/                    # API endpoint definitions
    ├── index.ts             # Export all paths
    ├── auth.paths.ts        # Authentication endpoints
    ├── projects.paths.ts    # Project endpoints
    └── tasks.paths.ts       # Task endpoints
```

## How to Add New Documentation

### Adding a New Schema

1. Create a new file in `schemas/` or add to an existing one:
   ```typescript
   export const MyNewSchema = {
     type: 'object',
     properties: {
       // ... your schema properties
     }
   };
   ```

2. Export it from `schemas/index.ts`:
   ```typescript
   import { MyNewSchema } from './my-new.schema';
   
   export const schemas = {
     // ... existing schemas
     MyNew: MyNewSchema
   };
   ```

### Adding New Endpoints

1. Create a new file in `paths/` or add to an existing one:
   ```typescript
   export const myNewPaths = {
     '/my-endpoint': {
       get: {
         tags: ['MyTag'],
         summary: 'My endpoint',
         // ... endpoint definition
       }
     }
   };
   ```

2. Export it from `paths/index.ts`:
   ```typescript
   import { myNewPaths } from './my-new.paths';
   
   export const paths = {
     ...existingPaths,
     ...myNewPaths
   };
   ```

### Adding a New Tag

Add your tag to the `tags` array in `components.ts`:
```typescript
export const tags = [
  // ... existing tags
  {
    name: 'MyNewTag',
    description: 'Description of my new tag'
  }
];
```

## Best Practices

- **Keep schemas focused**: Each schema file should handle a specific domain (users, projects, tasks, etc.)
- **Reuse components**: Use `$ref` to reference existing schemas
- **Add examples**: Include example values in your schemas for better documentation
- **Document errors**: Always include appropriate error responses (400, 401, 404, etc.)
- **Update README**: Keep this file updated when adding major structural changes

## Accessing the Documentation

Once the API server is running, access the interactive documentation at:
- **URL**: `http://localhost:{PORT}/docs`
- **Format**: Swagger UI with interactive testing capabilities

## References

- [OpenAPI 3.0 Specification](https://swagger.io/specification/)
- [Swagger UI Documentation](https://swagger.io/tools/swagger-ui/)
- [swagger-jsdoc](https://github.com/Surnet/swagger-jsdoc)

