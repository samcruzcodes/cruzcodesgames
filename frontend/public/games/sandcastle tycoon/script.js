let waveInterval = 10000;
let waveTimer = 10000;
let waveCount = 1;
var theta = 0.0;
var amplitude = 1.0;
let castle1, castle1Img, castle2Img, castle3Img, castle4Img;
let rocks, rock, rock1;
let beachFont;
let backing;
let shovelBack, bucketBack, plantBack;
let shovel, bucket, plant, mark, plant1, plant2, plants;
let shovelImg, bucketImg, plantImg, markImg;
let screen = 0;
let play, howToPlay, back;
let buttonImg;
let shovelHolding = false;
let toolSound, bucketSound, rockSound, plantSound, bgMusic;
let dune1, duneLevel1Img, duneLevel2Img, duneLevel3Img;
let lastMoveTimeRock = 0;
let lastMoveTimePlant = 0;
let duneDown;
let howToPic, howToPicPic;

function preload() {
  beachFont = loadFont('assets/beachday.ttf');
  castle1Img = loadImage('assets/castle1.png');
  castle2Img = loadImage('assets/castle2.png');
  castle3Img = loadImage('assets/castle3.png');
  castle4Img = loadImage('assets/castle4.png');
  waveImg = loadImage('assets/wave.png');
  backing = loadImage('assets/back.png');
  backgroundImage = loadImage('assets/background.png');
  buttonImg = loadImage('assets/button.png');
  shovelImg = loadImage('assets/shovel.png');
  bucketImg = loadImage('assets/bucket.png');
  plantImg = loadImage('assets/seed.png');
  rockImg = loadImage('assets/stone.png');
  markImg = loadImage('assets/x.png');
  toolSound = loadSound('assets/toool.mp3');
  bucketSound = loadSound('assets/bucketSand.mp3');
  rockSound = loadSound('assets/stone.mp3');
  plantSound = loadSound('assets/leaveSound.mp3');

  duneLevel1Img = loadImage('assets/mound1.png');
  duneLevel2Img = loadImage('assets/mound2.png');
  duneLevel3Img = loadImage('assets/mound3.png');

  howToPicPic = loadImage('assets/instructions.png');

  // Music: “Palm Beach”, from PlayOnLoop.com
  //Licensed under Creative Commons by Attribution 4.0
  bgMusic = loadSound('assets/background.mp3');
}

/* SETUP RUNS ONCE */
function setup() {
  createCanvas(700, 1000);
  frameRate(60);

  //CASTLE
  castle1 = new Sprite(1999, 1999, 300, 300);
  castle1.visible = true;
  castle1.collider = "static";
  castle1.img = castle1Img;
  castle1.scale = .5;


  //dune
  dune1 = new Sprite(1999, -1999, 150, 150);
  dune1.img = duneLevel1Img;
  dune1.collider = "static";
  dune1.rotationLock = true;


  // wave
  wave = new Sprite(1999, 1999, 1400, 220);
  wave.img = waveImg;
  wave.collider = "static";

  //tools
  shovelBack = new Sprite(1999, 1999, 75, 75)
  shovelBack.collider = "static";
  shovelBack.img = backing;
  bucketBack = new Sprite(1999, 1999, 75, 75)
  bucketBack.collider = "static";
  bucketBack.img = backing;
  bucket = new Sprite(1999, 1999, 75, 75);
  bucket.img = bucketImg;
  bucket.collider = "static";
  plantBack = new Sprite(1999, 1999, 75, 75)
  plantBack.collider = "static";
  plantBack.img = backing;
  plant = new Sprite(1999, 1999, 75, 75);
  plant.img = plantImg;
  plant.collider = "static";
  shovel = new Sprite(1999, 1999, 75, 75);
  shovel.img = shovelImg;
  shovel.collider = "static";
  mark = new Sprite(1999, 1999, 50, 50);
  mark.collider = "static";
  mark.img = markImg;

  //seeds
  plant1 = new Sprite(1999, 1999, 0, 0);
  plant1.img = plantImg;
  plant1.collider = "static";
  plant2 = new Sprite(1999, 1999, 50, 50);
  plant2.img = plantImg;
  plant2.collider = "static";

  // rock
  rock1 = new Sprite(1999, 1999, 0, 0);
  rock1.img = rockImg;
  rock1.scale = 0.5;
  rock1.collider = "static";
  rock = new Sprite(1999, 1999, 50, 50);
  rock.img = rockImg;
  rock.scale = 0.6;
  rock.collider = "static";

  // buttons
  play = new Sprite(1999, 1999, 250, 70, 30);
  play.collider = "static";
  play.img = buttonImg;

  howToPlay = new Sprite(1999, 1999, 250, 70, 30);
  howToPlay.collider = "static";
  howToPlay.img = buttonImg;


  howToPic = new Sprite(1999, 1999, 0, 0);
  howToPic.collider = "static";
  howToPic.img = howToPicPic;

  back = new Sprite(1999, 1999, 200, 80);
  back.collider = "static";
  back.img = buttonImg;

  rocks = 0;
  plants = 0;
}

