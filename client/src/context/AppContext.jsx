import { useEffect ,useState} from "react";
import axios from "axios";
import { useAuth, useUser } from "@clerk/clerk-react";
import { useLocation, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { AppContext } from "./AppContextDefinition";

axios.defaults.baseURL = import.meta.env.VITE_BASE_URL;

// Provider component
export const AppProvider = ({ children }) => {

  const[isAdmin, setIsAdmin] = useState(false);
  const[shows, setShows] = useState([]);
  const[favoriteMovies, setFavoriteMovies] = useState([]);

  
  const image_base_url=import.meta.env.VITE_TMDB_IMAGE_BASE_URL;

  const{user}=useUser()
  const{getToken}=useAuth()
  const location = useLocation()
  const navigate = useNavigate()
  
  const fetchIsAdmin = async()=>{
    try{
      const {data} = await axios.get("/api/admin/is-admin",{
        headers:{
          Authorization: `Bearer ${await getToken()}`,
        },
      });
      if(data.success && data.isAdmin){
        setIsAdmin(true);
      } else {
        setIsAdmin(false);
        if(location.pathname.startsWith("/admin")){
          navigate("/");
          toast.error("You are not authorized to access this page");
        }
      }
    }catch(error){
      console.error("Error fetching admin status:", error);
      setIsAdmin(false);
      // Handle 403 or 401 errors - user is not admin
      if(error.response && (error.response.status === 403 || error.response.status === 401)){
        if(location.pathname.startsWith("/admin")){
          navigate("/");
          toast.error("You are not authorized to access this page");
        }
      }
    }
  }

  const fetchShows = async()=>{
    try{
      const {data} = await axios.get("/api/show/all");
      if(data.success){
        setShows(data.shows);
      }else{
        toast.error(data.message);
      }
    }catch(error){
      console.error("Error fetching shows:", error);
    }
  }

  const fetchFavoriteMovies = async()=>{
    try{
      const {data} = await axios.get("/api/user/favorites",{
        headers:{
          Authorization: `Bearer ${await getToken()}`,
        },
      });
      if(data.success){
        setFavoriteMovies(data.movies);
      }else{
        toast.error(data.message);
      }
    }catch(error){
      console.error("Error fetching favorite movies:", error);
    }
  }

  useEffect(()=>{
    
      fetchShows();
    
  },[])

  useEffect(()=>{
    if(user){
      fetchIsAdmin();
      fetchFavoriteMovies();
    }
  },[user])
      



  const value = {axios,fetchIsAdmin,navigate,user,getToken,shows,fetchFavoriteMovies,isAdmin,favoriteMovies,image_base_url};


  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  );
};

