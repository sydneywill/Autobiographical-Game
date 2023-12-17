let images = []
let tiles = [];
let paths = [
  "assets/H01.png",
  "assets/H02.png",
  "assets/H03.png",
  "assets/H04.png",
  "assets/H05.png",
  "assets/H06.png",
  "assets/H07.png",
  "assets/H08.png",
  "assets/H09.png",
  "assets/H10.png",
  "assets/H11.png",
  "assets/H12.png",
  "assets/H13.png",
  "assets/H14.png",
  "assets/H15.png",
];

let death = 1;

let levelComplete = false;

let order = [
  [16, 1, 2, 15], 
  [3, 4, 5, 6], 
  [7, 8, 9, 10], 
  [11, 12, 13, 14]
]

// LEVEL 1
// paths = ['3.png', '2.png', '15.png', '4.png', '1.png', '5.png', '6.png', '7.png', '8.png', '9.png', '10.png', '11.png', '12.png', '13.png', '14.png'];

// order = [
//   [16, 3, 2, 15], 
//   [4, 1, 5, 6], 
//   [7, 8, 9, 10], 
//   [11, 12, 13, 14]
// ]

let levels = {
  1: {
    paths: ['assets/H03.png', 'assets/H02.png', 'assets/H15.png', 'assets/H04.png', 'assets/H01.png', 'assets/H05.png', 'assets/H06.png', 'assets/H07.png', 'assets/H08.png', 'assets/H09.png', 'assets/H10.png', 'assets/H11.png', 'assets/H12.png', 'assets/H13.png', 'assets/H14.png'],
    order: [
      [16, 3, 2, 15], 
      [4, 1, 5, 6], 
      [7, 8, 9, 10], 
      [11, 12, 13, 14]
    ]
  },
  2: {
    paths: ['assets/H03.png', 'assets/H01.png', 'assets/H15.png', 'assets/H04.png', 'assets/H02.png', 'assets/H05.png', 'assets/H11.png', 'assets/H08.png', 'assets/H09.png', 'assets/H06.png', 'assets/H12.png', 'assets/H13.png', 'assets/H14.png', 'assets/H10.png'],
    order: [
      [16, 3, 1, 15], 
      [7, 4, 2, 5], 
      [11, 8, 9, 6], 
      [12, 13, 14, 10]
    ]
  },
  3: {
    paths: ['assets/H02.png', 'assets/H05.png', 'assets/H15.png', 'assets/H01.png', 'assets/H04.png', 'assets/H06.png', 'assets/H10.png', 'assets/H03.png', 'assets/H08.png', 'assets/H11.png', 'assets/H12.png', 'assets/H13.png'],
    order: [
      [16, 2, 5, 15], 
      [1, 4, 6, 10], 
      [3, 8, 9, 14], 
      [7, 11, 12, 13]
    ] 
  },
  
}
let level = 1;
let lastLevel = 3

function updateLevel(lvl){
  paths =  JSON.parse(JSON.stringify(levels[lvl].paths));
  order = JSON.parse(JSON.stringify(levels[lvl].order));
  
  images = [];
  for(let i = 0; i < 15; i++){
    let s = paths[i]
    // images.push(loadImage( s ))
    images.push(loadImage(s))
  }
}

function preload(){
  shift = new Audio('shift.wav')
  for(let i = 0; i < 15; i++){
    let s = paths[i]
    images.push(loadImage(s))
  }
  lava = loadImage("lava.jpg")
  bowser = loadImage('bowserlaugh.png')
  music = new Audio('https://vgmsite.com/soundtracks/super-mario-64-soundtrack/drbaibihvg/10%20Lethal%20Lava%20Land.mp3')
  laugh = new Audio("laugh.wav")
  laugh.loop = false;
  gameOverScreen = loadImage("gameover.png")
  thankyou = new Audio("thankyou.wav")
  staffroll = new Audio("Staff Roll.mp3")
}

class Tile {
  constructor(x, y, img){
    this.x = x;
    this.y = y;
    this.w = 50;
    this.h = 50;
    this.to = {x: x, y: y}
    this.isTile = true;
    this.img = img;
  }
   
