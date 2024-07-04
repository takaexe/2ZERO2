const { EmbedBuilder } = require('discord.js');

module.exports = {
  name: "suporte",
  description: "Obtenha o link do servidor de suporte",
  permissions: "0x0000000000000800",
  options: [],
  run: async (client, interaction) => {
    try {

      const supportServerLink = "https://discord.gg/";
      const instagramLink = "https://www.instagram.com/Taka.exe";
        const embed = new EmbedBuilder()
            .setColor('#b300ff')
            .setAuthor({
              name: 'Suporte bot',
              iconURL: 'https://cdn.discordapp.com/attachments/1230824451990622299/1230824519220985896/6280-2.gif?ex=6638ae28&is=66375ca8&hm=13e4a1b91a95b2934a39de1876e66c11711c7b30ac1a91c2a158f2f2ed1c2fc6&', 
              url: 'https://www.instagram.com/Taka.exe/'
          })
            .setDescription(`➡️ **Discord!**\n- Discord ( Em construção ) -${supportServerLink}\n\n➡️ **Me siga:**\n- Instagram -${instagramLink}`)
            .setImage('https://media.discordapp.net/attachments/1067224490225959032/1256707652013129888/2560x1440-cyberpunk-1gsxtwvkfayit9el.png?ex=6681bfb4&is=66806e34&hm=e92fa220ead6d9f77153da7de0b0c9d5f9d789adc0c31d168b679801558a829f&=&format=webp&quality=lossless')
            .setTimestamp();

      return interaction.reply({ embeds: [embed] });
    } catch (e) {
    console.error(e); 
  }
  },
};
 
