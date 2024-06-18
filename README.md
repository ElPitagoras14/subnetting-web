# Subnetting Web

## Description

Subnetting Web Frontend is a web application built with Next.js to IP segmentation with FLSM and VLSM techniques.

## Requirements

- Node.js 14+
- npm or yarn
- Run the [Subnetting API](https://github.com/ElPitagoras14/subnetting-api).

## Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/ElPitagoras14/subnetting-web.git
   cd subnetting-web
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Create an `.env` file in the root of the project and add the following environment variables:

   ```env
   NEXT_PUBLIC_BACKEND_URL=http://127.0.0.1:3001
   ```

## Running the Development Server

1. Start the development server:

   ```bash
   npm run dev
   ```

The development server should be running at `http://localhost:3000`.

## Environment Variables

- `NEXT_PUBLIC_BACKEND_URL`: URL of the backend API.

## Author

- [Jonathan García](https://github.com/ElPitagoras14) - Computer Science Engineer