  draw() {
    rect(this.x, this.y, this.w, this.h)
    image(this.img, this.x-this.w/2, this.y-this.h/2, 50, 50, 0, 0, this.img.height, this.img.height)
  }
  
  move() {
    this.moving = true;
    this.x += (this.to.x - this.x) * 0.1
    this.y += (this.to.y - this.y) * 0.1
    
    if(abs(this.to.x - this.x) < 0.1) {
      this.x = this.to.x
    }
    if(abs(this.to.y - this.y) < 0.1) {
      this.y = this.to.y;
    }
  }
}

function grid(n, w, dx, dy){
  let g = [];
  let c = 0;
  for(let i = 0; i < n; i++){
    g.push([]);
    for(let j = 0; j < n; j++){
      if(i*(n-1) + j + c == 0){
        g[i].push(0)
      } else {
        // console.log(i*(n-1) + j + c)
        let tileImage = images[i*(n-1) + j + c - 1]
        g[i].push( new Tile(j* w + dx, i*w + dy, tileImage) )
      }
    }
    c += 1
  }
  return g;
}

function setup() {
  createCanvas(400, 400).parent('sketch-holder');
  rectMode(CENTER)
  t = new Tile(100, 100)
  lava.resize(width*1.4, height*1.4)
  music.loop = true;
  music.volume = 0.75;
  bowser.resize(bowser.width*2, bowser.height*2)
  fadeAlpha = 255;
  fadeFactor = 2;
  updateLevel(level)
  g = new grid(4, 50, 127, 120);
  deathScreenActive = false;
  document.getElementById('level').innerText = "Level: " + level
  gameOverScreen.resize(height/gameOverScreen.height*gameOverScreen.width, height)
  gameOver = false;
  thankyou.loop = false;
  thankyou.volume = 0.6;
  thankyouplayed = false;
  laugh.loop = false;
  laughPlayed = false;
}

function draw() {
  // updateLevel(level)
  clear()
  // background(220);
  push()
    imageMode(CENTER)
    translate(width/2, height/2)
    rotate(frameCount / 3000)
    image(lava, 0, 0)
    imageMode(CORNER)
  pop()
  for(let i = 0; i < g.length; i++){
    for(let j = 0; j < g[0].length; j++){
      if(g[i][j].isTile) {
        g[i][j].draw()
        g[i][j].move()
      }
    }
  }
  
  // Death screen
  if(levelComplete && bowser.width > 5 && bowser.height > 5){
    deathScreenActive = true;
    if(!laughPlayed) laugh.play()
    laughPlayed = true;
    death *= 0.999775
    image(bowser, width/2 - bowser.width/2, height/2 - bowser.height/2)
    bowser.resize(bowser.width*death, bowser.height*death)
    rectMode(CORNER)
    fill(0)
    rect(0, 0, width, height/2 - bowser.height/2)
    rect(0, 0, width/2 - bowser.width/2, height)
    rect(width/2 + bowser.width/2, 0, width , height)
    rect(0, height/2 + bowser.height/2, width, height)
    rectMode(CENTER)
    if(level == lastLevel){
      music.volume = death;
    }
  } else if (levelComplete){
    deathScreenActive = false;
    laughPlayed = false;
    levelComplete = false;
    death = 1;
    level += 1;
    if(level == lastLevel + 1){
      gameOver = true;
      level = 1;
      fadeFactor = 2;
      document.getElementById('level').innerText = "You win this time Mario! Wahahahaha"
    } 
    document.getElementById('level').innerText = "Level: " + level
    updateLevel(level)
    console.log("NEXT LEVEL" + level)
    g = new grid(4, 50, 127, 120);
    console.log(g)
    bowser = loadImage('bowserlaugh.png')
    bowser.resize(bowser.width*2, bowser.height*2)
    fadeFactor = 2;
  }
  if(gameOver){
    music.pause();
    imageMode(CENTER)
    image(gameOverScreen, width/2, height/2)
    imageMode(CORNER)
  }
  if(fadeFactor < 255 ) {
    fadeFactor *= 1.1
    fadeAlpha = (255 - fadeFactor - 1)
    fadeIn(fadeAlpha)
  } else if(gameOver && !thankyouplayed){
    thankyou.play()
    thankyouplayed = true;
    staffroll.play()
  }
  // 
}

