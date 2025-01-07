import { MantineProvider } from "@mantine/core";
import { createBrowserRouter, RouterProvider, Outlet } from "react-router-dom";
import ErrorPage from "./pages/Error";
import GamePage from "./pages/GamePage";
import { PATHS } from "./constants/Navigation";
import { AuthProvider } from "./authcontext";
import Header from "./components/Header";
import EditProfile from "./components/editProfile";
import Login from "./components/login";
import SignUp from "./components/signup";
import "./index.css";

function AppLayout() {
  return (
    <div className="app-container">
      <Header />
      <Outlet />
    </div>
  );
}

const router = createBrowserRouter([
  {
    path: "/",
    element: <AppLayout />,
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
}
