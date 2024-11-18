import { MantineProvider } from "@mantine/core";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import ErrorPage from "./pages/Error";
import RootLayout from "./layouts/RootLayout";
import GamePage from "./pages/GamePage"; 
import { PATHS } from "./constants/Navigation";
import "./index.css";

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
    ],
  },
]);

export default function App() {
  return (
    <MantineProvider withGlobalStyles withNormalizeCSS>
      <RouterProvider router={router} />
    </MantineProvider>
  );
}
