var newGameArea;
var ctx
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
var testObject
var testObject2
function updateGameArea() {
    newGameArea.clear()
    player.start()
    testObject.objectInit()
    testObject2.objectInit()
}
function init() {
    newGameArea = new gameArea()
    ctx = newGameArea.context
    player = new Player(100,100)
    testObject = new ObjectMaterial(player.x-50,200,410,250,"first")
    testObject2 = new ObjectMaterial(player.x+450,440,400,50,"second")
    document.addEventListener("keydown",playerControlKeyPressed, false);	
	document.addEventListener("keyup",playerControlKeyReleased, false);
}
class Player {
    constructor (
        x=0,y=0,height=80,width=40,speed=3
    ) {
        this.x = Number(x)
        this.y = Number(y)
        this.width = Number(width)
        this.height = Number(height)
        this.charAlpha = 1;
        this.fillColor = `rgb(225, 237, 232,${this.charAlpha})`
        this.speed = speed
        this.rCollision = false
        this.lCollision = false
        this.uCollision = false
        this.dCollision = false
        this.gravityAvailabe = false
        this.jumpHeightDiv = 33 //YEh height control krta hai
        this.jumpHeightPerDiv = 11 //yeh speed control krega
        this.inAir = true
        this.jumpPressed = false
        this.charAnimCycle = 0;
        this.deathAnimCycle = 0;
        this.startX = x
        this.startY = y
        this.characterDraw()
        this.isAlive = true
        
    }
    start() {
        this.addGravity()
        this.borderCollision()
        this.characterDraw()
        this.attachControls()
    }
    newPos(val){
        //1,2,3,4 as URDL
        if(this.isAlive){
            if(val==1 && !this.uCollision){
                this.y -=1
            }
            if(val==2 && !this.rCollision){
                this.x +=1
            }
            if(val==3 && !this.dCollision){
                this.y +=1
            }
            if(val==4 && !this.lCollision){
                this.x -=1
            }
        }
    }

