class Sprite {
  constructor({
    position,
    velocity = 10,
    imageSrc,
    frames = { max: 1 },
    sprites = [],
    animate = false,
    imageWidth,
    imageHeight,
    spriteName = "",
  }) {
    this.position = position;
    this.setImage({ imageSrc, imageWidth, imageHeight });
    this.frames = { ...frames, val: 0, elapsed: 0 };
    this.animate = animate;
    this.setSprites(sprites);
    this.setWidth(spriteName);
    this.setHeight(spriteName);
    this.velocity = velocity;
    this.spriteName = spriteName;
  }

  setImage({ imageSrc, imageWidth, imageHeight }) {
    this.image = new Image();
    this.image.src = imageSrc;
    this.image.width = imageWidth;
    this.image.height = imageHeight;
  }

  setWidth(spriteName) {
    if (spriteName !== "") {
      this.width = this.sprites[spriteName].width;
    } else {
      this.width = this.image.width / this.frames.max;
    }
  }

  setHeight(spriteName) {
    if (spriteName !== "") {
      this.height = this.sprites[spriteName].height;
    } else {
      this.height = this.image.height;
    }
  }

  setSprites(sprites) {
    if (!sprites.length) {
      this.sprites = null;
    } else {
      let spriteFormatted = {};

      sprites.forEach((sprite) => {
        spriteFormatted[sprite.action] = {
          width: sprite.width,
          height: sprite.height,
          quantity: sprite.quantity,
          position: {
            x: sprite.position.x,
            y: sprite.position.y,
          },
        };
      });

      this.sprites = spriteFormatted;
    }
  }

  getSourcePositionX() {
    if (this.spriteName != "") {
      return this.sprites[this.spriteName].width * this.frames.val;
    } else {
      return this.frames.val * this.width;
    }
  }

  getSourcePositionY() {
    if (this.spriteName != "") {
      return this.sprites[this.spriteName].position.y;
    } else {
      return 0;
    }
  }

  getSourceWidth() {
    if (this.spriteName != "") {
      return this.sprites[this.spriteName].width;
    } else {
      return this.image.width / this.frames.max;
    }
  }

  getSourceHeight() {
    if (this.spriteName != "") {
      return this.sprites[this.spriteName].height;
    } else {
      return this.image.height;
    }
  }

  getDestinationPositionX() {
    return this.position.x;
  }

  getDestinationPositionY() {
    return this.position.y;
  }

  getDestinationWidth() {
    if (this.spriteName != "") {
      return this.sprites[this.spriteName].width;
    } else {
      return this.image.width / this.frames.max;
    }
  }

  getDestinationHeight() {
    if (this.spriteName != "") {
      return this.sprites[this.spriteName].height;
    } else {
      return this.image.height;
    }
  }

  draw() {
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

    this.update();
  }

  update() {
    if (!this.animate) return;

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

  constructor({ position, code, isTransparent = true }) {
    this.position = position;
    this.width = Boundary.width;
    this.height = Boundary.height;
    this.code = code;
    this.isTransparent = isTransparent;
  }

  draw() {
    this.update();

    ctx.fillStyle = this.color;
    ctx.fillRect(this.position.x, this.position.y, this.width, this.height);
  }

  update() {
    if (this.code === mapConstants.rock) {
      this.color = `rgba(128, 128, 128, ${this.isTransparent ? "0" : "0.5"})`;
    }

    if (this.code === mapConstants.monster) {
      this.width = 56;
      this.height = 48;
      this.color = `rgba(160, 32, 240, ${this.isTransparent ? "0" : "0.3"})`;
    }

    if (this.code === mapConstants.boundary) {
      this.color = `rgba(255, 0, 0, ${this.isTransparent ? "0" : "0.2"})`;
    }

    if (this.code === mapConstants.tree) {
      this.color = `rgba(0, 255, 0, ${this.isTransparent ? "0" : "0.2"})`;
    }
  }
}

class Player extends Sprite {
  constructor({
    position,
    velocity = 10,
    imageSrc,
    frames = { max: 1 },
    sprites = [],
    animate = false,
    imageWidth,
    imageHeight,
    spriteName = "",
  }) {
    super({
      position,
      velocity,
      imageSrc,
      frames,
      sprites,
      animate,
      imageWidth,
      imageHeight,
      spriteName,
    });

    this.life = 5;
  }

  draw() {
    super.draw();
  }
}
