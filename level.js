/*global ROT, DN*/

DN.Level = function () {
  'use strict';
  var i;
  this.map = {};
  this.monsters = [];
  DN.digger.create(this.initMap.bind(this));
  this.rooms = DN.digger.getRooms();
  this.stairs = this.rooms[this.rooms.length - 1].getCenter();
  this.map[this.stairs[0] + ',' + this.stairs[1]] = {
    x: this.stairs[0],
    y: this.stairs[1],
    char: '>'
  };
  for (i = 0; i < this.rooms.length; i += 1) {
    this.rooms[i].getDoors(this.initDoor.bind(this));
  }
  this.fov = new ROT.FOV.PreciseShadowcasting(this.isTransparent.bind(this));
};

DN.Level.prototype.initMap = function (x, y, value) {
  'use strict';
  if (!value) {
    this.map[x + ',' + y] = {
      x: x,
      y: y,
      char: '.'
    };
    if (ROT.RNG.getPercentage() === 1) {
      this.monsters.push(new DN.Actor('A', x, y));
    }
  }
};

DN.Level.prototype.initDoor = function (x, y) {
  'use strict';
  this.map[x + ',' + y].char = '+';
};

DN.Level.prototype.isTransparent = function (x, y) {
  'use strict';
  if (this.map.hasOwnProperty(x + ',' + y)) {
    return this.map[x + ',' + y].char !== '+';
  }
  return false;
};

DN.Level.prototype.isPassable = function (x, y) {
  'use strict';
  return this.map.hasOwnProperty(x + ',' + y);
};

DN.Level.prototype.getChar = function (x, y) {
  'use strict';
  var i;
  if (DN.adventurer.x === x && DN.adventurer.y === y) {
    return '@';
  }
  for (i = 0; i < this.monsters.length; i += 1) {
    if (this.monsters[i].x === x && this.monsters[i].y === y) {
      return this.monsters[i].char;
    }
  }
  if (this.map.hasOwnProperty(x + ',' + y)) {
    return this.map[x + ',' + y].char;
  }
  return '#';
};

DN.Level.prototype.getTerrain = function (x, y) {
  'use strict';
  if (this.map.hasOwnProperty(x + ',' + y)) {
    return this.map[x + ',' + y].char;
  }
  return '#';
};

DN.Level.prototype.setChar = function (x, y, char) {
  'use strict';
  this.map[x + ',' + y] = {
    x: x,
    y: y,
    char: char
  };
};
