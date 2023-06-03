class Sprite {
  constructor({
    position,
    velocity,
    imageSrc,
    frames = { max: 1 },
    sprites = [],
    moving = false,
  }) {
    this.position = position;
    this.image = new Image();
    this.image.src = imageSrc;
    this.frames = { ...frames, val: 0, elapsed: 0 };
    this.image.onload = () => {
      this.width = this.image.width / this.frames.max;
      this.height = this.image.height;
    };
    this.moving = moving;
    this.sprites = this.setSprites(sprites);
  }

  draw() {
    ctx.drawImage(
      this.image,
      this.frames.val * this.width,
      0,
      this.image.width / this.frames.max,
      this.image.height,
      this.position.x,
      this.position.y,
      this.image.width / this.frames.max,
      this.image.height
    );

    if (!this.moving) return;

    if (this.frames.max > 1) {
      this.frames.elapsed++;
    }

    if (this.frames.elapsed % 20 === 0) {
      if (this.frames.val < this.frames.max - 1) this.frames.val++;
      else this.frames.val = 0;
    }
  }

  setSprites(sprites) {
    if (!sprites.length) return sprites;

    let spriteFormatted = {};

    sprites.forEach((sprite) => {
      const image = new Image();
      image.src = sprite.imageSrc;
      spriteFormatted[sprite.action] = image;
    });

    return spriteFormatted;
  }
}

class Boundary {
  static width = 48;
  static height = 48;

  constructor({ position }) {
    this.position = position;
    this.width = Boundary.width;
    this.height = Boundary.height;
  }

  draw() {
    ctx.fillStyle = "rgba(255, 0, 0, 0.2)";
    ctx.fillRect(this.position.x, this.position.y, this.width, this.height);
  }
}
