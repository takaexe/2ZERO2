const { EmbedBuilder } = require('discord.js');


module.exports = {
  name: "comandos",
  description: "Obtenha informações sobre o bot",
  permissions: "0x0000000000000800",
  options: [],
  run: async (client, interaction) => {
    try {
     

      const embed = new EmbedBuilder()
         .setColor('#0099ff')
      .setTitle('💎 Comandos!')
      .setDescription('Bem-vindo ao Bot de Música!\n\n- Aqui estão os comandos disponíveis:\n\n' +
        '**/play :** Adicione suas músicas pesquisando pelo nome ou link da sua playlist(Spotify, Youtube, Soundcloud)\n' +
        '**/ping :** Verifique a latência do bot.\n' +
        '**/suporte :** Informações de suporte do bot(EM CONSTRUÇÃO)');

      return interaction.reply({ embeds: [embed] });
    } catch (e) {
    console.error(e); 
  }
  },
};
