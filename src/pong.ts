function pong():void {
  /**
   * param: None
   * return: None -> void function 
   * This function make an event such that user click the image of start button, the game will run 
   * Not only that but this function hide image of main menu and shows some object to be shown when pong games start 
   * this function is also a closure function where it store all function to render the games
   */

  /*
    declare html element into pong games with constant
    making it a global constant variable to allow usage in all function below
    */
  const img = <HTMLElement>document.getElementById("mainMenu"),start = <HTMLElement>document.getElementById("start"),
  pScore = <HTMLElement>document.getElementById("pScore"),cScore = <HTMLElement>document.getElementById("cScore"),
  playa = <HTMLElement>document.getElementById("playa"),comp = <HTMLElement>document.getElementById("comp"),
  svg = <HTMLElement>document.getElementById("canvas"),stopButton= <HTMLElement>document.createElement("stopbutton"),
  mousemove = Observable.fromEvent<MouseEvent>(svg, 'mousemove'),stopGame = Observable.fromEvent(stopButton, 'click'),
  mouseup = Observable.fromEvent<MouseEvent>(svg, 'mouseup'),Result = <HTMLElement>document.getElementById("result"),
  arcades = <HTMLElement>document.getElementById("arcade"),arcadescore = <HTMLElement>document.getElementById("aScore"),
  instruc = <HTMLElement>document.getElementById("instruction");

  //check if start button was click if it is, start normal game
  Observable.fromEvent(start,'mousedown')
  //employed element to board
  .subscribe(()=>{img.style.display="none",start.style.display="none",arcades.style.display="none",pScore.setAttribute('display','block'),
  cScore.setAttribute('display','block'),comp.setAttribute('display','block'),playa.setAttribute('display','block'),
  instruc.setAttribute('display','block'),game()})
  
  //check if arcade button was click if it is, start arcade game
  Observable.fromEvent(arcades,'mousedown')
  //employed element to board
  .subscribe(()=>{img.style.display="none",start.style.display="none",arcades.style.display="none",arcadescore.setAttribute('display','block'),
  instruc.setAttribute('display','block'),arcade()})

  function arcade():void{
    /**
     * param None
     * return nothing, void function 
     * renders arcade games into board
     * declare all variable,data needed for games to render 
     */
    const balls:Elem = ball();
    const playerPaddle:Elem = paddle(670,250,true);
    let maxblock:number = 12;
    let score:number = 0;
    let dx:number =4;
    let dy:number =4;
    renderGame()
    function block (X:number,Y:number):void{
      /**
       * param X,a number type, used to create block at coordinate
       * param Y,a number type, used to create block at coordinate
       * return nothing,void function 
       * used to create blocks, and it will be destroyed when ball hit this element 
       */
      const killblock = <HTMLElement>document.createElement("kill"),destroy = Observable.fromEvent(killblock, 'click')
      const rect = new Elem(svg, 'rect').attr('x', X).attr('y', Y).attr('width', 22).attr('height', 100).attr('fill', '#95B3D7').attr('stroke','rgb(0,0,0');
     
       //when ball hit this block, the block destroyed and increase score,decrease maxblock
      Observable.interval(25).takeUntil(destroy).
      map(()=>({ballsX:(Number(balls.attr('cx'))-Number(balls.attr('r'))),
      rectX:(Number(rect.attr('x'))+Number(rect.attr('width'))),ballY:Number(balls.attr('cy')),ballRadius:Number(balls.attr('r')),
      rectY:Number(rect.attr('y')),rectHeight:Number(rect.attr('height')),
    }))
    //when ball hit block, the block destroyed and increase score,decrease maxblock, otherwise keep observing
      .filter(({ballsX,rectX,ballY,ballRadius,rectY,rectHeight})=>ballsX<=rectX&& 
      !(ballY + ballRadius <= rectY || ballY - ballRadius >= rectY + rectHeight))
      .subscribe(()=>{rect.attr('display','none'),score++,maxblock--,killblock.click()
    })
    }
    function renderGame():void{
      /**
   * @param none,no param 
   * @return nothing, it is void function
   * constructs an Observable event stream of pong games with eight branches:
   *   Observable<playerPaddle,compPaddle,Ball,Canvas,Playerscore,CompScore,StopButton>
   *    |- create block- using while loops to create block  as long as block height does not exceeed the canvas height 
   *    |- update score - change score when updated   
   *    |- animate the ball - move the ball 
   *    |- check if ball collides with top or bottom canvas,
   *       if ball collide both location, ball movement in y-coordinate is reverse 
   *    |- check if ball collides player paddle
   *       if ball collide player paddle, ball movement in x-coordinate is reverse
  `*    |- check if ball hit the goal(left canvas)
           if ball hit left canvas, ball movement in x-coordinate is reverse
   *    |- check if ball hit the goal(right canvas)
           if ball hit left canvas, decrease score and change ball position to middle 
   *    |- check if maxblock is 0,when it is 0 
   *          then, end the game by clicking the hidden button, 
   *          hide balls,and player paddles and 
   *          publish wheather player wins or lose 
   *    when game is done by clicking stop button, 
   *    takeuntill proceed ending all the brances,therefore, pong game is done and no more operation is running.  
   * */
      // i is a number that allows to create block,as long as block height does not exceeed the
      //canvas height 
      let i:number = 0;
      const o = Observable.interval(25).takeUntil(stopGame)
      //create block  
      o.filter(()=>i*80<=700).subscribe(()=>{block(0,100*i),block(22,100*i);i++;})
      //publish score 
      o.subscribe(()=>(arcadescore.innerHTML=scoretoString(score)))
      //animate ball
      o.map(()=>({ballX:Number(balls.attr('cx')),ballY:Number(balls.attr('cy'))}))
      .subscribe(({ballX,ballY})=>{balls.attr('cx', dx+ballX),balls.attr('cy', dy+ballY)});
      //wall collide ball
      o.map(()=>({ballY:Number(balls.attr('cy')),ballRadius:Number(balls.attr('r')),canvasHeight:Number(svg.clientHeight)}))
      .filter(({ballY,ballRadius,canvasHeight})=>ballY <= ballRadius || ballY + ballRadius >=  canvasHeight-ballRadius).subscribe(()=>dy=-dy)
      //player paddle collide ball
      o.map(()=>({ballX:Number(balls.attr('cx')),ballY:Number(balls.attr('cy')),ballRadius:Number(balls.attr('r')),
      playerPadX:Number(playerPaddle.attr('x')),playerPadY:Number(playerPaddle.attr('y')),
      playerPadHeight:Number(playerPaddle.attr('height')),playerPadWidth:Number(playerPaddle.attr('width'))}))
      .filter(({ballX,playerPadX,playerPadHeight,playerPadY,ballY,ballRadius})=>
      ballX>=playerPadX && !(ballY + ballRadius <= playerPadY || ballY - ballRadius >= playerPadY + playerPadHeight))
      .subscribe(()=>dx =-dx)
      //collide right canvas- reduce mark
      o.map(()=>({ballX:Number(balls.attr('cx'))})).filter(({ballX})=>ballX>690).subscribe(()=>{dx=-dx;balls.attr('cx',350);score = score<=0?0:score-1});
      //collide left canvas
      o.map(()=>({ballX:Number(balls.attr('cx'))})).filter(({ballX})=>ballX<10).subscribe(()=>{dx=-dx;});
      //end game if all block is over
      o.filter(()=> maxblock <= 0).subscribe(()=>{stopButton.click(),balls.attr('display','none'),playerPaddle.attr('display','none'),
      Result.innerHTML=publish(score)})
    }

  }
  function game():void {
    /*
    @param None,getting no parameter needed
    @return nothing, it is void function
    declare movement of x and y coordinate of ball as number,
    as well as player score and computer score as number
    give layer score and computer score,dx and dy a default value,
    if no default value game wont start
    this function basically construct all element required before start the ga,e
    */
    let dx:number = 4,dy:number = 4, playerScore:number = 0, compScore:number = 0; 
    //create line,playerpaddle,computerpaddles and balls into canvas
    const balls:Elem = ball(),playerPaddle:Elem = paddle(670,250,true)
    ,compPaddle:Elem = paddle(10,250,false)
    //,compPaddle:Elem = paddle(balls,10,250,false);
    Line();
    //Start the game
    gameStart(dx,dy,playerScore,compScore,playerPaddle,compPaddle,balls);
  }

  function paddle(X:number,Y:number,Playable:boolean):Elem {
    /**
      * @param balls,Elem type,refers to ball of pong game
      * @param X,number type, refers to initial x coordinate of paddle
      * @param Y,number type, refers to initial y coordinate of paddle
      * @param Playable,boolean type, refers to wheather it is player's paddle 
      * @return paddles,Elem type, for manipulation of paddle movement.
     * It will first create paddle for player and computer and run through this:
     * Constructs an observable stream for the paddle 
     * that if it is player's paddle
     * on mousedown creates a new stream to handle drags until mouseup 
     * but it can only moves up and down(change in y-coordinate) 
     * but x-coordinate remain same,not allowing any change in x-coordinate
     * Lastly, it returns as an elem to allow manipulation of its movement 
     * in pong games
     * 
     *   O<MouseDown>
     *     | map x/y offsets
     *   O<x,y>
     *     | flatMap
     *     +---------------------+------------...
     *   O<MouseMove>          O<MouseMove>
     *     | takeUntil mouseup   |
     *   O<MouseMove>          O<MouseMove>
     *     | map x + 0,y + offsets   | -> only change y from mouse movement
     *     +---------------------+------------...
     *   O<x,y>
     *     | move the paddle
     *    --- 
     */
    const rect = new Elem(svg, 'rect').attr('x', X).attr('y', Y).attr('width', 22).attr('height', 80).attr('fill', '#95B3D7');
  
    rect.observe<MouseEvent>('mousedown').filter(()=>Playable)
      .map(({clientX, clientY}) => ({ xOffset: X,yOffset: Number(rect.attr('y')) - clientY }))
      .flatMap(({xOffset, yOffset}) =>mousemove.takeUntil(mouseup)
      .map(({clientX, clientY}) =>({ x: X, y: clientY + yOffset})))
      .subscribe(({x, y}) =>rect.attr('x', x).attr('y', boundY(y,0)));

    return rect
    }
    
  function ball():Elem{
    /*
    * @param None,No parameter needed
    * @return balls,Elem type, for manipulation of ball movement.
    create a ball from svg circle type into the pong games canvas 
    important for paddles to scores goals  
    return the Elem ball to allow manipulation of its movement 
    */
    const balls = new Elem(svg, 'circle').attr('cx', 350).attr('cy', 300).attr('r',10).attr('fill', '#89d792');
    return balls;
  }
  
  function Line():void {
    /*
    * @param None,No parameter needed
    * @return None, void function
    create a line from svg line type into the pong games canvas 
    important for location for ball to spawn,located at middle of canvas.  
    return nothing(void) to just construct the line into pong games canvas 
    */
    const line = new Elem(svg, 'line').attr('x1', 350)
          .attr('y1', 600).attr('x2',350).attr('y2',0)
          .attr('style',"stroke:rgb(255, 255, 0);stroke-width:2").attr('fill', '#360613');
  }
  
  /*
  * @param y,a number type, refers to y coordinate of paddle.
    @param Nextsteps,a number type, extra steps to move for paddle.
  * @return a number, number type, a new y coordinate of paddles.
  purpose of this is to ensure paddle do not goes out of bound by Y-coordinate during its movement
  This function takes two parameter which is both number type and return a number
  this function first check tertary condition of y-coordinate of paddles with next steps,
  if y+steps is > 500, return 500 else,
  check if y+steps < 0,return 0 if true else 
  return y+steps because it pass the test of bounding box 
  */
  const boundY = (y:number,Nextsteps:number):number =>  y+Nextsteps>500?500:y+Nextsteps<0?0:y+Nextsteps;
  
  /*
  * @param aScore,a number type, score point of player or computer.
  * @return a string,string type, to update score of player and computer.
  purpose of this is to publish score of player and computer
  This function takes number type parameter and return a string type
  This function takes aScore(either Computer score or player score) and 
  The condition is placed to ensure two digits is published such that when 
  aScore < 10,we knows there's only one digit so "0" is added infront of string
  else, we return "" because for instance result of string "10"  concatenate "" == "10" 
  return a string of the score given in parameter.
  */
  const scoretoString = (aScore:number):string => (aScore < 10 ? "0":"" ) + aScore.toString(); 
  
  /*
  note:"&nbsp;" refers to space between text and 
        repeat is a function of string that repeat a number of times
  * @param playerScore,a number type, score point of player
  * @return a string,string type,formatted in html text, to publish result of player/computer wins  
  purpose of this is to publish wheather player wins or lose
  This function takes number type parameter and return a string type
  This function takes playerscore(expecting player score) and 
  The condition is to check wheather player is a winner by checking it score 
  if player score is 11, 
    if true -> return string of player wins
    if false -> return string of player lose
  return a string of the player wins or player lose given in parameter.
  */
  const publish = (playerscore:number):string => (playerscore >= 11?`Playa`:`Comp`)+`${"&nbsp;".repeat(2)} Wins`
  
  function gameStart(dx:number,dy:number,playerScore:number,compScore:number,playerPaddle:Elem,compPaddle:Elem,balls:Elem):void{
  /**
   * @param dx,a number type,refers to change in x coordinate for balls
   * @param dy,a number type,refers to change in y coordinate for balls
   * @param playerScore,a number type, score point of player
   * @param CompScore,a number type, score point of computer
   * @param playerPaddle,an elem type, player paddle
   * @param compPaddle,an elem type, computer paddle
   * @param balls,an elem type, balls
   * @return nothing, it is void function
   * constructs an Observable event stream of pong games with eight branches:
   *   Observable<playerPaddle,compPaddle,Ball,Canvas,Playerscore,CompScore,StopButton>
   *    |- animate the ball
   *    |- check if ball collides with top or bottom canvas,
   *       if ball collide both location, ball movement in y-coordinate is reverse 
   *    |- check if ball collides player paddle
   *       if ball collide player paddle, ball movement in x-coordinate is reverse
   *    |- check if ball collides computer paddle
   *       if ball collide computer paddle, ball movement in x-coordinate is reverse
  `*    |- check if ball hit the goal(left canvas)
           if ball hit left canvas, increase computer score and change ball position to middle 
   *    |- check if ball hit the goal(right canvas)
           if ball hit left canvas, increase player score and change ball position to middle 
   *    |- print an updated scores to board
   *       update pScore and cScore with respective player and computer score in html
   *    |- check if either player score or computer score achieved score 11
   *       if  either player score or computer score achieved score 11 
   *          then, end the game by clicking the hidden button, 
   *          hide balls,computer paddles,and player paddles and 
   *          publish wheather player wins or lose 
   *    when game is done by clicking stop button, 
   *    takeuntill proceed ending all the brances,therefore, pong game is done and no more operation is running.  
   * */
  
    /*
    declare html element into pong games with constant,this includes 
    stopbutton, computer score,player score, position of player paddle and computer paddles
    ,and result of the games 
    */
  
    //Start the game with Observable event stream of pong games 
    const o = Observable.interval(25).takeUntil(stopGame)
    .map(()=>({ballX:Number(balls.attr('cx')),ballY:Number(balls.attr('cy')),ballRadius:Number(balls.attr('r')),
    playerPadY:Number(playerPaddle.attr('y')),playerPadX:Number(playerPaddle.attr('x')),
    playerPadHeight:Number(playerPaddle.attr('height')),playerPadWidth:Number(playerPaddle.attr('width')),
    compPadY:Number(compPaddle.attr('y')),compPadX:Number(compPaddle.attr('x')),
    compPadHeight:Number(compPaddle.attr('height')),compPadWidth:Number(compPaddle.attr('width')),canvasHeight:Number(svg.clientHeight)
    }))
  
    o.subscribe(({ballX,ballY})=>{balls.attr('cx', dx+ballX),balls.attr('cy', dy+ballY),compPaddle.attr('y',boundY(ballY,dy/2))});
  
    //wall collide ball
    o.filter(({ballY,ballRadius,canvasHeight})=>ballY <= ballRadius || ballY + ballRadius >=  canvasHeight-ballRadius).subscribe(()=>dy=-dy)
    
    //player paddle collide ball
    o.filter(({ballX,playerPadX,playerPadHeight,playerPadY,ballY,ballRadius})=> ballX+ballRadius >=playerPadX && 
    !(ballY + ballRadius <= playerPadY || ballY - ballRadius >= playerPadY + playerPadHeight)
    ).subscribe(()=>dx=-dx);
    
    //comp paddle collide ball
    o.filter(({ballX,compPadX,compPadWidth,ballY,ballRadius,compPadY,compPadHeight})=> ballX-ballRadius <=compPadX+compPadWidth && 
    !(ballY + ballRadius + dy <= compPadY|| ballY - ballRadius + dy >= compPadY + compPadHeight)).subscribe(()=>dx=-dx);

    //ball hit the goal
    o.filter(({ballX})=>ballX>690).subscribe(()=>{dx=-dx;compScore++;balls.attr('cx',350)});
    o.filter(({ballX})=>ballX<10).subscribe(()=>{dx=-dx;playerScore++;balls.attr('cx',350)});

    //print scores to board
    o.subscribe(() => {pScore.innerHTML = scoretoString(playerScore);cScore.innerHTML = scoretoString(compScore)});
    
    //end game by clicking
    o.filter(()=> playerScore == 11||compScore == 11)
    .subscribe(()=>{stopButton.click(),balls.attr('display','none'),playerPaddle.attr('display','none'),
    compPaddle.attr('display','none'),Result.innerHTML=publish(playerScore)})
  }
}

// the following simply runs your pong function on window load.  Make sure to leave it in place.
if (typeof window != 'undefined') window.onload = ()=>{
  pong();
}