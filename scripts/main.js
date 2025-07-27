import { system, world } from "@minecraft/server";

let secondsRemaining = 0;

// 停止予定時刻（24時間表記）
// 停止予定時刻の5分前に通知を出す（ここでは23:55 と 11:55）
const notifyTimes = [
  { hour: 23, minute: 55 },
  { hour: 11, minute: 55 }
];

system.runInterval(() => {
  const now = new Date();
  const hour = now.getHours();
  const minute = now.getMinutes();
  const second = now.getSeconds();

  // 時刻チェック
  for (const t of notifyTimes) {
    if (hour === t.hour && minute === t.minute && second === 0) {
      world.sendMessage("§e[お知らせ] サーバーは5分後に自動再起動されます。");
      secondsRemaining = 300;
    }
  }

  // カウントダウン通知（任意）
  if (secondsRemaining > 0) {
    if ([300, 60, 10, 5, 4, 3, 2, 1].includes(secondsRemaining)) {
      world.sendMessage(`§c[警告] サーバー再起動まであと ${secondsRemaining} 秒`);
    }
    secondsRemaining--;
  }
}, 20); // 20 ticks = 1秒
