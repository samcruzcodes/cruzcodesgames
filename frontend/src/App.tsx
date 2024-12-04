import { MantineProvider } from "@mantine/core";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import ErrorPage from "./pages/Error";
import RootLayout from "./layouts/RootLayout";
import GamePage from "./pages/GamePage"; 
import { PATHS } from "./constants/Navigation";
import { AuthProvider } from "./authcontext";
import "./index.css";
import EditProfile from "./components/editProfile";
import Login from "./components/login";
import SignUp from "./components/signup";

const router = createBrowserRouter([
  {
    path: "/",
    element: <RootLayout />,
    errorElement: <ErrorPage />,
    children: [  
      ...PATHS.map((item) => ({
        path: item.link,
        element: item.element,
      })),
      {
        path: "/public/games/:id",
        element: <GamePage />,
      },
      {
        path: "/edit-profile",
        element: <EditProfile />,
      },
      {
        path: "/login",
        element: <Login />,
      },
      {
        path: "/signup",
        element: <SignUp />,
      },
    ],
  },
]);

export default function App() {
  return (
    <MantineProvider withGlobalStyles withNormalizeCSS>
      <AuthProvider>
        <RouterProvider router={router} />
      </AuthProvider>
    </MantineProvider>
  );
};