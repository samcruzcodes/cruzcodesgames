import { HeaderSimple } from "../components/Header";
import { PATHS } from "../constants/Navigation";
import { Outlet } from "react-router-dom";

const RootLayout = () => {
    console.log("RootLayout rendering");
    return (
      <div style={{ width: '100%' }}>
          <HeaderSimple links={PATHS} />
          <div style={{ width: '100%' }}>
              <Outlet />
          </div>
      </div>
    );
  };

export default RootLayout;
