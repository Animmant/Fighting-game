const canvas = document.querySelector('canvas')
const c = canvas.getContext('2d')

canvas.width = 1024
canvas.height = 576

c.fillRect(0, 0, canvas.width, canvas.height)

const gravity = 0.7



const player = new Sprite({
  position: {
    x: 100,
    y: 100
  },
  offset: {
    x: 0,
    y: 0
  }
})

console.log(player)