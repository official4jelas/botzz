const fetch = require('node-fetch');
const yts = require('yt-search');

let handler = async (m, { conn, text, usedPrefix, command }) => {
  if (!text) return m.reply(`Input salah\nContoh: ${usedPrefix + command} judul lagu`);

  try {
    m.reply('Sedang mencari audio...');

    const res = await yts(text);
    const video = res.videos[0];
    if (!video) throw 'Video tidak ditemukan';

    const videoUrl = video.url;
    const apiRes = await fetch(`https://api.vreden.web.id/api/ytmp3?url=${encodeURIComponent(videoUrl)}`);
    const data = await apiRes.json();

    if (!data.result || !data.result.download || !data.result.download.url) {
      throw 'Audio tidak ditemukan';
    }

    const { title, thumbnail, url } = data.result.metadata;
    const audioUrl = data.result.download.url;

    await conn.sendMessage(m.chat, {
      text: `乂 PLAY AUDIO\n\n📌 Judul: ${title}\n🎵 Kualitas: 128 kbps\n💾 Ukuran File: Tidak diketahui\nSedang mengirim file audio...`,
      contextInfo: {
        externalAdReply: {
          title: 'YouTube Play (Audio)',
          body: title,
          thumbnailUrl: thumbnail,
          sourceUrl: url,
        },
      },
    });

    await conn.sendFile(m.chat, audioUrl, `${title}.mp3`, null, m, false, { mimetype: 'audio/mpeg' });
  } catch (err) {
    m.reply(`Terjadi kesalahan: ${err}`);
  }
};

handler.help = ['play2 <query>'];
handler.tags = ['downloader'];
handler.command = ['play2'];
handler.register = true;

module.exports = handler;