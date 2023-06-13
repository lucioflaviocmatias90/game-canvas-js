const canvas = document.querySelector("canvas");
const ctx = canvas.getContext("2d");

canvas.width = 1024;
canvas.height = 576;

ctx.fillStyle = "white";
ctx.fillRect(0, 0, canvas.width, canvas.height);

let collisionsSaved = localStorage.getItem("collisionsSaved");

if (!collisionsSaved) {
  localStorage.setItem("collisionsSaved", JSON.stringify(collisions));
  collisionsSaved = collisions;
} else {
  collisionsSaved = JSON.parse(collisionsSaved);
}

const collisionsMap = [];
for (let i = 0; i < collisionsSaved.length; i += 70) {
  collisionsMap.push(collisionsSaved.slice(i, 70 + i));
}

const boundaries = [];
const bubbleMonsters = [];

const offset = {
  x: -735,
  y: -650,
};

collisionsMap.forEach((row, i) => {
  row.forEach((symbol, j) => {
    if (symbol !== 0) {
      boundaries.push(
        new Boundary({
          position: {
            x: j * Boundary.width + offset.x,
            y: i * Boundary.height + offset.y,
          },
          code: symbol,
        })
      );
    }
    if (symbol === mapConstants.monster) {
      bubbleMonsters.push(
        new Sprite({
          imageSrc: "./img/monsters/bubble-green.png",
          imageWidth: 240,
          imageHeight: 52,
          position: {
            x: j * Boundary.width + offset.x,
            y: i * Boundary.height + offset.y,
          },
          frames: {
            max: 4,
          },
          moving: true,
          velocity: 15,
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
  // imageSrc: "./img/player.png",
  // imageWidth: 336,
  // imageHeight: 724,
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
      width: 48,
      height: 72,
      position: {
        x: 0,
        y: 0,
      },
      quantity: 4,
    },
    {
      action: "up",
      imageSrc: "./img/playerUp.png",
      width: 48,
      height: 72,
      position: {
        x: 0,
        y: 216,
      },
      quantity: 4,
    },
    {
      action: "left",
      imageSrc: "./img/playerLeft.png",
      width: 48,
      height: 72,
      position: {
        x: 0,
        y: 144,
      },
      quantity: 4,
    },
    {
      action: "right",
      imageSrc: "./img/playerRight.png",
      width: 48,
      height: 72,
      position: {
        x: 0,
        y: 288,
      },
      quantity: 4,
    },
    {
      action: "down",
      imageSrc: "./img/playerDown.png",
      width: 48,
      height: 72,
      position: {
        x: 0,
        y: 72,
      },
      quantity: 4,
    },
    {
      action: "damageUp",
      imageSrc: "./img/playerUpDamage.png",
      width: 48,
      height: 72,
      position: {
        x: 0,
        y: 432,
      },
      quantity: 4,
    },
    {
      action: "damageLeft",
      imageSrc: "./img/playerLeftDamage.png",
      width: 48,
      height: 72,
      position: {
        x: 0,
        y: 576,
      },
      quantity: 4,
    },
    {
      action: "damageRight",
      imageSrc: "./img/playerRightDamage.png",
      width: 48,
      height: 72,
      position: {
        x: 0,
        y: 504,
      },
      quantity: 4,
    },
    {
      action: "damageDown",
      imageSrc: "./img/playerDownDamage.png",
      width: 48,
      height: 72,
      position: {
        x: 0,
        y: 360,
      },
      quantity: 4,
    },
    {
      action: "rightAxe",
      imageSrc: "./img/playerRightAxe.png",
      width: 84,
      height: 80,
      position: {
        x: 0,
        y: 648,
      },
      quantity: 4,
    },
  ],
  moving: true,
});

const background = new Sprite({
  position: {
    x: offset.x,
    y: offset.y,
  },
  imageSrc: "./img/background-map-1.png",
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

const tree = new Sprite({
  imageSrc: "./img/tree-2.png",
  imageWidth: 224,
  imageHeight: 228,
  position: {
    x: 680,
    y: 170,
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

const healthBar = new Sprite({
  imageSrc: "./img/health-bar.png",
  imageWidth: 168 * 5,
  imageHeight: 36,
  position: {
    x: 10,
    y: 10,
  },
  // TODO: apagar as linhas debaixo, quando implementar o personagem receber o dano pelo monstro
  moving: true,
  frames: {
    max: 5,
  },
  velocity: 90,
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
  spaceBar: {
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
  tree,
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

  tree.draw();

  wormMonster.draw();

  healthBar.draw();

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
        if (boundary.code === 39) {
          player.moving = true;
          player.image = player.sprites.damageUp;
        }
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
        if (boundary.code === 39) {
          player.moving = true;
          player.image = player.sprites.damageDown;
        }
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
        if (boundary.code === 39) {
          player.moving = true;
          player.image = player.sprites.damageLeft;
        }
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
        if (boundary.code === 39) {
          player.moving = true;
          player.image = player.sprites.damageRight;
        }
        break;
      }
    }
    if (backgroundMoving) {
      movables.forEach((movable) => (movable.position.x -= 3));
    }
  }

  if (keys.spaceBar.pressed) {
    player.moving = true;
    player.image = player.sprites.rightAxe;

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
        if (boundary.code === 39) {
          player.moving = true;
          player.image = player.sprites.damageRight;
        }
        break;
      }
    }
    // if (backgroundMoving) {
    //   movables.forEach((movable) => (movable.position.x -= 3));
    // }
  }

  // player.moving = true;
  // player.image = player.sprites.idle;
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

    case " ":
      keys.spaceBar.pressed = true;
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

    case " ":
      keys.spaceBar.pressed = false;
      break;

    default:
      break;
  }
});

window.addEventListener("click", (ev) => {
  const position = {
    x: Math.floor((ev.x - offset.x) / 48),
    y: Math.floor((ev.y - offset.y) / 48),
  };

  const block = position.y * 70 + position.x;

  console.log({
    ...position,
    block,
  });

  collisionsSaved[block] = mapConstants.tree;
  localStorage.setItem("collisionsSaved", JSON.stringify(collisions));

  boundaries.push(
    new Boundary({
      code: mapConstants.tree,
      position: {
        x: ev.x,
        y: ev.y,
      },
    })
  );
});
