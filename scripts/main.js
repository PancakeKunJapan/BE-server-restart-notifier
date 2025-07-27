import { system, world } from "@minecraft/server";

// 通知を出す再起動時間（停止の5分前）
// たとえば Xserver の停止が 00:00, 12:00 なら → 通知は 23:55, 11:55
const notifyTimes = [
  { hour: 23, minute: 55 },
  { hour: 11, minute: 55 }
];

let secondsRemaining = 0;
let isCountingDown = false;

system.runInterval(() => {
  const now = new Date();
  const hour = now.getHours();
  const minute = now.getMinutes();
  const second = now.getSeconds();

  // 通知開始時刻かどうか
  if (!isCountingDown) {
    for (const t of notifyTimes) {
      if (hour === t.hour && minute === t.minute && second === 0) {
        world.sendMessage("§e[お知らせ] サーバーは5分後に自動再起動されます。");
        secondsRemaining = 300;
        isCountingDown = true;
        break;
      }
    }
  }

  // カウントダウン中なら通知＆音
  if (isCountingDown && secondsRemaining > 0) {
    // 音を鳴らす秒数
    const soundTimes = [300, 60, 30, 10, 5, 4, 3, 2, 1];

    if (soundTimes.includes(secondsRemaining)) {
      world.sendMessage(`§c[警告] サーバー再起動まであと ${secondsRemaining} 秒`);

      // 全プレイヤーに音を鳴らす
      for (const player of world.getPlayers()) {
        player.runCommandAsync(`playsound random.orb @s`);
      }
    }

    // 5秒以下は毎秒通知＆音
    if (secondsRemaining <= 5) {
      world.sendMessage(`§4[再起動] あと ${secondsRemaining} 秒...`);
      for (const player of world.getPlayers()) {
        player.runCommandAsync(`playsound note.harp @s`);
      }
    }

    secondsRemaining--;
  }

  if (secondsRemaining === 0 && isCountingDown) {
    world.sendMessage("§c[再起動] サーバーをまもなく再起動します！");
    isCountingDown = false;
  }
}, 20); // 1秒ごと
