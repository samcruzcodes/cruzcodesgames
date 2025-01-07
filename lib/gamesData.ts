import cheezyLogo from "../frontend/src/assets/cheezyLogo.png";
import sandyLogo from "../frontend/src/assets/sandyLogo.png";
import { Game } from "./types/index";

const staticGames: Omit<Game, "likes" | "views">[] = [
  {
    id: "sandcastle-tycoon",
    title: "Sandcastle Tycoon",
    description: "Build, Defend, and Thrive: Master the Shores in Sandcastle Tycoon!",
    thumbnailUrl: sandyLogo,
    itchIoUrl: "https://itch.io/embed-upload/11755159?color=033438",
    height: "1020px",
    width: "700px",
    margin: "-10rem 0.5rem -10rem 0"  
  },
  {
    id: "cheezy-conundrum",
    title: "Cheezy Conundrum",
    description: "Guide Timmy and Tommy out this Cheezy Conundrum.",
    thumbnailUrl: cheezyLogo,
    itchIoUrl: "https://itch.io/embed-upload/11723855?color=7e7e7e",
    height: "770px",
    width: "750px",
    margin: "-7.5rem 0.5rem -8.5rem 0"  
  },
];

export const getGames = async (): Promise<Game[]> => {
  try {
    const response = await fetch("http://localhost:8080/api/games");
    if (!response.ok) {
      throw new Error(`status: ${response.status}`);
    }

    const gamesData = await response.json();
    
    return staticGames.map((game) => {
      const dynamicData = gamesData.find((g: any) => g.id === game.id) || { likes: 0, views: 0 };
      return {
        ...game,
        likes: dynamicData.likes,
        views: dynamicData.views,
      };
    });
  } catch (error) {
    console.error("Error fetching games data:", error);
    return staticGames.map((game) => ({ ...game, likes: 0, views: 0 }));
  }
};