function draw() {
  background(backgroundImage);

  if (screen == 0) {

    play.pos = { x: width / 2, y: height / 2 - 50 };
    howToPlay.pos = { x: width / 2, y: height / 2 + 50 };
    textFont(beachFont);
    fill("#ffb95d");
    stroke(0, 0, 0);
    strokeWeight(5);
    textSize(100);
    text("Sandcastle", width / 2 - 250, 250);
    text("Tycoon", width / 2 - 160, 330);


    strokeWeight(1);
    play.text = "Play";
    play.textSize = 35;
    play.textColor = "#ffd093";


    howToPlay.text = "How to Play";
    howToPlay.textSize = 35;
    howToPlay.textColor = "#ffd093";

    if (play.mouse.presses()) {
      toolSound.play()
      bgMusic.setVolume(0.6);
      backgroundMusic();
      // move off screen
      play.pos = { x: 1999, y: 1999 };
      howToPlay.pos = { x: 1999, y: 1999 };
      screen = 1;
      wave.pos = { x: 350, y: 900 };
      waveCount = 1;
      waveTimer = waveInterval;
    }
    if (howToPlay.mouse.presses()) {
      toolSound.play();
      // move off screen
      play.pos = { x: 1999, y: 1999 };
      howToPlay.pos = { x: 1999, y: 1999 };
      screen = 2;
    }
  }

  else if (screen == 1) {
    // things onto screen
    shovelBack.pos = { x: 450, y: 110 };
    bucketBack.pos = { x: 550, y: 110 };
    plantBack.pos = { x: 650, y: 110 };
    castle1.pos = { x: 350, y: 350 };
    shovel.pos = { x: 450, y: 110 };
    bucket.pos = { x: 550, y: 105 };
    plant.pos = { x: 650, y: 105 };
    rock1.pos = { x: 535, y: 159 };
    rock1.scale = 0.45;
    rock1.opacity = 0.9;
    plant1.pos = { x: 635, y: 159 };
    plant1.scale = 0.45;
    plant1.opacity = 0.9;
    // rock text
    textFont(beachFont);
    fill("#ffd093");
    stroke(0, 0, 0);
    textSize(30);
    text((rocks), 565, 171);

    // plant text
    textFont(beachFont);
    fill("#ffd093");
    stroke(0, 0, 0);
    textSize(30);
    text((plants), 665, 171);

    //wave movement
    theta += 5;
    wave.pos.y = wave.pos.y + sin(theta) * amplitude;
    if (wave.pos.x >= width) {
      wave.pos.x = 0;
    }
    else {
      wave.pos.x += 2;
    }

    // randomly placing rock
    if (millis() - lastMoveTimeRock > random(8000, 20000)) {
      rock.x = random(width);
      rock.y = wave.pos.y - 230;
      lastMoveTimeRock = millis();
    }
    if (waveCount > 2 && millis() - lastMoveTimePlant > random(5000, 10000)) {
      plant2.x = random(width);
      plant2.y = wave.pos.y - 230;
      lastMoveTimePlant = millis();
    }


    // picking up rocks
    if (rock.mouse.presses()) {
      rock.x = 1999;
      rock.y = 1999;
      rocks += 1;
      rockSound.play();
    }

    //picking up seeds
    if (plant2.mouse.presses()) {
      plant2.x = 1999;
      plant2.y = 1999;
      plants += 1;
      plantSound.play();
    }

    // x marks on the spot
    if (waveCount == 2 && waveTimer <= 100) {
      mark.pos.x = 350;
      mark.pos.y = wave.pos.y - 320;
    }

    //mark collision
    if (shovelHolding && mark.mouse.presses()) {
      dune1.x = mark.pos.x;
      dune1.y = mark.pos.y;
      mark.pos.x = 1999;
      mark.pos.y = 1999;
      bucketSound.play();
      shovelHolding = false;
      duneDown = false;
    }

    // text
    textFont(beachFont);
    fill("#ffd093");
    stroke(0, 0, 0);
    textSize(50);
    text(('Wave #' + waveCount), width / 2 - 110, 55);

    textSize(25);

    // wave time
    waveTimer -= deltaTime;
    let formattedWaveTimer = (waveTimer / 1000).toFixed(0);

    if (waveTimer <= 0) {
      startNextWave();
    }
    currentTime = int(millis() / 1000);
    text(('Next Wave: ' + formattedWaveTimer + ' seconds'), 20, 115);

    // shovel tool
    if (shovel.mouse.presses()) {
      if (shovelHolding) {
        // If already holding, release the shovel
        shovelHolding = false;
      } else {
        // If not holding, pick up the shovel
        shovelHolding = true;
        toolSound.play();
      }
    }

    if (shovelHolding) {
      shovel.x = mouseX;
      shovel.y = mouseY - 10;
    } else {
      shovel.pos = { x: 450, y: 110 };
    }

    //rocks and castle upgrade
    castleUpgrade();

    // dunes upgrading
    upgradeDune();

    if (duneDown == true) {
      if (plants > 4 && wave.pos.y > 610) {
        plant.scale = 1.2;
        plant.opacity = 1;
        plant.bounce = true;
        mark.pos.x = 350;
        mark.pos.y = wave.pos.y - 200;
        if (mark.mouse.presses() && shovelHolding) {
          plants -= 5;
          plant.scale = 1;
          plant.opacity = 0.5;
          plant.bounce = false;
        }
      }
      else {
        mark.pos.x = -1999;
      }
    }

    print("wave:" + wave.pos.y);
    print("dune" + dune1.pos)

    // // dunes downgrading
    downgradeDune();

    // loose condition
    if (wave.pos.y < 545) {
      screen = 3;
    }

  }

  else if (screen == 2) {
    howTo()
  }

  else if (screen == 3) {
    loose();
  }
}

