"use client";

import { useEffect, useRef, useState } from "react";

export default function InvaderGame() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const playerSpeed = 5;
  const bulletSpeed = 8;
  const touchState = useRef({
    left: false,
    right: false,
    shoot: false,
  });

  useEffect(() => {
    // モバイル判定
    const checkIsMobile = () => {
      setIsMobile(
        /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
          navigator.userAgent
        )
      );
    };
    checkIsMobile();
    window.addEventListener("resize", checkIsMobile);

    const canvas = canvasRef.current;
    if (!canvas) return;

    // キャンバスサイズ調整
    const setCanvasSize = () => {
      if (isMobile) {
        canvas.width = window.innerWidth * 0.9;
        canvas.height = window.innerHeight * 0.7;
      } else {
        canvas.width = 800;
        canvas.height = 600;
      }
    };
    setCanvasSize();
    window.addEventListener("resize", setCanvasSize);

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // タッチ操作処理
    const handleTouchStart = (e: TouchEvent) => {
      const touch = e.changedTouches[0];
      const rect = canvas.getBoundingClientRect();
      const x = touch.clientX - rect.left;
      const y = touch.clientY - rect.top;

      if (x < canvas.width / 3) {
        touchState.current.left = true;
        playerDirection = -1;
      } else if (x > (canvas.width * 2) / 3) {
        touchState.current.right = true;
        playerDirection = 1;
      } else if (y > canvas.height * 0.8) {
        touchState.current.shoot = true;
        if (Date.now() - lastShotTime > shotDelay) {
          bullets.push({
            x: player.x + player.width / 2 - 2.5,
            y: player.y,
          });
          lastShotTime = Date.now();
        }
      }
    };

    const handleTouchEnd = () => {
      touchState.current.left = false;
      touchState.current.right = false;
      touchState.current.shoot = false;
      playerDirection = 0;
    };

    if (isMobile) {
      canvas.addEventListener("touchstart", handleTouchStart);
      canvas.addEventListener("touchend", handleTouchEnd);
      canvas.addEventListener("touchcancel", handleTouchEnd);
    }

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
      window.removeEventListener("resize", checkIsMobile);
      window.removeEventListener("resize", setCanvasSize);

      if (canvas) {
        canvas.removeEventListener("touchstart", handleTouchStart);
        canvas.removeEventListener("touchend", handleTouchEnd);
        canvas.removeEventListener("touchcancel", handleTouchEnd);
      }
    };
  }, [isMobile]);

  // ゲーム状態をrefで管理
  const gameState = useRef({
    playerDirection: 0,
    lastShotTime: 0,
    shotDelay: 200,
    bullets: [] as { x: number; y: number }[],
    player: {
      x: 0,
      y: 0,
      width: 50,
      height: 30,
    },
  });

  // ゲーム状態の初期化
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    gameState.current = {
      ...gameState.current,
      player: {
        x: canvas.width / 2 - 25,
        y: canvas.height - 50,
        width: 50,
        height: 30,
      },
      bullets: [],
      playerDirection: 0,
      lastShotTime: 0,
    };
  }, []);

  // 仮想コントローラ
  const VirtualControls = () => (
    <div className="fixed bottom-4 left-0 right-0 flex justify-between px-4">
      <div className="flex space-x-4">
        <button
          className="w-16 h-16 bg-white bg-opacity-20 rounded-full flex items-center justify-center text-white text-2xl"
          onTouchStart={() => {
            touchState.current.left = true;
            gameState.current.playerDirection = -1;
          }}
          onTouchEnd={() => {
            touchState.current.left = false;
            if (!touchState.current.right)
              gameState.current.playerDirection = 0;
          }}
        >
          ←
        </button>
        <button
          className="w-16 h-16 bg-white bg-opacity-20 rounded-full flex items-center justify-center text-white text-2xl"
          onTouchStart={() => {
            touchState.current.right = true;
            gameState.current.playerDirection = 1;
          }}
          onTouchEnd={() => {
            touchState.current.right = false;
            if (!touchState.current.left) gameState.current.playerDirection = 0;
          }}
        >
          →
        </button>
      </div>
      <button
        className="w-16 h-16 bg-red-500 bg-opacity-80 rounded-full flex items-center justify-center text-white text-2xl"
        onTouchStart={() => {
          touchState.current.shoot = true;
          if (
            Date.now() - gameState.current.lastShotTime >
            gameState.current.shotDelay
          ) {
            gameState.current.bullets.push({
              x:
                gameState.current.player.x +
                gameState.current.player.width / 2 -
                2.5,
              y: gameState.current.player.y,
            });
            gameState.current.lastShotTime = Date.now();
          }
        }}
        onTouchEnd={() => {
          touchState.current.shoot = false;
        }}
      >
        🔫
      </button>
    </div>
  );

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
      {isMobile && <VirtualControls />}
    </div>
  );
}
