# SmartBuy

- **Visit**: [SmartBuy](https://smart-buy-eta.vercel.app/)


## Overview
SmartBuy is an e-commerce platform that provides APIs for user management, product management, order processing, and payment integration. This README serves as the entry point for understanding the platform and accessing its resources.

## API Documentation
Comprehensive API documentation is available, providing details on all endpoints, request structures, and example responses.

#### It is my 1st api documentation 

- **API Documentation Link**: [SmartBuy API Documentation](https://documenter.getpostman.com/view/26469566/2sAYdcrXwk)

## Features
- **User Management**: Create, login, and manage user accounts.
- **Product Management**: Retrieve product listings and details.
- **Order Management**: Place and manage orders seamlessly.
- **Payment Integration**: Securely process and verify payments.

## Getting Started
### Requirements
- Node.js (>= 20.x)
- MongoDB (>= 4.x)

### Installation
1. Clone the repository:
   ```bash
   git clone https://github.com/manojit-007/SmartBuy.git
   ```
2. Navigate to the project directory:
   ```bash
   cd smartbuy
   ```
3. Install dependencies:
#### For Starting Server
   ```bash
   cd server 
   npm install
   ```
#### For Starting Client
   ```bash
   cd client
   npm install
   ```

### Environment Variables
Create a `.env` file in the both server and client root directory and configure the following:
### For server
```env
PORT=8000
ORIGIN="http://localhost:5173"
MONGODB_URL="mongodb_url"
JWT_SECRET_KEY= "JWT_SECRET_KEY"
JWT_EXPIRE=5d
Cookie_EXPIRE=5
NODE_ENV = "production"
SMPT_SERVICE="gmail"
SMPT_MAIL="sample@gmail.com"
SMPT_PASSWORD="get own SMPT_PASSWORD"
SMPT_HOST="get own SMPT_HOST"
SMPT_PORT= get the port for SMPT_PORT
RAZORPAY_KEY_ID = "get RAZORPAY_KEY_ID"
RAZORPAY_KEY_SECRET = "get RAZORPAY_KEY_SECRET"
CLOUDINARY_CLOUD_NAME= CLOUDINARY_CLOUD_NAME
CLOUDINARY_API_KEY=CLOUDINARY_API_KEY
CLOUDINARY_API_SECRET=CLOUDINARY_API_SECRET
```

### For client
```env
VITE_BASE_URL= "http://localhost:8000"
```

### Running the Application
Start the development server and client:
#### for server (make sure you are in server folder)
```bash
npm start || npm run dev
```
#### for client (make sure you are in client folder)
```bash
npm start || npm run dev
```

Access the backend application at `http://localhost:8000`.
Access the frontend application at `http://localhost:5173`.

## Contributing
Contributions are welcome! Please follow these steps:
1. Fork the repository.
2. Create a new branch for your feature:
   ```bash
   git checkout -b feature/your-feature-name
   ```
3. Commit your changes and push to the branch.
4. Submit a pull request.

## End
For any issues or feature requests, feel free to open an issue in the repository or contact me at `manojitbhowmick.prof.07@gmail.com
`.
---

