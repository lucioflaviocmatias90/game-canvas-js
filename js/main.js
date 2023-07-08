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
const bubbleMonsters = [];
const rocks = [];
const trees = [];

const offset = {
  x: -735,
  y: -650,
};

function randomNumber(value) {
  return parseInt(Math.random() * value);
}

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
    if (symbol === gameItemEnum.MONSTER) {
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
            elapsed: randomNumber(8000),
          },
          animate: true,
          velocity: 15,
        })
      );
    }
    if (symbol === gameItemEnum.ROCK) {
      rocks.push(
        new Sprite({
          imageSrc: "./img/rock.png",
          imageWidth: 60,
          imageHeight: 59,
          position: {
            x: j * Boundary.width + offset.x - 4,
            y: i * Boundary.height + offset.y - 4,
          },
        })
      );
    }
    if (symbol === gameItemEnum.TREE) {
      trees.push(
        new Sprite({
          imageSrc: "./img/tree-2.png",
          imageWidth: 224 * 2,
          imageHeight: 228,
          position: {
            x: j * Boundary.width + offset.x - 80,
            y: i * Boundary.height + offset.y - 175,
          },
          animate: false,
          frames: {
            max: 2,
          },
          velocity: 40,
        })
      );
    }
  });
});

const player = new Player({
  position: {
    x: canvas.width / 2 - 192 / 4 / 2,
    y: canvas.height / 2 - 68 / 2,
  },
  imageSrc: "./img/player.png",
  imageWidth: 336,
  imageHeight: 724,
  frames: {
    max: 4,
  },
  sprites: [
    {
      action: "idle",
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
      width: 84,
      height: 84,
      position: {
        x: 0,
        y: 648,
      },
      quantity: 4,
    },
  ],
  animate: true,
  spriteName: "idle",
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

const healthBar = new Sprite({
  imageSrc: "./img/health-bar.png",
  imageWidth: 168 * 5,
  imageHeight: 36,
  position: {
    x: 10,
    y: 10,
  },
  // TODO: apagar as linhas debaixo, quando implementar o personagem receber o dano pelo monstro
  animate: false,
  frames: {
    max: 5,
  },
  velocity: 40,
});

const tools = new Sprite({
  imageSrc: "./img/tools.png",
  position: {
    x: 190,
    y: 7,
  },
  imageWidth: 176,
  imageHeight: 48,
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
  ...rocks,
  ...trees,
];

function rectangularCollision({ rectangle1, rectangle2 }) {
  return (
    rectangle1.position.x + rectangle1.width >= rectangle2.position.x &&
    rectangle1.position.x <= rectangle2.position.x + rectangle2.width &&
    rectangle1.position.y <= rectangle2.position.y + rectangle2.height &&
    rectangle1.position.y + rectangle1.height >= rectangle2.position.y
  );
}

function opacityTrees(trees, player, colliding) {
  if (colliding) {
    trees
      .filter((tree) => {
        if (
          rectangularCollision({
            rectangle1: player,
            rectangle2: {
              ...tree,
              position: {
                x: tree.position.x,
                y: tree.position.y + 3,
              },
            },
          })
        ) {
          return tree;
        }
      })
      .forEach((tree) => (tree.opacity = 0.2));
  } else {
    trees.forEach((tree) => (tree.opacity = 1));
  }
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

  rocks.forEach((rock) => rock.draw());

  trees.forEach((tree) => tree.draw());

  healthBar.draw();

  tools.draw();

  let backgroundMoving = true;
  let collidingTree = false;
  player.spriteName = "idle";
  healthBar.animate = false;

  if (keys.w.pressed) {
    player.spriteName = "up";

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
        if (boundary.code === gameItemEnum.MONSTER) {
          player.spriteName = "damageUp";
          healthBar.animate = true;
        }
        if (boundary.code === gameItemEnum.LEAVES) {
          collidingTree = true;
          continue;
        }
        backgroundMoving = false;
        break;
      }
    }
    if (backgroundMoving) {
      movables.forEach((movable) => (movable.position.y += 3));
    }
    opacityTrees(trees, player, collidingTree);
  }

  if (keys.s.pressed) {
    player.spriteName = "down";

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
        if (boundary.code === gameItemEnum.MONSTER) {
          player.spriteName = "damageDown";
          healthBar.animate = true;
        }
        if (boundary.code === gameItemEnum.LEAVES) {
          collidingTree = true;
          continue;
        }
        backgroundMoving = false;
        break;
      }
    }
    if (backgroundMoving) {
      movables.forEach((movable) => (movable.position.y -= 3));
    }
    opacityTrees(trees, player, collidingTree);
  }

  if (keys.a.pressed) {
    player.spriteName = "left";

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
        if (boundary.code === gameItemEnum.MONSTER) {
          player.spriteName = "damageLeft";
          healthBar.animate = true;
        }
        if (boundary.code === gameItemEnum.LEAVES) {
          collidingTree = true;
          continue;
        }
        backgroundMoving = false;
        break;
      }
    }
    if (backgroundMoving) {
      movables.forEach((movable) => (movable.position.x += 3));
    }
    opacityTrees(trees, player, collidingTree);
  }

  if (keys.d.pressed) {
    player.spriteName = "right";

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
        if (boundary.code === gameItemEnum.MONSTER) {
          player.spriteName = "damageRight";
          healthBar.animate = true;
        }
        if (boundary.code === gameItemEnum.LEAVES) {
          collidingTree = true;
          continue;
        }
        backgroundMoving = false;
        break;
      }
    }
    if (backgroundMoving) {
      movables.forEach((movable) => (movable.position.x -= 3));
    }
    opacityTrees(trees, player, collidingTree);
  }

  if (keys.spaceBar.pressed) {
    player.spriteName = "rightAxe";
    player.velocity = 8;

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
        if (boundary.code === gameItemEnum.MONSTER) {
          player.spriteName = "damageRight";
        }
        break;
      }
    }
  }

  if (healthBar.frames.val === 4) {
    console.log("vc morreu!");
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
