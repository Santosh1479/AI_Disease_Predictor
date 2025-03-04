# Backend Documentation

## Models

### Message Model
Located at: `Backend/models/message.model.js`
- **author**: String, required
- **message**: String, required
- **time**: String, required
- **room**: String, required

### Hospital Model
Located at: `Backend/models/hospital.model.js`
- **_id**: Number, required, must be at least 4 digits
- **name**: String, required, minimum length 3
- **customerCare**: String, required, minimum length 10
- **email**: String, required, must be a valid email
- **specialisations**: Array of Strings, required
- **latitude**: Number, required
- **longitude**: Number, required

### Doctor Model
Located at: `Backend/models/doctor.model.js`
- **fullname**: Object containing:
  - **firstname**: String, required, minimum length 3
  - **lastname**: String, required, minimum length 3
- **email**: String, required, unique, minimum length 5
- **mobileNumber**: String, required, minimum length 10
- **password**: String, required, minimum length 6
- **hospital**: Number, required
- **specialisation**: String, required

### BlacklistToken Model
Located at: `Backend/models/blacklistToken.model.js`
- **token**: String, required, unique
- **createdAt**: Date, default is current date, expires in 24 hours

## Controllers

### User Controller
Located at: `Backend/controllers/user.controller.js`
- **registerUser**: Registers a new user
- **loginUser**: Logs in a user
- **getUserData**: Retrieves all users
- **getUserProfile**: Retrieves the profile of the logged-in user
- **logoutUser**: Logs out a user and blacklists the token

### Hospital Controller
Located at: `Backend/controllers/hospital.controller.js`
- **createHospital**: Creates a new hospital
- **getHospitals**: Retrieves all hospitals
- **getHospitalById**: Retrieves a hospital by ID
- **updateHospital**: Updates a hospital by ID
- **deleteHospital**: Deletes a hospital by ID

### Doctor Controller
Located at: `Backend/controllers/doctor.controller.js`
- **createDoctor**: Creates a new doctor
- **loginDoctor**: Logs in a doctor
- **getDoctors**: Retrieves all doctors
- **getDoctorById**: Retrieves a doctor by ID
- **updateDoctor**: Updates a doctor by ID
- **deleteDoctor**: Deletes a doctor by ID

## Middleware

### Auth Middleware
Located at: `Backend/middlewares/auth.middleware.js`
- **authUser**: Middleware to authenticate a user using JWT

## Database Connection

### DB Connection
Located at: `Backend/db/db.js`
- **connecttoDB**: Function to connect to the MongoDB database

