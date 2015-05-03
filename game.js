/*global ROT*/

var DONK, display, digger, i, rooms, setdoor, fov, player, draw, generateMap;
display = new ROT.Display({
  fontFamily: 'Courier'
});
digger = new ROT.Map.Digger(60, 20);

generateMap = function () {
  'use strict';
  var stairs;
  DONK = {
    map: {},
    explored: {}
  };
  digger.create(function (x, y, value) {
    if (!value) {
      DONK.map[x + ',' + y] = {
        x: x,
        y: y,
        value: '.'
      };
    }
  });
  rooms = digger.getRooms();
  setdoor = function (x, y) {
    DONK.map[x + ',' + y].value = '+';
  };
  player = {
    x: rooms[0].getCenter()[0],
    y: rooms[0].getCenter()[1]
  };
  stairs = rooms[rooms.length - 1].getCenter();
  DONK.map[stairs[0] + ',' + stairs[1]] = {
    x: stairs[0],
    y: stairs[1],
    value: '>'
  };
  for (i = 0; i < rooms.length; i += 1) {
    rooms[i].getDoors(setdoor);
  }

  fov = new ROT.FOV.PreciseShadowcasting(function (x, y) {
    if (DONK.map.hasOwnProperty(x + ',' + y)) {
      return DONK.map[x + ',' + y].value !== '+';
    }
    return false;
  });
};

draw = function () {
  'use strict';
  var x, y;
  for (x = 0; x < 80; x += 1) {
    for (y = 0; y < 25; y += 1) {
      if (DONK.explored.hasOwnProperty(x + ',' + y)) {
        display.draw(x, y, DONK.explored[x + ',' + y].value, '#555');
      } else {
        display.draw(x, y, '');
      }
    }
  }
  fov.compute(player.x, player.y, 10, function (x, y, r) {
    if (DONK.map.hasOwnProperty(x + ',' + y)) {
      display.draw(x, y, DONK.map[x + ',' + y].value);
      DONK.explored[x + ',' + y] = DONK.map[x + ',' + y];
    } else {
      display.draw(x, y, '#');
      DONK.explored[x + ',' + y] = {
        x: x,
        y: y,
        value: '#'
      };
    }

  });

  display.draw(player.x, player.y, '@');
  display.drawText(1, 21, 'Welcome to the Dungeons of Neverknown!');
  display.drawText(62, 1, '@ adventurer');
  display.drawText(62, 2, '. floor');
  display.drawText(62, 3, '+ closed door');
  display.drawText(62, 4, '/ opened door');
  display.drawText(62, 5, '# wall');
  display.drawText(62, 6, '> stairs');
};

generateMap();
draw();

window.addEventListener('keypress', function (e) {
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
    if (DONK.map[player.x + ',' + player.y].value === '>') {
      generateMap();
    }
    break;
  }
  if (DONK.map.hasOwnProperty((player.x + newx) + ',' + (player.y + newy))) {
    player.x += newx;
    player.y += newy;
    if (DONK.map[player.x + ',' + player.y].value === '+') {
      DONK.map[player.x + ',' + player.y].value = '/';
    }
  }
  draw();
});
