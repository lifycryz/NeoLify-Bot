const axios = require('axios');

module.exports = {
  autoRead: true,
  react: "🕐",
  presence: "composing",
  onlyOwner: false,
  cmds: ["tiktok"],
  handle: async (ctx, m) => {
    const url = m.args && m.args[0];
    if (!url || !m.isLink) {
      return m.reply("Masukkan link TikTok yang valid.");
    }

    try {
      const response = await downloadTikTokVideo(url);
      if (!response.success) {
        throw new Error(response.error || "Gagal mengambil data video.");
      }

      const { title, hdplay } = response.data.data;
      const videoUrl = `https://tikwm.com/${hdplay}`;
      
      m.reply("*Berhasil!* Sedang mengirimkan video")
      ctx.sendMessage(m.id, {
        video: { url: videoUrl },
        caption: `*Judul:* ${title}`,
      });
    } catch (error) {
      console.error("Error:", error.message || error);
      m.reply("Gagal mengunduh video TikTok. Silakan coba lagi.");
    }
  },
};

async function downloadTikTokVideo(url) {
  try {
    const response = await axios.post(
      'https://www.tikwm.com/api/',
      new URLSearchParams({
        url,
        count: '12',
        cursor: '0',
        web: '1',
        hd: '1',
      }),
      {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
          Accept: 'application/json, text/javascript, */*; q=0.01',
          'X-Requested-With': 'XMLHttpRequest',
          'User-Agent':
            'Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Mobile Safari/537.36',
          Referer: 'https://www.tikwm.com/',
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