    borderCollision() {
        if (this.dCollision){
            this.inAir = false
        }
        else {
            this.inAir = true
        }
        if(this.y+this.height >=newGameArea.height){
            this.isDead()
        }
    }
    async addGravity() {
        var move = 1;
        //playerControl.DOWN = this.gravityAvailabe
        if(this.gravityAvailabe){
            while(move<this.speed*1) {
                this.newPos(3)
                this.newPos(3)
                move +=1;
                await sleep(200)
            }
        }
    }
    onRight = function(){
        if(playerControl.RIGHT){
            var move = 1;
            while(move<this.speed) {
                this.newPos(2)
                move +=1;
            }
        }
    }
    onLeft = function(){
        if(playerControl.LEFT){
            var move = 1;
            while(move<this.speed) {
                this.newPos(4)
                move +=1;
            }
        }
    }
    onUp = function(){
        if(playerControl.UP){
            var move = 1;
            while(move<this.speed) {
                this.newPos(1)
                move +=1;
            }
        }
    }
    onDown = function(){
        if(playerControl.DOWN){
            var move = 1;
            while(move<this.speed) {
                this.newPos(3)
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
                while(move<this.jumpHeightDiv) {
                    for (var i=0;i<=this.jumpHeightPerDiv;i++) {
                        this.newPos(1)
                    }
                    move +=1;
                    await sleep(1)
                }
            }
        }
    }
    attachControls(){
        if(this.isAlive){
            this.onJump()
            this.onRight()
            this.onLeft()
            this.onUp()
            this.onDown()
        }
    }
    isDead(){
        this.isAlive = false
        console.log("Payer Died")
    }
    characterDraw() {
        var eyePos = this.x
        var eyeSize = [5,2]
        var eyeCycle = 800;
        if(this.charAnimCycle >eyeCycle && this.charAnimCycle <eyeCycle+50){
            eyeSize = [1,0]
            
        }
        else if(this.charAnimCycle > eyeCycle+50){
            this.charAnimCycle = 0
        }
        if(playerControl.LEFT && this.isAlive){
            eyePos = this.x-4
        }
        if(playerControl.RIGHT && this.isAlive){
            eyePos = this.x+4
        }
        if(!this.isAlive){
            this.deathAnimCycle +=1;
            eyeSize = [1,0]
            if(this.deathAnimCycle>0 &&this.deathAnimCycle<200){
                ctx.font = 'bold 18px Monospace'
                this.fillColor = `rgb(225, 237, 232,${this.charAlpha})`
                ctx.fillText('x', eyePos+5, this.y+15)
                ctx.fillText('x', eyePos+25, this.y+15)
                this.charAlpha -= 0.01;
            }
            else if(this.deathAnimCycle >200){
                this.x = this.startX
                this.y = this.startY
                this.deathAnimCycle = 0
                this.isAlive = true
                this.charAlpha = 1
                this.fillColor = `rgb(225, 237, 232,${this.charAlpha})`
            }
        }
        this.charAnimCycle += 1;
        ctx.lineWidth = 4
        ctx.strokeStyle = this.fillColor
        //head
        ctx.strokeRect(this.x, this.y, 40, 25)
        ctx.fillStyle = this.fillColor;
        //body
        ctx.fillRect(this.x, this.y+25, 40, 35);
        //legs
        ctx.fillRect(this.x+5, this.y+60, 10, 20);
        ctx.fillRect(this.x+25, this.y+60, 10, 20);
        //eye
        ctx.beginPath()
        ctx.ellipse(eyePos+10, this.y+10, eyeSize[0], eyeSize[1], Math.PI / 2, 0, 2 * Math.PI);
        ctx.fill()
        ctx.stroke()
        ctx.beginPath()
        ctx.ellipse(eyePos+30, this.y+10,eyeSize[0], eyeSize[1], Math.PI / 2, 0, 2 * Math.PI);
        ctx.fill()
        ctx.stroke()

    }
}
class ObjectMaterial {
    constructor (
        x=0,y=0,width=50,height=50,name,material=0,fillColor="rgb(225, 237, 232)"
    ){
        this.x = x
        this.name = name
        this.y = y
        this.startX = x
        this.startY = y
        this.width = width
        this.height = height
        this.material = material
        this.fillColor = fillColor
        this.collision = [false,false,false,false]
        this.playerKeyHistory = [false,false,false,false] //LURD
    }
    get isColliding(){
        var c = false
        for(var i=0;i<4;i++){
            if(this.collision[i]){
                c = true
                break
            }
        }
        return c
    }
    storeKeyHistory(){
        //LURD
        if(!this.playerKeyHistory[0]){
            this.playerKeyHistory[0] = playerControl.LEFT
        }
        if(!this.playerKeyHistory[1]){
            this.playerKeyHistory[1] = playerControl.UP || playerControl.JUMP
        }
        if(!this.playerKeyHistory[2]){
            this.playerKeyHistory[2] = playerControl.RIGHT
        }
        if(!this.playerKeyHistory[3]){
            this.playerKeyHistory[3] = playerControl.DOWN || player.gravityAvailabe
        }
    }
    get objYbound(){
        if(player.y+player.height>this.y && player.y<this.y+this.height){
            return true
        }
        else {
            false
        }
    }
    get objXbound(){
        if(player.x+player.width>=this.x && player.x<=this.x+this.width){
            return true
        }
        else {
            false
        }
    }
    restoreKeyHist(val){
        var i = 4
        while(i>=0){
            if(i!=val){
                this.playerKeyHistory[i]=false
            }
            i--
        }
    }
    objectInit(){
        this.objectDraw()
        this.checkCollision()
    }
    checkCollision(x=player.x,y=player.y){
        this.storeKeyHistory()
        if(!this.isColliding){
            //console.log(this.playerKeyHistory[0])
            if(y<=this.y+this.height && y>=this.y && this.playerKeyHistory[1]){
                //D collision
                if(x+player.width>=this.x && x<=this.x+this.width){
                    this.collision[2] = true
                    //this.collision[0] = false
                    console.log("collision D ",this.name)
                    //player.uCollision = true
                    //player.dCollision = false
                }
            }
            if(this.playerKeyHistory[0] && x<this.x+this.width && x>this.x){
                if(y+player.height>=this.y+3  && y<=this.y+this.height) {
                    //R collision
                    this.collision[1] = true
                    //this.collision[3] = false
                    console.log("collision R ",this.name)
                    //player.lCollision = true
                    //player.rCollision = false
                }
            }
            else if((this.playerKeyHistory[0] && (this.playerKeyHistory[1] || this.playerKeyHistory[3])) && x<this.x+this.width && x>this.x){
                this.collision[1] = true
                    //this.collision[3] = false
                    console.log("collision R ",this.name)
            }
            if(this.playerKeyHistory[2] && x+player.width>this.x && x+player.width<this.x+this.width){
                if(y+player.height>this.y+3 && y<this.y+this.height) {
                    //L collision
                    this.collision[3] = true
                    //this.collision[1] = false
                    console.log("collision L ",this.name) 
                    //player.rCollision = true
                    //player.lCollision = false
                }
            }
            else if(this.playerKeyHistory[2] && (this.playerKeyHistory[1] || this.playerKeyHistory[3]) && x+player.width>this.x && x+player.width<this.x+this.width){
                this.collision[3] = true
                    //this.collision[1] = false
                    console.log("collision L ",this.name)
            }
            if (y+player.height>=this.y &&y+player.height<=this.y+this.height && this.playerKeyHistory[3]){
                if(x+player.width>=this.x && x<=this.x+this.width){
                    //player.y = this.y - player.height
                    //U collision
                    this.collision[0] = true
                    //this.collision[2] = false
                    console.log("collision U ",this.name)
                    //player.dCollision = true
                    //player.uCollision = false
                }
            }
        }
        else {
            if (y+player.height<=this.y && this.playerKeyHistory[1] || !this.objXbound){
                //U collision
                this.collision[0] = false
                //this.collision[2] = false
                console.log("decollision U ",this.name)
                //player.dCollision = true
                //player.uCollision = false
            }
            if(x+player.width<this.x && this.playerKeyHistory[0] || !this.objYbound){
                //L collision
                this.collision[3] = false
                //this.collision[1] = false
                console.log("decollision L ",this.name) 
                //player.rCollision = true
                //player.lCollision = false
            }
            if(x>this.x+this.width && this.playerKeyHistory[2] || !this.objYbound){
                //R collision
                this.collision[1] = false
                //this.collision[3] = false
                console.log("decollision R ",this.name)
                //player.lCollision = true
                //player.rCollision = false
            }
            if(y>=this.y+this.height && this.playerKeyHistory[3] || !this.objXbound){
                //D collision
                this.collision[2] = false
                console.log("decollision D ",this.name)
            }
            player.lCollision = this.collision[1]
            player.rCollision = this.collision[3]
            player.dCollision = this.collision[0]
            player.uCollision = this.collision[2]
        }
        
        this.restoreKeyHist()
        

    }
    objectDraw(){
        ctx.beginPath()
        //ctx.strokeStyle = this.fillColor
        ctx.fillStyle = this.fillColor;
        ctx.fillRect(this.x, this.y, this.width, this.height)
    }
}
document.addEventListener("DOMContentLoaded",init)