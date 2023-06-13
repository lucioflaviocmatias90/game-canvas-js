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
    this.setImage({ imageSrc, imageWidth, imageHeight });
    this.frames = { ...frames, val: 0, elapsed: 0 };

    this.moving = moving;
    this.sprites = this.setSprites(sprites);
    this.width = this.image.width / this.frames.max;
    this.height = this.image.height;
    this.velocity = velocity;
  }

  setImage({ imageSrc, imageWidth, imageHeight }) {
    this.image = new Image();
    this.image.src = imageSrc;
    this.image.width = imageWidth;
    this.image.height = imageHeight;
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

  getSourcePositionX() {
    // return this.frames.val * this.sprites[this.spriteName].position.x;
    return this.frames.val * this.width;
  }

  getSourcePositionY() {
    // return this.sprites[this.spriteName].position.y;
    return 0;
  }

  getSourceWidth() {
    // return this.sprites[this.spriteName].width;
    return this.image.width / this.frames.max;
  }

  getSourceHeight() {
    // return this.sprites[this.spriteName].height;
    return this.image.height;
  }

  getDestinationPositionX() {
    // return this.position.x;
    return this.position.x;
  }

  getDestinationPositionY() {
    // return this.position.y;
    return this.position.y;
  }

  getDestinationWidth() {
    // return this.sprites[this.spriteName].width;
    return this.image.width / this.frames.max;
  }

  getDestinationHeight() {
    // return this.sprites[this.spriteName].height;
    return this.image.height;
  }

  draw() {
    // console.log({
    //   image: this.image,
    //   sx: this.frames.val * this.width,
    //   sy: 0,
    //   sw: this.image.width / this.frames.max,
    //   sh: this.image.height,
    //   dx: this.position.x,
    //   dy: this.position.y,
    //   dw: this.image.width / this.frames.max,
    //   dh: this.image.height,
    // });

    ctx.drawImage(
      this.image,
      this.getSourcePositionX(),
      this.getSourcePositionY(),
      this.getSourceWidth(),
      this.getSourceHeight(),
      this.getDestinationPositionX(),
      this.getDestinationPositionY(),
      this.getDestinationWidth(),
      this.getDestinationHeight()
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
}

class Boundary {
  static width = 48;
  static height = 48;

  constructor({ position, code, isTransparent = false }) {
    this.position = position;
    this.width = Boundary.width;
    this.height = Boundary.height;
    this.code = code;
    this.isTransparent = isTransparent;
  }

  draw() {
    if (this.code === mapConstants.monster) {
      ctx.fillStyle = `rgba(0, 0, 255, ${this.isTransparent ? "0" : "0.3"})`;
    }

    if (this.code === mapConstants.boundary) {
      ctx.fillStyle = `rgba(255, 0, 0, ${this.isTransparent ? "0" : "0.2"})`;
    }

    ctx.fillRect(this.position.x, this.position.y, this.width, this.height);
  }
}
