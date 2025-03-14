# School Library Management App - Frontend

A Vue.js application for managing a school library system. This frontend application allows users to manage books, track checkouts, and view library statistics.

## Technologies Used

- Vue 3 with Composition API
- TypeScript
- Ant Design Vue for UI components
- Vue Router for navigation
- Axios for API requests
- Vite as the build tool

## Project Setup

1. Clone the repository
2. Install dependencies:

```sh
npm install
```

### Compile and Hot-Reload for Development

```sh
npm run dev
```

## Features

- Book management (add, edit, delete)
- Book checkout system
- Dashboard with library statistics
- Search functionality

## API Connection

The application connects to a backend API running on
`http://localhost:3001 `. Make sure the backend server is running before using this application.

## Project Structure

```PlainText
school-library-frontend/
├── src/
│ ├── api/ # API service layer
│ ├── assets/ # Static assets
│ ├── components/ # Reusable Vue components
│ ├── layouts/ # Layout components
│ ├── router/ # Vue Router configuration
│ ├── types/ # TypeScript type definitions
│ ├── views/ # Page components
│ ├── App.vue # Root component
│ └── main.ts # Application entry point
```
