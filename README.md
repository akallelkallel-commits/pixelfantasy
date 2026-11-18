# Pixel Fantasy com multiplayer

Nesta pasta tem tudo para rodar o jogo num servidor e jogar junto com outra pessoa:

* `server.js`: o servidor. Ele entrega o jogo e repassa as mensagens entre os jogadores da mesma sala.
* `package.json`: a lista do que o servidor precisa (só o pacote `ws`).
* `public/index.html`: o jogo.

## Testar no seu computador

1. Instale o Node.js versão 18 ou mais nova (nodejs.org).
2. Abra o terminal dentro desta pasta e rode `npm install`
3. Rode `npm start`
4. Abra `http://localhost:3000` no navegador.
5. Se o seu irmão estiver na mesma rede de casa, ele abre `http://IP_DO_SEU_PC:3000` (o IP do seu computador na rede, algo como 192.168.0.10).

## Colocar na internet (Render, tem plano grátis)

1. Suba esta pasta para um repositório no GitHub.
2. No render.com, clique em New e escolha Web Service.
3. Conecte o repositório. Build Command: `npm install`. Start Command: `npm start`.
4. No fim o Render te dá um endereço, tipo `https://pixelbox.onrender.com`. Esse é o jogo, é só mandar o link para o seu irmão.

No plano grátis o servidor dorme quando fica parado e leva uns 50 segundos para acordar na primeira visita.

Também roda em qualquer VPS: instale o Node.js, copie a pasta, rode `npm install` e `npm start` (de preferência com o pm2 para ficar ligado sempre) e libere a porta 3000, ou coloque atrás de um proxy com HTTPS.

## Como jogar juntos

1. Quem tem o mundo abre o site, entra em Um jogador, escolhe o mundo e clica em Abrir para amigo. O código da sala aparece no canto, junto do relógio.
2. O outro abre o mesmo site, clica em Jogar com amigo, coloca o nome, o código da sala e o visual, e clica em Entrar.
3. O mundo fica salvo no navegador de quem abriu. O que o convidado pega fica salvo no navegador dele, para a próxima vez que ele entrar naquele mundo.

## O que já é compartilhado

* Vocês se veem com nome em cima, skin, armadura, cavalo, barco, nadando e voando.
* Tudo que um constrói, quebra, planta ou larga no chão aparece para o outro.
* Os bichos são os mesmos para os dois e perseguem quem estiver mais perto. O que cai de um bicho vai para quem deu o golpe final.
* Dia, noite, Lua de Sangue e Tempestade acontecem juntos.
* Baús: o conteúdo é enviado quando alguém fecha o baú.

## O que ainda não é compartilhado

* Os chefes aparecem pela posição de quem abriu o mundo. Para lutar juntos, vão os dois até lá.
* Relíquias e chefes derrotados contam para o mundo de quem abriu.
* Quando um está na caverna e o outro na superfície (ou longe um do outro), cada um vê os próprios bichos.

## Atualizar o jogo

Quando sair uma versão nova, é só trocar o `public/index.html` e subir de novo.
