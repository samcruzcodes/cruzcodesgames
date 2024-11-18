/* VARIABLES */
let player, life, currentTime, finalTime, walls, screen, play;
let cheese, cheese1, cheese2, cheese3, cheese4, cheese5;
let hurt, trap, pressurePlate, invisibleTop, invisibleBottom, platImg;
let cheeseFont, backupFont, bgMusic, bgMenu, eat, rat1Anim, rat2Anim, bg1;
let pressedPlate = false;
let buttonImg;
let displayTimer = 0, dead;
let canMove = true;

function preload() {
  cheeseFont = loadFont('assets/Buncits.otf');
  backupFont = loadFont('assets/cheesefont.otf');
  bgMusic = loadSound('assets/soundtrack.mp3');
  eat = loadSound('assets/eat.mp3');
  rat1Anim = loadAnimation('assets/rat11.png', 'assets/rat12.png', 'assets/rat13.png');
  rat2Anim = loadAnimation('assets/rat21.png', 'assets/rat22.png', 'assets/rat23.png');
  bg1 = loadImage('assets/level1 bg.png');
  hurt = loadSound('assets/hurt.mp3');
  trapImg = loadImage('assets/trap.png');
  platImg = loadImage('assets/pressure.png');
  bgMenu = loadImage('assets/menu2.png');
  bgMenu2 = loadImage('assets/menu.png');
  buttonImg = loadImage('assets/button.png');
}

/* SETUP RUNS ONCE */
function setup() {
  createCanvas(700, 700);
  background('#8B4513');
  frameRate(60);
  life = 1;
  cheese = 0;
  screen = 1;

  // trap sprite

  trap = new Sprite(90, 110, 30, 30);
  trap.visible = false;
  trap.collider = "static";
  trap.img = trapImg;

  pressurePlate = new Sprite(650, 300, 66, 40);
  pressurePlate.visible = false;
  pressurePlate.collider = "static";
  pressurePlate.img = platImg;

  invisibleTop = new Sprite(650, 240, 66, 30);
  invisibleTop.visible = false;
  invisibleTop.collider = "static";


  invisibleBottom = new Sprite(650, 360, 66, 30);
  invisibleBottom.visible = false;
  invisibleBottom.collider = "static";

  //Create player sprite
  player = new Sprite();
  player.img = 'assets/rat1.png';
  player.addAnimation("walk", rat1Anim);
  player.scale = 1.5;
  player.w = 30;
  player.h = 50;
  player.color = "orange";
  player.rotationLock = true;

  player2 = new Sprite();
  player2.img = 'assets/rat2.png';
  player2.addAnimation("walk", rat2Anim);
  player2.scale = 1.5;
  player2.w = 30;
  player2.h = 50;
  player2.color = "white";
  player2.rotationLock = true;


  // buttons
  play = new Sprite(width / 2, height / 2, 250, 70);
  play.collider = "static";
  play.img = buttonImg;
  fill("#FFFF66");
  play.text = "Play";
  play.textSize = 35;
  play.textColor = "#FFFF66";


  howToPlay = new Sprite(width / 2, height / 2, 250, 70, 30);
  howToPlay.collider = "static";
  howToPlay.img = buttonImg;
  fill("#FFFF66");
  howToPlay.text = "How to Play";
  howToPlay.textSize = 35;
  howToPlay.textColor = "#FFFF66";

  back = new Sprite(-1000, -1000, 200, 80);
  back.collider = "static";
  back.color = "#66CC99";
  back.stroke = "#66CC32";
  fill("#FFFF66");
  back.text = "Back to Menu";
  back.img = buttonImg;
  back.textSize = 30;
  back.textColor = "#333333";


  // pos the player
  player.pos = { x: 40, y: 660 };
  player2.pos = { x: 660, y: 660 };
  player.visible = false;
  player2.visible = false;

  // cheese sprites
  cheese1 = new Sprite(width / 2 - 50, height / 2 - 20, 15, 15);
  cheese2 = new Sprite(width / 2 - 50, 160, 15, 15);
  cheese3 = new Sprite(650, 100, 15, 15);
  cheese4 = new Sprite(657, 500, 15, 15);
  cheese5 = new Sprite(600, 500, 15, 15);
  cheese1.visible = false;
  cheese2.visible = false;
  cheese3.visible = false;
  cheese4.visible = false;
  cheese5.visible = false;
  cheese1.collider = "static";
  cheese2.collider = "static";
  cheese3.collider = "static";
  cheese4.collider = "static";
  cheese5.collider = "static";
  cheese1.img = "assets/cheese.png";
  cheese2.img = "assets/cheese.png";
  cheese3.img = "assets/cheese.png";
  cheese4.img = "assets/cheese.png";
  cheese5.img = "assets/cheese.png";

  level1Maze();
  backgroundMusic();

}

