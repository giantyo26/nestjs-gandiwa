# nestjs-gandiwa
## Installation
### Packages
- Nest.js
- MySQL
- TypeORM
- Passport JS
- JWT
- Swagger

### Install all packages using NPM
```bash
npm i
```
### Usage
```bash
npm run start:dev
```

### Endpoint list
## Register
```bash
http://localhost:3000/v1/auth/register

# Request body example
{
  "username": "test",
  "email": "test@gmail.com",
  "password": "test"
}
```
## Login
```bash
http://localhost:3000/v1/auth/login

# Request body example
{
  "username": "test",
  "email": "test@gmail.com",
  "password": "test"
}

# Response body example
{
  "msg": "Login successful",
  "data": {
    "id": 2,
    "username": "ben",
    "email": "ben@gmail.com",
    "password": "$2b$12$PbmGwmlTLvMBZ68/frUafeG5jrvw2hm0cTtUpLCDnkGjcIG6Es9XG"
  },
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOjIsImVtYWlsIjoiYmVuQGdtYWlsLmNvbSIsImlhdCI6MTY4OTU2MDAxMCwiZXhwIjoxNjg5NTYyNzEwfQ.GaBb23mFnm8AEBE4P4t-J5dT0Tg6NB5coR2olsDGUCQ"
}
```

## Get current user
```bash
http://localhost:3000/v1/profiles/me

# Request example
Input the bearer token
# Response
Will Return the user associated with the provided token
```

## Update profile for current user
```bash
http://localhost:3000/profiles/

# Request example
You must provide the bearer token for the user whose profile you wish to update.
With request body
{
  "displayname": "ben p",
  "age": 21,
  "bio": "hoobla"
}
```