function fadeIn(a){
  push()
    fill(0, 0, 0, a)
    rect(width/2, height/2, width, height)
  pop()
}


function mousePressed() {
  music.play()
  if(true){
    let moved = false;
    for(let i = 0; i < g.length; i++){
      for(let j = 0; j < g[0].length; j++){
        let gridPt = g[i][j]
        let neighbors = {
          above: null,
          below: null,
          left: null,
          right: null
        };
        if(i > 0){
          neighbors.above = g[i-1][j];
        }
        if(i < g.length-1){
          neighbors.below = g[i+1][j];
        }
        if(j >= 0){
          neighbors.right = g[i][j+1];
        }
        if(j < g.length){
          neighbors.left = g[i][j-1];
        }
        if(gridPt.isTile && moved == false) {
          if(abs(mouseX - gridPt.x) < gridPt.w/2 &&
            abs(mouseY - gridPt.y) < gridPt.w/2) {
            for (const neighbor in neighbors) {
              // console.log(neighbors[neighbor])
              if(neighbors[neighbor] == 0) {
                // console.log(neighbor)
                if(neighbor == "above"){
                  gridPt.to = {x: gridPt.x, y: gridPt.to.y - gridPt.w}
                  g[i-1][j] = gridPt;
                  g[i][j] = 0

                  // Rearrange the order for building puzzle
                  let old1 = order[i-1][j];
                  let old2 = order[i][j];
                  order[i-1][j] = old2;
                  order[i][j] = old1;
                  printGrid(order)
                  levelComplete = checkOrder(order)
                  moved = true
                }
                else if(neighbor == "below"){
                  gridPt.to = {x: gridPt.x, y: gridPt.to.y + gridPt.w}
                  g[i+1][j] = gridPt;
                  g[i][j] = 0

                  // Rearrange the order for building puzzle
                  let old1 = order[i+1][j];
                  let old2 = order[i][j];
                  order[i+1][j] = old2;
                  order[i][j] = old1;
                  printGrid(order)
                  levelComplete = checkOrder(order)
                  moved = true
                }
                else if(neighbor == "left"){
                  gridPt.to = {x: gridPt.to.x - gridPt.w, y: gridPt.y}
                  g[i][j-1] = gridPt;
                  g[i][j] = 0
                  moved = true

                  // Rearrange the order for building puzzle
                  let old1 = order[i][j-1];
                  let old2 = order[i][j];
                  order[i][j-1] = old2;
                  order[i][j] = old1;
                  printGrid(order)
                  levelComplete = checkOrder(order)
                }
                else if(neighbor == "right"){
                  gridPt.to = {x: gridPt.to.x + gridPt.w, y: gridPt.y}
                  g[i][j+1] = gridPt;
                  g[i][j] = 0
                  moved = true

                  // Rearrange the order for building puzzle
                  let old1 = order[i][j+1];
                  let old2 = order[i][j];
                  order[i][j+1] = old2;
                  order[i][j] = old1;
                  printGrid(order)
                  levelComplete = checkOrder(order)
                }
                // console.log(...[...[...g]])
                let sound = new Audio("shift.wav")
                sound.play()
                break
              }
            }
          }
        }
      }
    }
  }
  
}
  
function checkOrder(grd){
  let win = true;
  let correct = [
    [16, 1, 2, 15], 
    [3, 4, 5, 6], 
    [7, 8, 9, 10], 
    [11, 12, 13, 14]
  ]
  for(let i = 0; i < grd.length; i++){
    for(let j = 0; j < grd.length; j++){
      if(grd[i][j] != correct[i][j]) win = false;
    }
  }
  return win
}

function printGrid(grd){
  let orderArray = "";
  for(let i = 0; i < grd.length; i++){
    for(let j = 0; j < grd.length; j++){
      orderArray = orderArray + "'" + grd[i][j] + ".png', "
    }
  }
  // console.log(orderArray.toString())
}
  
function restart(){
  levelComplete = true;
  if(!deathScreenActive) level -= 1
}