/* DRAW LOOP REPEATS */
function draw() {

  currentTime = int(millis() / 1000);

  // Display start button
  if (screen == 1) {
    background(bgMenu);
    textFont(cheeseFont);
    back.pos = { x: -1000, y: -1000 };
    play.pos = { x: width / 2, y: height / 2 + 20 }
    howToPlay.pos = { x: width / 2, y: height / 2 + 100 }
    fill("#FFFF66");
    strokeWeight(3);
    textAlign(LEFT);
    text("Cheezy", width / 2 - 175, height / 2 - 150);
    text("Conundrum", width / 2 - 275, height / 2 - 50);
    textSize(100);
    if (play.mouse.presses()) {
      print('pressed play button');
      screen = 2;
    }
    if (howToPlay.mouse.presses()) {
      print('pressed how to play button');
      screen = 0;
    }
  }
  else if (screen == 2) {
    level1();
    play.pos = { x: -1999, y: -1999 }
    howToPlay.pos = { x: -1999, y: -1999 }
    player.visible = true;
    player2.visible = true;
    cheese1.visible = true;
    cheese2.visible = true;
    cheese3.visible = true;
    cheese4.visible = true;
    cheese5.visible = true;
    pressurePlate.visible = true;
    trap.visible = true;
    walls.visible = true;
  }
  else if (screen == 0) {
    background(bgMenu2);
    howTo();
  }
  else if (screen == 100) {
    end();
  }

  updatePlayerMovement(player, player2);
}

// movement
function updatePlayerMovement(player1, player2) {
  // Define the base movement speed
  const baseSpeed = 1;

  if (canMove) {
    // Determine horizontal velocity
    if (kb.pressing("left")) {
      player1.vel.x = -baseSpeed;
      player2.vel.x = -baseSpeed;
      player1.rotation = -90;
      player2.rotation = -90;
      rat1Anim.play();
      rat2Anim.play();
    } else if (kb.pressing("right")) {
      player1.vel.x = baseSpeed;
      player2.vel.x = baseSpeed;
      player1.rotation = 90;
      player2.rotation = 90;
      rat1Anim.play();
      rat2Anim.play();
    } else {
      player1.vel.x = 0;
      player2.vel.x = 0;
      rat1Anim.stop();
      rat2Anim.stop();
    }

    // Determine vertical velocity
    if (kb.pressing("up")) {
      player1.vel.y = -baseSpeed;
      player2.vel.y = -baseSpeed;
      player1.rotation = 0;
      player2.rotation = 0;
      rat1Anim.play();
      rat2Anim.play();
    } else if (kb.pressing("down")) {
      player1.vel.y = baseSpeed;
      player2.vel.y = baseSpeed;
      player1.rotation = 180;
      player2.rotation = 180;
      rat1Anim.play();
      rat2Anim.play();
    } else {
      player1.vel.y = 0;
      player2.vel.y = 0;
    }

    // Normalize diagonal movement
    if (player1.vel.x !== 0 && player1.vel.y !== 0) {
      const diagonalMagnitude = Math.sqrt(baseSpeed * baseSpeed / 2);
      player1.vel.x = player1.vel.x > 0 ? diagonalMagnitude : -diagonalMagnitude;
      player1.vel.y = player1.vel.y > 0 ? diagonalMagnitude : -diagonalMagnitude;
    }

    if (player2.vel.x !== 0 && player2.vel.y !== 0) {
      const diagonalMagnitude = Math.sqrt(baseSpeed * baseSpeed / 2);
      player2.vel.x = player2.vel.x > 0 ? diagonalMagnitude : -diagonalMagnitude;
      player2.vel.y = player2.vel.y > 0 ? diagonalMagnitude : -diagonalMagnitude;
    }

    // Update players' positions based on velocity
    player1.pos.x += player1.vel.x;
    player1.pos.y += player1.vel.y;
    player2.pos.x += player2.vel.x;
    player2.pos.y += player2.vel.y;

    //cheeses collision
    if (player1.collides(cheese1)) {
      cheese1.h = 10;
      cheese1.pos = { x: -6060, y: -6600 };
      cheese = cheese + 1;
      eat.play();
    }

    if (player1.collides(cheese2)) {
      cheese2.h = 10;
      cheese2.pos = { x: -6600, y: -6600 };
      cheese = cheese + 1;
      eat.play();
    }

    if (player2.collides(cheese3)) {
      cheese3.h = 10;
      cheese3.pos = { x: -6600, y: -6600 };
      cheese = cheese + 1;
      eat.play();
    }

    if (player2.collides(cheese4)) {
      cheese4.h = 10;
      cheese4.pos = { x: -6600, y: -6600 };
      cheese = cheese + 1;
      eat.play();
    }

    if (player2.collides(cheese5)) {
      cheese5.h = 10;
      cheese5.pos = { x: -6600, y: -6600 };
      cheese = cheese + 1;
      eat.play();
    }
  }

  if (player1.overlap(trap) || player2.overlap(trap)) {
    hurt.play();
    trap.pos = { x: 90, y: 110 };
    player.pos = { x: 40, y: 660 };
    player2.pos = { x: 660, y: 660 };
    life = life + 1;
    cheese = 0;
    cheese1.pos = { x: width / 2 - 50, y: height / 2 - 20 };
    cheese2.pos = { x: width / 2 - 50, y: 160 };
    cheese3.pos = { x: 650, y: 100 };
    cheese4.pos = { x: 657, y: 500 };
    cheese5.pos = { x: 600, y: 500 };

    // Set the display timer to 180 (3 seconds * 60 frames per second)
    displayTimer = 120;
  }

  // Decrement the display timer
  if (displayTimer > 0) {
    displayTimer--;
    canMove = false;

    // Display the text on the screen
    textSize(50);
    fill("#B58900");
    stroke("black");
    text(("You Died Life #" + life), width / 2 - 175, 50);
  }
  else {
    canMove = true;
  }


  if (player2.overlap(invisibleTop) || player2.overlap(invisibleBottom)) {
    pressedPlate = false;
  }

  if (player2.overlap(pressurePlate)) {
    pressedPlate = true;
  }

  if (pressedPlate) {
    trap.pos = { x: -1000, y: -1000 }; // Move the trap off-screen or set its visibility to false
  } else {
    trap.pos = { x: 90, y: 110 }; // Move the trap to its default position
  }
}

