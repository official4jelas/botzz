const axios = require("axios");
const handler = async (m, { conn, usedPrefix, command, text }) => {
    if (!text) 
        throw `Apa yang pengen kamu tanyain?\n\nContoh: ${usedPrefix + command} halo`;

    try {
        let d = new Date(); // Ambil waktu sekarang
        let locale = 'id'; // Lokasi di Indonesia
        const jam = d.toLocaleString("en-US", { timeZone: "Asia/Jakarta" }); // Sesuaikan jam dengan zona waktu Jakarta
        let hari = d.toLocaleDateString(locale, { weekday: 'long' }); // Ambil hari
        let tgl = d.toLocaleDateString(locale, {
            day: 'numeric',
            month: 'long',
            year: 'numeric'
        }); // Format tanggal

        let logic = `Nama kamu adalah botzz diciptakan si o, kamu dibuat dan dikembangkan oleh OpenAI. Pakailah bahasa gaul, seperti kata gw dan kamu dalam menjawab semua pertanyaan. Kamu cerdas dalam menangani masalah apapun. Selalu gunakan emoji yang sesuai dalam setiap kalimat. Gunakan tanggal ${tgl}. Gunakan jam ${jam}. Gunakan hari ${hari}.`; // Logika yang dipake

        let json = await openai(text, logic); // Panggil fungsi openai

        // Kirim pesan sesuai format yang diinginkan
        await conn.sendMessage(m.chat, {
            text: json, // Hasil dari AI
            // contextInfo dihapus
        }, { quoted: m }); // Mengutip pesan dari user
        
    } catch (e) {
        console.error(e); // Log error kalo ada
        throw `Maaf, ada yang salah! Coba lagi nanti. 😅`; // Pesan error yang lebih informatif
    }
};

handler.help = ["gpt2 <teks>", "gpt42"];
handler.tags = ["ai2"];
handler.command = /^(openai2|ai2)$/i;
handler.limit = true;

module.exports = handler; // Ekspor handler

const openai = async (text, logic) => { // Fungsi openai
    let response = await axios.post("https://chateverywhere.app/api/chat/", {
        "model": {
            "id": "gpt-4",
            "name": "GPT-4",
            "maxLength": 32000,  // Sesuaikan token limit
            "tokenLimit": 8000,  // Token limit untuk model GPT-4
            "completionTokenLimit": 5000,  // Sesuaikan jika perlu
            "deploymentName": "gpt-4"
        },
        "messages": [
            {
                "pluginId": null,
                "content": text, 
                "role": "user"
            }
        ],
        "prompt": logic, 
        "temperature": 0.5
    }, { 
        headers: {
            "Accept": "/*/",
            "User-Agent": "Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Mobile Safari/537.36"
        }
    });
    
    let result = response.data;
    return result;
};