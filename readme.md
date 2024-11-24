
# Videosdk task

---

## Table of Contents
1. [Prerequisites](#prerequisites)
2. [Folder Structure](#folder-structure)
3. [Setup Instructions](#setup-instructions)
   - [Clone Repository](#clone-repository)
   - [Environment Variables](#environment-variables)
   - [Installing Dependencies](#installing-dependencies)
   - [Running the Server](#running-the-server)
   - [Running the Client](#running-the-client)
4. [Tech Stack](#tech-stack)

---

## Prerequisites

Ensure the following tools are installed on your system:

- Node.js (v16.x or higher)
- pnpm or yarn or npm ([issue](https://ui.shadcn.com/docs/react-19))
- MongoDB (local instance or MongoDB Atlas)

## Folder Structure

- ### Client

```
.
├── components.json
├── next.config.ts
├── package.json
├── package-lock.json
├── pnpm-lock.yaml
├── postcss.config.mjs
├── public
├── README.md
├── src
│   ├── api
│   ├── app
│   ├── components
│   ├── lib
│   └── util
├── tailwind.config.ts
└── tsconfig.json
```

- ### server

```
.
├── env.example
├── nodemon.json
├── package.json
├── pnpm-lock.yaml
├── prisma
│   └── schema.prisma
├── src
│   ├── features
│   ├── globals
│   ├── index.ts
│   ├── prisma.ts
│   ├── server.ts
│   └── util
└── tsconfig.json

```

## Setup Instructions

- #### Clone Repository

```
git clone https://github.com/pankaj1980patel/videosdk-task.git
```

- #### Environment Variables

    - ### Client
        ```
        NEXT_PUBLIC_APP_API_ENDPOINT=http://localhost:8080/api/v1
        ```
    - ### Server
        ```
        DATABASE_URL=
        PORT=8080
        ```

- #### Installing Dependencies

```
cd videosdk-task/server
pnpm install
cd ../client
pnpm install
```

- #### Running the Server
```
pnpx prisma db push (for local)
pnpx prisma db deploy (for production)
cd server
pnpm run dev
```

- #### Running the Client
```
cd client
pnpm run dev (for dev)

pnpm run build
pnpm run start (for production)
```

## Tech Stack

- Client
    - NextJs
    - ReactJs

- Server
    - NodeJs
    - Prisma
    - MongoDB
        
