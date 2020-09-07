var objid = 0
var newGameArea;
var ctx
var screenResized = false
var player;
var playerControl = {
  LEFT: false,
  UP: false,
  RIGHT: false,
  DOWN: false,
  JUMP:false,
  ENTER:false
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
    if(key=="Enter"){
        playerControl.ENTER = true
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
    if(key=="Enter"){
        playerControl.ENTER = false
    }
}
var testObject
var testObject2
var testObject3
var testObject4
var testObject5
var gameCanvas
function init() {
    gameCanvas = document.getElementById('gameAreaCanvas')
    newGameArea = new gameArea()
    ctx = newGameArea.context
    /*testObject = new ObjectMaterial(10,640,280,60,"p1",0,objid++)
    testObject2 = new ObjectMaterial(450,540,280,160,"p2",0,objid++)
    testObject3 = new ObjectMaterial(50,550,50,90,"flag",1,objid++)
    testObject4 = new ObjectMaterial(900,640,280,60,"p3",0,objid++)
    testObject5 = new ObjectMaterial(480,460,100,80,"winningspot",2,objid++)
    var objects = [testObject,testObject2,testObject3,testObject4,testObject5]
    level = new gameLevel(950,560,objects,player)*/
    level = LevelGenerator()
    window.requestAnimationFrame(updateGameArea)
    document.addEventListener("keydown",playerControlKeyPressed, false);	
    document.addEventListener("keyup",playerControlKeyReleased, false);
}
window.addEventListener('resize', ()=>{
    screenResized = true
}, false)
class gameArea {
    constructor (
        width=1300,height=700,color="rgb(59, 59, 59)"
    ) {
        this.color = color
        this.width = width
        this.height = height
        this.start()
    }
    resizeGame() {
        var gameAreaBody = document.getElementById('gameArea');
        var widthToHeight = 16 / 9;
        var newWidth = window.innerWidth;
        var newHeight = window.innerHeight;
        var newWidthToHeight = newWidth / newHeight;
        
        if (newWidthToHeight > widthToHeight) {
            newWidth = newHeight * widthToHeight;
            gameAreaBody.style.height = newHeight + 'px';
            gameAreaBody.style.width = newWidth + 'px';
        } else {
            newHeight = newWidth / widthToHeight;
            gameAreaBody.style.width = newWidth + 'px';
            gameAreaBody.style.height = newHeight + 'px';
        }
        
        gameAreaBody.style.marginTop = (-newHeight / 2) + 'px';
        gameAreaBody.style.marginLeft = (-newWidth / 2) + 'px';
    }
    start() {
        this.canvas = gameCanvas
        this.resizeGame()
        this.canvas.style.backgroundColor = this.color
        this.canvas.width = this.width
        this.canvas.height = this.height
        this.context = this.canvas.getContext("2d")
        this.context.imageSmoothingEnabled = false
        //this.interval = setInterval(updateGameArea,0.01)
    }
    clear() {
        if(screenResized){
            screenResized = false
            this.resizeGame()
        }
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }
}
function updateGameArea() {
    newGameArea.clear()
    level.playLevel()
    player.start()
    window.requestAnimationFrame(updateGameArea)
}
document.addEventListener("DOMContentLoaded",init)
function playSound(params) {
    var url = window.URL || window.webkitURL;
    try {
        var soundURL = jsfxr(params);
        var player = new Audio();
        player.addEventListener('error', function(e) {
        console.log("Error: " + player.error.code);
        }, false);
        player.src = soundURL;
        player.play();
        player.addEventListener('ended', function(e) {
        url.revokeObjectURL(soundURL);
        }, false);
    } catch(e) {
        console.log(e);
    }
}

function playString(name="death") {
    var str
    var flagTouch = "[0,,0.0154,0.538,0.329,0.5342,,,,,,0.4599,0.6024,,,,,,1,,,,,0.52]"
    if (name =="death"){
        str = "[1,,0.0404,,0.2501,0.6364,,-0.4971,,,,,,,,,,,1,,,0.2928,,0.5]"
    }
    else if(name == "keyPress"){
        str = "[0,,0.0185,0.5339,0.1614,0.28,0.16,,,,,,,,,,,,1,,,,,0.52]"
    }
    else if(name=="flag"){
        str = flagTouch
    }
    var temp = str.split(",");
    var params = new Array();
    for(var i = 0; i < temp.length; i++) {
        params[i] = parseFloat(temp[i]);
    }
    console.log(params)
    playSound(params);
}