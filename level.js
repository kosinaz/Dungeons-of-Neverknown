/*global ROT, DN*/

DN.Level = function () {
  'use strict';
  var i;
  this.map = {};
  this.actors = {};
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
  DN.adventurer.setXY(this.rooms[0].getCenter());
};

DN.Level.prototype.initMap = function (x, y, value) {
  'use strict';
  var monster;
  if (!value) {
    this.map[x + ',' + y] = {
      x: x,
      y: y,
      char: '.'
    };
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

DN.Level.prototype.getChar = function (x, y) {
  'use strict';
  if (DN.adventurer.x === x && DN.adventurer.y === y) {
    return '@';
  }
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
