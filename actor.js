/*global ROT, DN*/

DN.Actor = function (char, x, y, z, range, speed, health) {
  'use strict';
  this.char = char || '@';
  this.x = x || 30;
  this.y = y || 10;
  this.z = z || 0;
  this.range = range || 10;
  this.speed = speed || 10;
  this.currentHealth = this.maxHealth = health || 10;
  this.targetX = this.x;
  this.targetY = this.y;
  this.exploredLevels = [];
  this.path = [];
  this.initExplored();
  DN.scheduler.add(this, true);
  if (this.char === '@') {
    window.addEventListener('keypress', this.handleEvenet.bind(this));
  }
};

DN.Actor.prototype.setXY = function (xy) {
  'use strict';
  this.x = xy[0];
  this.y = xy[1];
};

DN.Actor.prototype.getSpeed = function () {
  'use strict';
  return this.speed;
};

DN.Actor.prototype.act = function () {
  'use strict';
  this.initFOV();
  DN.getLevel().fov.compute(
    this.x,
    this.y,
    this.range,
    this.updateFOV.bind(this)
  );
  if (this.char === '@') {
    this.draw();
    DN.engine.lock();
  } else {
    if (this.targetX !== this.x || this.targetY !== this.y) {
      this.path = [];
      new ROT.Path.AStar(
        this.targetX,
        this.targetY,
        DN.getLevel().isPassable.bind(DN.getLevel())
      ).compute(
        this.x,
        this.y,
        this.updatePath.bind(this)
      );
      this.setXY(this.path[1]);
    }
  }
};

DN.Actor.prototype.updatePath = function (x, y) {
  'use strict';
  this.path.push([x, y]);
};

DN.Actor.prototype.initFOV = function () {
  'use strict';
  this.exploredLevels[this.z].fov = {};
};

DN.Actor.prototype.getFOV = function () {
  'use strict';
  return this.exploredLevels[this.z].fov;
};

DN.Actor.prototype.initExplored = function () {
  'use strict';
  this.exploredLevels[this.z] = {
    fov: {},
    explored: {}
  };
};

DN.Actor.prototype.getExplored = function () {
  'use strict';
  return this.exploredLevels[this.z].explored;
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
  this.getFOV()[x + ',' + y] = {
    x: x,
    y: y,
    char: DN.getLevel().getChar(x, y)
  };
  this.getExplored()[x + ',' + y] = {
    x: x,
    y: y,
    char: DN.getLevel().getTerrain(x, y)
  };
  if (this.char !== '@' && this.getFOV()[x + ',' + y].char === '@') {
    this.targetX = x;
    this.targetY = y;
  }
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
  case ROT.VK_5:
    if (DN.getLevel().getTerrain(this.x, this.y) === '>') {
      this.moveDownstairs();
      DN.engine.unlock();
    }
    return;
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
  this.x = 30;
  this.y = 10;
  this.z += 1;
  if (!DN.levels[this.z]) {
    DN.levels.push(new DN.Level());
    this.initExplored();
  }
};
