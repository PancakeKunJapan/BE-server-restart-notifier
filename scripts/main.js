import { system, world } from "@minecraft/server";

const MINUTES = 5; // 再起動までの分数
const RESTART_SECONDS = MINUTES * 60;

let secondsRemaining = RESTART_SECONDS;

system.runInterval(() => {
  if (secondsRemaining === 300) {
    world.sendMessage("§e[お知らせ] サーバーは5分後に再起動します！");
  } else if (secondsRemaining === 60) {
    world.sendMessage("§c[警告] サーバーは1分後に再起動します！");
  } else if (secondsRemaining === 10) {
    world.sendMessage("§4[警告] 再起動まで10秒！");
  } else if (secondsRemaining <= 5 && secondsRemaining > 0) {
    world.sendMessage(`§4[警告] ${secondsRemaining}秒前...`);
  } else if (secondsRemaining === 0) {
    world.sendMessage("§4[再起動] サーバーを再起動します！");
    system.run(() => {
      world.sendMessage("§7/server stop コマンドを実行してください（自動停止は不可）");
      // 統合版には `server.stop()` のようなAPIがないため、外部スクリプトでstopする必要があります。
    });
  }

  secondsRemaining--;
}, 20); // 20 ticks = 1秒
