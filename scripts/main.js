import { system, world } from "@minecraft/server";

const notifyTimes = [
  { hour: 23, minute: 55 },
  { hour: 11, minute: 55 }
];

let secondsRemaining = 0;
let isCountingDown = false;

// 起動時に通知
world.sendMessage("§a[RestartNotifier] アドオンが正常に読み込まれました！");

// 毎秒の処理
system.runInterval(() => {
  const now = new Date();
  const hour = now.getHours();
  const minute = now.getMinutes();
  const second = now.getSeconds();

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

  if (isCountingDown && secondsRemaining > 0) {
    // カウントダウン処理（省略）
    secondsRemaining--;
  }

  if (secondsRemaining === 0 && isCountingDown) {
    world.sendMessage("§c[再起動] サーバーをまもなく再起動します！");
    isCountingDown = false;
  }
});

// チャットコマンド登録
world.events.beforeChat.subscribe(event => {
  const message = event.message.toLowerCase();

  if (message === "/nextrestart") {
    event.cancel = true;

    const now = new Date();
    const nowMinutes = now.getHours() * 60 + now.getMinutes();

    // notifyTimesを分に変換して現在時刻と比較
    const notifyMinutesList = notifyTimes.map(t => t.hour * 60 + t.minute);

    // 現在時刻より後の通知時刻を探す（なければ翌日扱い）
    let nextNotify = notifyMinutesList.find(m => m > nowMinutes);
    if (nextNotify === undefined) {
      nextNotify = notifyMinutesList[0] + 24 * 60; // 翌日の1つ目の通知時刻
    }

    const diffMinutes = nextNotify - nowMinutes;
    const diffH = Math.floor(diffMinutes / 60);
    const diffM = diffMinutes % 60;

    world.sendMessage(`§b[RestartNotifier] 次の再起動通知は約 ${diffH}時間${diffM}分後です。`);
  }
});
