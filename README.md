# StayWander

StayWander is a full-stack web application inspired by Airbnb, allowing users to explore, create, and review unique travel listings from around the world. The platform supports user authentication, listing management, image uploads, and review functionality, all styled with a modern responsive UI.

## Features

- **User Authentication**: Sign up, log in, and log out securely using Passport.js and sessions.
- **Listings**: Create, view, edit, and delete property listings with images, categories, and location details.
- **Categories & Filters**: Browse listings by categories such as Trending, Rooms, Iconic Cities, Mountains, Castles, Arctic Pools, Campings, Farms, Arctic, Beachfront, and Luxury.
- **Search**: Search listings by title, location, or description.
- **Image Uploads**: Upload listing images directly to Cloudinary via Multer.
- **Reviews**: Leave ratings and comments on listings, and manage your own reviews.
- **Responsive UI**: Modern design using Bootstrap 5, FontAwesome, and custom CSS.
- **Flash Messages**: User feedback for actions like login, errors, and CRUD operations.
- **Validation**: Robust server-side validation for listings and reviews using Joi.

## Technologies Used

- **Backend**: Node.js, Express.js, MongoDB, Mongoose
- **Authentication**: Passport.js, passport-local, passport-local-mongoose
- **Frontend**: EJS, EJS-Mate, Bootstrap 5, FontAwesome
- **Image Uploads**: Multer, Cloudinary, multer-storage-cloudinary
- **Validation**: Joi
- **Session & Flash**: express-session, connect-flash

## Data Models

### User
- `email`: String (required)
- `username`: String (required, via passport-local-mongoose)
- `password`: String (hashed, via passport-local-mongoose)

### Listing
- `title`: String (required)
- `description`: String
- `image`: { url: String, filename: String }
- `price`: Number
- `location`: String
- `country`: String
- `category`: String (enum)
- `owner`: User reference
- `reviews`: Array of Review references

### Review
- `comment`: String
- `rating`: Number (1-5)
- `createdAt`: Date
- `author`: User reference

## Setup Instructions

1. **Clone the repository**

   ```bash
   git clone <repo-url>
   cd -StayWander-project-
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Environment Variables**

   Create a `.env` file in the root directory with the following variables:
   ```env
   CLOUD_NAME=your_cloudinary_cloud_name
   CLOUD_API_KEY=your_cloudinary_api_key
   CLOUD_API_SECRET=your_cloudinary_api_secret
   NODE_ENV=development
   ```

4. **Database**

   - Make sure MongoDB is running locally on `mongodb://127.0.0.1:27017/wanderlust` (default).
   - To seed the database with sample listings, run:
     ```bash
     node init/index.js
     ```

5. **Start the Application**

   ```bash
   node app.js
   ```
   The app will be available at [http://localhost:8080](http://localhost:8080)

## Usage

- **Browse Listings**: Visit `/listings` to explore all listings. Use filters or search to narrow results.
- **Sign Up / Log In**: Create an account or log in to add, edit, or review listings.
- **Create Listing**: Click "Airbnb your home" in the navbar, fill out the form, and upload an image.
- **Edit/Delete Listing**: Only the owner can edit or delete their listings.
- **Leave Reviews**: Authenticated users can leave a rating and comment on any listing.
- **Delete Reviews**: Users can delete their own reviews.

## Folder Structure

- `app.js` - Main server file
- `models/` - Mongoose schemas for User, Listing, Review
- `controllers/` - Route logic for listings, users, reviews
- `routes/` - Express route definitions
- `views/` - EJS templates for UI
- `public/` - Static assets (CSS, JS)
- `init/` - Database seeding scripts
- `utils/` - Utility functions and error handling

## Customization

- **Styling**: Modify `public/css/style.css` and `public/css/rating.css` for custom styles.
- **Cloudinary**: Change the upload folder or allowed formats in `CloudConfig.js`.
- **Categories**: Update the `category` enum in `models/listing.js` to add/remove categories.

## Credits

- Developed by Tushar
- Inspired by Airbnb

## License

ISC 

##🌐 Live Demo
🔗 https://staywander-project-1.onrender.com/listings
