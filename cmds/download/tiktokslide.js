const axios = require("axios");
const { proto, generateWAMessageFromContent, generateWAMessageContent } = require("@whiskeysockets/baileys");

module.exports = {
  autoRead: true,
  react: "🕐",
  presence: "composing",
  onlyOwner: false,
  cmds: ["tiktokslide"],
  handle: async (ctx, m) => {
    const url = m.args && m.args[0];
    if (!url || !m.isLink) {
      return m.reply("Masukkan link TikTok yang valid.");
    }

    const createImage = async (url) => {
      const { imageMessage } = await generateWAMessageContent(
        {
          image: { url },
        },
        {
          upload: ctx.waUploadToServer,
        }
      );
      return imageMessage;
    };

    try {
      const result = await downloadTikTokSlide(url); // Perbaikan: Menambahkan `await`
      console.log(result.data.data.images)
      if (!result.success || !result.data.data.images || result.data.data.images.length === 0) {
        return m.reply("Gagal mengambil gambar dari TikTok.");
      }

      const imageUrls = result.data.images;
const cards = await Promise.all(
  Array.isArray(result.data.images) && result.data.images.length > 0
    ? result.data.images.map(async (url, index) => ({
        header: proto.Message.InteractiveMessage.Header.fromObject({
          title: `Image ${index + 1} / ${result.data.images.length}`, // Dynamic image count
          hasMediaAttachment: true,
          imageMessage: await createImage(url),
        }),
        nativeFlowMessage: proto.Message.InteractiveMessage.NativeFlowMessage.fromObject({
          buttons: [], // No buttons
        }),
      }))
    : []
);

      const msg = generateWAMessageFromContent(
        m.id,
        {
          viewOnceMessage: {
            message: {
              messageContextInfo: {
                deviceListMetadata: {},
                deviceListMetadataVersion: 2,
              },
              interactiveMessage: proto.Message.InteractiveMessage.fromObject({
                body: proto.Message.InteractiveMessage.Body.fromObject({
                  text: "*Result:* \n> © CiyoBot", // Perbaikan: `text` didefinisikan langsung
                }),
                carouselMessage: proto.Message.InteractiveMessage.CarouselMessage.fromObject({
                  cards,
                }),
              }),
            },
          },
        },
        {}
      );

      await ctx.relayMessage(msg.key.remoteJid, msg.message, { messageId: msg.key.id });
    } catch (error) {
      console.error("Error:", error.message || error);
      return m.reply("Terjadi kesalahan saat memproses permintaan.");
    }
  },
};

async function downloadTikTokSlide(url) {
  try {
    const response = await axios.post(
      "https://www.tikwm.com/api/",
      new URLSearchParams({
        url,
        count: "12",
        cursor: "0",
        web: "1",
        hd: "1",
      }),
      {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
          Accept: "application/json, text/javascript, */*; q=0.01",
          "X-Requested-With": "XMLHttpRequest",
          "User-Agent":
            "Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Mobile Safari/537.36",
          Referer: "https://www.tikwm.com/",
        },
      }
    );

    return { success: true, data: response.data };
  } catch (error) {
    console.error("API Error:", error.message || error);
    return {
      success: false,
      error:
        (error.response && error.response.data) ||
        "Terjadi kesalahan saat menghubungi API TikTok.",
    };
  }
}