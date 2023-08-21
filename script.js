/* Load only once, when all HTML is written.
* Can put script tag at bottom of HTML file.  */
document.addEventListener('DOMContentLoaded', () => {
    const grid = document.querySelector ('.grid')          // Picks out element from HTML.
    const doodler = document.createElement('div')
    let doodlerLeftSpace = 50
    let doodlerBottomSpace = 250
    let isGameOver = false
    let platformCount = 5
    let platforms = []
    let upTimerId
    let downTimerId

    function createDoodler() {
        grid.appendChild(doodler)          // put the doodler (child) into the grid (parent).
        doodler.classList.add('doodler')    // adding the doodler class to the element of doodler - appears corresp to .css.

        doodler.style.left = doodlerLeftSpace + 'px' // left spacing of 50px
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
        if (doodlerBottomSpace > 200){  // if the doodler is above the bot margin, move
            platforms.forEach( platform => {
                platform.bottom -= 4
                let visual = platform.visual
                visual.style.bottom = platform.bottom + 'px'    // platform moves by 4 each time
            })
        }
    }

    function jump() {
        clearInterval(downTimerId)
        upTimerId = setInterval(function() {       // Stops the interval when needed
            doodlerBottomSpace += 20
            doodler.style.bottom = doodlerBottomSpace + 'px'        // visual
            if (doodlerBottomSpace > 350){      // visualize the fall if the bottom space is over x.
                fall()
            }
        }, 20)
    }

    function fall(){
        clearInterval(upTimerId)    // stop the jump interval
        downTimerId = setInterval( function() {
            doodlerBottomSpace -= 5
            doodler.style.bottom = doodlerBottomSpace +'px'
            if (doodlerBottomSpace <= 0 ){
                jump()
            }
        }, 30)
    }

    function gameOver(){
        console.log('game over')
        isGameOver = true
        clearInterval(upTimerId)
        clearInterval(downTimerId)
    }

    function start() {
        if (!isGameOver) {
            createDoodler()
            createPlatforms()
            setInterval(movePlatforms, 30)      // sets interval for moving platforms
            jump()
        }
    }
    // TODO: attach to a button
    start()


})