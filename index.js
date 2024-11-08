const canvas = document.querySelector('canvas')
const c = canvas.getContext('2d')

canvas.width = 1024
canvas.height = 576

c.fillRect(0, 0, canvas.width, canvas.height)

const gravity = 0.7

class Sprite {
  constructor({ position, velocity, color = 'red', offset, imageSrc}) {
    this.position = position
    this.velocity = velocity
    this.height = 150
    this.width = 50
    this.lastKey
    this.attackBox = {
      position: {
        x: this.position.x,
        y: this.position.y
      },
      offset,
      width: 100,
      height: 50
    }
    this.color = color
    this.isAttacking
    this.health = 100
    this.framesCurrent = 0
    this.framesElapsed = 0
    this.framesHold = 5 
    this.dead = false

    if (imageSrc) {
      this.image = new Image()
      this.image.src = imageSrc
    }
  }

  draw() {
    if (this.image) {
      // Якщо є зображення - малюємо його
      c.drawImage(
        this.image,
        this.position.x,
        this.position.y,
        this.width,
        this.height
      )
    } else {
      // Якщо немає - малюємо прямокутник
      c.fillStyle = this.color
      c.fillRect(this.position.x, this.position.y, this.width, this.height)
    }


    // attack box
    if (this.isAttacking){
      c.fillStyle = 'green'
      c.fillRect(
        this.attackBox.position.x,
        this.attackBox.position.y,
        this.attackBox.width,
        this.attackBox.height
      )
    }
  }

  update() {
    this.draw()

    this.attackBox.position.x = this.position.x + this.attackBox.offset.x
    this.attackBox.position.y = this.position.y
    
    this.position.x += this.velocity.x
    this.position.y += this.velocity.y

    if (this.position.y + this.height + this.velocity.y >= canvas.height){
      this.velocity.y = 0
    } else this.velocity.y += gravity

    /*
    need after movement
    if (this.position.x + this.width + this.velocity.x >= canvas.width){
      this.velocity.x = 0
    }
      */
  }

  attack() {
      this.isAttacking = true
      setTimeout(() => {
        this.isAttacking = false
      }, 100)
  }
}

const player = new Sprite({
  position: {
    x: 100,
    y: 0
  },
  velocity: {
    x: 0,
    y: 10
  },
  offset: {
    x: 0,
    y: 0
  },
  
})

const enemy = new Sprite({
  position: {
    x: canvas.width - 100,
    y: 0
  },
  velocity: {
    x: 0,
    y: 10
  },
  offset: {
    x: -50,
    y: 0
  },
  color: 'blue'
})

const keys = {
  a: {
    pressed: false
  },
  d: {
    pressed: false
  },
  ArrowRight: {
    pressed: false
  },
  ArrowLeft: {
    pressed: false
  }
}

function rectangularCollision({ rectangle1, rectangle2 }) {
  return (
    rectangle1.attackBox.position.x + rectangle1.attackBox.width >=
      rectangle2.position.x &&
    rectangle1.attackBox.position.x <=
      rectangle2.position.x + rectangle2.width &&
    rectangle1.attackBox.position.y + rectangle1.attackBox.height >=
      rectangle2.position.y &&
    rectangle1.attackBox.position.y <= rectangle2.position.y + rectangle2.height
  )
}

function determineWinner({ player, enemy }) {
  document.querySelector('#displayText').style.display = 'flex'
  if (player.health === enemy.health) {
    document.querySelector('#displayText').innerHTML = 'Tie'
  } else if (player.health > enemy.health) {
    document.querySelector('#displayText').innerHTML = 'Player 1 Wins'
  } else if (player.health < enemy.health) {
    console.log('enemy atck succesasd')
    document.querySelector('#displayText').innerHTML = 'Player 2 Wins'
  }
}

function animate() {
  window.requestAnimationFrame(animate)
  c.fillStyle = 'black'
  c.fillRect(0, 0, canvas.width, canvas.height)
  player.update()
  enemy.update()

  player.velocity.x = 0
  enemy.velocity.x = 0

  // palyer move
  if (keys.a.pressed && player.lastKey === 'a') {
    player.velocity.x = -5
  } else if (keys.d.pressed && player.lastKey === 'd') {
    player.velocity.x = 5
  } else {
  }
 
  //enemy move
  if (keys.ArrowLeft.pressed && enemy.lastKey === 'ArrowLeft') {
    enemy.velocity.x = -5
  } else if (keys.ArrowRight.pressed && enemy.lastKey === 'ArrowRight') {
    enemy.velocity.x = 5
  } else {
  }
  
  if (
    rectangularCollision({
      rectangle1: player,
      rectangle2: enemy
    }) &&
    player.isAttacking
  ) {
    player.isAttacking = false
    enemy.health -= 20
    document.querySelector('#enemyHealth').style.width = enemy.health + '%'
    console.log('go')
  }

  if (
    rectangularCollision({
      rectangle1: player,
      rectangle2: enemy
    }) &&
    enemy.isAttacking
  ) {
    enemy.isAttacking = false
    player.health -= 20
    document.querySelector('#playerHealth').style.width = player.health + '%'

    console.log('enemy atck succes')
  }


  if (enemy.health <= 0 || player.health <= 0) {
    determineWinner({ player, enemy})
  }

}

animate()

window.addEventListener('keydown', (event) =>{
  //console.log(event.code)
})

window.addEventListener('keydown', (event) => {
  if (!player.dead) {
    switch (event.code) {  // 
      case 'KeyD':  // 
        keys.d.pressed = true
        player.lastKey = 'd'
        break
      case 'KeyA':  // '
        keys.a.pressed = true
        player.lastKey = 'a'
        break
      case 'KeyW':  // 
        player.velocity.y = -20
        break
      case 'KeyS':  // 
        player.attack()
        break
      case 'Space':  // 
        player.attack()
        break
    }
  }

  if (!enemy.dead) {
    switch (event.code) {
      case 'ArrowRight':
        keys.ArrowRight.pressed = true
        enemy.lastKey = 'ArrowRight'
        break
      case 'ArrowLeft':
        keys.ArrowLeft.pressed = true
        enemy.lastKey = 'ArrowLeft'
        break
      case 'ArrowUp':
        enemy.velocity.y = -20
        break
      case 'ArrowDown':
        enemy.attack()
        break
    }
  }
})

window.addEventListener('keyup', (event) => {
  switch (event.code) {  // 
    case 'KeyD':
      keys.d.pressed = false
      break
    case 'KeyA':
      keys.a.pressed = false
      break
  }

  // enemy keys
  switch (event.code) {
    case 'ArrowRight':
      keys.ArrowRight.pressed = false
      break
    case 'ArrowLeft':
      keys.ArrowLeft.pressed = false
      break
  }
})