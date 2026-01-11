const swaggerSpec = {
  openapi: '3.0.0',
  info: {
    title: 'REST Assignment API',
    version: '1.0.0',
    description: 'API documentation for Posts, Comments and Users with JWT auth',
  },
  servers: [{ url: 'http://localhost:3000' }],
  components: {
    securitySchemes: {
      bearerAuth: { type: 'http', scheme: 'bearer', bearerFormat: 'JWT' },
    },
    schemas: {
      User: {
        type: 'object',
        properties: {
          id: { type: 'string' },
          username: { type: 'string' },
          email: { type: 'string' },
          displayName: { type: 'string' },
          bio: { type: 'string' },
        },
      },
      Post: {
        type: 'object',
        properties: {
          _id: { type: 'string' },
          title: { type: 'string' },
          body: { type: 'string' },
          senderId: { $ref: '#/components/schemas/User' },
          createdAt: { type: 'string', format: 'date-time' },
        },
      },
      Comment: {
        type: 'object',
        properties: {
          _id: { type: 'string' },
          postId: { type: 'string' },
          authorId: { $ref: '#/components/schemas/User' },
          text: { type: 'string' },
          createdAt: { type: 'string', format: 'date-time' },
        },
      },
      AuthResponse: {
        type: 'object',
        properties: {
          accessToken: { type: 'string' },
          user: { $ref: '#/components/schemas/User' },
        },
      },
    },
  },
  security: [{ bearerAuth: [] }],
  paths: {
    '/auth/register': {
      post: {
        summary: 'Register a new user',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  username: { type: 'string' },
                  email: { type: 'string' },
                  password: { type: 'string' },
                  displayName: { type: 'string' },
                },
                required: ['username', 'email', 'password'],
              },
            },
          },
        },
        responses: { '201': { description: 'Created', content: { 'application/json': { schema: { $ref: '#/components/schemas/AuthResponse' } } } } },
      },
    },
    '/auth/login': {
      post: {
        summary: 'Login (email or username + password)',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: { type: 'object', properties: { identifier: { type: 'string' }, password: { type: 'string' } }, required: ['identifier', 'password'] },
            },
          },
        },
        responses: { '200': { description: 'OK', content: { 'application/json': { schema: { $ref: '#/components/schemas/AuthResponse' } } } } },
      },
    },
    '/auth/refresh': {
      post: {
        summary: 'Refresh access token using refresh cookie/token',
        responses: { '200': { description: 'New access token', content: { 'application/json': { schema: { type: 'object', properties: { accessToken: { type: 'string' } } } } } } },
      },
    },
    '/users': {
      get: { summary: 'List users', responses: { '200': { description: 'OK' } } },
    },
    '/users/{id}': {
      get: { summary: 'Get user by id', parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }], responses: { '200': { description: 'OK' } } },
    },
    '/post': {
      post: {
        summary: 'Create post (auth required)',
        security: [{ bearerAuth: [] }],
        requestBody: { required: true, content: { 'application/json': { schema: { type: 'object', properties: { title: { type: 'string' }, body: { type: 'string' } }, required: ['title', 'body'] } } } },
        responses: { '201': { description: 'Created' } },
      },
      get: { summary: 'List posts', responses: { '200': { description: 'OK' } } },
    },
    '/post/{id}': {
      get: { summary: 'Get post', parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }], responses: { '200': { description: 'OK' } } },
      put: { summary: 'Update post (owner only)', security: [{ bearerAuth: [] }], requestBody: { required: true, content: { 'application/json': { schema: { type: 'object', properties: { title: { type: 'string' }, body: { type: 'string' } }, required: ['title', 'body'] } } } }, responses: { '200': { description: 'OK' } } },
      delete: { summary: 'Delete post (owner only)', security: [{ bearerAuth: [] }], parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }], responses: { '204': { description: 'Deleted' } } },
    },
    '/comment': {
      post: { summary: 'Create comment (auth required)', security: [{ bearerAuth: [] }], requestBody: { required: true, content: { 'application/json': { schema: { type: 'object', properties: { postId: { type: 'string' }, text: { type: 'string' } }, required: ['postId', 'text'] } } } }, responses: { '201': { description: 'Created' } } },
      get: { summary: 'List comments', responses: { '200': { description: 'OK' } } },
    },
    '/comment/{id}': {
      get: { summary: 'Get comment', parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }], responses: { '200': { description: 'OK' } } },
      put: { summary: 'Update comment (owner only)', security: [{ bearerAuth: [] }], requestBody: { required: true, content: { 'application/json': { schema: { type: 'object', properties: { text: { type: 'string' } }, required: ['text'] } } } }, responses: { '200': { description: 'OK' } } },
      delete: { summary: 'Delete comment (owner only)', security: [{ bearerAuth: [] }], parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }], responses: { '204': { description: 'Deleted' } } },
    },
  },
};

module.exports = swaggerSpec;
