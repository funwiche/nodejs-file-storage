# Nodejs File Storage

Manipulate and Store files to MongoDB using Express, Multer and Flash

## Setup

Make sure to install the dependencies:

```bash
# yarn
yarn install

# npm
npm install
```

Create a `.env` file and add the following variables:

```bash
DB_URL= # Database URL
```

## Development Server

Start the development server on http://localhost:3001

```bash
# yarn
yarn dev

# npm
npm run dev
```

## Routes

```bash
GET     /               # Get all files with pagination
GET     /?:resize:id    # GEt Single file. (resize=WxH)
POST    /               # Add a file
DELETE  /:id            # Delete one File
```
