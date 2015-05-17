/*global ROT, DN*/

DN.Adventurer = function (xy) {
  'use strict';
  this.x = xy[0];
  this.y = xy[1];
  this.range = 10;
  this.levels = [];
  this.levels[0] = {
    explored: {},
    fov: {}
  };
  this.level = this.levels[0];
  window.addEventListener('keypress', this.handleEvenet.bind(this));
};

DN.Adventurer.prototype.act = function () {
  'use strict';
  this.level.fov = {};
  DN.level.fov.compute(this.x, this.y, this.range, this.updateFOV.bind(this));
  this.draw();
  DN.engine.lock();
};

DN.Adventurer.prototype.draw = function () {
  'use strict';
  this.drawExplored();
  this.drawFOV();
  DN.drawUI();
};

DN.Adventurer.prototype.drawExplored = function () {
  'use strict';
  var i, e;
  for (i in this.level.explored) {
    if (this.level.explored.hasOwnProperty(i)) {
      e = this.level.explored[i];
      DN.display.draw(e.x, e.y, e.char, '#555');
    }
  }
};

DN.Adventurer.prototype.drawFOV = function () {
  'use strict';
  var i, f;
  for (i in this.level.fov) {
    if (this.level.fov.hasOwnProperty(i)) {
      f = this.level.fov[i];
      DN.display.draw(f.x, f.y, f.char);
    }
  }
};

DN.Adventurer.prototype.updateFOV = function (x, y) {
  'use strict';
  this.level.fov[x + ',' + y] = this.level.explored[x + ',' + y] = {
    x: x,
    y: y,
    char: DN.level.getChar(x, y)
  };
};

DN.Adventurer.prototype.handleEvenet = function (e) {
  'use strict';
  var newx, newy;
  newx = 0;
  newy = 0;
  switch (e.keyCode) {
  case ROT.VK_1:
    newx -= 1;
    newy += 1;
    break;
  case ROT.VK_2:
    newy += 1;
    break;
  case ROT.VK_3:
    newx += 1;
    newy += 1;
    break;
  case ROT.VK_4:
    newx -= 1;
    break;
  case ROT.VK_6:
    newx += 1;
    break;
  case ROT.VK_7:
    newx -= 1;
    newy -= 1;
    break;
  case ROT.VK_8:
    newy -= 1;
    break;
  case ROT.VK_9:
    newx += 1;
    newy -= 1;
    break;
  case 13:
    break;
  }
  if (this.level.fov[(this.x + newx) + ',' + (this.y + newy)].char !== '#') {
    this.x += newx;
    this.y += newy;
    if (this.level.fov[this.x + ',' + this.y].char === '+') {
      DN.level.setChar(this.x, this.y, '/');
    }
    DN.engine.unlock();
  }
};
