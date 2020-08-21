class Player {
    constructor (
        x=0,y=0,height=80,width=40,speed=3
    ) {
        this.x = x
        this.y = y
        this.gameRatio = newGameArea.resizeRatio
        this.width = Number(width)
        this.height = Number(height)
        this.screenResized = false
        this.charAlpha = 1; //alpha opacity for player
        this.fillColor = `rgb(225, 237, 232,${this.charAlpha})`
        this.speed = speed
        this.rCollision = [false]
        this.lCollision = [false]
        this.uCollision = [false]
        this.dCollision = [false]
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
        window.addEventListener('resize', ()=>{
            this.screenResized = true
        }, false);
    }
    start() {
        //console.log(this.screenW,this.x,this.screenW,this.y,newGameArea.width)
        this.addGravity()
        this.borderCollision()
        this.characterDraw()
        this.attachControls()
        this.resizeUpdate()
    }
    resizeUpdate(){
        if(this.screenResized){
            this.screenResized = false
            this.gameRatio = newGameArea.resizeRatio
            //this.x *=this.gameRatio
            //this.y *=this.gameRatio
            this.height *=this.gameRatio
            this.width *=this.gameRatio
            console.log(this.gameRatio)
        }
    }
    newPos(val){
        //1,2,3,4 as URDL
        if(this.isAlive){
            if(val==1 && !this.collisionU){
                this.y -=1*this.gameRatio*2
            }
            if(val==2 && !this.collisionR){
                this.x +=1*this.gameRatio*2
            }
            if(val==3 && !this.collisionD){
                this.y +=1*this.gameRatio*2
            }
            if(val==4 && !this.collisionL){
                this.x -=1*this.gameRatio*2
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
    get collisionL(){
        var len = this.lCollision.length
        var collision = false
        for(var i=0;i<len;i++){
            if(this.lCollision[i]){
                collision = this.lCollision[i]
                break
            }
        }
        return collision
    }
    get collisionR(){
        var len = this.rCollision.length
        var collision = false
        for(var i=0;i<len;i++){
            if(this.rCollision[i]){
                collision = this.rCollision[i]
                break
            }
        }
        return collision
    }
    get collisionU(){
        var len = this.uCollision.length
        var collision = false
        for(var i=0;i<len;i++){
            if(this.uCollision[i]){
                collision = this.uCollision[i]
                break
            }
        }
        return collision
    }
    get collisionD(){
        var len = this.dCollision.length
        var collision = false
        for(var i=0;i<len;i++){
            if(this.dCollision[i]){
                collision = this.dCollision[i]
                break
            }
        }
        return collision
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
        if(!this.gravityAvailabe){
            if(playerControl.UP){
                var move = 1;
                while(move<this.speed) {
                    this.newPos(1)
                    move +=1;
                }
            }
        }
    }
    onDown = function(){
        if(!this.gravityAvailabe){
            if(playerControl.DOWN){
                var move = 1;
                while(move<this.speed) {
                    this.newPos(3)
                    move +=1;
                }
            }
        }
    }
    onJump= async function(){
        if(playerControl.JUMP && this.gravityAvailabe){
            var move = 1;
            if(!this.inAir && !this.jumpPressed && this.collisionD) {
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
        //this.isAlive = false
        //console.log("Payer Died")
    }
    characterDraw() {
        ctx.scale(this.gameRatio,this.gameRatio)
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
                ctx.beginPath()
                ctx.font = 'bold 18px Monospace'
                this.fillColor = `rgb(225, 237, 232,${this.charAlpha})`
                ctx.fillStyle = this.fillColor
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
        if(this.screenResized){
            console.log(this.gameRatio,"h")
        }
        //ctx.fillRect(500, 50, 100, 100);
        ctx.fillRect(500, 50, 100, 100);
        ctx.fill()
        ctx.setTransform(1, 0, 0, 1, 0, 0)

    }
}