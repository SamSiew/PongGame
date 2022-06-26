function intersects(X:number,Y:number,r:number,rectX:number,rectY:number,rectWidth:number,rectHeight:number) {
    let circleDistancex = Math.abs(X- rectX);
    let circleDistancey = Math.abs(Y - rectY);
  
    if (circleDistancex > (rectWidth/2 + r)) { return false; }
    if (circleDistancey > (rectHeight/2 + r)) { return false; }
  
    if (circleDistancex <= (rectWidth/2)) { return true; } 
    if (circleDistancey <= (rectHeight/2)) { return true; }
  
    let cornerDistanceSq = Math.sqrt(circleDistancex - rectWidth/2) +
                        Math.sqrt(circleDistancey - rectHeight/2);
  
    return (cornerDistanceSq <= (Math.sqrt(r)));
  }
  /*
  function scoreResul():string{
    const space = "&emsp;"
    return `Computer Score: ${compScore} ${space.repeat(27)} Player Score: ${playerScore}`
  }
   */
/*

{
const 
stopButton= <HTMLElement>document.createElement("stopbutton"),pScore = <HTMLElement>document.getElementById("pScore"),
cScore = <HTMLElement>document.getElementById("cScore"),playerCompPos = <HTMLElement>document.getElementById("pos"),
Result = <HTMLElement>document.getElementById("result"),stopGame = Observable.fromEvent(stopButton, 'click'),
svg = <HTMLElement>document.getElementById("canvas");
playerCompPos.innerHTML = pos();
const o = Observable.interval(25).takeUntil(stopGame).map(()=>({ballX:Number(balls.attr('cx')),ballY:Number(balls.attr('cy')),ballRadius:Number(balls.attr('r')),playerPadY:Number(playerPaddle.attr('y')),playerPadX:Number(playerPaddle.attr('x')),playerPadHeight:Number(playerPaddle.attr('height')),playerPadWidth:Number(playerPaddle.attr('width')),compPadY:Number(compPaddle.attr('y')),compPadX:Number(compPaddle.attr('x')),compPadHeight:Number(compPaddle.attr('height')),compPadWidth:Number(compPaddle.attr('width')),canvasHeight:Number(svg.clientHeight)}))
o.subscribe(({ballX,ballY})=>{balls.attr('cx', dx+ballX),balls.attr('cy', dy+ballY),compPaddle.attr('y',boundY(ballY,dy/2))});
o.filter(({ballY,ballRadius,canvasHeight})=>ballY <= ballRadius || ballY + ballRadius >=  canvasHeight-ballRadius).subscribe(()=>dy=-dy)
o.filter(({ballX,playerPadX,playerPadHeight,playerPadY,ballY,ballRadius})=> ballX+ballRadius >=playerPadX && ballY>= playerPadY && ballY + ballRadius <= playerPadY + playerPadHeight) .subscribe(()=>dx=-dx);
o.filter(({ballX,compPadX,compPadWidth,ballY,ballRadius,compPadY,compPadHeight})=> ballX <=compPadX+compPadWidth && ballY>= compPadY && ballY + ballRadius <= compPadY + compPadHeight).subscribe(()=>dx=-dx);
o.filter(({ballX})=>ballX>690).subscribe(()=>{dx=-dx;compScore++;balls.attr('cx',350)});
o.filter(({ballX})=>ballX<10).subscribe(()=>{dx=-dx;playerScore++;balls.attr('cx',350)});
o.subscribe(() => {pScore.innerHTML = scoretoString(playerScore);cScore.innerHTML = scoretoString(compScore)});
o.filter(()=> playerScore == 11||compScore == 11).subscribe(()=>{stopButton.click(),balls.attr('display','none'),playerPaddle.attr('display','none'),compPaddle.attr('display','none'),Result.innerHTML=publish(playerScore)})
}
*/

/*
purpose of this is to avoid player from confusing which paddle to use
note: repeat is inbuilt method of string which repeat string number of times
This function takes no parameter and return a string type
this return a string where computer and player are positionised 
such that Computer is on left and Player on the right 
*/
//const pos = ():string => `Computer: ${"&emsp;".repeat(35)} Player:`

/**
 rect.observe<MouseEvent>('mousedown').map(()=>({ballY:Number(balls.attr('cy')),ballRadius:Number(balls.attr('r')),
  padY:Number(rect.attr('y')),padX:Number(rect.attr('x')),padHeight:Number(rect.attr('height')),ballX:Number(balls.attr('cx'))}))
  .filter(({ballY,ballRadius,padY,padHeight})=>!(ballY + ballRadius <= padY|| ballY - ballRadius >= padY +padHeight))
  .subscribe(({ballY,ballX,padY,padX,ballRadius})=>{balls.attr('cx',padX-ballRadius),balls.attr('cy',padY-+ballRadius)})
 */