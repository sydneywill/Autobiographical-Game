let video;

function setup() {
  createCanvas(400, 400);

  video = createCapture(VIDEO);
  video.hide();

}

function draw() {
  background(220);

  // image(video, 0, 0);

  video.loadPixels();

  //iterating over every 30 pixels bc 680,000
    //array is very long and machine will break
    for(let x=0; x<video.width; x+=20){
      for(let y=0; y<video.height; y+=20){
// alls me to get eaxh x and y index or the pixel
        let pindex = (x + (y * video.width))* 4;
//pizels is the pixel array
// video.pixels ==> the pixrl array from the video
        let r =video.pixels[pindex+0];
        let g = video.pixels[pindex+1];
        let b = video.pixels[pindex+2];
        let a = video.pixels[pindex+3];

        fill (r, g, b. a);
        rect(x, y, 30);


      }
    }
}
