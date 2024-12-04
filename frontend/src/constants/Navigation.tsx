import Home from "../pages/Home";
import Profile from "../pages/Profile";
import Devlogs from "../pages/Devlogs";

const BACKEND_BASE_PATH = "https://fa23-lec9-demo-soln.fly.dev/api";

const PATHS = [
  {
    link: "/",
    label: "Home",
    element: <Home />,
  },
  {
    link: "/devlogs",
    label: "Devlogs",
    element: <Devlogs />,
  },
  {
    link: "/profile",
    label: "Profile",
    element: <Profile/>,
  },
];

export { BACKEND_BASE_PATH, PATHS };
