/*global ROT, DN*/

DN.Actor = function (type) {
  'use strict';
  this.type = type;
  this.x = 0;
  this.y = 0;
  this.r = 10;
  this.exploredLevels = [];
  this.currentLevel = -1;
  DN.scheduler.add(this, true);
  window.addEventListener('keypress', this.handleEvenet.bind(this));
};

DN.Actor.prototype.setXY = function (xy) {
  'use strict';
  this.x = xy[0];
  this.y = xy[1];
};

DN.Actor.prototype.act = function () {
  'use strict';
  this.initFOV();
  DN.getLevel().fov.compute(this.x, this.y, this.r, this.updateFOV.bind(this));
  if (this.type === 'adventurer') {
    this.draw();
    DN.engine.lock();
  }
};

DN.Actor.prototype.initFOV = function () {
  'use strict';
  this.exploredLevels[this.currentLevel].fov = {};
};

DN.Actor.prototype.getFOV = function () {
  'use strict';
  return this.exploredLevels[this.currentLevel].fov;
};

DN.Actor.prototype.initExplored = function () {
  'use strict';
  this.exploredLevels[this.currentLevel] = {
    fov: {},
    explored: {}
  };
};

DN.Actor.prototype.getExplored = function () {
  'use strict';
  return this.exploredLevels[this.currentLevel].explored;
};

DN.Actor.prototype.draw = function () {
  'use strict';
  DN.display.clear();
  this.drawExplored();
  this.drawFOV();
  DN.drawUI();
};

DN.Actor.prototype.drawExplored = function () {
  'use strict';
  var i, e;
  e = this.getExplored();
  for (i in e) {
    if (e.hasOwnProperty(i)) {
      DN.display.draw(e[i].x, e[i].y, e[i].char, '#555');
    }
  }
};

DN.Actor.prototype.drawFOV = function () {
  'use strict';
  var i, f;
  f = this.getFOV();
  for (i in f) {
    if (f.hasOwnProperty(i)) {
      DN.display.draw(f[i].x, f[i].y, f[i].char);
    }
  }
};

DN.Actor.prototype.updateFOV = function (x, y) {
  'use strict';
  this.getFOV()[x + ',' + y] = this.getExplored()[x + ',' + y] = {
    x: x,
    y: y,
    char: DN.getLevel().getChar(x, y)
  };
};

DN.Actor.prototype.handleEvenet = function (e) {
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
    this.moveDownstairs();
    DN.engine.unlock();
    return;
  }
  if (!this.isChar((this.x + newx), (this.y + newy), '#')) {
    this.setXY([this.x + newx, this.y + newy]);
    if (this.isChar(this.x, this.y, '+')) {
      DN.getLevel().setChar(this.x, this.y, '/');
    }
    DN.engine.unlock();
  }
};

DN.Actor.prototype.isChar = function (x, y, char) {
  'use strict';
  return this.getFOV()[x + ',' + y].char === char;
};

DN.Actor.prototype.moveDownstairs = function () {
  'use strict';
  var x, y;
  this.currentLevel += 1;
  if (!DN.levels[this.currentLevel]) {
    DN.levels.push(new DN.Level());
    this.initExplored();
  }
};
