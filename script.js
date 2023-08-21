/* Load only once, when all HTML is written.
* Can put script tag at bottom of HTML file.  */
document.addEventListener('DOMContentLoaded', () => {
    const grid = document.querySelector ('.grid')          // Picks out element from HTML.
    const doodler = document.createElement('div')
    let doodlerLeftSpace = 50
    let startPoint = 150
    let doodlerBottomSpace = 150
    let isGameOver = false
    let platformCount = 5
    let platforms = []
    let upTimerId, downTimerId, leftTimerId, rightTimerId
    let isJumping = false
    let isGoingLeft, isGoingRight = false
    let score = 0



    function createDoodler() {
        grid.appendChild(doodler)          // put the doodler (child) into the grid (parent).
        doodler.classList.add('doodler')    // adding the doodler class to the element of doodler - appears corresp to .css.
        //doodlerLeftSpace = platforms[0].left
        doodler.style.left = doodlerLeftSpace + 'px' // left spacing of 50px for absolute positioning
        doodler.style.bottom = doodlerBottomSpace + 'px'
    }

    /* Constructs one platform evenly spaced vertically and
    * randomly placed horizontally within grid from left margin.
    * Create a 'div' visual element and add platform class with the
    * left and bottom margin numbers. Finally, append the platform visual to the grid. */
    class Platform {
        constructor(newPlatformBottom){
            this.bottom = newPlatformBottom
            this.left = Math.random() * 315     // Keep rand <315 because 400px Scr - 85px Doodler width
            this.visual = document.createElement('div')

            const visual = this.visual
            visual.classList.add('platform')    // adding platform class to visual
            visual.style.left = this.left + 'px'
            visual.style.bottom = this.bottom +'px'
            grid.appendChild(visual)
        }
    }

    /* Create 5 platforms, each new class */
    function createPlatforms() {
        for (let i = 0; i < platformCount ; i++){
            let platformGap = 600 / platformCount
            let newPlatBottom = 100 + i * platformGap
            let newPlatform = new Platform(newPlatBottom)

            platforms.push(newPlatform) // push the new platform into the array
            // console.log(platforms)
        }
    }

    /* As the doodler moves up, the current platforms need to move down. */
    function movePlatforms(){
        if (doodlerBottomSpace > 200){  // if the doodler is above the bottom margin, move
            platforms.forEach( platform => {
                platform.bottom -= 4
                let visual = platform.visual
                visual.style.bottom = platform.bottom + 'px'    // platform moves by 4 each time
                if (platform.bottom < 10){
                    let firstPlatform = platforms[0].visual     // get first platform visual
                    firstPlatform.classList.remove('platform')
                    platforms.shift()       // js shifts array
                    score++
                    let newPlatform = new Platform(600)     // the new platform appears at the top of the grid
                    platforms.push(newPlatform)
                }
            })
        }
    }

    function jump() {
        clearInterval(downTimerId)
        if (isJumping){
            clearInterval(upTimerId)
        }
        isJumping = true
        upTimerId = setInterval(function() {       // Stops the interval when needed
            doodlerBottomSpace += 10
            doodler.style.bottom = doodlerBottomSpace + 'px'        // visual
            if (doodlerBottomSpace > startPoint + 200){      // visualize the fall if the bottom space is over x.
                fall()
            }
        }, 20)
    }

    function fall(){
        clearInterval(upTimerId)    // stop the jump interval
        if (!isJumping){
            clearInterval(downTimerId)
        }
        isGoingRight = false
        isGoingLeft = false
        isJumping = false
        downTimerId = setInterval( function() {
                doodlerBottomSpace -= 5
                doodler.style.bottom = doodlerBottomSpace +'px'
            if (doodlerBottomSpace <= 0 ){
                gameOver()
            }
            /*Check if doodler is on a platform*/
            platforms.forEach(platform => {
                if (
                    (doodlerBottomSpace >= platform.bottom) &&
                    (doodlerBottomSpace <= platform.bottom + 15) && // Height of doodler is 15px
                    ((doodlerLeftSpace + 60 ) >= platform.left) &&
                    (doodlerLeftSpace <= platform.left +85) &&
                    !isJumping
                ){
                    startPoint = doodlerBottomSpace     // update doodler's current bottom space to be its new startpoint
                    jump()
                }
            })
        }, 30)
    }

    function gameOver(){
        console.log('game over')
        isGameOver = true
        while(grid.firstChild) {
            grid.removeChild(grid.firstChild)
        }
        grid.innerHTML = score
        clearInterval(upTimerId)
        clearInterval(downTimerId)
        clearInterval(leftTimerId)
        clearInterval(rightTimerId)
    }

    function control(e){
        if (e.key === "ArrowLeft") {
            moveLeft()
        } else if (e.key === "ArrowRight"){
            moveRight()
        } else if (e.key === "ArrowUp"){
            moveStraight()
        }

    }

    function moveLeft(){
        if (isGoingLeft) {
            clearInterval(leftTimerId)     // clear double clicked key interval
        }
        isGoingLeft = true
        isGoingRight = false
        clearInterval(rightTimerId)
        leftTimerId = setInterval( function() {
            if (doodlerLeftSpace >= 0){     // 0 as left grid
                doodlerLeftSpace -= 5           // move doodler left
                doodler.style.left = doodlerLeftSpace + 'px'
            } else {
                moveRight()     // move right from bouncing off grid
            }
        }, 20)
    }

    function moveRight(){
        if (isGoingRight){
            clearInterval(rightTimerId)}    // clears double-clicked key intervals
        isGoingRight = true
        isGoingLeft = false
        clearInterval(leftTimerId)
        rightTimerId = setInterval( function() {
            if(doodlerLeftSpace <= 340){
                doodlerLeftSpace += 5
                doodler.style.left = doodlerLeftSpace + 'px'
            } else {
                moveLeft()      // move left from bouncing off grid
            }
        },20)
    }

    function moveStraight(){
        isGoingLeft, isGoingRight = false
        clearInterval(rightTimerId)
        clearInterval(leftTimerId)
    }

    function start() {
        if (!isGameOver) {
            createDoodler()
            createPlatforms()
            setInterval(movePlatforms, 30)      // sets interval for moving platforms
            jump()
            document.addEventListener('keyup', control)     // if keyboard, execute control
        }
    }
    // TODO: attach to a button
    start()

})