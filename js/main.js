const canvas = document.querySelector("canvas");
const ctx = canvas.getContext("2d");

canvas.width = 1024;
canvas.height = 576;

ctx.fillStyle = "white";
ctx.fillRect(0, 0, canvas.width, canvas.height);

const collisionsMap = [];
for (let i = 0; i < collisions.length; i += 70) {
  collisionsMap.push(collisions.slice(i, 70 + i));
}

const boundaries = [];

const offset = {
  x: -735,
  y: -650,
};

collisionsMap.forEach((row, i) => {
  row.forEach((symbol, j) => {
    if (symbol === 1025) {
      boundaries.push(
        new Boundary({
          position: {
            x: j * Boundary.width + offset.x,
            y: i * Boundary.height + offset.y,
          },
        })
      );
    }
  });
});

const player = new Sprite({
  position: {
    x: canvas.width / 2 - 192 / 4 / 2,
    y: canvas.height / 2 - 68 / 2,
  },
  imageSrc: "./img/playerIdle.png",
  imageWidth: 192,
  imageHeight: 68,
  frames: {
    max: 4,
  },
  sprites: [
    {
      action: "idle",
      imageSrc: "./img/playerIdle.png",
    },
    {
      action: "up",
      imageSrc: "./img/playerUp.png",
    },
    {
      action: "left",
      imageSrc: "./img/playerLeft.png",
    },
    {
      action: "right",
      imageSrc: "./img/playerRight.png",
    },
    {
      action: "down",
      imageSrc: "./img/playerDown.png",
    },
  ],
  moving: true,
});

const bubbleMonsters = [
  {
    position: {
      x: 600,
      y: 340,
    },
  },
  {
    position: {
      x: 750,
      y: 140,
    },
  },
  {
    position: {
      x: 400,
      y: 440,
    },
  },
  {
    position: {
      x: 140,
      y: 210,
    },
  },
].map(
  (monster) =>
    new Sprite({
      imageSrc: "./img/monsters/bubble-green.png",
      imageWidth: 240,
      imageHeight: 52,
      position: {
        x: monster.position.x,
        y: monster.position.y,
      },
      frames: {
        max: 4,
      },
      moving: true,
      velocity: 15,
    })
);

const background = new Sprite({
  position: {
    x: offset.x,
    y: offset.y,
  },
  imageSrc: "./img/Pellet Town.png",
  imageWidth: 3360,
  imageHeight: 1920,
});

const foreground = new Sprite({
  position: {
    x: offset.x,
    y: offset.y,
  },
  imageSrc: "./img/foregroundObjects.png",
  imageWidth: 3360,
  imageHeight: 1920,
});

const rock = new Sprite({
  imageSrc: "./img/rock.png",
  imageWidth: 60,
  imageHeight: 59,
  position: {
    x: 455,
    y: 400,
  },
});

const wormMonster = new Sprite({
  imageSrc: "./img/monsters/worm.png",
  imageWidth: 344,
  imageHeight: 89,
  position: {
    x: 1120,
    y: 0,
  },
  moving: true,
  frames: {
    max: 4,
  },
});

const keys = {
  w: {
    pressed: false,
  },
  a: {
    pressed: false,
  },
  s: {
    pressed: false,
  },
  d: {
    pressed: false,
  },
};

const movables = [
  background,
  ...boundaries,
  foreground,
  ...bubbleMonsters,
  rock,
  wormMonster,
];

function rectangularCollision({ rectangle1, rectangle2 }) {
  return (
    rectangle1.position.x + rectangle1.width >= rectangle2.position.x &&
    rectangle1.position.x <= rectangle2.position.x + rectangle2.width &&
    rectangle1.position.y <= rectangle2.position.y + rectangle2.height &&
    rectangle1.position.y + rectangle1.height >= rectangle2.position.y
  );
}

function animate() {
  window.requestAnimationFrame(animate);

  background.draw();

  boundaries.forEach((boundary) => {
    boundary.draw();
  });

  player.draw();

  foreground.draw();

  bubbleMonsters.forEach((bubbleMonster) => bubbleMonster.draw());

  rock.draw();

  wormMonster.draw();

  let backgroundMoving = true;
  player.moving = false;

  if (keys.w.pressed) {
    player.moving = true;
    player.image = player.sprites.up;

    for (let i = 0; i < boundaries.length; i++) {
      const boundary = boundaries[i];
      if (
        rectangularCollision({
          rectangle1: player,
          rectangle2: {
            ...boundary,
            position: {
              x: boundary.position.x,
              y: boundary.position.y + 3,
            },
          },
        })
      ) {
        backgroundMoving = false;
        break;
      }
    }
    if (backgroundMoving) {
      movables.forEach((movable) => (movable.position.y += 3));
    }
  }

  if (keys.s.pressed) {
    player.moving = true;
    player.image = player.sprites.down;

    for (let i = 0; i < boundaries.length; i++) {
      const boundary = boundaries[i];
      if (
        rectangularCollision({
          rectangle1: player,
          rectangle2: {
            ...boundary,
            position: {
              x: boundary.position.x,
              y: boundary.position.y - 3,
            },
          },
        })
      ) {
        backgroundMoving = false;
        break;
      }
    }
    if (backgroundMoving) {
      movables.forEach((movable) => (movable.position.y -= 3));
    }
  }

  if (keys.a.pressed) {
    player.moving = true;
    player.image = player.sprites.left;

    for (let i = 0; i < boundaries.length; i++) {
      const boundary = boundaries[i];
      if (
        rectangularCollision({
          rectangle1: player,
          rectangle2: {
            ...boundary,
            position: {
              x: boundary.position.x + 3,
              y: boundary.position.y,
            },
          },
        })
      ) {
        backgroundMoving = false;
        break;
      }
    }
    if (backgroundMoving) {
      movables.forEach((movable) => (movable.position.x += 3));
    }
  }

  if (keys.d.pressed) {
    player.moving = true;
    player.image = player.sprites.right;

    for (let i = 0; i < boundaries.length; i++) {
      const boundary = boundaries[i];
      if (
        rectangularCollision({
          rectangle1: player,
          rectangle2: {
            ...boundary,
            position: {
              x: boundary.position.x - 3,
              y: boundary.position.y,
            },
          },
        })
      ) {
        backgroundMoving = false;
        break;
      }
    }
    if (backgroundMoving) {
      movables.forEach((movable) => (movable.position.x -= 3));
    }
  }
}

animate();

let lastKey = "";
window.addEventListener("keydown", (ev) => {
  switch (ev.key) {
    case "w":
      keys.w.pressed = true;
      lastKey = "w";
      break;

    case "a":
      keys.a.pressed = true;
      lastKey = "a";
      break;

    case "s":
      keys.s.pressed = true;
      lastKey = "s";
      break;

    case "d":
      keys.d.pressed = true;
      lastKey = "d";
      break;

    default:
      break;
  }
});

window.addEventListener("keyup", (ev) => {
  switch (ev.key) {
    case "w":
      keys.w.pressed = false;
      break;

    case "a":
      keys.a.pressed = false;
      break;

    case "s":
      keys.s.pressed = false;
      break;

    case "d":
      keys.d.pressed = false;
      break;

    default:
      break;
  }
});

window.addEventListener("click", (ev) => {
  console.log({
    x: ev.x,
    y: ev.y,
  });
});