function backgroundMusic() {
  bgMusic.play();
  bgMusic.loop();
}

function startNextWave() {
  // first three waves are 15 seconds
  if (waveCount < 4) {
    waveTimer = waveInterval * 1.5;
  }
  // waves 3-7 are 10 seconds
  else if (waveCount > 3 && waveCount < 8) {
    waveTimer = waveInterval;
  }
  // after that waves are every 5 seconds
  else {
    waveTimer = waveInterval * 0.5;
  }

  // wave goes up 40
  wave.pos.y -= 40;

  // Increment the wave count
  waveCount++;
}

function howTo() {
  back.pos = { x: width / 2, y: height / 2 + 260 };
  howToPic.pos = { x: width / 2, y: height / 2 - 100 };
  fill("#ffb95d");
  back.color = "#66CC99";
  back.stroke = "#66CC32";
  back.text = "Back to Menu";
  back.textSize = 30;
  back.textColor = "#ffd093";

  if (back.mouse.presses()) {
    toolSound.play();
    // move off screen
    back.pos = { x: 1999, y: 1999 };
    howToPic.pos = { x: 1999, y: 1999 };
    screen = 0;
  }

}

function castleUpgrade() {
  // castle upgrading
  if (rocks > 9 && bucket.mouse.presses() && castle1.img == castle1Img) {
    bucketSound.play();
    castle1.img = castle2Img;
    rocks -= 9;
  }
  else if (rocks > 9 && bucket.mouse.presses() && castle1.img == castle2Img) {
    bucketSound.play();
    castle1.img = castle3Img;
    rocks -= 9;
  }
  else if (rocks > 9 && bucket.mouse.presses() && castle1.img == castle3Img) {
    bucketSound.play();
    castle1.img = castle4Img;
    rocks -= 9;
  }

  // rocks notification
  if (bucket.bounce) {
    bucket.y = 105 + sin(frameCount * 5) * 3; // Adjust the bounce height as needed
  }

  if (rocks > 9 && castle1.img != castle4Img) {
    bucket.scale = 1.2;
    bucket.opacity = 1;
    bucket.bounce = true;
  }
  else {
    bucket.scale = 1;
    bucket.opacity = 0.5;
    bucket.bounce = false;
  }
}

