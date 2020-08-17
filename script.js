var newGameArea;
var player;
var playerControl = {
  LEFT: false,
  UP: false,
  RIGHT: false,
  DOWN: false,
  JUMP:false,
};
const sleep = (milliseconds) => {
    return new Promise(resolve => setTimeout(resolve, milliseconds))
  }
function playerControlKeyPressed(event){
    const key = event.key
    if(key == "ArrowRight" || key == "D" || key == "d"){
        playerControl.RIGHT = true
    }
    if(key == "ArrowLeft" || key == "A" || key == "a"){
        playerControl.LEFT = true
    }
    if(key == "ArrowUp" || key == "W" || key == "w"){
        if(!player.gravityAvailabe){
            playerControl.UP = true
        }
    }
    if(key == "ArrowDown" || key == "s" || key == "S"){
        playerControl.DOWN = true
    }
    if(key == " "){
        playerControl.JUMP = true
    }
}
function playerControlKeyReleased(event){
    const key = event.key
    if(key == "ArrowRight" || key == "D" || key == "d"){
        playerControl.RIGHT = false
    }
    if(key == "ArrowLeft" || key == "A" || key == "a"){
        playerControl.LEFT = false
    }
    if(key == "ArrowUp" || key == "W" || key == "w"){
        if(!player.gravityAvailabe){
            playerControl.UP = false
        }
    }
    if(key == "ArrowDown" || key == "s" || key == "S"){
        playerControl.DOWN = false
    }
    if(key == " "){
        playerControl.JUMP = false
        player.jumpPressed = false
    }
}
class gameArea {
    constructor (
        width=1000,height=600,color="rgb(59, 59, 59)"
    ) {
        this.width = width
        this.height = height
        this.color = color
        this.start()
    }
    start() {
        this.canvas = document.createElement("canvas")
        this.canvas.width = this.width
        this.canvas.height = this.height
        this.canvas.style.backgroundColor = this.color
        this.context = this.canvas.getContext("2d")
        document.body.insertBefore(this.canvas, document.body.childNodes[0]);
        this.interval = setInterval(updateGameArea,0.001)
    }
    clear() {
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }
}
function updateGameArea() {
    newGameArea.clear()
    player.start()
}
function init() {
    newGameArea = new gameArea()
    player = new Player("#ecedee",100,400)
    document.addEventListener("keydown",playerControlKeyPressed, false);	
	document.addEventListener("keyup",playerControlKeyReleased, false);
}
class Player {
    constructor (
        fillColor="white",x=0,y=0,height=80,width=40,speed=3
    ) {
        this.x = Number(x)
        this.y = Number(y)
        this.width = Number(width)
        this.height = Number(height)
        this.fillColor = fillColor
        this.ctx = newGameArea.context
        this.speed = speed
        this.rCollision = false
        this.lCollision = false
        this.uCollision = false
        this.dCollision = false
        this.gravity = 5
        this.gravityAvailabe = true
        this.jumpHeightDiv = 30
        this.jumpHeightPerDiv = 8
        this.inAir = true
        this.jumpPressed = false
        this.charAnimCycle = 0;
        setInterval(()=>{
            this.addGravity()
        },2)
        this.characterDraw()
        
    }
    start() {
        this.borderCollision()
        this.characterDraw()
        this.attachControls()
    }
    newPos(moveX=0,moveY=0){
        this.x += moveX;
        this.y += moveY; 
    }

    borderCollision() {
        if(this.x <= 0) {
            this.lCollision = true
            this.rCollision = false
        }
        else if(this.x+this.width >= newGameArea.width){
            this.lCollision = false
            this.rCollision = true
        }
        else {
            this.rCollision = false
            this.lCollision = false
        }
        if(this.y <=0){
            this.uCollision = true
            this.dCollision = false
        }
        else if(this.y+this.height>=newGameArea.height){
            this.uCollision = false
            this.dCollision = true
            this.inAir = false
        }
        else {
            this.uCollision = false
            this.dCollision = false
        }
    }
    async addGravity() {
        var move = 1;
        if(this.gravityAvailabe){
            while(move<this.speed*2 && !this.dCollision) {
                this.newPos(0,1)
                this.newPos(0,1)
                move +=1;
                await sleep(200)
            }
        }
    }
    onRight = function(){
        if(playerControl.RIGHT){
            var move = 1;
            while(move<this.speed && !this.rCollision) {
                this.newPos(1)
                move +=1;
            }
        }
    }
    onLeft = function(){
        if(playerControl.LEFT){
            var move = 1;
            while(move<this.speed && !this.lCollision) {
                this.newPos(-1)
                move +=1;
            }
        }
    }
    onUp = function(){
        if(playerControl.UP){
            var move = 1;
            while(move<this.speed && !this.uCollision) {
                this.newPos(0,-1)
                move +=1;
            }
        }
    }
    onDown = function(){
        if(playerControl.DOWN){
            var move = 1;
            while(move<this.speed && !this.dCollision) {
                this.newPos(0,1)
                move +=1;
            }
        }
    }
    onJump= async function(){
        if(playerControl.JUMP){
            var move = 1;
            if(!this.inAir && !this.jumpPressed) {
                this.inAir = true
                this.jumpPressed = true
                while(move<this.jumpHeightDiv && !this.uCollision) {
                    for (var i=0;i<=this.jumpHeightPerDiv;i++) {
                        this.newPos(0,-1)
                    }
                    move +=1;
                    await sleep(1)
                }
            }
        }
    }
    attachControls(){
        this.onJump()
        this.onRight()
        this.onLeft()
        this.onUp()
        this.onDown()
    }
    characterDraw() {
        this.charAnimCycle += 1;
        this.ctx.lineWidth = 4
        this.ctx.strokeStyle = this.fillColor
        //head
        this.ctx.strokeRect(this.x, this.y, 40, 25)
        this.ctx.fillStyle = this.fillColor;
        //body
        this.ctx.fillRect(this.x, this.y+25, 40, 35);
        //legs
        this.ctx.fillRect(this.x+5, this.y+60, 10, 20);
        this.ctx.fillRect(this.x+25, this.y+60, 10, 20);
        //eye
        var eyePos = this.x
        var eyeSize = [5,2]
        var eyeCycle = 800;
        if(this.charAnimCycle >eyeCycle && this.charAnimCycle <eyeCycle+50){
            eyeSize = [1,0]
            
        }
        else if(this.charAnimCycle > eyeCycle+50){
            this.charAnimCycle = 0
        }
        if(playerControl.LEFT){
            eyePos = this.x-4
        }
        if(playerControl.RIGHT){
            eyePos = this.x+4
        }
        this.ctx.beginPath()
        this.ctx.ellipse(eyePos+10, this.y+10, eyeSize[0], eyeSize[1], Math.PI / 2, 0, 2 * Math.PI);
        this.ctx.fill()
        this.ctx.stroke()
        this.ctx.beginPath()
        this.ctx.ellipse(eyePos+30, this.y+10,eyeSize[0], eyeSize[1], Math.PI / 2, 0, 2 * Math.PI);
        this.ctx.fill()
        this.ctx.stroke()

    }
}
document.addEventListener("DOMContentLoaded",init)