# Tweteroo API

The **Tweteroo API** is a back-end for a replica of the classic Twitter, where users can register and post tweets. The focus of this project is on the back-end implementation.

## Technologies Used:

- Node.js with Express.js
- MongoDB (MongoDB Atlas)
- Joi for data validation
- Dotenv for environment variables

## How to Test the API

The API is hosted on your local machine and uses MongoDB Atlas for data persistence.

### 1. Create User (Sign Up)

**Endpoint:** `POST: /sign-up`

**Body:**
```json
{
  "username": "bobesponja",
  "avatar": "https://bobesponja.com.br/imagens/thumbnail.png"
}
```

**Response:**
```json
{
  "message": "User created successfully"
}
```

### 2. Post a Tweet

**Endpoint:** `POST: /tweets`

**Body:**
```json
{
  "username": "bobesponja",
  "tweet": "Eu amo hambúrguer de siri!"
}
```

**Response:**
```json
{
  "message": "Tweet created successfully"
}
```

### 3. Get Tweets

**Endpoint:** `GET: /tweets`

**Response:** 
```json
[
  {
    "_id": "660c825e763137cbd36f7f13",
    "username": "bobesponja",
    "avatar": "https://bobesponja.com.br/imagens/thumbnail.png",
    "tweet": "Eu amo hambúrguer de siri!"
  }
]
```

### 4. Edit Tweet

**Endpoint:** `PUT: /tweets/:id`

**Body:**

```json
{
  "tweet": "Eu amo hambúrguer de siri, e pizza também!"
}
```

**Response:** `Status 204 No Content`

### 5. Delete Tweet

**Endpoint:** `DELETE: /tweets/:id`

**Response:** `Response: Status 204 No Content`

# Setup and Installation

- Clone this repository to your local machine.
- Install dependencies using npm: 
```json
npm install
```

- Create a .env file in the root directory with the following variables:
```json
PORT=5000
DATABASE_URL=mongodb://your_mongo_connection_string
```

- Start the server:
```json
npm start
```

- The server will be running on http://localhost:5000.
