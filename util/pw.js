const status = "AUTOMATIC";
const botName = "💎 Satoru Music";
const Text = "Taka.exe";
const version = "Latest@ v1.0"; 
const startTime = Date.now();

function printWatermark() {
  const uptimeInSeconds = ((Date.now() - startTime) / 1000).toFixed(2);

  console.log('\x1b[1m\x1b[36m╔════════════════════════════════════════════╗');
  console.log('\x1b[1m\x1b[36m║                                            ║');
  console.log(`\x1b[1m\x1b[36m            ${botName}     `);
  console.log(`\x1b[1m\x1b[36m            👑 Autorização: ${status}    `);
  console.log(`\x1b[1m\x1b[36m            💡 Versão: ${version}`);
  console.log(`\x1b[1m\x1b[36m            📅 Tempo de atividade: ${uptimeInSeconds}s`);
  console.log(`\x1b[1m\x1b[36m            🚀 Desenvolvido por ${Text}`);
  console.log('\x1b[1m\x1b[36m║                                            ║');
  console.log('\x1b[1m\x1b[36m╚════════════════════════════════════════════╝\x1b[0m');
}

module.exports = {
  printWatermark,
};
