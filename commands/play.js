const { Riffy } = require("riffy");
const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require("discord.js");
const { queueNames } = require("./commands/play");

function initializePlayer(client) {
    const nodes = [
        {
            host: "lava-v3.ajieblogs.eu.org",
            port: 443,
            password: "https://dsc.gg/ajidevserver",
            secure: true
        },
    ];

    client.riffy = new Riffy(client, nodes, {
        send: (payload) => {
            const guildId = payload.d.guild_id;
            if (!guildId) return;

            const guild = client.guilds.cache.get(guildId);
            if (guild) guild.shard.send(payload);
        },
        defaultSearchPlatform: "ytmsearch",
        restVersion: "v3"
    });

    client.riffy.on("nodeConnect", node => {
        console.log(`Nó "${node.name}" conectado.`);
    });

    client.riffy.on("nodeError", (node, error) => {
        console.error(`Nó "${node.name}" encontrou um erro: ${error.message}.`);
    });

    client.riffy.on("trackStart", async (player, track) => {
        const channel = client.channels.cache.get(player.textChannel);

        const embed = new EmbedBuilder()
            .setColor("#0099ff")
            .setAuthor({
                name: 'Tocando agora',
                iconURL: 'https://cdn.discordapp.com/attachments/1230824451990622299/1236664581364125787/music-play.gif'
            })
            .setDescription(`➡️ **Nome da música:** [${track.info.title}](${track.info.uri})\n➡️ **Autor:** ${track.info.author}\n➡️ **Plataformas :** YouTube, Spotify, SoundCloud`)
            .setImage(`https://cdn.discordapp.com/attachments/1004341381784944703/1165201249331855380/RainbowLine.gif`)
            .setThumbnail(track.info.thumbnail)
            .setTimestamp()
            .setFooter({ text: 'Clique nos botões abaixo para controlar a reprodução!' });

        const pauseButton = new ButtonBuilder()
            .setCustomId("pauseTrack")
            .setLabel("Pausar")
            .setStyle(ButtonStyle.Primary)
            .setEmoji('⏸️');

        const skipButton = new ButtonBuilder()
            .setCustomId("skipTrack")
            .setLabel("Pular")
            .setStyle(ButtonStyle.Success);

        const showQueueButton = new ButtonBuilder()
            .setCustomId("showQueue")
            .setLabel("Mostrar lista de reprodução")
            .setStyle(ButtonStyle.Primary);

        const clearQueueButton = new ButtonBuilder()
            .setCustomId("clearQueue")
            .setLabel("Limpar lista de reprodução")
            .setStyle(ButtonStyle.Danger);

        const actionRow = new ActionRowBuilder()
            .addComponents(pauseButton, skipButton, showQueueButton, clearQueueButton);

        const message = await channel.send({ embeds: [embed], components: [actionRow] });

        const filter = i => i.customId === 'pauseTrack' || i.customId === 'skipTrack' || i.customId === 'showQueue' || i.customId === 'clearQueue';
        const collector = message.createMessageComponentCollector({ filter, time: 180000 });

        setTimeout(() => {
            const disabledRow = new ActionRowBuilder()
                .addComponents(
                    pauseButton.setDisabled(true),
                    skipButton.setDisabled(true),
                    showQueueButton.setDisabled(true),
                    clearQueueButton.setDisabled(true)
                );

            message.edit({ components: [disabledRow] })
                .catch(console.error);
        }, 180000);

        collector.on('collect', async i => {
            await i.deferUpdate();

            if (i.customId === 'pauseTrack') {
                if (player.paused) {
                    player.pause(false);
                    const playEmbed = new EmbedBuilder()
                        .setColor("#00FF00")
                        .setAuthor({
                            name: 'Música reproduzida',
                            iconURL: 'https://cdn.discordapp.com/attachments/1230824451990622299/1236664581364125787/music-play.gif'
                        })
                        .setTitle("**A música está sendo reproduzida!**");

                    await channel.send({ embeds: [playEmbed] });

                } else {
                    player.pause(true);
                    const pauseEmbed = new EmbedBuilder()
                        .setColor("#FFA500")
                        .setAuthor({
                            name: 'Música pausada',
                            iconURL: 'https://cdn.discordapp.com/attachments/1230824451990622299/1236802049190920202/4104-verify-red.gif'
                        })
                        .setTitle("**A música está pausada!**");

                    await channel.send({ embeds: [pauseEmbed] });
                }

            } else if (i.customId === 'skipTrack') {
                player.stop();
                const skipEmbed = new EmbedBuilder()
                    .setColor('#3498db')
                    .setAuthor({
                        name: 'Música pulada...',
                        iconURL: 'https://cdn.discordapp.com/attachments/1156866389819281418/1157269773118357604/giphy.gif'
                    })
                    .setTitle("**O bot vai tocar a próxima música!**")
                    .setTimestamp();

                await channel.send({ embeds: [skipEmbed] });

            } else if (i.customId === 'showQueue') {
                const queueEmbed = new EmbedBuilder()
                    .setColor("#0099ff")
                    .setAuthor({
                        name: 'Lista de reprodução',
                        iconURL: 'https://cdn.discordapp.com/attachments/1230824451990622299/1230836684774576168/7762-verified-blue.gif'
                    })
                    .setDescription(`Lista de Reprodução Atual:\n${queueNames.map((name, index) => `**${index + 1}.** ${name}`).join('\n')}`);

                await channel.send({ embeds: [queueEmbed] });

            } else if (i.customId === 'clearQueue') {
                clearQueue(player);
                const queueEmbed = new EmbedBuilder()
                    .setColor("#0099ff")
                    .setAuthor({
                        name: 'Lista de reprodução está Limpa',
                        iconURL: 'https://cdn.discordapp.com/attachments/1230824451990622299/1230836684774576168/7762-verified-blue.gif'
                    })
                    .setDescription('**A lista de reprodução foi limpa com sucesso!**');

                await channel.send({ embeds: [queueEmbed] });
            }
        });

        collector.on('end', collected => {
            console.log(`Foram coletadas ${collected.size} interações.`);
        });
    });

    client.riffy.on("queueEnd", async (player) => {
        const channel = client.channels.cache.get(player.textChannel);
        const autoplay = false;

        if (autoplay) {
            player.autoplay(player);
        } else {
            player.destroy();
            const queueEmbed = new EmbedBuilder()
                .setColor("#0099ff")
                .setDescription('**Acabou as músicas! Desconectando o bot...**');

            await channel.send({ embeds: [queueEmbed] });
        }
    });

    async function play(client, interaction) {
        try {
            const voiceChannel = interaction.member.voice.channel;

            if (!voiceChannel) {
                const errorEmbed = new EmbedBuilder()
                    .setColor('#ff0000')
                    .setTitle('Erro')
                    .setDescription('Você precisa estar em um canal de voz para poder reproduzir música.');

                await interaction.reply({ embeds: [errorEmbed] });
                return;
            }

            const query = interaction.options.getString('name');

            const player = client.riffy.createConnection({
                guildId: interaction.guildId,
                voiceChannel: voiceChannel.id,
                textChannel: interaction.channelId,
                deaf: true
            });

            await interaction.deferReply();

            // Try resolving the query and log the entire response for debugging
            const resolve = await client.riffy.resolve({ query: query, requester: interaction.user });
            console.log('Resolve response:', resolve);

            // Ensure the response structure is as expected
            if (!resolve || typeof resolve !== 'object') {
                throw new TypeError('Resolve response is not an object');
            }

            const { loadType, tracks, playlistInfo } = resolve;

            if (!Array.isArray(tracks)) {
                console.error('Expected tracks to be an array:', tracks);
                throw new TypeError('Expected tracks to be an array');
            }

            if (loadType === 'PLAYLIST_LOADED') {
                for (const track of tracks) {
                    track.info.requester = interaction.user;
                    player.queue.add(track);
                    queueNames.push(track.info.title);
                }

                if (!player.playing && !player.paused) player.play();

            } else if (loadType === 'SEARCH_RESULT' || loadType === 'TRACK_LOADED') {
                const track = tracks.shift();
                track.info.requester = interaction.user;

                player.queue.add(track);
                queueNames.push(track.info.title);

                if (!player.playing && !player.paused) player.play();
            } else {
                const errorEmbed = new EmbedBuilder()
                    .setColor('#ff0000')
                    .setTitle('Erro')
                    .setDescription('Não foram encontrados resultados.');

                await interaction.editReply({ embeds: [errorEmbed] });
                return;
            }

            await new Promise(resolve => setTimeout(resolve, 500));

            const embeds = [
                new EmbedBuilder()
                    .setColor('#4d9fd6')
                    .setAuthor({
                        name: 'Música adicionada!',
                        iconURL: 'https://cdn.discordapp.com/attachments/1230824451990622299/1236794583732457473/7828-verify-ak.gif',
                        url: 'https://instagram.com/taka.exe'
                    })
                    .setDescription('➡️ **Sua música foi adicionada com sucesso.**\n➡️** Use os botões para controlar a fila**'),

                new EmbedBuilder()
                    .setColor('#ffea00')
                    .setAuthor({
                        name: 'Música adicionada!',
                        iconURL: 'https://cdn.discordapp.com/attachments/1230824451990622299/1236802032938127470/4104-verify-yellow.gif',
                        url: 'https://instagram.com/taka.exe'
                    })
                    .setDescription('➡️ **Sua música foi adicionada com sucesso.**\n➡️** Use os botões para controlar a fila**'),

                new EmbedBuilder()
                    .setColor('#FF0000')
                    .setAuthor({
                        name: 'Música adicionada!',
                        iconURL: 'https://cdn.discordapp.com/attachments/1230824451990622299/1236802049190920202/4104-verify-red.gif',
                        url: 'https://instagram.com/taka.exe'
                    })
                    .setDescription('➡️ **Sua música foi adicionada com sucesso.**\n➡️** Use os botões para controlar a fila**')
            ];

            const randomIndex = Math.floor(Math.random() * embeds.length);
            await interaction.followUp({ embeds: [embeds[randomIndex]] });

        } catch (error) {
            console.error('Erro ao processar o comando play:', error);
            const errorEmbed = new EmbedBuilder()
                .setColor('#ff0000')
                .setTitle('Erro')
                .setDescription('Um erro ocorreu durante o processamento do seu pedido.');

            await interaction.editReply({ embeds: [errorEmbed] });
        }
    }

    return { play };
}

module.exports = { initializePlayer };
