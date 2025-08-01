import Booking from "../models/Booking.js";
import Show from "../models/Show.js";



// API to check if user is admin
export const isAdmin = async (req, res) => {
    try {
        // If the request reaches here, it means the user passed the protectAdmin middleware
        // So they are definitely an admin
        res.json({success: true, isAdmin: true});
    } catch (error) {
        console.error("Error in isAdmin:", error);
        res.status(500).json({success: false, message: "Server error"});
    }
};

// API to get dashboard data
export const getDashboardData = async (req, res) => {
    try {
        const bookings = await Booking.find({isPaid: true});
        const activeShows = await Show.find({showDateTime: {$gte: new Date()}})
            .populate('movie');
        const totalUser = await User.countDocuments();
        
        const dashboardData = {
            totalBookings: bookings.length,
            totalRevenue: bookings.reduce((acc, booking) => acc + booking.amount, 0),
            activeShows,
            totalUser
        };
        
        res.json({ success: true, dashboardData });
    } catch (error) {   
        console.error(error);
        res.status(500).json({ success: false, message: error.message });
    }
}


// API to get all shows
export const getAllShows = async (req, res) => {
    try {
        const shows = await Show.find({showDateTime: { $gte: new Date() }}).populate('movie').sort({ showDateTime: 1 });
        res.json({success: true, shows});
    } catch (error) {
        console.error(error);
        res.status(500).json({success: false, message: error.message});
    }
}

// API to get all bookings
// This function retrieves all bookings from the database
export const getAllBookings = async (req, res) => {
    try {
        // Find all bookings in the database
        // .populate('user') - Replaces the user ID with the actual user document
        // .populate({path: "show", populate: {path: "movie"}}) - Replaces the show ID with the show document
        //   and also populates the movie field within each show
        // .sort({ createdAt: -1 }) - Sorts results by creation date in descending order (newest first)
        const bookings = await Booking.find({})
            .populate('user')
            .populate({
                path: "show",
                populate: {path: "movie"}
            })
            .sort({ createdAt: -1 });
        
        // Return the bookings as a JSON response with success status
        res.json({success: true, bookings});
    } catch (error) {
        // Log any errors that occur during the process
        console.error(error);
        // Return a 500 status code with the error message
        res.status(500).json({success: false, message: error.message});
    }
}


