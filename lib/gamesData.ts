import cheezyLogo from "../frontend/src/assets/cheezyLogo.png";
import sandyLogo from "../frontend/src/assets/sandyLogo.png";
import { Game } from "./types/index";

const staticGames: Omit<Game, "likes" | "views">[] = [
  {
    id: "sandcastle-tycoon",
    title: "Sandcastle Tycoon",
    description: "Build, Defend, and Thrive: Master the Shores in Sandcastle Tycoon!",
    thumbnailUrl: sandyLogo,
    itchIoUrl: "https://cruzcodes.itch.io/sandcastle-tycoon",
  },
  {
    id: "cheezy",
    title: "Cheezy Conundrum",
    description: "Guide Timmy and Tommy out this Cheezy Conundrum.",
    thumbnailUrl: cheezyLogo,
    itchIoUrl: "https://cruzcodes.itch.io/cheezy-conundrum",
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