function upgradeDune() {
  // plant notification
  if (plant.bounce) {
    plant.y = 105 + sin(frameCount * 5) * 3; // Adjust the bounce height as needed
  }

  if (plants > 2 && dune1.img == duneLevel1Img && dune1.pos.x != -1999) {
    plant.scale = 1.2;
    plant.opacity = 1;
    plant.bounce = true;
  }

  else if (plants > 2 && dune1.img == duneLevel2Img && dune1.pos.x != -1999) {
    plant.scale = 1.2;
    plant.opacity = 1;
    plant.bounce = true;
  }

  else {
    plant.scale = 1;
    plant.opacity = 0.5;
    plant.bounce = false;
  }

  // upgrade
  if (plants > 2 && plant.mouse.presses() && dune1.img == duneLevel1Img && dune1.pos.x != -1999) {
    plantSound.play();
    dune1.img = duneLevel2Img;
    plants -= 3;
  }

  else if (plants > 2 && plant.mouse.presses() && dune1.img == duneLevel2Img && dune1.pos.x != -1999) {
    plantSound.play();
    dune1.img = duneLevel3Img;
    plants -= 3;
  }

}

function downgradeDune() {
  if (wave.pos.y < dune1.pos.y + 110) {
    wave.pos.y += 100;
    if (dune1.img == duneLevel3Img) {
      dune1.img = duneLevel2Img;
    }
    else if (dune1.img == duneLevel2Img) {
      dune1.img = duneLevel1Img;
    }
    else {
      dune1.pos.x = -1999;
      dune1.pos.y = -1999;
      duneDown = true;
    }
  }
}

function loose() {
  // reset
  rocks = 0;
  plants = 0;
  dune1.img = duneLevel1Img;
  castle1.img = castle1Img;

  // things off screen
  shovelBack.pos = { x: 1999, y: 1999 };
  shovel.pos = { x: 1999, y: 1999 };
  bucketBack.pos = { x: 1999, y: 1999 };
  bucket.pos = { x: 1999, y: 1999 };
  plantBack.pos = { x: 1999, y: 1999 };
  plant.pos = { x: 1999, y: 1999 };
  castle1.pos = { x: 1999, y: 1999 };
  wave.pos = { x: 1999, y: 1999 };
  rock1.pos = { x: 1999, y: 1999 };
  rock.pos = { x: 1999, y: 1999 };
  dune1.pos = { x: 1999, y: -1999 };
  mark.pos = { x: 1999, y: 1999 };
  plant1.pos = { x: 1999, y: 1999 };
  plant2.pos = { x: 1999, y: 1999 };
  let finalWave = waveCount;

  // text
  textFont(beachFont);
  fill("#ffd093");
  stroke(0, 0, 0);
  textSize(50);
  text(("Thanks for learning"), width / 2 - 220, height / 2 - 200);
  text(("and Playing!"), width / 2 - 130, height / 2 - 130);
  text(("You made it to"), width / 2 - 160, height / 2 - 50);
  text(('Wave #' + finalWave), width / 2 - 80, 500);

  back.pos = { x: width / 2, y: height / 2 + 150 };
  fill("#ffb95d");
  back.color = "#66CC99";
  back.stroke = "#66CC32";
  back.text = "Restart";
  back.textSize = 30;
  back.textColor = "#ffd093";

  if (back.mouse.presses()) {
    print('pressed back button');
    // move off screen
    back.pos = { x: 1999, y: 1999 };
    screen = 0;
  }
}