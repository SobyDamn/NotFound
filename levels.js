/**
 * screensize width=1300,height=700
 * height and width of player = 85,40
 * flag w,h = 50,90
 * winning point w,h = 100,80
 */
var levels = {
    level0:{
        nextLevel:"level1",
        startX:100,
        startY:415,
        Objects:{
            p1:{
                x:0,
                y:500,
                width:1300,
                height:200,
                material:0
            },
            flag:{
                x:50,
                y:410,
                width:50,
                height:90,
                material:1
            },
            winningSpot:{
                x:1100,
                y:420,
                width:100,
                height:80,
                material:2
            }
        }
    },
    level1:{
        nextLevel:"level2",
        startX:950,
        startY:555,
        Objects:{
            p1:{
                x:10,
                y:640,
                width:280,
                height:60,
                material:0
            },
            p2:{
                x:450,
                y:540,
                width:280,
                height:160,
                material:0
            },
            p3:{
                x:900,
                y:640,
                width:280,
                height:60,
                material:0
            },
            flag1:{
                x:50,
                y:550,
                width:50,
                height:90,
                material:1
            },
            winningSpot:{
                x:480,
                y:460,
                width:100,
                height:80,
                material:2
            }
        }
    }
}
function LevelGenerator(level="level0"){
    console.log(level)
    var screenLoader = document.getElementById("screenLoader")
    screenLoader.style.animation = "fadeIn 1s ease-in"
    screenLoader.style.display = "block"
    player = new Player()
    var object_id = 0
    var objectArr = []
    var startX = levels[level].startX
    var startY = levels[level].startY
    var Objects = levels[level].Objects
    for (object in Objects){
        var objectGen = new ObjectMaterial(Objects[object].x,Objects[object].y,Objects[object].width,Objects[object].height,object,Objects[object].material,object_id++)
        objectArr.push(objectGen)
        console.log(object)
    }
    var level = new gameLevel(startX,startY,objectArr,player,levels[level].nextLevel,level)
    screenLoader.style.animation = "fadeOut 1s ease-in"
    setTimeout(()=>{
        screenLoader.style.display = "none"
    },1000)
    return level
}
setTimeout(()=>{
    //level = LevelGenerator("level1")
},5000)
class gameLevel {
    constructor (
        startX,startY,objects,player,nextLevel,name
    ){
        this.startX = startX
        this.startY = startY
        this.objects = objects
        this.player = player
        this.nextLevelKey = []
        this.nextLevel = nextLevel
        this.name = name
        this.start()
    }
    start(){
        this.player.x = this.startX
        this.player.y = this.startY
    }
    playLevel(){
        this.objects.forEach((object)=>{
            object.objectInit()
        })
    }
}