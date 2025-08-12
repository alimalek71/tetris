const canvas = document.getElementById('game');
const ctx = canvas.getContext('2d');

function draw() {
  ctx.fillStyle = 'black';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  ctx.fillStyle = 'red';
  ctx.fillRect(50, 50, 100, 100);
}

draw();
