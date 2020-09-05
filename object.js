class ObjectMaterial {
    constructor (
        x=0,y=0,width=50,height=50,name,id=0,material=0,fillColor="rgb(225, 237, 232)"
    ){
        this.id = id
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
        this.objectAnimeCycle = 0
        this.objectAnimeCycleStart = false
        this.objectAnimeCycleEnd = true
        this.keyShown = false
        this.key = -1
        this.flagTouched = false
        this.flagYpos = this.y
        this.enteredKey = []
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
    objYbound(val){
        if(player.y+player.height>this.y && player.y<this.y+this.height){
            return true
        }
        else {
            false
        }
    }
    objXbound(val){
        if(player.x+player.width>=this.x - val && player.x<=this.x+this.width + val){
            return true
        }
        else {
            false
        }
    }
    actualCollision(x=0){
        return this.objXbound(x) && this.objYbound(x)
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
            switch(this.material){
                case 0:
                    this.checkCollision()
                    break
                case 1:
                    this.nearObjectEffectKey()
                    break
                case 2:
                    this.nearObjectEffectFinishPoint()
                    break
            }
    }
    nonPlatformObjectInit(){
        
    }
    nearObjectEffectKey(){
        if(this.actualCollision()){
            ctx.beginPath()
            ctx.font = 'bold 15px "Comic Sans MS", cursive, sans-serif'
            this.fillColor = `#42f5a1`
            ctx.fillStyle = this.fillColor
            if(!playerControl.ENTER){
                ctx.fillText('Press Enter!', this.x, this.y-50)
                this.keyShown = false
            }
            else {
                this.flagTouched = true
                if(!this.keyShown){
                    this.key = Math.floor(Math.random() * 10)
                    this.keyShown = true
                }
                ctx.fillText(this.key, this.x, this.y-50)
            }
        }
    }
    nearObjectEffectFinishPoint(){
        if(this.actualCollision(30)){
            document.addEventListener("keydown",this.winningPointKeyInput, false);
            document.Object = this
            ctx.beginPath()
            ctx.font = 'bold 15px "Comic Sans MS", cursive, sans-serif'
            //this.fillColor = `#42f5a1`
            ctx.fillStyle = this.fillColor
            ctx.beginPath();
            ctx.lineWidth = 3
            ctx.moveTo(this.x+20, this.y+45);
            ctx.lineTo(this.x+80, this.y+45);
            ctx.fillText('***', this.x+50, this.y+25)
            ctx.fillText(this.enteredKeyVal, this.x+50, this.y+40)
            ctx.stroke();
            if(!playerControl.ENTER){
                ctx.fillText('Enter the codes', this.x+this.width/2, this.y-50)
            }
            else {
                ctx.fillText('Next Level', this.x+this.width/2, this.y-50)
            }
        }
        else {
            document.removeEventListener("keydown",this.winningPointKeyInput, false);
            ctx.fillStyle = "rgb(225, 237, 232)"
            ctx.font = 'bold 12px "Lucida Console", Monaco, monospace'
            ++this.objectAnimeCycle
            if(this.objectAnimeCycle>50 && this.objectAnimeCycle<100){
                ctx.fillText('waiting..', this.x+50, this.y+30)
            }
            else if(this.objectAnimeCycle>=100 && this.objectAnimeCycle<150) {
                ctx.fillText('waiting...', this.x+50, this.y+30)
            }
            else {
                ctx.fillText('waiting....', this.x+50, this.y+30)
            }
            if (this.objectAnimeCycle>150){
                this.objectAnimeCycle=0
            }
        }
    }
    winningPointKeyInput(event){
        const key = event.key
        const keyPas = parseInt(key)
        const object = event.currentTarget.Object
        if (Number.isInteger(keyPas) && object.enteredKey.length <4){
            object.enteredKey.push(keyPas)
            console.log(key,"int")
        }
        else if(key == "Backspace"){
            object.enteredKey.pop()
        }
        else if(key == "Enter"){
            console.log("enter")
        }
    }
    get enteredKeyVal() {
        var str = ""
        for(var i=0;i<this.enteredKey.length;i++){
            if(i==this.enteredKey.length-1){
                str += this.enteredKey[i]
            }
            else {
                str += this.enteredKey[i]+" "
            }
        }
        return str
    }
    nearObjectEffectDeath(){
        if(this.actualCollision()){
            player.isDead()
        }
    }
    animeCycle(val=200,i=1){
        if(!this.objectAnimeCycleStart){
            ++this.objectAnimeCycle
        }
        else {
            --this.objectAnimeCycle
        }
        if(this.objectAnimeCycle <1){
            this.objectAnimeCycleStart = false
        }
        else if(this.objectAnimeCycle>=val){
            this.objectAnimeCycleStart = true
        }
        return this.objectAnimeCycle
    }
    keyStarPoint(spikes=5, outerRadius=this.width/2, innerRadius=this.width/4) {
        //outerradius is double of height or width
        //innerradius is half of outerradius
        var rot = Math.PI / 2 * 3;
        var x = this.x;
        var y = this.y;
        var step = Math.PI / spikes;
        ctx.beginPath();
        ctx.moveTo(this.x, this.y - outerRadius)
        for (var i = 0; i < spikes; i++) {
            x = this.x + Math.cos(rot) * outerRadius;
            y = this.y + Math.sin(rot) * outerRadius;
            ctx.lineTo(x, y)
            rot += step
    
            x = this.x + Math.cos(rot) * innerRadius;
            y = this.y + Math.sin(rot) * innerRadius;
            ctx.lineTo(x, y)
            rot += step
        }
        ctx.lineTo(this.x, this.y - outerRadius)
        ctx.closePath();
        ctx.lineWidth = this.animeCycle(200,5)/100
        ctx.strokeStyle='#ffe11c';
        ctx.stroke();
        ctx.fillStyle='#ffff1c';
        ctx.fill();
    
    }
    keyFlagPoint(){
        //ObjectMaterial(50,550,50,90,"star",objid++,1)
        if(this.flagTouched){
            if(this.objectAnimeCycle<this.height-40){
                this.flagYpos += 1
                this.objectAnimeCycle++
                console.log(this.objectAnimeCycle)
            }
        }
        ctx.beginPath()
        ctx.moveTo(this.x, this.y); 
        ctx.lineTo(this.x, this.y+this.height);
        ctx.ellipse(this.x, this.y+5, 2, 2, Math.PI / 2, 0, 2 * Math.PI);
        ctx.ellipse(this.x, this.y+this.height, 2, 5, Math.PI / 2, 0, 2 * Math.PI);
        ctx.lineWidth = 6;
        ctx.strokeStyle = "#ddd";
        ctx.fillStyle = "#ddd"
        ctx.stroke();
        //flag triangle
        ctx.beginPath();
        ctx.moveTo(this.x, this.flagYpos+10);
        ctx.lineTo(this.x, this.flagYpos+40);
        ctx.lineTo(this.x+this.width, this.flagYpos+25);
        ctx.fill();
    }
    drawPlatform(){
        ctx.beginPath()
        ctx.fillStyle = this.fillColor;
        ctx.fillRect(this.x, this.y, this.width, this.height)

    }
    winningPoint(){
        /*ctx.lineJoin = "round";
        ctx.beginPath()
        ctx.strokeRect(480, 460, 100, 80)
        ctx.font = 'bold 12px "Lucida Console", Monaco, monospace'
        ctx.fillText('waiting....', 490, 490)
        ctx.stroke()
        ctx.beginPath()
        ctx.fillRect(480, 520, 100, 20)
        ctx.beginPath()
        ctx.fillStyle = "rgb(59, 59, 59)"
        ctx.ellipse(530, 528, 10, 10, Math.PI / 2, 0, 2 * Math.PI);
        ctx.fill()
        ctx.stroke()*/
        ctx.lineJoin = "round";
        ctx.beginPath()
        ctx.strokeRect(this.x, this.y, this.width, this.height)
        ctx.stroke()
        ctx.textAlign = 'center';
        ctx.beginPath()
        ctx.fillRect(this.x, this.y+(this.height/2)+20, this.width, this.height/4)
        ctx.beginPath()
        ctx.fillStyle = "rgb(59, 59, 59)"
        ctx.ellipse(this.x+this.width/2, this.y+this.height-12, 10, 10, Math.PI / 2, 0, 2 * Math.PI);
        ctx.fill()
        ctx.stroke()
    }
    objectDraw(){
        switch(this.material){
            case 0:
                this.drawPlatform()
                break
            case 1:
                this.keyFlagPoint()
                break
            case 2:
                this.winningPoint()
                break
        }
    }
    checkCollision(x=player.x,y=player.y){
        this.storeKeyHistory()
        if(!this.isColliding){
            //console.log(this.playerKeyHistory[0])
            if(y+player.height>=this.y+10 && y<=this.y+this.height) {
                if(this.playerKeyHistory[2] && x+player.width>this.x && x+player.width<this.x+this.width){
                    //L collision
                    this.collision[3] = true
                    console.log("collision L ",this.name) 
                }
                if(this.playerKeyHistory[0] && x<this.x+this.width && x>this.x){
                    //R collision
                    this.collision[1] = true
                    console.log("collision R ",this.name)
                }
            }
            if(x+player.width>=this.x && x<=this.x+this.width){
                if(y<=this.y+this.height && y>=this.y && this.playerKeyHistory[1]){
                    //D collision
                    this.collision[2] = true
                    console.log("collision D ",this.name)
                }
                if (y+player.height>=this.y &&y+player.height<=this.y+this.height && this.playerKeyHistory[3]){
                    //U collision
                    player.y = this.y - (player.height)
                    this.collision[0] = true
                    console.log("collision U ",this.name)
                }
            }
        }
        else {
            if(x+player.width<this.x && this.playerKeyHistory[0] || !this.objYbound){
                //L collision
                this.collision[3] = false
                console.log("decollision L ",this.name) 
            }
            if(x>this.x+this.width && this.playerKeyHistory[2] || !this.objYbound){
                //R collision
                this.collision[1] = false
                console.log("decollision R ",this.name)
            }
            if (y+player.height<=this.y && this.playerKeyHistory[1] || !this.objXbound){
                //U collision
                this.collision[0] = false
                console.log("decollision U ",this.name,this.id)
            }
            if(y>=this.y+this.height && this.playerKeyHistory[3] || !this.objXbound){
                //D collision
                this.collision[2] = false
                console.log("decollision D ",this.name)
            }
            player.lCollision[this.id] = this.collision[1]
            player.rCollision[this.id] = this.collision[3]
            player.dCollision[this.id] = this.collision[0]
            player.uCollision[this.id] = this.collision[2]
        }
        this.restoreKeyHist()
    }
}