class Sprite {
  constructor({
    position,
    velocity = 10,
    imageSrc,
    frames = { max: 1 },
    sprites = [],
    moving = false,
    imageWidth,
    imageHeight,
  }) {
    this.position = position;
    this.image = new Image();
    this.image.src = imageSrc;
    this.frames = { ...frames, val: 0, elapsed: 0 };
    this.image.width = imageWidth;
    this.image.height = imageHeight;
    this.moving = moving;
    this.sprites = this.setSprites(sprites);
    this.width = this.image.width / this.frames.max;
    this.height = this.image.height;
    this.velocity = velocity;
  }

  draw() {
    // if (this.image.src === "http://127.0.0.1:5500/img/playerIdle.png") {
    //   console.log({
    //     image: this.image,
    //     sx: this.frames.val * this.width,
    //     sy: 0,
    //     sw: this.image.width / this.frames.max,
    //     sh: this.image.height,
    //     dx: this.position.x,
    //     dy: this.position.y,
    //     dw: this.image.width / this.frames.max,
    //     dh: this.image.height,
    //   });
    // }

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

    if (this.frames.elapsed % this.velocity === 0) {
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

  constructor({ position, code, isTransparent = true }) {
    this.position = position;
    this.width = Boundary.width;
    this.height = Boundary.height;
    this.code = code;
    this.isTransparent = isTransparent;
  }

  draw() {
    if (this.code === 39) {
      ctx.fillStyle = `rgba(0, 0, 255, ${this.isTransparent ? "0" : "0.3"})`;
    }

    if (this.code === 1025) {
      ctx.fillStyle = `rgba(255, 0, 0, ${this.isTransparent ? "0" : "0.2"})`;
    }

    ctx.fillRect(this.position.x, this.position.y, this.width, this.height);
  }
}
