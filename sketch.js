var END = 0;
var IDLE = 1;
var PLAY = 2;

var gameState = IDLE;

var bird, birdImg;

var topPipe, botPipe, scoreCol, pipeImg;

var pipes
var scoreCols;

var ground, groundImg;

var score;

var highscore;

var GRAVITY = 1;

var MAXFALL;
 
var FLAP;

var PIPESPEED = -5;

var gameOverSound;

var widHeiAverage;

function preload() {
  birdImg = loadImage("flappyBird.png");
  
  groundImg = loadImage("ground.png");
  
  pipeImg = loadImage("pipe.png");
  
  gameOverSound = loadSound("gameOver.mp3");
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  widHeiAverage = (windowWidth + windowHeight)/2;
  
  bird = createSprite(windowWidth*0.1, windowHeight/2);
  bird.addImage("bird", birdImg);
  bird.scale = widHeiAverage*0.00005;
  
  pipes = createGroup();
  scoreCols = createGroup();
  
  ground = createSprite(600, windowHeight*1.6);
  ground.addImage("ground", groundImg);
  ground.scale = windowHeight/150;
  
  score = 0;
  highscore = 0;

  FLAP = -widHeiAverage/120;
  MAXFALL = -FLAP;

  GRAVITY = widHeiAverage/960;
  
}

function draw() {
  background("skyblue");
  
  if (ground.x <= 0){
    ground.x = 640;
  }
  
  if (gameState === IDLE){
    
    ground.velocityX = PIPESPEED;
    
    textSize(widHeiAverage/24);
    textAlign(CENTER);
    text("Space to flap.", windowWidth/2, windowHeight*0.3);
    
    bird.velocityY = (Math.sin(World.frameCount*0.2)*5);
    
    if (keyWentDown("space")){
      bird.velocityY = FLAP;
      gameState = PLAY;
    }
  }
  
  if (gameState == PLAY){
    
    PIPESPEED = -(5 + (score/3));
    
    textAlign(CENTER);
    textSize(widHeiAverage/12);
    text("Score: " + score, windowWidth/2, windowHeight*0.1);
    textSize(widHeiAverage/24);
    text("Your Best: " + highscore, windowWidth/2, windowHeight*0.3);
    
    ground.velocityX = PIPESPEED;
    
    if (keyDown("space")){
      bird.velocityY = FLAP;
    }
    
    bird.velocityY += GRAVITY;
    if (bird.velocityY > MAXFALL){
      bird.velocityY = MAXFALL;
    }
    
    if (World.frameCount%90 == 0){
      pipe();
    }
    
    if (bird.isTouching(pipes) || bird.collide(ground)){
      gameOver();
    }
    
    for (var s = 0; s < scoreCols.length; s++){
      if (scoreCols[s].isTouching(bird)){
        score++;
        scoreCols[s].destroy();
      }
    }
    
    if (bird.y <= 0){
      bird.y = 0;
    }
  }
  
  
  
  if (score > highscore){
    highscore = score;
  }
  
  bird.rotation = lerp(bird.rotation, bird.velocityY*3, 0.25);
  
  bird.collide(ground);
  
  drawSprites();
  
  if (gameState == END){
    
    background(rgb(50, 50, 50, 0.5));
    
    ground.velocityX = 0;
    
    fill("white");
    textAlign(CENTER);
    textSize(widHeiAverage/48);
    text("You went through " + score + " pipes", windowWidth/2, windowHeight*0.3);
    textSize(widHeiAverage/96);
    text("Click R to restart.", windowWidth/2, windowHeight*0.5);
    textSize(widHeiAverage/80);
    text("Your best score: " + highscore, windowWidth/2, windowHeight*0.7);
    
    if (keyWentDown("r")){
      restart();
    }
  }
}

function pipe() {
  var r = random(windowHeight*-0.4, windowHeight*0.25);
  
  scoreCol = createSprite(windowWidth*1.1, r+400, 10, windowHeight/2);
  scoreCol.shapeColor = "skyblue";
  scoreCol.velocityX = PIPESPEED;
  scoreCol.lifetime = (windowWidth*1.1)/PIPESPEED;
  
  scoreCols.add(scoreCol);
  
  topPipe = createSprite(windowWidth*1.1, (r)+(windowHeight*0.05));
  topPipe.shapeColor = rgb(4, 161, 43);
  topPipe.velocityX = PIPESPEED;
  topPipe.lifetime = (windowWidth*1.1)/PIPESPEED;
  topPipe.addImage("pipe", pipeImg);
  topPipe.rotation = 180;
  topPipe.scale = 0.5;
  
  botPipe = createSprite(windowWidth*1.1, (800+r)-(windowHeight*0.05));
  botPipe.shapeColor = rgb(4, 161, 43);
  botPipe.velocityX = PIPESPEED;
  botPipe.lifetime = (windowWidth*1.1)/PIPESPEED;
  botPipe.addImage("pipe", pipeImg);
  botPipe.scale = 0.5;
  
  pipes.add(topPipe);
  pipes.add(botPipe);
  
  ground.depth = botPipe.depth + 1;
  
}

function gameOver() {
  gameOverSound.play();
  gameState = END;
  
  pipes.setVelocityXEach(0);
  pipes.setLifetimeEach(-1);
  
  scoreCols.destroyEach();
  
  bird.velocityY = 5;
}

function restart() {
  score = 0;
  bird.y = 300;
  bird.velocityY = 0;
  gameState = IDLE;
  pipes.destroyEach();
  scoreCols.destroyEach();
}
