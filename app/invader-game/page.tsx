"use client";

import { useEffect, useRef, useState } from "react";

export default function InvaderGame() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const playerSpeed = 5;
  const bulletSpeed = 8;

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // ゲーム初期化
    const player = {
      x: canvas.width / 2 - 25,
      y: canvas.height - 50,
      width: 50,
      height: 30,
      color: "#00FF00",
    };

    const invaders = Array.from({ length: 30 }, (_, i) => ({
      x: (i % 10) * 50 + 50,
      y: Math.floor(i / 10) * 40 + 50,
      width: 30,
      height: 20,
      color: "#FF0000",
      alive: true,
    }));
    let invaderDirection = 1;
    const invaderSpeed = 1;
    let invaderMoveTimer = 0;
    const invaderMoveInterval = 30;

    const bullets: { x: number; y: number }[] = [];
    let animationFrameId: number;
    let playerDirection = 0;
    let lastShotTime = 0;
    const shotDelay = 200;

    // キーボード入力処理
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") playerDirection = -1;
      if (e.key === "ArrowRight") playerDirection = 1;
      if (e.key === " " && Date.now() - lastShotTime > shotDelay) {
        bullets.push({
          x: player.x + player.width / 2 - 2.5,
          y: player.y,
        });
        lastShotTime = Date.now();
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft" && playerDirection === -1) playerDirection = 0;
      if (e.key === "ArrowRight" && playerDirection === 1) playerDirection = 0;
    };

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);

    // 描画関数
    function draw() {
      if (!ctx || !canvas) return;

      // プレイヤー移動
      player.x += playerDirection * playerSpeed;
      player.x = Math.max(0, Math.min(canvas.width - player.width, player.x));

      // 弾の移動と当たり判定
      for (let i = bullets.length - 1; i >= 0; i--) {
        bullets[i].y -= bulletSpeed;

        // 画面外の弾を削除
        if (bullets[i].y < 0) {
          bullets.splice(i, 1);
          continue;
        }

        // インベーダーとの衝突判定
        for (let j = invaders.length - 1; j >= 0; j--) {
          if (
            invaders[j].alive &&
            bullets[i].x > invaders[j].x &&
            bullets[i].x < invaders[j].x + invaders[j].width &&
            bullets[i].y > invaders[j].y &&
            bullets[i].y < invaders[j].y + invaders[j].height
          ) {
            invaders[j].alive = false;
            bullets.splice(i, 1);
            setScore((prev) => prev + 10);
            break;
          }
        }
      }

      // インベーダー移動
      invaderMoveTimer++;
      if (invaderMoveTimer >= invaderMoveInterval) {
        invaderMoveTimer = 0;

        // 左右移動
        let moveDown = false;
        invaders.forEach((invader) => {
          if (invader.alive) {
            invader.x += invaderDirection * invaderSpeed;
            if (invader.x < 0 || invader.x + invader.width > canvas.width) {
              moveDown = true;
            }
          }
        });

        // 下方向移動
        if (moveDown) {
          invaderDirection *= -1;
          invaders.forEach((invader) => {
            if (invader.alive) {
              invader.y += 20;
              // ゲームオーバー判定
              if (invader.y + invader.height > player.y) {
                setGameOver(true);
                return;
              }
            }
          });
        }
      }

      // クリア判定
      if (invaders.every((invader) => !invader.alive)) {
        setGameOver(true);
        return;
      }

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // プレイヤー描画
      ctx.fillStyle = player.color;
      ctx.fillRect(player.x, player.y, player.width, player.height);

      // インベーダー描画
      invaders.forEach((invader) => {
        if (invader.alive) {
          ctx.fillStyle = invader.color;
          ctx.fillRect(invader.x, invader.y, invader.width, invader.height);
        }
      });

      // 弾描画
      bullets.forEach((bullet) => {
        ctx.fillStyle = "#FFFF00";
        ctx.fillRect(bullet.x, bullet.y, 5, 10);
      });

      animationFrameId = requestAnimationFrame(draw);
    }

    // ゲームループ開始
    draw();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
    };
  }, []);

  const restartGame = () => {
    setScore(0);
    setGameOver(false);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-black">
      {gameOver && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center">
          <div className="text-center">
            <h2 className="text-4xl font-bold text-white mb-4">Game Over</h2>
            <button
              onClick={restartGame}
              className="bg-white text-black px-6 py-2 rounded-lg text-xl hover:bg-gray-200"
            >
              Restart
            </button>
          </div>
        </div>
      )}
      <h1 className="text-4xl font-bold text-white mb-8">Invader Game</h1>
      <canvas
        ref={canvasRef}
        width={800}
        height={600}
        className="border-2 border-white"
      />
      <div className="mt-4 text-white">Score: {score}</div>
      {gameOver && <div className="mt-4 text-red-500 text-2xl">Game Over!</div>}
    </div>
  );
}
