import Home from "../pages/Home";
import Profile from "../pages/Profile";
import Devlogs from "../pages/Devlogs";

const BACKEND_BASE_PATH = "https://fa23-lec9-demo-soln.fly.dev/api";

const mockUser = {
  id: "12345",
  username: "sjc365",
  email: "sjc365@cornell.edu",
  createdAt: "2024-01-15",
};

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
    element: <Profile user={mockUser} />,
  },
];

export { BACKEND_BASE_PATH, PATHS };