function backgroundMusic() {
  bgMusic.play();
  bgMusic.loop();
  bgMusic.setVolume(0.05);
  userStartAudio();
}

// moves each wall sprite off screen
function moveWallsOffScreen(wall) {


  for (let i = 0; i < wall.length; i++) {
    wall[i].position.x = -5000;
    wall[i].position.y = -5000;
  }
}

function howTo() {
  play.pos = { x: -1999, y: -1999 }
  howToPlay.pos = { x: -1999, y: -1999 }
  stroke("black");
  strokeWeight(6);
  textSize(60);
  textFont(cheeseFont);
  fill("#FFFF66");
  text("How To Play", width / 2, height / 2 - 230);
  textSize(30);
  textFont(backupFont)
  textAlign(CENTER);
  fill("#FFFF66");
  text("Guide rats Timmy and Tommy using WASD/Arrow Keys. \nTrapped in a Cheezy Conundrum, they chase cheese \nin hope of freedom, but traps lurk.\n\n Teamwork is key: solve puzzles together to bypass traps. \nTheir bond grows, hope shines, and freedom awaits. \nCan you lead them to victory?", width / 2, height / 2 - 140);
  back.pos = { x: width / 2, y: 510 };
  back.scale = 1.25;

  if (back.mouse.presses()) {
    print('pressed play button');
    screen = 1;
  }
}

