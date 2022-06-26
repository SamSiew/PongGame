"use strict";
function pong() {
    const img = document.getElementById("mainMenu"), start = document.getElementById("start"), pScore = document.getElementById("pScore"), cScore = document.getElementById("cScore"), playa = document.getElementById("playa"), comp = document.getElementById("comp"), svg = document.getElementById("canvas"), stopButton = document.createElement("stopbutton"), mousemove = Observable.fromEvent(svg, 'mousemove'), stopGame = Observable.fromEvent(stopButton, 'click'), mouseup = Observable.fromEvent(svg, 'mouseup'), Result = document.getElementById("result"), arcades = document.getElementById("arcade"), arcadescore = document.getElementById("aScore"), instruc = document.getElementById("instruction");
    Observable.fromEvent(start, 'mousedown')
        .subscribe(() => {
        img.style.display = "none", start.style.display = "none", arcades.style.display = "none", pScore.setAttribute('display', 'block'),
            cScore.setAttribute('display', 'block'), comp.setAttribute('display', 'block'), playa.setAttribute('display', 'block'),
            instruc.setAttribute('display', 'block'), game();
    });
    Observable.fromEvent(arcades, 'mousedown')
        .subscribe(() => {
        img.style.display = "none", start.style.display = "none", arcades.style.display = "none", arcadescore.setAttribute('display', 'block'),
            instruc.setAttribute('display', 'block'), arcade();
    });
    function arcade() {
        const balls = ball();
        const playerPaddle = paddle(670, 250, true);
        let maxblock = 12;
        let score = 0;
        let dx = 4;
        let dy = 4;
        renderGame();
        function block(X, Y) {
            const killblock = document.createElement("kill"), destroy = Observable.fromEvent(killblock, 'click');
            const rect = new Elem(svg, 'rect').attr('x', X).attr('y', Y).attr('width', 22).attr('height', 100).attr('fill', '#95B3D7').attr('stroke', 'rgb(0,0,0');
            Observable.interval(25).takeUntil(destroy).
                map(() => ({ ballsX: (Number(balls.attr('cx')) - Number(balls.attr('r'))),
                rectX: (Number(rect.attr('x')) + Number(rect.attr('width'))), ballY: Number(balls.attr('cy')), ballRadius: Number(balls.attr('r')),
                rectY: Number(rect.attr('y')), rectHeight: Number(rect.attr('height')),
            }))
                .filter(({ ballsX, rectX, ballY, ballRadius, rectY, rectHeight }) => ballsX <= rectX &&
                !(ballY + ballRadius <= rectY || ballY - ballRadius >= rectY + rectHeight))
                .subscribe(() => {
                rect.attr('display', 'none'), score++, maxblock--, killblock.click();
            });
        }
        function renderGame() {
            let i = 0;
            const o = Observable.interval(25).takeUntil(stopGame);
            o.filter(() => i * 80 <= 700).subscribe(() => { block(0, 100 * i), block(22, 100 * i); i++; });
            o.subscribe(() => (arcadescore.innerHTML = scoretoString(score)));
            o.map(() => ({ ballX: Number(balls.attr('cx')), ballY: Number(balls.attr('cy')) }))
                .subscribe(({ ballX, ballY }) => { balls.attr('cx', dx + ballX), balls.attr('cy', dy + ballY); });
            o.map(() => ({ ballY: Number(balls.attr('cy')), ballRadius: Number(balls.attr('r')), canvasHeight: Number(svg.clientHeight) }))
                .filter(({ ballY, ballRadius, canvasHeight }) => ballY <= ballRadius || ballY + ballRadius >= canvasHeight - ballRadius).subscribe(() => dy = -dy);
            o.map(() => ({ ballX: Number(balls.attr('cx')), ballY: Number(balls.attr('cy')), ballRadius: Number(balls.attr('r')),
                playerPadX: Number(playerPaddle.attr('x')), playerPadY: Number(playerPaddle.attr('y')),
                playerPadHeight: Number(playerPaddle.attr('height')), playerPadWidth: Number(playerPaddle.attr('width')) }))
                .filter(({ ballX, playerPadX, playerPadHeight, playerPadY, ballY, ballRadius }) => ballX >= playerPadX && !(ballY + ballRadius <= playerPadY || ballY - ballRadius >= playerPadY + playerPadHeight))
                .subscribe(() => dx = -dx);
            o.map(() => ({ ballX: Number(balls.attr('cx')) })).filter(({ ballX }) => ballX > 690).subscribe(() => { dx = -dx; balls.attr('cx', 350); score = score <= 0 ? 0 : score - 1; });
            o.map(() => ({ ballX: Number(balls.attr('cx')) })).filter(({ ballX }) => ballX < 10).subscribe(() => { dx = -dx; });
            o.filter(() => maxblock <= 0).subscribe(() => {
                stopButton.click(), balls.attr('display', 'none'), playerPaddle.attr('display', 'none'),
                    Result.innerHTML = publish(score);
            });
        }
    }
    function game() {
        let dx = 4, dy = 4, playerScore = 0, compScore = 0;
        const balls = ball(), playerPaddle = paddle(670, 250, true), compPaddle = paddle(10, 250, false);
        Line();
        gameStart(dx, dy, playerScore, compScore, playerPaddle, compPaddle, balls);
    }
    function paddle(X, Y, Playable) {
        const rect = new Elem(svg, 'rect').attr('x', X).attr('y', Y).attr('width', 22).attr('height', 80).attr('fill', '#95B3D7');
        rect.observe('mousedown').filter(() => Playable)
            .map(({ clientX, clientY }) => ({ xOffset: X, yOffset: Number(rect.attr('y')) - clientY }))
            .flatMap(({ xOffset, yOffset }) => mousemove.takeUntil(mouseup)
            .map(({ clientX, clientY }) => ({ x: X, y: clientY + yOffset })))
            .subscribe(({ x, y }) => rect.attr('x', x).attr('y', boundY(y, 0)));
        return rect;
    }
    function ball() {
        const balls = new Elem(svg, 'circle').attr('cx', 350).attr('cy', 300).attr('r', 10).attr('fill', '#89d792');
        return balls;
    }
    function Line() {
        const line = new Elem(svg, 'line').attr('x1', 350)
            .attr('y1', 600).attr('x2', 350).attr('y2', 0)
            .attr('style', "stroke:rgb(255, 255, 0);stroke-width:2").attr('fill', '#360613');
    }
    const boundY = (y, Nextsteps) => y + Nextsteps > 500 ? 500 : y + Nextsteps < 0 ? 0 : y + Nextsteps;
    const scoretoString = (aScore) => (aScore < 10 ? "0" : "") + aScore.toString();
    const publish = (playerscore) => (playerscore >= 11 ? `Playa` : `Comp`) + `${"&nbsp;".repeat(2)} Wins`;
    function gameStart(dx, dy, playerScore, compScore, playerPaddle, compPaddle, balls) {
        const o = Observable.interval(25).takeUntil(stopGame)
            .map(() => ({ ballX: Number(balls.attr('cx')), ballY: Number(balls.attr('cy')), ballRadius: Number(balls.attr('r')),
            playerPadY: Number(playerPaddle.attr('y')), playerPadX: Number(playerPaddle.attr('x')),
            playerPadHeight: Number(playerPaddle.attr('height')), playerPadWidth: Number(playerPaddle.attr('width')),
            compPadY: Number(compPaddle.attr('y')), compPadX: Number(compPaddle.attr('x')),
            compPadHeight: Number(compPaddle.attr('height')), compPadWidth: Number(compPaddle.attr('width')), canvasHeight: Number(svg.clientHeight)
        }));
        o.subscribe(({ ballX, ballY }) => { balls.attr('cx', dx + ballX), balls.attr('cy', dy + ballY), compPaddle.attr('y', boundY(ballY, dy / 2)); });
        o.filter(({ ballY, ballRadius, canvasHeight }) => ballY <= ballRadius || ballY + ballRadius >= canvasHeight - ballRadius).subscribe(() => dy = -dy);
        o.filter(({ ballX, playerPadX, playerPadHeight, playerPadY, ballY, ballRadius }) => ballX + ballRadius >= playerPadX &&
            !(ballY + ballRadius <= playerPadY || ballY - ballRadius >= playerPadY + playerPadHeight)).subscribe(() => dx = -dx);
        o.filter(({ ballX, compPadX, compPadWidth, ballY, ballRadius, compPadY, compPadHeight }) => ballX - ballRadius <= compPadX + compPadWidth &&
            !(ballY + ballRadius + dy <= compPadY || ballY - ballRadius + dy >= compPadY + compPadHeight)).subscribe(() => dx = -dx);
        o.filter(({ ballX }) => ballX > 690).subscribe(() => { dx = -dx; compScore++; balls.attr('cx', 350); });
        o.filter(({ ballX }) => ballX < 10).subscribe(() => { dx = -dx; playerScore++; balls.attr('cx', 350); });
        o.subscribe(() => { pScore.innerHTML = scoretoString(playerScore); cScore.innerHTML = scoretoString(compScore); });
        o.filter(() => playerScore == 11 || compScore == 11)
            .subscribe(() => {
            stopButton.click(), balls.attr('display', 'none'), playerPaddle.attr('display', 'none'),
                compPaddle.attr('display', 'none'), Result.innerHTML = publish(playerScore);
        });
    }
}
if (typeof window != 'undefined')
    window.onload = () => {
        pong();
    };
//# sourceMappingURL=pong.js.map