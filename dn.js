/*global ROT, DN*/

var Dn = function () {
  'use strict';
  this.display = new ROT.Display({
    fontFamily: 'Courier'
  });
  this.digger = new ROT.Map.Digger(60, 20);
  this.scheduler = new ROT.Scheduler.Speed();
  this.engine = new ROT.Engine(this.scheduler);
  this.levels = [];
  this.adventurer = {};
};

Dn.prototype.init = function () {
  'use strict';
  this.adventurer = new DN.Actor();
  DN.levels.push(new DN.Level());
  this.engine.start();
};

Dn.prototype.drawUI = function () {
  'use strict';
  this.display.drawText(1, 21, 'Welcome to the Dungeons of Neverknown!');
  this.display.drawText(62, 0, 'Health: ' + this.adventurer.currentHealth + '/'
                        + this.adventurer.maxHealth);
  this.display.drawText(62, 2, '@ adventurer');
  this.display.drawText(62, 3, '. floor');
  this.display.drawText(62, 4, '+ closed door');
  this.display.drawText(62, 5, '/ opened door');
  this.display.drawText(62, 6, '# wall');
  this.display.drawText(62, 7, '> stairs');
};

Dn.prototype.getLevel = function () {
  'use strict';
  return this.levels[this.adventurer.z];
};

var DN = new Dn();
