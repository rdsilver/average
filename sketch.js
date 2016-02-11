var grid;
var cell_size = 35;

// Moore neighborhood
var neighborhood = [[0, -1], [-1, 0], [1, 0], [0, 1], [-1, -1], [1, -1], [1, 1], [-1, 1]];

var fountains = {};

function setup() {
  var myCanvas = createCanvas(window.innerWidth, window.innerHeight);
  myCanvas.parent('sketch');
  background(255);

  grid = new Grid();
  noStroke();
  smooth();
}

function draw() {
  grid.step();
}

function Grid() {
  this.size = cell_size;
  this.grid_w = Math.round(width/this.size);
  this.grid_h = Math.round(height/this.size);
  this.grid = set2dArrayToZero(createArray(this.grid_w, this.grid_h));
  this.holder_grid = set2dArrayToZero(createArray(this.grid_w, this.grid_h));
  this.temp_grid = 0;

  this.step = function() {
    this.temp_grid = this.holder_grid;

    var rgb, num_neighbors, var_key;
    for (var x=0; x<this.grid_w; x++) 
      for (var y=0; y<this.grid_h; y++) {
        rgb = this.get_new_rgb(x,y, num_neighbors, rgb);
        this.temp_grid[x][y] = rgb;
        this.fountain_exception(var_key, x, y);
        rgb = this.temp_grid[x][y];

        // Draw Cells
        fill(rgb[0], rgb[1], rgb[2]);
        rect(x*this.size, y*this.size, this.size, this.size);
      }

    this.grid = this.temp_grid;

  }

  // Gets the new rgb for this cell this step
  this.get_new_rgb = function (x, y, num_neighbors, rgb) {
    num_neighbors = 0;
    rgb = [0, 0, 0];

    // Loop through the neighborhood and average the color
    _.each(neighborhood, function(neighbor) {
      n_x = neighbor[0];
      n_y = neighbor[1];

      if (n_x+x<this.grid_w && n_x+x>=0 && n_y+y<this.grid_h && n_y+y>=0) {
        num_neighbors++;

        _.each(this.grid[x+n_x][y+n_y], function(colors, i) {
          rgb[i] += colors;
        })
      }
    }, this);

    _.each(rgb, function(color, i) {
      rgb[i] = color/(num_neighbors);
    });

    return rgb;
  }

  this.fountain_exception = function(var_key, x, y) {
    var_key = ""+x+" "+y;

    if (var_key in fountains) {
      this.grid[x][y] = fountains[var_key];
    }
  }

}; 


function set2dArrayToZero(array) {
  for (x=0; x<array.length; x++) 
      for (y=0; y<array[x].length; y++) 
        array[x][y] = [255, 255, 255];

  return array;
}

function createArray(length) {
    var arr = new Array(length || 0),
        i = length;

    if (arguments.length > 1) {
        var args = Array.prototype.slice.call(arguments, 1);
        while(i--) arr[length-1 - i] = createArray.apply(this, args);
    }

    return arr;
}

function mouseClicked() {
    var x = Math.floor(mouseX/cell_size);
    var y = Math.floor(mouseY/cell_size);
    var var_key = ""+x+" "+y;

    if (var_key in fountains) 
      delete fountains[var_key];
    
    var num_fountains = _.keys(fountains).length;
    if (num_fountains%3 == 0)
      fountains[var_key] = [153, 204, 255];
    else if (num_fountains%3 == 1)
      fountains[var_key] = [255, 204, 0];
    else 
      fountains[var_key] = [153, 204, 153];

}

/* needs fixing */
function windowResized() {
  resizeCanvas(window.innerWidth, window.innerHeight);
  grid = new Grid();
  fountains = {};
}