function level1Maze() {
  //Create the maze level 1
  walls = new Group();

  // top 
  new walls.Sprite(width / 2 - 210, 70, 260, 10);
  walls[0].color = "beige";
  new walls.Sprite(width / 2 + 210, 70, 260, 10);
  walls[1].color = "beige";

  // bottom
  new walls.Sprite(width / 2, 692, 550, 10);
  walls[2].color = "beige";

  // left and right side and middle
  new walls.Sprite(8, height / 2 + 31, 10, height - 68);
  new walls.Sprite(692, height / 2 + 31, 10, height - 68);
  new walls.Sprite(width / 2, height / 2 + 32, 10, height - 70);
  walls[3].color = "beige";
  walls[4].color = "beige";
  walls[5].color = "beige";

  //left rat side
  new walls.Sprite(78, 597, 10, 200);
  walls[6].color = "blue";
  new walls.Sprite(83, 410, 160, 10);
  walls[7].color = "cyan";
  new walls.Sprite(166, 505, 10, 200);
  walls[8].color = "green";
  new walls.Sprite(254, 451, 10, 310);
  walls[9].color = "lightgreen";
  new walls.Sprite(216, 300, 276, 10);
  walls[10].color = "black";
  new walls.Sprite(83, 230, 10, 150);
  walls[11].color = "gray";
  new walls.Sprite(168, 141, 10, 150);
  walls[12].color = "purple";
  new walls.Sprite(260, 171, 10, 90);
  walls[13].color = "orange";
  new walls.Sprite(300, 130, 90, 10);
  walls[14].color = "pink";

  // right rat side
  new walls.Sprite(594, 614, 206, 10);
  walls[15].color = "blue";
  new walls.Sprite(562, 535, 130, 10);
  walls[16].color = "cyan";
  new walls.Sprite(500, 440, 10, 200);
  walls[17].color = "green";
  new walls.Sprite(627, 505, 10, 70);
  walls[18].color = "white";
  new walls.Sprite(610, 230, 10, 327);
  walls[19].color = "lightgreen";
  new walls.Sprite(524, 245, 180, 10);
  walls[20].color = "black";
  new walls.Sprite(435, 160, 180, 10);
  walls[21].color = "gray";
  new walls.Sprite(429, 430, 10, 380);
  walls[22].color = "yellow";
  new walls.Sprite(622, 470, 130, 10);
  walls[23].color = "purple";

  new walls.Sprite(width / 2, 70, 693, 10);
  walls[24].color = "beige";



  walls.collider = "static";
  walls.visible = false;

  new walls.Sprite(width / 2 - 90, 35, 10, 80);
  walls[25].color = "beige";

  new walls.Sprite(width / 2 + 92, 35, 10, 80);
  walls[26].color = "beige";

  for (let i = 0; i < walls.length; i++) {
    walls[i].color = "#BC4A3C";
    walls[i].stroke = "#953b30";
  }

  walls[25].visible = false;
  walls[26].visible = false;


  walls[25].pos = { x: -100, y: -100 };
  walls[26].pos = { x: -100, y: -100 };

}

function level1() {
  background("#000033");
  screen = 2;

  strokeWeight(6);

  // Draw cheese text
  fill("yellow");
  textSize(20);
  textFont(backupFont);
  text(('TIME: ' + currentTime + ' seconds'), 30, 50);
  text('Life # ' + life, 520, 30);
  text('Cheese collected: ' + cheese, 520, 50);


  //Player cannot go above maze
  if (player.y < 68 & player2.y < 68) {
    player.y = 68;
    player2.y = 68;
  }

  else if (player.y < 68) {
    player.y = 68;
  }
  else if (player2.y < 68) {
    player2.y = 68;
  }

  // cannot go below
  else if (player.y > 680 & player2.y > 680) {
    player.y = 680;
    player2.y = 680;
  }

  else if (player.y > 680) {
    player.y = 680;
  }

  else if (player2.y > 680) {
    player2.y = 680;
  }

  // Player wins
  if (player.y < 70 & player2.y < 70 & cheese == 5) {
    moveWallsOffScreen(walls)
    pressedPlate = true;
    player.vel.x = 0;
    player.vel.y = 0;
    screen = 100;
    cheese = 0;
    trap.pos = { x: -1000, y: -1000 };
    pressurePlate.pos = { x: -1000, y: -1000 }
  }

  // end unlocked
  if (cheese == 5) {
    // Draw End Text
    fill("yellow");
    textSize(36);
    text(('Next Level'), width / 2 - 70, 50);
    walls[24].pos = { x: -100, y: -100 };
    walls[25].pos = { x: (width / 2 - 90), y: 35 };
    walls[26].pos = { x: (width / 2 + 92), y: 35 };
  }
}

function end() {
  background(bgMenu2);

  player.pos = { x: -100, y: -100 };
  player2.pos = { x: -100, y: -100 };


  finalTime = currentTime;

  textSize(60);
  textFont(backupFont)
  stroke("black");
  strokeWeight(6);
  textAlign(CENTER);
  text("Congratulations!", width / 2, height / 2 - 180);
  textSize(30);
  strokeWeight(0.3);
  fill("#FFFF66");
  text("Timmy and Tommy have triumphed over \nthe Cheesy Conundrum, proving that hope and \nteamwork can conquer any challenge. Their \njourney reminds us that with determination, friendship, \nand a dash of cheese, true freedom is possible. \n\nRefresh the page to try and beat ur time!\n You took " + currentTime + " seconds" + "\n It took you " + life + " lives!", width / 2, height / 2 - 120);
}
