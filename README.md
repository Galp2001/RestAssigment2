# REST Assignment

This repository implements a small REST API (TypeScript, Express, Mongoose) with Users, Posts and Comments and JWT authentication (access + refresh tokens).

Quick start

1. Install dependencies:

```bash
npm install
```

2. Add environment variables (create a `.env` file) - recommended:

```
PORT=3000
MONGO_URI=mongodb://localhost:27017/rest-assignment
ACCESS_TOKEN_SECRET=replace_me
REFRESH_TOKEN_SECRET=replace_me_too
ACCESS_TOKEN_EXPIRES_IN=15m
REFRESH_TOKEN_EXPIRES_IN=7d
BCRYPT_SALT_ROUNDS=10
```

3. Start the server (development):

```bash
npm run dev
```

4. Open API docs in your browser:

http://localhost:3000/docs

Running tests

```bash
npm test
```

Notes

- Swagger UI is served at `/docs` when `swagger-ui-express` is installed (it is included as a dependency).
- Tests use `mongodb-memory-server` and run with Jest.
- You may see Node engine and schema index warnings during tests; they do not currently block running the app or tests.

Next steps

- Add CI to run tests on push
- Expand Swagger examples and full response schemas
- Add deployment and environment guidance

Continuous integration

This repo includes a GitHub Actions workflow that runs the test suite on push and pull requests to `main`.

Badge (build status):

![CI](https://github.com/Galp2001/RestAssigment2/actions/workflows/ci.yml/badge.svg)

Useful API examples

- Register:

```bash
curl -X POST http://localhost:3000/auth/register \
	-H 'Content-Type: application/json' \
	-d '{"username":"alice","email":"alice@example.com","password":"P@ssw0rd"}'
```

- Login:

```bash
curl -X POST http://localhost:3000/auth/login \
	-H 'Content-Type: application/json' \
	-d '{"identifier":"alice","password":"P@ssw0rd"}'
```

OpenAPI /docs

Start the server and open `http://localhost:3000/docs` to view the interactive API docs (Swagger UI).

Troubleshooting

- If you see warnings about duplicate schema indexes for `username`/`email`, check model definitions and remove duplicate `index: true` or `schema.index()` usages.
- If GitHub Actions fails due to Node engine constraints, adjust the `node-version` in `.github/workflows/ci.yml` to a compatible version.
