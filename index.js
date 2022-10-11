const {create, decryptMedia} = require('@open-wa/wa-automate');


create({
  sessionId: "STICKER_BOT",
  multiDevice: true, //required to enable multiDevice support
  authTimeout: 60, //wait only 60 seconds to get a connection with the host account device
  blockCrashLogs: true,
  disableSpins: true,
  headless: true,
  hostNotificationLang: 'PT_BR',
  logConsole: false,
  popup: true,
  qrTimeout: 0, //0 means it will wait forever for you to scan the qr code
}).then(client => start(client));


function start(client) {
  client.onMessage(async message => {
    if (message.type === "image"){
        await client.sendText(message.from , "✅ Imagen recibida, convirtiendo para sticker...");
        client.simulateTyping(message.from, true)
        const mediaData = await decryptMedia(message);
        const imageBase64 = `data:${message.mimetype};base64,${mediaData.toString(
        'base64'
        )}`;
        try {
          await client.sendImageAsSticker(message.from, imageBase64, {
            author: "💻",
            pack: "🖥"
          });
        } catch (error) {
          await client.sendText(message.from, "❌ Error al convertir la imagen en sticker (Intenta con otra imagen)");
          await client.sendText(message.from, "❌ Error: " + error);
        }
    }else if(message.type === "video"){
      client.simulateTyping(message.from, true)
      await client.sendText(message.from , "✅ Video recibido, convirtiendo para sticker...");
      const mediaData = await decryptMedia(message);
      const imageBase64 = `data:${message.mimetype};base64,${mediaData.toString(
      'base64'
      )}`;
      try {
        await client.sendMp4AsSticker(message.from, imageBase64, {}, {
          author: "💻",
          pack: "🖥"
        });  
      } catch (error) {
        await client.sendText(message.from, "❌ Error al convertir el video en sticker (Intenta con otro video)");
        await client.sendText(message.from, "❌ Error: " + error);
      }  
    }
  });
}