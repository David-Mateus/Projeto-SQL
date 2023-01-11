(function () {
  var socket = document.createElement('script')
  var script = document.createElement('script')
  socket.setAttribute('src', 'http://127.0.0.1:1337/socket.io/socket.io.js')
  script.type = 'text/javascript'

  socket.onload = function () {
    document.head.appendChild(script)
  }
  script.text = ['window.socket = io("http://127.0.0.1:1337");',
  'socket.on("bundle", function() {',
  'console.log("livereaload triggered")',
  'window.location.reload();});'].join('\n')
  document.head.appendChild(socket)
}());
(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
const setup = require("./setup-v3");
const { options, createObjects } = require("./objects");
const texts = require("./texts");

const {
  randomNumber,
  randomFloatNumber,
  configureObject,
  configureObject2,
  size,
  position,
  moveSize,
  removeFunction,
  addFunction,
  formatObject,
  initial,
  removeContainer,
  moveSize2,
} = require("./functions");

//MAIN
(function main() {
  setup(options, (app, resources) => {
    /* MAIN TIMELINE */
    const mainTimeline = () => {
      const timeline = gsap.timeline();
      // timeline.add(intro(app, resources));
      timeline.add(footer(app, resources, texts));
      timeline.add(initialPosition());

      return timeline;
    };

    /* CREATE ITEMS SCOPE */
    const allObjects = createObjects(app, resources);

    // Desestruturação dos objetos criados no (objects.js)
    const {
      persona,
      persona2,
      sieve_75,
      shell,
      arrayCements,
      surface,
      brush,
      flannel,
      flannel_part1,
      flannel_part2,
      becker,
      topSieve,
      bottonSieve,
      stick,
      cartesiano,
      button,
      TextBalance,
      balance,
      invisibleBlock,
      invisibleBlock2,
      arryGrainsBrush,
      arryGrainsBrush2,
      arryGrainsBrush3,
      arryGrainsFlannel,
      arryGrainsFlannel2,
      arryGrainsFlannel3,
      buttonMenuItens,
      backgroudMenuItens,
      containerMenuItens,
      containerMenuCements,
      bottonMenuCements,
      backgroudMenuCements,
      lens1,
      timer,
      cover,
      containerBalance,
      containerGrainBrush,
      containerGrainFlannel,
      containerScreening,
      tableProfile1,
      grains,
      textBar,
      textBarClear,
      containerCementForBecker,
      maskCement,
      cementContainer,
      colorProgressBar,
      becker_part1,
      becker_part2,
      surface2,
      TextChronometer,
      textTimer,
      textBrush,
      textFlannel,
      textBecker,
      textStick,
      textLens1,
      textCover,
      textTopSieve,
      textBottonSieve,
      textCement_V,
      textCement_IV,
      textCement_CPIIZ,
      textCement_III,
      textCement_CPIIF,
      textCement_CPIIE,
      textCement_CPI,
      textSieve75,
      textSieve50,
      textSieve150,
      textSieve300,
      textSieve600,
      checkStick,
      checkBrush,
      checkflannel,
      okCheck0,
      okCheck1,
      okCheck2,
      arrayGrains1,
      arrayGrains2,
      arrayGrains3,
      containerGrains1,
      staticBotton,
      buttonReload,
      textButtonReload,
      backgroudButtonReload,
      tack1,

      //Textos dos valores pesados
      textValueLens,
      textValueBecker,
      containerTextValuesItens,
    } = allObjects;

    // teste de inserção de dialogo.
    persona.addDialog(
      "Olá, iremos realiza o ensaio de Índice de Finura do Cimento Portland por meio da peneira 75µm conforme determinações da NBR 11579:2012 e verificar o atendimento a NBR 16697:2018 que trata dos Requisitos do Cimento Portland.\n\nNo lado esquerdo, abra o depósito e escolha o cimento a ser ensaiado. Arrastando o cimento para a bancada."
    );

    // controladores de camadas de grãos
    let flagGrains1 = true;
    let flagGrains2 = false;
    let flagGrains3 = false;
    //-----------------------------------
    // diminui o alpha dos grãos a mendida que são peneirados.
    const screeningAlpha = (cont) => {
      if (flagGrains1) {
        arrayGrains1.forEach((object) => {
          object.alpha -= 0.025;
        });
        arryGrainsBrush.forEach((object) => {
          object.alpha += 0.025;
        });
        arryGrainsFlannel.forEach((object) => {
          object.alpha += 0.025;
        });

        //controlador, ao chegar no final da peneiragem irá sumer a próxima camada de grãos
        if (cont === 40) {
          flagGrains1 = false;
          flagGrains2 = true;
        }
      } else if (flagGrains2) {
        arrayGrains2.forEach((object) => {
          object.alpha -= 0.025;
        });
        arryGrainsBrush2.forEach((object) => {
          object.alpha += 0.025;
        });
        arryGrainsFlannel2.forEach((object) => {
          object.alpha += 0.025;
        });

        if (cont === 40) {
          flagGrains2 = false;
          flagGrains3 = true;
        }
      } else if (flagGrains3) {
        arrayGrains3.forEach((object) => {
          object.alpha -= 0.025;
        });
        arryGrainsBrush3.forEach((object) => {
          object.alpha += 0.025;
        });
        arryGrainsFlannel3.forEach((object) => {
          object.alpha += 0.025;
        });
      }
    };
    //-------------------------------------------------------------------------------
    //-------------------------------------------------------------------------------

    // função responsavel por receber imputs contadores e acrescentar visualmente na barrade progresso
    const progressBar = {
      start(cont) {
        const time = gsap.timeline();

        let executions = 1; // Alterar!!!
        if (cont <= 40) {
          // Adiciona 12pixis a cada volta regulando o x da barra de progresso para não sair do eixo.
          colorProgressBar.width = colorProgressBar.width + 10;
          colorProgressBar.x = colorProgressBar.x + 5;

          //ajusta o texto da em percentual da barra de progresso
          textBar.text = `${cont * 2.5}%`;

          //se esta forma suprir, criar funcoes separadas para cada tempo do cronometro e utiliza-las no momento adequado de cada peneragem
          if (executions === 1) {
            TextChronometer.text = `0${(cont * 0.12 + 0.2).toFixed(2)}`;
          } else if (executions === 2) {
            TextChronometer.text = `0${(cont * 0.5).toFixed(2)}`;
          } else if (executions === 3) {
            TextChronometer.text = `0${(cont * 0.005 + 0.39).toFixed(2)} seg`;
          }

          if (cont === 40) {
            const time = gsap.timeline();
            textBarClear.text = `PENEIRAMENTO DE ELIMINAÇÃO DE FINOS CONCLUÍDO`;

            if (control === 1) {
              persona2.addDialog("Na caixa de ferramentas, busque a tampa.");
            } else if (control === 2) {
              persona2.addDialog("Toque na tampa  para levantar o conjunto.");
            } else if (control === 3) {
              persona2.addDialog("Toque na tampa para levantar o conjunto.");
            }
          }

          executions += 1;
        }
      },
      // volta a barra de progresso para o valor inicial
      reset() {
        const time = gsap.timeline();
        time.to(colorProgressBar, { width: 14, x: 1007 });
        textBar.text = `${00}%`;
        textBarClear.text = ``;
        TextChronometer.text = "00:00";
      },
    };

    becker.interactive = true;
    becker.buttonMode = true;
    becker
      .on("pointerdown", onDragBeckerStart)
      .on("pointerup", onDragBeckerEnd)
      .on("pointerupoutside", onDragBeckerEnd)
      .on("pointermove", onDragBeckerMove);

    function onDragBeckerStart(event) {
      this.data = event.data;
      this.dragging = true;
    }

    function onDragBeckerEnd() {
      this.dragging = false;
      this.data = null;

      const time = gsap.timeline();
      if (checkArea(this, surface) && this.flagUnic) {
        this.flagUnic = false;

        setTimeout(() => {
          lens1.interactive = true;
        }, 10000);

        // retraí a bandeja de itens
        fuctionMenuItens();

        this.interactive = false;
        removeContainer(app, containerMenuItens, this);
        time.to(this, { x: 620, y: 370, duration: 2 });
        animationCementInBecker(cementId);
        this.interactive = false;

        arrayCements.forEach((object) => {
          if (object.id === cementId) object.interactive = false;
        });
      } else if (!checkArea(this, surface)) {
        time.to(becker, { x: 640, y: 240 });
      }

      // Verificação final do becker com os valores dos passantes na peneira
      if (lens1.flag) {
        if (checkArea(this, invisibleBlock)) {
          lens1.flagScale = false;
          value = becker.value;

          gsap.to(lens1, { pixi: { x: 105, y: 390 } });
          gsap.to(this, { x: 200, y: 315 });

          TextBalance.text = `0${value}:00`;
          textValueBecker.text = `Becker: 0${value}:00`;

          removeContainer(app, containerMenuItens, becker);
          removeContainer(app, containerMenuItens, lens1);
        }
      }
    }

    function onDragBeckerMove() {
      if (this.dragging) {
        const newPosition = this.data.getLocalPosition(this.parent);
        this.x = newPosition.x;
        this.y = newPosition.y;
      }
    }

    const valueResultScreening = () => {
      lens1.flagScale = true;
      let value = 0;
      arrayCements.forEach((object) => {
        if (object.id === cementId) {
          value = object.value;
        }
      });

      becker.interactive = true;
      becker.buttonMode = true;

      TextBalance.text = `00:${value}`;
      textValueLens.text = `Vidro relógio: 00:${value}`;
    };

    lens1
      .on("pointerdown", onDragLensStart)
      .on("pointerup", onDragLensEnd)
      .on("pointerupoutside", onDragLensEnd)
      .on("pointermove", onDragLensMove);

    function onDragLensStart(event) {
      this.data = event.data;
      this.dragging = true;
    }

    lens1.flagScale = true;
    let flagInSieve = true;
    let testeflegOne = true;
    function onDragLensEnd() {
      this.dragging = false;
      this.data = null;

      const time = gsap.timeline();

      //usar no objeto que for mover para pesagem na balança
      if (checkArea(invisibleBlock, this) && lens1.flagScale) {
        time.to(this, { x: 200, y: 330 });

        // fecha a bandeja de itens
        fuctionMenuItens();
        // Remove o item do container e adiciona novamente ao app
        if (testeflegOne) {
          removeContainer(app, containerMenuItens, this);
          testeflegOne = false;
        }

        if (lens1.flag) {
          return valueResultScreening();
        }

        setTimeout(() => {
          becker_part2.texture = resources.becker_frame2.texture;
        }, 4700);

        setTimeout(() => {
          becker_part2.texture = resources.becker_frame1.texture;
        }, 5400);

        setTimeout(() => {
          becker_part2.texture = resources.becker_part2.texture;
        }, 6500);

        this.interactive = false;
        efectDownGrains();
        setTimeout(() => {
          this.texture = resources.lens2.texture;
          TextBalance.text = "00:70";
        }, 4700);
        setTimeout(() => {
          this.texture = resources.lens3.texture;
          TextBalance.text = "03:05";
        }, 5700);
        setTimeout(() => {
          this.texture = resources.lens4.texture;
          TextBalance.text = "25:45";
        }, 6700);
        setTimeout(() => {
          TextBalance.text = "50:00";
          this.interactive = true;

          persona.addDialog(
            "Retire o material da balança, leve para a peneira."
          );
        }, 6800);

        lens1.flagScale = false;
      } else {
        if (checkArea(this, invisibleBlock2) && flagInSieve) {
          setTimeout(() => {
            fuctionMenuItens();
          }, 4000);
          setTimeout(() => {
            fuctionMenuItens();
          }, 8000);

          flagInSieve = false;

          TextBalance.text = "00:00";

          time.to(this, { x: 340, y: 260 });
          time.to(this, { angle: 140 });

          grains.restart();
          const newOptions = {
            x: 345,
            y: 271,
            finalY: 335,
            visibleStart: false,
            widthStart: 20,
            widthEnd: 10,
          };
          grains.update(newOptions);
          grains.use();

          setTimeout(() => {
            lens1.texture = resources.lens3.texture;
          }, 2000);

          setTimeout(() => {
            lens1.texture = resources.lens2.texture;
          }, 2500);

          setTimeout(() => {
            lens1.texture = resources.lens1.texture;

            persona.addDialog(
              "Clique no botão superior esquerdo para ir na área de peneiramento."
            );
          }, 3000);

          time.to(this, { angle: 0, delay: 3.5 });
          setTimeout(() => {
            containerMenuItens.addChild(this);
            containerMenuItens.addChild(becker);

            time.to(becker, { x: 640, y: 240 });
            time.to(this, { x: 640, y: 360 });
          }, 6000);

          lens1.interactive = false;

          setTimeout(() => {
            button.interactive = true;
            button.buttonMode = true;
            button.visible = true;
            time.to(button, { alpha: 1 });
          }, 11000);
        } else {
          time.to(this, { x: 640, y: 360 });
          TextBalance.text = "00:00";

          // Adiciona novamente o item ao container
          if (!testeflegOne) {
            containerMenuItens.addChild(this);
            testeflegOne = true;
          }
        }
      }

      return time;
    }

    function onDragLensMove() {
      if (this.dragging) {
        const newPosition = this.data.getLocalPosition(this.parent);
        this.x = newPosition.x;
        this.y = newPosition.y;
      }
    }

    //--------------------------------------------------------------
    //      Função para abrir e fechar menu de seleção de itens
    //--------------------------------------------------------------
    let FlagMenu = true;
    const fuctionMenuItens = () => {
      const time = gsap.timeline();
      FlagMenu = !FlagMenu;
      if (FlagMenu) {
        // menu itens fechado
        time.to(containerMenuItens, { x: containerMenuItens.x + 270 });
      } else {
        // menu itens aberto
        if (buttonMenuItens.x >= 270) {
          time.to(containerMenuItens, { x: containerMenuItens.x - 270 });
        } else {
          time.to(containerMenuItens, { x: 0 });
        }
      }
    };
    buttonMenuItens.on("pointerdown", fuctionMenuItens);
    //--------------------------------------------------------------

    //--------------------------------------------------------------
    //              Função da aba de cimento
    //--------------------------------------------------------------
    let FlagMenuCement = true;
    const fuctionMenuCements = () => {
      const time = gsap.timeline();
      FlagMenuCement = !FlagMenuCement;
      if (FlagMenuCement) {
        // menu itens fechado
        time.to(containerMenuCements, { x: containerMenuCements.x - 270 });
      } else {
        // menu itens aberto
        if (buttonMenuItens.x <= 270) {
          time.to(containerMenuCements, { x: containerMenuCements.x + 270 });
        } else {
          time.to(containerMenuCements, { x: 0 });
        }
      }
    };
    bottonMenuCements.on("pointerdown", fuctionMenuCements);
    //--------------------------------------------------------------
    //--------------------------------------------------------------

    sieve_75
      .on("pointerdown", sieveCementDragStart)
      .on("pointerup", sieveCementDragEnd)
      .on("pointerupoutside", sieveCementDragEnd)
      .on("pointermove", sieveCementDragMove);

    arrayCements.forEach((object) => {
      object
        .on("pointerdown", sieveCementDragStart)
        .on("pointerup", sieveCementDragEnd)
        .on("pointerupoutside", sieveCementDragEnd)
        .on("pointermove", sieveCementDragMove);
    });

    // initial position, first timeline.
    function initialPosition() {
      const initial = gsap.timeline({
        delay: 1,
      });

      initial.to(cartesiano, { x: 400, y: 300, duration: 1 });
      initial.to(button, { x: 40, duration: 1 });
      /* initial position code */
      return initial;
    }

    //função para chegar se dois objetos estão na mesma área (pixel)
    function checkArea(object1, object2) {
      const bounds1 = object1.getBounds();
      const bounds2 = object2.getBounds();

      return (
        bounds1.x < bounds2.x + bounds2.width &&
        bounds1.x + bounds1.width > bounds2.x &&
        bounds1.y < bounds2.y + bounds2.height &&
        bounds1.y + bounds1.height > bounds2.y
      );
    }

    //mover o objeto, se objeto na mesma posicao da balança >
    //se true, ativar a funcao random mostram outros valores
    let flagButton = false;
    const onStep1 = () => {
      persona2.addDialog(
        "Chegamos na fase de ELIMINAÇÃO DOS FINOS que é nosso primeiro peneiramento. \nBusque o cronometro na caixa de ferramentas."
      );

      flagButton = !flagButton;
      const time = gsap.timeline();
      if (flagButton) {
        time.to(cartesiano, { x: 1200, y: 300, duration: 1 }, 0);
        time.to(
          containerMenuItens,
          { x: containerMenuItens.x + 800, duration: 1 },
          0
        );
        time.to(button, { x: 840, duration: 1, visible: false }, 1);

        time.to(app.stage, { x: -800, y: 0, duration: 1 }, 0);
      } else {
        time.to(cartesiano, { x: 400, y: 300, duration: 1 }, 0);
        time.to(
          containerMenuItens,
          { x: containerMenuItens.x - 800, duration: 1 },
          0
        );
        time.to(button, { x: 40, duration: 1, visible: false }, 1);

        time.to(app.stage, { x: 0, y: 0, duration: 1 }, 0);
      }

      timer.interactive = true;
      button.alpha = 0;
      button.width = -90;

      return time;
    };
    button.on("pointerdown", onStep1);

    //----------------------------------------------------------------------------------------//
    //                 POSICIONA O OBJETO AO CLICAR NELA NO MENU DE ITENS
    //----------------------------------------------------------------------------------------//

    containerScreening.addChild(
      bottonSieve,
      containerGrainFlannel,
      containerGrainBrush,
      topSieve,
      containerGrains1
    );
    arryGrainsBrush.forEach((object) => {
      object.visible = true;
    });
    arryGrainsFlannel.forEach((object) => {
      object.visible = true;
    });

    const positionTimer = () => {
      persona2.addDialog(
        "Com o cursor agite manualmente o conjunto de peneira para um lado e para o outro até chegar em 100%.",
        20
      );

      const time = gsap.timeline();
      textTimer.visible = false;

      fuctionMenuItens();
      containerScreening.interactive = true;

      timer.x = 740 + 800;
      TextChronometer.x = 720 + 800;
      time.to(timer, { pixi: { x: 920, y: 130, scale: 0.6 } }, 0);
      time.to(TextChronometer, { pixi: { x: 920, y: 103, scale: 1 } }, 0);

      TextChronometer.interactive = false;
      timer.interactive = false;
      removeContainer(app, containerMenuItens, timer);
      removeContainer(app, containerMenuItens, TextChronometer);
      app.stage.addChild(timer);
      app.stage.addChild(TextChronometer);
    };
    timer.on("pointerdown", positionTimer);

    let flagCover = false;
    cover.flag = true;
    const positionCover = () => {
      flagCover = !flagCover;
      const time = gsap.timeline();

      if (flagCover) {
        persona2.addDialog(
          "Use o bastão (caixa de ferramentas), bata 3 vezes na lateral do conjunto. "
        );

        setTimeout(() => {
          time.to(cover, { y: cover.y - 20, duration: 2 }, 0);
          time.to(topSieve, { y: topSieve.y - 20, duration: 2 }, 0);
          time.to(
            containerGrains1,
            { y: containerGrains1.y - 20, duration: 2 },
            0
          );
          time.to(checkStick, { alpha: 1 });
          stick.interactive = true;
        }, 2000);

        if (cover.flag) {
          cover.x = 750 + 800;
          time.to(cover, { pixi: { x: 1135, y: 285, scale: 1.2 } });

          // removendo do container
          fuctionMenuItens();
          cover.interactive = false;
          removeContainer(app, containerMenuItens, cover);
          containerScreening.addChild(cover);
        }
      } else {
        persona2.removeDialog();

        if (cover.flag) {
          //Adicionando ao container com efeito de balanço
          removeContainer(app, containerScreening, cover);
          containerMenuItens.addChild(cover);
          time.to(
            cover,
            { pixi: { x: 750, y: 480, scale: 0.35, duration: 1 } },
            0
          );
        } else {
          time.to(cover, { pixi: { y: 285 } }, 1);
          time.to(cover, { pixi: { x: 1133 } }, 2);
        }

        time.to(topSieve, { pixi: { y: 300 } }, 1);
        time.to(containerGrains1, { pixi: { y: 250 } }, 1);
        time.to(topSieve, { pixi: { x: 1133 } }, 2);
        time.to(containerGrains1, { pixi: { x: 1070 } }, 2);

        time.to(checkflannel, { alpha: 0 }, 3);
        time.to(okCheck2, { alpha: 0 }, 3);
        time.to(checkBrush, { alpha: 0 }, 4);
        time.to(okCheck1, { alpha: 0 }, 4);
        time.to(checkStick, { alpha: 0 }, 5);
        time.to(okCheck0, { alpha: 0 }, 5);
        progressBar.reset();

        screeningCont = 0;
        containerScreening.interactive = true;
        cover.interactive = false;
      }
    };
    cover.on("pointerdown", positionCover);

    // Adiciona mobilida no eixo X ao container.
    containerScreening
      .on("pointerdown", onDragContainerScreeningStart)
      .on("pointerup", onDragContainerScreeningEnd)
      .on("pointerupoutside", onDragContainerScreeningEnd)
      .on("pointermove", onDragContainerScreeningMove);

    function onDragContainerScreeningStart(event) {
      this.data = event.data;
      this.dragging = true;
    }

    function onDragContainerScreeningEnd() {
      this.dragging = false;
      this.data = null;
    }

    let screeningCont = 0;
    let leftTest = true;
    let centerTest = true;
    let rightTest = true;
    function onDragContainerScreeningMove() {
      if (this.dragging) {
        const newPosition = this.data.getLocalPosition(tableProfile1);

        if (newPosition.x > 150 && newPosition.x < 300) {
          this.x = newPosition.x - 240;

          // verifica de o container bateu na esquerda atribuido apenas uma vez ao contador
          if (newPosition.x > 140 && newPosition.x < 160) {
            if (leftTest) {
              leftTest = !leftTest;
              centerTest = true;

              screeningCont++;
              progressBar.start(screeningCont);
              screeningAlpha(screeningCont);
            }
          }

          // libera novamente a atribuição ao contador, quando o container se encontra na estremidade
          if (newPosition.x < 235 && newPosition.x > 215) {
            if (centerTest) {
              centerTest = !centerTest;

              leftTest = true;
              rightTest = true;
            }
          }

          // verifica de o container bateu na direita atribuido apenas uma vez ao contador
          if (newPosition.x > 290 && newPosition.x < 310) {
            if (rightTest) {
              rightTest = !rightTest;
              centerTest = true;

              screeningCont++;
              progressBar.start(screeningCont);
              screeningAlpha(screeningCont);
            }
          }

          if (screeningCont === 40) {
            const time = gsap.timeline();
            time.to(containerScreening, { x: 0 });
            this.interactive = false;
            topSieve.interactive = true;
            cover.interactive = true;

            // contador recebe o valor 0 para que possa ser chamado novamente e reutilizado
            screeningCont = 0;
          }
        }
      }
    }

    //----------------------------------------------------------------------------------------//
    //----------------------------------------------------------------------------------------//
    //----------------------------------------------------------------------------------------//

    function sieveCementDragStart(event) {
      this.data = event.data;
      this.alpha = 0.5;
      this.dragging = true;
    }

    // Flag e local de armazenagem do id
    let selectSieve = true;
    let sieveId = "";
    // Flag e local de armazenagem do id
    let selectCement = true;
    let cementId = "";
    function sieveCementDragEnd() {
      this.alpha = 1;
      this.dragging = false;
      // set the interaction data to null
      this.data = null;

      if (checkArea(this, surface)) {
        if (this.type === "sieve" && selectSieve) {
          fuctionMenuItens();
          removeContainer(app, containerMenuItens, this);
          moveSize2(this, 0.4, 350, 343);
          sieveId = this.id;
          selectSieve = false;
          sieve_75.interactive = false;
          arrayCements.forEach((object) => {
            if (checkArea(object, surface)) becker.interactive = true;
          });
        }

        if (this.type === "cement" && selectCement) {
          fuctionMenuCements();
          removeContainer(app, containerMenuCements, this);
          moveSize2(this, 0.3, 500, 310);
          cementId = this.id;
          selectCement = false;
          sieve_75.interactive = true;

          persona.addDialog(
            "No lado direito, abra a caixa de ferramentas, selecione a peneira 75µm acima do fundo de peneira, retorne para a caixa de ferramentas e selecione o Becker de vidro e leve para bancada. Automaticamente a quantidade a ser ensaiada será retirada e colocada no Becker."
          );
        } else if (this.type !== "sieve") {
          // adiciona novamente o cimento selecionado ao menu de cimentos
          arrayCements.forEach((object) => {
            if (object.id === cementId) containerMenuCements.addChild(object);
          });
          const { par1, par2, par3, par4, par5, par6 } = this.initial;
          initial(par1, par2, par3, par4, par5, par6);
          if (this.id === cementId) selectCement = true;
          sieve_75.interactive = false;
        }
      } else {
        const { par1, par2, par3, par4, par5, par6 } = this.initial;
        initial(par1, par2, par3, par4, par5, par6);

        if (this.id === sieveId) selectSieve = true;
        if (this.id === cementId) selectCement = true;
      }
    }

    function sieveCementDragMove() {
      if (this.dragging) {
        const newPosition = this.data.getLocalPosition(this.parent);
        this.x = newPosition.x;
        this.y = newPosition.y;
      }
    }

    // utilizado no inicio da prática para ilustras os  grãos caindo no becker
    const animationCementInBecker = (cementId) => {
      arrayCements.forEach((object) => {
        // verificação se o cimento é o mesmo em cima da mesa.
        if (object.id === cementId) {
          setTimeout(() => {
            // Adicionando ao cimento junto a mascara para rotacionar o conteiner com cimento 'aberto'
            containerCementForBecker.addChild(object, maskCement);
          }, 2000);

          arrayCements.forEach((object) => {
            object.interactive = false;
          });

          setTimeout(() => {
            // Ajuste de posicionamento dos obj em relação ao container
            object.x = 0;
            object.y = 0;
            maskCement.x = 0;
            maskCement.y = 0;
            maskCement.visible = true;

            const time = gsap.timeline();

            time.to(shell, { pixi: { y: 190 }, duration: 2 });
            time.to(shell, { pixi: { x: 570, angle: -30 }, duration: 2 });
            time.to(shell, { pixi: { x: 530, y: 245 }, duration: 2 });
            setTimeout(() => {
              shell.texture = resources.shell2.texture;
            }, 6000);
            time.to(shell, { pixi: { x: 570, y: 190, angle: 0 }, duration: 2 });
            time.to(shell, { pixi: { x: 660, y: 300 }, duration: 2 });
            time.to(shell, { pixi: { x: 650, angle: -30 }, duration: 2 });

            setTimeout(() => {
              grains.restart();
              const newOptions = {
                x: 630,
                y: 340,
                finalY: 390,
                visibleStart: false,
                widthStart: 10,
                widthEnd: 5,
              };
              grains.update(newOptions);
              grains.use();
            }, 11000);

            setTimeout(() => {
              shell.texture = resources.shell3.texture;
              shell.y = shell.y - 4;
              becker_part2.texture = resources.becker_frame1.texture;
            }, 11000);
            setTimeout(() => {}, 12000);
            setTimeout(() => {
              becker_part2.texture = resources.becker_frame2.texture;
              shell.texture = resources.shell1.texture;

              persona.addDialog(
                "Retorne a caixa de ferramentas e selecione o vidro relógio e leve para a balança. Automaticamente o material ensaiado será levado para pesagem 50g."
              );
            }, 13000);

            time.to(shell, { x: 640, y: 360, angle: 0, delay: 3 });
          }, 2000);
        }
      });
    };

    const efectDownGrains = () => {
      const time = gsap.timeline();

      time.to(becker, { x: 215, y: 165, duration: 1.5 });
      time.to(becker, { angle: -140, duration: 1.5 });

      setTimeout(() => {
        grains.restart();
        const newOptions = {
          x: 200,
          y: 200,
          finalY: 335,
          visibleStart: false,
          widthStart: 20,
          widthEnd: 10,
          heightStart: 40,
          heightEnd: 0,
        };
        grains.update(newOptions);
        grains.use();
      }, 3000);

      time.to(becker, { x: 620, y: 370, angle: 0, duration: 1.5, delay: 4 });
    };

    const efectDownGrainsInLens = () => {
      const time = gsap.timeline();

      lens1.flagScale = true;
      lens1.testeflegOne = true;
      lens1.flag = true;

      const tack = new PIXI.Sprite(resources.tack.texture);
      tack.zIndex = 10;
      configureObject2(app, tack, 0.8, 1200, 300);
      setTimeout(() => {
        time.to(tack, { alpha: 0 });
      }, 2000);

      cover.visible = false;
      topSieve.visible = false;
      timer.visible = false;
      TextChronometer.visible = false;
      containerGrains1.visible = false;

      time.to(bottonSieve, {
        pixi: { x: 1200, y: 240, angle: 180, scale: 1.5 },
      });
      bottonSieve.interactive = false;

      tableProfile1.visible = false;

      // remove o becker e posiciona na tela
      removeContainer(app, containerMenuItens, lens1);
      time.to(lens1, { pixi: { x: 1200, y: 500, scale: 0.4 } });

      surface2.visible = true;

      grains.restart();
      grains.zIndex = 10;
      const newOptions = {
        x: 1200,
        y: 360,
        finalY: 500,
        visibleStart: false,
        widthStart: 70,
        widthEnd: 35,
      };
      grains.update(newOptions);
      // troca de textura
      setTimeout(() => {
        grains.use();
      }, 3000);
      setTimeout(() => {
        lens1.texture = resources.lens2.texture;
      }, 6000);

      setTimeout(() => {
        time.to(tack, { alpha: 1 }, 0);
        time.to(tack1, { alpha: 1 }, 0);
        setTimeout(() => {
          onStep1();
        }, 1000);
      }, 10000);

      setTimeout(() => {
        cover.interactive = true;

        cover.visible = true;
        topSieve.visible = true;
        timer.visible = true;
        TextChronometer.visible = true;
        containerGrains1.visible = true;

        time.to(bottonSieve, {
          pixi: { x: 1133, y: 330, angle: 0, scale: 1.2 },
        });
        bottonSieve.interactive = false;

        tableProfile1.visible = true;

        // adiciona o becker e posiciona no menu de itens
        containerMenuItens.addChild(lens1);
        lens1.scale.set(0.2);
        lens1.x = 640;
        lens1.y = 360;
        lens1.flag = true;
        testeflegOne = true;

        surface2.visible = false;
      }, 11000);

      setTimeout(() => {
        time.to(tack, { alpha: 0 });
        time.to(tack1, { alpha: 0 });
      }, 12000);

      setTimeout(() => {
        lens1.interactive = true;
      }, 1200);
      setTimeout(() => {
        button.interactive = true;
        button.buttonMode = true;
        time.to(button, { alpha: 1 });
      }, 1200);
    };

    let control = 1;
    // efeito utilizado para colocar o resto de cimento passante do fundo da peneira para o becker
    const efectDownGrainsInBecker = () => {
      const time = gsap.timeline();

      if (control === 1) {
        cover.flag = false;

        control++;
        contBrush = 0;
        flagBrush1 = false;
        flagBrush2 = true;

        contFlannel = 0;
        flagFlannel1 = false;
        flagFlannel2 = true;

        setTimeout(() => {
          becker_part2.texture = resources.becker_frame1.texture;
        }, 5000);
        setTimeout(() => {
          becker_part2.texture = resources.becker_frame2.texture;
        }, 6000);

        arryGrainsBrush.forEach((object) => {
          object.alpha = 0;
        });
        arryGrainsFlannel.forEach((object) => {
          object.alpha = 0;
        });

        setTimeout(() => {
          persona2.addDialog(
            "Chegamos na ETAPA DE PENEIRAMENTO INTERMEDIÁRIO, realize o peneiramento do material retido na peneira 75µm. \n\nSeguindo os mesmos passo da primeira vez, para começar o peneiramento clique na tampa."
          );
          setTimeout(() => {
            persona2.removeDialog();
          }, 20000);
        }, 11000);
      } else if (control === 2) {
        control++;
        contBrush = 0;
        flagBrush2 = false;
        flagBrush3 = true;

        setTimeout(() => {
          becker_part2.texture = resources.becker_frame3.texture;
        }, 6000);

        contFlannel = 0;
        flagFlannel2 = false;
        flagFlannel3 = true;

        arryGrainsBrush2.forEach((object) => {
          object.alpha = 0;
        });
        arryGrainsFlannel2.forEach((object) => {
          object.alpha = 0;
        });
        setTimeout(() => {
          persona.addDialog(
            "Insira o vidro relógio na balança e logo em seguida o becker, depois verifique se esta dentro dos parametros da norma:\na) Calcule o módulo de finura do material ensaiado.\nb) Redija um relatório para o ensaio.\nc) Comente no relatório os limites de aceitação e as implicações no caso de resultados em desacordo com as normas técnicas."
          );
          persona2.addDialog(
            "Estamos no PENEIRAMENTO FINAL.\n\nClique na tampa e dê procedimento ao peneiramento."
          );
          setTimeout(() => {
            persona2.removeDialog();
          }, 20000);
        }, 11000);
      } else if (control === 3) {
        control++;
        contBrush = 0;
        flagBrush3 = false;

        contFlannel = 0;
        flagFlannel3 = false;

        arryGrainsBrush3.forEach((object) => {
          object.alpha = 0;
        });
        arryGrainsFlannel3.forEach((object) => {
          object.alpha = 0;
        });

        setTimeout(() => {
          persona2.addDialog(
            "Realize a pesagem do passante que foi depositado no fundo para validar o término do ensaio, clicando no botão superior esquerdo."
          );
          setTimeout(() => {
            persona2.removeDialog();
          }, 20000);
        }, 11000);

        return efectDownGrainsInLens();
      }

      // efeito para cobrir tudo com a logo
      const tack = new PIXI.Sprite(resources.tack.texture);
      tack.zIndex = 10;
      configureObject2(app, tack, 0.8, 1200, 300);
      setTimeout(() => {
        time.to(tack, { alpha: 0 });
      }, 2000);

      cover.visible = false;
      topSieve.visible = false;
      timer.visible = false;
      TextChronometer.visible = false;
      containerGrains1.visible = false;

      time.to(bottonSieve, {
        pixi: { x: 1200, y: 200, angle: 180, scale: 1.5 },
      });
      bottonSieve.interactive = false;

      tableProfile1.visible = false;

      // remove o becker e posiciona na tela
      removeContainer(app, containerMenuItens, becker);
      time.to(becker, { pixi: { x: 1200, y: 440 } });
      becker_part1.scale.set(0.4);
      becker_part2.scale.set(0.4);

      surface2.visible = true;

      grains.restart();
      grains.zIndex = 10;
      const newOptions = {
        x: 1200,
        y: 300,
        finalY: 430,
        visibleStart: false,
        widthStart: 70,
        widthEnd: 35,
      };
      grains.update(newOptions);
      setTimeout(() => {
        grains.use();
      }, 3000);

      setTimeout(() => {
        time.to(tack, { alpha: 1 });
      }, 10000);

      setTimeout(() => {
        cover.interactive = true;

        cover.visible = true;
        topSieve.visible = true;
        timer.visible = true;
        TextChronometer.visible = true;
        containerGrains1.visible = true;

        time.to(bottonSieve, {
          pixi: { x: 1133, y: 330, angle: 0, scale: 1.2 },
        });
        bottonSieve.interactive = false;

        tableProfile1.visible = true;

        // adiciona o becker e posiciona no menu de itens
        containerMenuItens.addChild(becker);
        becker.x = 640;
        becker.y = 240;
        becker_part1.scale.set(0.2);
        becker_part2.scale.set(0.2);

        surface2.visible = false;
      }, 11000);

      setTimeout(() => {
        time.to(tack, { alpha: 0 });
      }, 12000);
    };

    let flagBrush1 = true;
    let flagBrush2 = false;
    let flagBrush3 = false;
    let contBrush = 0;
    // Funções Draggins do objeto brush
    function onDragBrushMove() {
      if (this.dragging) {
        const newPosition = this.data.getLocalPosition(this.parent);

        const time = gsap.timeline();
        if (this.x < newPosition.x) {
          time.to(this, { angle: 25 });

          if (flagBrush1) {
            arryGrainsBrush.forEach((object) => {
              if (object.y > 90) {
                contBrush++;
              } else {
                contBrush = 0;
              }

              if (checkArea(this, object)) {
                if (object.x < 104) {
                  object.x += 1;
                }
                if (object.y <= 110) {
                  object.y += 1;

                  setTimeout(() => {
                    if (contBrush >= 290) {
                      persona2.addDialog(
                        "Utilize a flanela que está na caixa de ferramentas para limpar os grãos mais finos que restarão no fundo."
                      );
                      gsap.to(okCheck1, { alpha: 1 });
                      gsap.to(checkflannel, { alpha: 1 });
                      setTimeout(() => {
                        brush.interactive = false;
                        brush.data = null;
                        brush.dragging = false;
                        containerMenuItens.addChild(brush);
                        gsap.to(brush, {
                          pixi: { x: 740, y: 120, angle: 0, scale: 0.08 },
                          delay: 0.1,
                        });
                      }, 5000);
                      flannel.interactive = true;
                    }
                  }, 500);
                }
              }
            });
          }

          if (flagBrush2) {
            arryGrainsBrush2.forEach((object) => {
              if (object.y > 90) {
                contBrush++;
              } else {
                contBrush = 0;
              }

              if (checkArea(this, object)) {
                if (object.x < 104) {
                  object.x += 1;
                }
                if (object.y <= 110) {
                  object.y += 1;

                  setTimeout(() => {
                    if (contBrush >= 290) {
                      persona2.addDialog(
                        "Utilize a flanela que está na caixa de ferramentas para limpar os grãos mais finos que restarão no fundo."
                      );
                      gsap.to(okCheck1, { alpha: 1 });
                      gsap.to(checkflannel, { alpha: 1 });
                      setTimeout(() => {
                        brush.interactive = false;
                      }, 5000);
                      flannel.interactive = true;
                    }
                  }, 1000);
                }
              }
            });
          }

          if (flagBrush3) {
            arryGrainsBrush3.forEach((object) => {
              if (object.y > 80) {
                contBrush++;
              } else {
                contBrush = 0;
              }

              if (checkArea(this, object)) {
                if (object.x < 104) {
                  object.x += 1;
                }
                if (object.y <= 110) {
                  object.y += 1;

                  setTimeout(() => {
                    if (contBrush >= 70) {
                      persona2.addDialog(
                        "Utilize a flanela que está na caixa de ferramentas para limpar os grãos mais finos que restarão no fundo."
                      );
                      gsap.to(okCheck1, { alpha: 1 });
                      gsap.to(checkflannel, { alpha: 1 });
                      setTimeout(() => {
                        brush.interactive = false;
                      }, 5000);
                      flannel.interactive = true;
                    }
                  }, 1000);
                }
              }
            });
          }
        } else if (this.x > newPosition.x) {
          time.to(this, { angle: -25 });

          if (flagBrush1) {
            arryGrainsBrush.forEach((object) => {
              if (object.y > 90) {
                contBrush++;
              } else {
                contBrush = 0;
              }
              if (checkArea(this, object)) {
                if (object.x > 0) {
                  object.x -= 1;
                }
                if (object.y <= 110) {
                  object.y += 1;

                  setTimeout(() => {
                    if (contBrush >= 290) {
                      persona2.addDialog(
                        "Utilize a flanela que está na caixa de ferramentas para limpar os grãos mais finos que restarão no fundo."
                      );
                      gsap.to(okCheck1, { alpha: 1 });
                      gsap.to(checkflannel, { alpha: 1 });
                      setTimeout(() => {
                        brush.interactive = false;
                        brush.data = null;
                        brush.dragging = false;
                        containerMenuItens.addChild(brush);
                        gsap.to(brush, {
                          pixi: { x: 740, y: 120, angle: 0, scale: 0.08 },
                          delay: 0.1,
                        });
                      }, 5000);
                      flannel.interactive = true;
                    }
                  }, 500);
                }
              }
            });
          }

          if (flagBrush2) {
            arryGrainsBrush2.forEach((object) => {
              if (object.y > 90) {
                contBrush++;
              } else {
                contBrush = 0;
              }

              if (checkArea(this, object)) {
                if (object.x > 0) {
                  object.x -= 1;
                }
                if (object.y <= 110) {
                  object.y += 1;
                  setTimeout(() => {
                    if (contBrush >= 290) {
                      persona2.addDialog(
                        "Utilize a flanela que está na caixa de ferramentas para limpar os grãos mais finos que restarão no fundo."
                      );
                      gsap.to(okCheck1, { alpha: 1 });
                      gsap.to(checkflannel, { alpha: 1 });
                      setTimeout(() => {
                        brush.interactive = false;
                      }, 5000);
                      flannel.interactive = true;
                    }
                  }, 1000);
                }
              }
            });
          }

          if (flagBrush3) {
            arryGrainsBrush3.forEach((object) => {
              if (object.y > 90) {
                contBrush++;
              } else {
                contBrush = 0;
              }

              if (checkArea(this, object)) {
                if (object.x > 0) {
                  object.x -= 1;
                }
                if (object.y <= 110) {
                  object.y += 1;
                  setTimeout(() => {
                    if (contBrush >= 70) {
                      persona2.addDialog(
                        "Utilize a flanela que está na caixa de ferramentas para limpar os grãos mais finos que restarão no fundo."
                      );
                      gsap.to(okCheck1, { alpha: 1 });
                      gsap.to(checkflannel, { alpha: 1 });
                      setTimeout(() => {
                        brush.interactive = false;
                      }, 5000);
                      flannel.interactive = true;
                    }
                  }, 1000);
                }
              }
            });
          }
        }
        this.x = newPosition.x;
        this.y = newPosition.y;
      }
    }

    function onDragBrushStart(event) {
      persona2.removeDialog();
      bottonSieve.interactive = false;
      this.data = event.data;
      this.dragging = true;
      removeContainer(app, containerMenuItens, brush);
      gsap.to(brush, { pixi: { scale: 0.13 } });
      fuctionMenuItens();
    }

    function onDragBrushEnd() {
      bottonSieve.interactive = true;
      this.dragging = false;
      // set the interaction data to null
      this.data = null;
      gsap.to(brush, { pixi: { scale: 0.08 } });

      const time = gsap.timeline();

      time.to(this, { angle: 0, x: 740 + 800, y: 120 });

      time.call(() => {
        containerMenuItens.addChild(brush);
        brush.x = 740;
      });
    }

    addFunction(
      brush,
      onDragBrushStart,
      onDragBrushEnd,
      onDragBrushEnd,
      onDragBrushMove
    );

    let flagFlannel1 = true;
    let flagFlannel2 = false;
    let flagFlannel3 = false;
    let contFlannel = 0;
    // Funções Draggins do objeto Flannel
    function onDragFlannelMove() {
      if (this.dragging) {
        const newPosition = this.data.getLocalPosition(this.parent);

        const time = gsap.timeline();
        if (this.x < newPosition.x) {
          time.to(this, { angle: 15 }, 0);
          time.to(flannel_part2, { angle: 10 }, 0);

          if (flagFlannel1) {
            arryGrainsFlannel.forEach((object) => {
              if (object.y > 90) {
                contFlannel++;
              } else {
                contFlannel = 0;
              }

              if (checkArea(this, object)) {
                if (object.x < 104) {
                  object.x += 1;
                }
                if (object.y <= 110) {
                  object.y += 1;

                  setTimeout(() => {
                    if (contFlannel >= 90) {
                      gsap.to(okCheck2, { alpha: 1 });
                    }
                  }, 500);
                }
              }
            });
          }

          if (flagFlannel2) {
            arryGrainsFlannel2.forEach((object) => {
              if (object.y > 90) {
                contFlannel++;
              } else {
                contFlannel = 0;
              }

              if (checkArea(this, object)) {
                if (object.x < 104) {
                  object.x += 1;
                }
                if (object.y <= 110) {
                  object.y += 1;

                  setTimeout(() => {
                    if (contFlannel >= 90) {
                      gsap.to(okCheck2, { alpha: 1 });
                    }
                  }, 500);
                }
              }
            });
          }

          if (flagFlannel3) {
            arryGrainsFlannel3.forEach((object) => {
              if (object.y > 90) {
                contFlannel++;
              } else {
                contFlannel = 0;
              }

              if (checkArea(this, object)) {
                if (object.x < 104) {
                  object.x += 1;
                }
                if (object.y <= 110) {
                  object.y += 1;

                  setTimeout(() => {
                    if (contFlannel >= 50) {
                      gsap.to(okCheck2, { alpha: 1 });
                    }
                  }, 500);
                }
              }
            });
          }
        } else if (this.x > newPosition.x) {
          time.to(this, { angle: -15 }, 0);
          time.to(flannel_part2, { angle: -10 }, 0);

          if (flagFlannel1) {
            arryGrainsFlannel.forEach((object) => {
              if (object.y > 90) {
                contFlannel++;
              } else {
                contFlannel = 0;
              }

              if (checkArea(this, object)) {
                if (object.x > 0) {
                  object.x -= 1;
                }
                if (object.y <= 110) {
                  object.y += 1;
                  setTimeout(() => {
                    if (contFlannel >= 90) {
                      gsap.to(okCheck2, { alpha: 1 });
                    }
                  }, 500);
                }
              }
            });
          }

          if (flagFlannel2) {
            arryGrainsFlannel2.forEach((object) => {
              if (object.y > 90) {
                contFlannel++;
              } else {
                contFlannel = 0;
              }

              if (checkArea(this, object)) {
                if (object.x > 0) {
                  object.x -= 1;
                }
                if (object.y <= 110) {
                  object.y += 1;
                  setTimeout(() => {
                    if (contFlannel >= 90) {
                      gsap.to(okCheck2, { alpha: 1 });
                    }
                  }, 500);
                }
              }
            });
          }

          if (flagFlannel3) {
            arryGrainsFlannel3.forEach((object) => {
              if (object.y > 90) {
                contFlannel++;
              } else {
                contFlannel = 0;
              }

              if (checkArea(this, object)) {
                if (object.x > 0) {
                  object.x -= 1;
                }
                if (object.y <= 110) {
                  object.y += 1;
                  setTimeout(() => {
                    if (contFlannel >= 50) {
                      gsap.to(okCheck2, { alpha: 1 });
                    }
                  }, 500);
                }
              }
            });
          }
        }

        this.x = newPosition.x;
        this.y = newPosition.y;
      }
    }

    function onDragFlannelStart(event) {
      persona2.removeDialog();
      this.data = event.data;
      this.dragging = true;
      // flannel.off('pointerover');
      removeContainer(app, containerMenuItens, flannel);
      const time = gsap.timeline();
      time.to(flannel_part1, { pixi: { scale: 0.5 } }, 0);
      time.to(flannel_part2, { pixi: { scale: 0.5 } }, 0);

      fuctionMenuItens();
    }

    function onDragFlannelEnd() {
      this.dragging = false;
      // set the interaction data to null
      this.data = null;

      const time = gsap.timeline();
      time.to(flannel_part1, { pixi: { scale: 0.3 } }, 0);
      time.to(flannel_part2, { pixi: { scale: 0.3 } }, 0);

      time.to(this, { angle: 0, x: 640 + 800, y: 120 });

      time.call(() => {
        containerMenuItens.addChild(flannel);
        flannel.x = 640;
      });

      setTimeout(() => {
        if (okCheck1.alpha == 1 && okCheck2.alpha == 1) {
          flannel.interactive = false;
          flannel.data = null;
          flannel.dragging = false;
          containerMenuItens.addChild(flannel);
          gsap.to(flannel, { pixi: { x: 640, y: 120, angle: 0 }, delay: 0.1 });
          efectDownGrainsInBecker();
        }
      }, 1000);
    }

    addFunction(
      flannel,
      onDragFlannelStart,
      onDragFlannelEnd,
      onDragFlannelEnd,
      onDragFlannelMove
    );

    // Funções Draggins do objeto stick
    let flagStick = true;
    let contStick = 0;
    function onDragStickMove() {
      if (this.dragging) {
        const newPosition = this.data.getLocalPosition(this.parent);
        const time = gsap.timeline();

        // Efeito de balanço do bastam
        if (this.x < newPosition.x) {
          time.to(this, { angle: 10, duration: 0.1 });
        } else if (this.x > newPosition.x) {
          time.to(this, { angle: -10, duration: 0.1 });
        } else {
          time.to(this, { angle: 0 });
        }

        if (checkArea(this, cover)) {
          //local de colisão

          if (flagStick) {
            flagStick = !flagStick;
            contStick++;
            checkStickFunction(contStick);
          }

          if (newPosition.x > this.x) {
            //local de removimento do batão
            this.x = newPosition.x;
          }
        } else {
          if (!checkArea(this, topSieve)) flagStick = !flagStick;
          this.x = newPosition.x;
          this.y = newPosition.y;
        }
      }
    }

    const checkStickFunction = (cont) => {
      const time = gsap.timeline();
      if (cont === 3) {
        time.to(okCheck0, { alpha: 1 });
        time.to(checkBrush, { alpha: 1 });

        stick.interactive = false;
        stick.data = null;
        stick.dragging = false;

        persona2.addDialog(
          "Utilize o pincel da caixa de ferramentas para limpar o fundo com os grãos passantes."
        );
        setTimeout(() => {
          gsap.to(stick, { angle: 0, x: 740, y: 240 });
          gsap.to(stick, { pixi: { scale: 0.4 } });
        }, 2000);
        brush.interactive = true;

        setTimeout(() => {
          time.to(cover, { x: cover.x + 250, y: cover.y + 40 }, 1);
          time.to(topSieve, { x: topSieve.x + 250, y: topSieve.y + 40 }, 1);
          time.to(
            containerGrains1,
            { x: containerGrains1.x + 250, y: containerGrains1.y + 40 },
            1
          );
        }, 2000);

        contStick = 0;
      }
    };

    function onDragStickStart(event) {
      persona2.removeDialog();
      this.data = event.data;
      this.dragging = true;
      gsap.to(stick, { pixi: { scale: 0.7 } });
      fuctionMenuItens();
    }

    function onDragStickEnd() {
      this.dragging = false;
      // set the interaction data to null
      this.data = null;

      const time = gsap.timeline();
      time.to(this, { angle: 0, x: 740, y: 240 });
      gsap.to(stick, { pixi: { scale: 0.4 } });
    }

    addFunction(
      stick,
      onDragStickStart,
      onDragStickEnd,
      onDragStickEnd,
      onDragStickMove
    );

    // deixa os objetos sem interação, sendo atribuido ao decorrer da prática.
    sieve_75.interactive = false;
    becker.interactive = false;
    lens1.interactive = false;
    brush.interactive = false;
    flannel.interactive = false;
    stick.interactive = false;
    timer.interactive = false;
    cover.interactive = false;
    containerScreening.interactive = false;

    // calling mainTimeline
    mainTimeline();
  });
})();

},{"./functions":2,"./objects":3,"./setup-v3":4,"./texts":5}],2:[function(require,module,exports){
//generates random numbers
const randomNumber = (min, max) =>
    Math.floor(Math.random() * (max - min) + min);

const randomFloatNumber = (min, max) =>
    (Math.random() * (max - min) + min).toFixed(2);

const size = (app, obj, width, height) => {
    if (typeof obj == "object") {
        obj.pivot.set(obj.width / 2, obj.height / 2);
        obj.width = width;
        obj.height = height;
    } else if (typeof obj == "array") {
        obj = width;
        obj = height;
    }
    app.stage.addChild(obj);
};

const position = (app, obj, x, y) => {
    if (typeof obj == "object") {
        obj.pivot.set(obj.width / 2, obj.height / 2);
        obj.x = x;
        obj.y = y;
    } else if (typeof obj == "array") {
        obj = x;
        obj = y;
    }
    app.stage.addChild(obj);
};

const configureObject = ( app, object, width, height, x, y, moveItem = false, visible = true) => {
    position(app, object, x, y);
    size(app, object, width, height);
    if (moveItem) {
        object.interactive = true;
        object.buttonMode = true;
    }
    object.visible = visible
    
    app.stage.addChild(object);
};


const configureObject2 = ( app, object, scale, x, y, moveItem = false, visible = true) => {
    position(app, object, x, y);
    object.scale.set(scale);
    if (moveItem) {
        object.interactive = true;
        object.buttonMode = true;
    }
    object.visible = visible
    
    app.stage.addChild(object);
};


const formatObject = ( object, scale, x, y, moveItem = false, visible = true) => {
    return {par1: object, par2: scale, par3: x, par4: y, par5: moveItem, par6: visible};
}

const initial = ( object, scale, x, y, moveItem = false, visible = true) => {
    object.visible = visible
    const time = gsap.timeline();
    time.to(object,{
        pixi:{
            scale: scale,
            x: x,
            y: y,
        }
    });
    if (moveItem) {
        object.interactive = true;
        object.buttonMode = true;
    }
}


const moveSize = (
                            object,
                            width = object.width,
                            height = object.height,
                            x = object.x,
                            y = object.y,
                            angle = object.angle,
                            duration = 1,
                            delay = 0
    ) => {
    const time = gsap.timeline();
    time.to(object,{
        pixi: {
            width: width,
            height: height,
            x: x,
            y: y,
            angle: angle,
        },
        duration: duration,
        delay: delay,
    });
};

const moveSize2 = (
    object,
    scale,
    x = object.x,
    y = object.y,
    angle = object.angle,
    duration = 1,
    delay = 0
) => {
    const time = gsap.timeline();
        time.to(object,{
            pixi: {
                scale: scale,
                x: x,
                y: y,
                angle: angle,
            },
            duration: duration,
            delay: delay,
        });
};

const removeFunction = ( object, interaction = false) => {
    object  .off('pointerdown')   
            .off('pointerup')
            .off('painterout')
            .off('pointerover')
            .off('pointerupoutside')
            .off('pointermove');

    if( !interaction ){
        object.interactive = false;
        object.buttonMode = false;
    }
}

// função para remover e inserir novas funcionalidades
const addFunction = (object, pointerdown = () =>{}, pointerup = () =>{}, pointerupoutside = () =>{}, pointermove = () =>{}) => {
    
    //Adiciona novas funcionalidas, caso não seja passado entra uma função void
    object  .on('pointerdown', pointerdown)   
            .on('pointerup', pointerup)
            .on('pointerupoutside', pointerupoutside)
            .on('pointermove', pointermove);

    object.interactive = true;
    object.buttonMode = true;
};

const removeContainer = (app, container, object) => {
    app.stage.addChild(container.removeChildAt(container.getChildIndex(object)));
}

module.exports = {
    randomNumber,
    randomFloatNumber,
    configureObject,
    size,
    position,
    moveSize,
    removeFunction,
    addFunction,
    formatObject,
    initial,
    removeContainer,
    configureObject2,
    moveSize2,
}

},{}],3:[function(require,module,exports){
//const {introOptions} = require('./intro');
//const {footerOptions} = require('./footer');
// const PIXI = require('pixi.js');
const texts = require("./texts");

const {
  randomNumber,
  randomFloatNumber,
  configureObject,
  formatObject,
  initial,
  moveSize,
  configureObject2,
} = require("./functions");

const options = {
  width: 800,
  height: 600,
  backgroundColor: 0x7193bc,
  targetSelector: "#animation",
  fontFamilies: ["Roboto", "DS-DIGI"],
  resources: {
    cartesiano:
      "https://lia-labv.s3.sa-east-1.amazonaws.com/praticas/_general/plano-cartesiano.png",
    sieve75:
      "https://lia-labv.s3.sa-east-1.amazonaws.com/praticas/p02-finura-v2/Peneira+auterada+75+%CE%BCm/75+%CE%BCm.png",
    maskCement:
      "https://lia-labv.s3.sa-east-1.amazonaws.com/praticas/p02-finura-v2/Cimento/Cimento/Mascara+.png",
    grain:
      "https://lia-labv.s3.sa-east-1.amazonaws.com/praticas/p02-finura/HitBox-imagens+/Imagens/Areia+de+cimento.png",
    flannel_part1:
      "https://lia-labv.s3.sa-east-1.amazonaws.com/praticas/p02-finura-v2/E/Flanela+p+01.png",
    flannel_part2:
      "https://lia-labv.s3.sa-east-1.amazonaws.com/praticas/p02-finura-v2/E/Flanela+p+02.png",
    bottonSieve:
      "https://lia-labv.s3.sa-east-1.amazonaws.com/praticas/p02-finura-v2/Solicita%C3%A7%C3%A3o/Fundo.png",
    lens1:
      "https://lia-labv.s3.sa-east-1.amazonaws.com/praticas/p02-finura-v2/VIDRO+.png",
    lens2:
      "https://lia-labv.s3.sa-east-1.amazonaws.com/praticas/p02-finura-v2/frames+lentes/F1.png",
    lens3:
      "https://lia-labv.s3.sa-east-1.amazonaws.com/praticas/p02-finura-v2/frames+lentes/F2.png",
    lens4:
      "https://lia-labv.s3.sa-east-1.amazonaws.com/praticas/p02-finura-v2/frames+lentes/F3.png",
    topSieve:
      "https://lia-labv.s3.sa-east-1.amazonaws.com/praticas/p02-finura-v2/Peneira+auterada+75+%CE%BCm/A75+%CE%BCm.png",
    brush:
      "https://lia-labv.s3.sa-east-1.amazonaws.com/praticas/p02-finura-v2/Pincel/Trincha+.png",
    becker:
      "https://lia-labv.s3.sa-east-1.amazonaws.com/praticas/p02-finura/HitBox-imagens+/Imagens/Recipiente.png",
    surface:
      "https://lia-labv.s3.sa-east-1.amazonaws.com/praticas/p02-finura-v2/mesa+perfil+.png",
    tableProfile1:
      "https://lia-labv.s3.sa-east-1.amazonaws.com/praticas/p02-finura-v2/Solicita%C3%A7%C3%A3o/Mesa.png",
    balance:
      "https://lia-labv.s3.sa-east-1.amazonaws.com/praticas/p02-finura/balan%C3%A7a+COM+LOGO+LIA+.png",
    stick:
      "https://lia-labv.s3.sa-east-1.amazonaws.com/praticas/p02-finura/HitBox-imagens+/Imagens/Bast%C3%A3o.png",
    button:
      "https://lia-labv.s3.sa-east-1.amazonaws.com/praticas/p02-finura-v2/buttoInterface.png",
    invisibleBlock:
      "https://lia-labv.s3.sa-east-1.amazonaws.com/praticas/p02-finura/HitBox-imagens+/Imagens/invibleBlock.png",
    menuItens:
      "https://lia-labv.s3.sa-east-1.amazonaws.com/praticas/p02-finura/Bot%C3%A3oItens.png",
    bottonMenuCements:
      "https://lia-labv.s3.sa-east-1.amazonaws.com/praticas/p02-finura-v2/bot%C3%A3ocimentos.png",
    backgroudMenuItens:
      "https://lia-labv.s3.sa-east-1.amazonaws.com/praticas/p02-finura/backgroudItens.png",
    timer:
      " https://lia-labv.s3.sa-east-1.amazonaws.com/praticas/p02-finura-v2/E/Relogio+.png",
    cover:
      "https://lia-labv.s3.sa-east-1.amazonaws.com/praticas/p02-finura-v2/Solicita%C3%A7%C3%A3o/Tampa+.png",
    layoutBar:
      "https://lia-labv.s3.sa-east-1.amazonaws.com/praticas/p02-finura-v2/layoutbarra.png",
    becker_part1:
      "https://lia-labv.s3.sa-east-1.amazonaws.com/praticas/p02-finura-v2/Becker+de+vidro/1%C2%BA+Camada.png",
    becker_part2:
      "https://lia-labv.s3.sa-east-1.amazonaws.com/praticas/p02-finura-v2/Becker+de+vidro/2%C2%BA+Camada.png",
    becker_frame1:
      "https://lia-labv.s3.sa-east-1.amazonaws.com/praticas/p02-finura-v2/Fra+1.png",
    becker_frame2:
      "https://lia-labv.s3.sa-east-1.amazonaws.com/praticas/p02-finura-v2/Fra+2.png",
    becker_frame3:
      "https://lia-labv.s3.sa-east-1.amazonaws.com/praticas/p02-finura-v2/Fra+3.png",
    becker_frame4:
      "https://lia-labv.s3.sa-east-1.amazonaws.com/praticas/p02-finura-v2/Fra+4.png",
    balance_part1:
      "https://lia-labv.s3.sa-east-1.amazonaws.com/praticas/p02-finura-v2/Balan%C3%A7a/Mascara+.png",
    balance_part2:
      "https://lia-labv.s3.sa-east-1.amazonaws.com/praticas/p02-finura-v2/Balan%C3%A7a/Balan%C3%A7a+de+prercis%C3%A3o+.png",
    progressBar:
      "https://lia-labv.s3.sa-east-1.amazonaws.com/praticas/p02-finura-v2/barraDeProgresso.png",
    colorProgressBar:
      "https://lia-labv.s3.sa-east-1.amazonaws.com/praticas/p02-finura-v2/barraDeProgresso.png",
    tack: "https://lia-labv.s3.sa-east-1.amazonaws.com/praticas/p02-finura-v2/tack.png",
    checkBrush:
      "https://lia-labv.s3.sa-east-1.amazonaws.com/praticas/p02-finura-v2/OK+PINCEL.png",
    checkflannel:
      "https://lia-labv.s3.sa-east-1.amazonaws.com/praticas/p02-finura-v2/OK+FLANELA.png",
    checkStick:
      "https://lia-labv.s3.sa-east-1.amazonaws.com/praticas/p02-finura-v2/OKBASTAO.png",
    okCheck:
      "https://lia-labv.s3.sa-east-1.amazonaws.com/praticas/p02-finura-v2/BOT%C3%83O+OK.png",
    staticBotton:
      "https://lia-labv.s3.sa-east-1.amazonaws.com/praticas/p02-finura-v2/fundo.png",
    CP_I_25:
      "https://lia-labv.s3.sa-east-1.amazonaws.com/praticas/p02-finura-v2/Sacos+de+cimento/CP-I-25.png",
    CP_I_32:
      "https://lia-labv.s3.sa-east-1.amazonaws.com/praticas/p02-finura-v2/Sacos+de+cimento/CP-I-32.png",
    CP_I_40:
      "https://lia-labv.s3.sa-east-1.amazonaws.com/praticas/p02-finura-v2/Sacos+de+cimento/CP-I-40.png",
    CP_I_S_25:
      "https://lia-labv.s3.sa-east-1.amazonaws.com/praticas/p02-finura-v2/Sacos+de+cimento/CP-I-S-25.png",
    CP_I_S_32:
      "https://lia-labv.s3.sa-east-1.amazonaws.com/praticas/p02-finura-v2/Sacos+de+cimento/CP-I-S-32.png",
    CP_I_S_40:
      "https://lia-labv.s3.sa-east-1.amazonaws.com/praticas/p02-finura-v2/Sacos+de+cimento/CP-I-S-40.png",
    CP_II_E_25:
      "https://lia-labv.s3.sa-east-1.amazonaws.com/praticas/p02-finura-v2/Sacos+de+cimento/CP-II-E-25.png",
    CP_II_E_32:
      "https://lia-labv.s3.sa-east-1.amazonaws.com/praticas/p02-finura-v2/Sacos+de+cimento/CP-II-E-32.png",
    CP_II_E_40:
      "https://lia-labv.s3.sa-east-1.amazonaws.com/praticas/p02-finura-v2/Sacos+de+cimento/CP-II-E-40.png",
    CP_II_F_25:
      "https://lia-labv.s3.sa-east-1.amazonaws.com/praticas/p02-finura-v2/Sacos+de+cimento/CP-II-F-25.png",
    CP_II_F_32:
      "https://lia-labv.s3.sa-east-1.amazonaws.com/praticas/p02-finura-v2/Sacos+de+cimento/CP-II-F-32.png",
    CP_II_F_40:
      "https://lia-labv.s3.sa-east-1.amazonaws.com/praticas/p02-finura-v2/Sacos+de+cimento/CP-II-F-40.png",
    CP_II_Z_25:
      "https://lia-labv.s3.sa-east-1.amazonaws.com/praticas/p02-finura-v2/Sacos+de+cimento/CP-II-Z-25.png",
    CP_II_Z_32:
      "https://lia-labv.s3.sa-east-1.amazonaws.com/praticas/p02-finura-v2/Sacos+de+cimento/CP-II-Z-32.png",
    CP_II_Z_40:
      "https://lia-labv.s3.sa-east-1.amazonaws.com/praticas/p02-finura-v2/Sacos+de+cimento/CP-II-Z-40.png",
    CP_III_25:
      "https://lia-labv.s3.sa-east-1.amazonaws.com/praticas/p02-finura-v2/Sacos+de+cimento/CP-III-25.png",
    CP_III_32:
      "https://lia-labv.s3.sa-east-1.amazonaws.com/praticas/p02-finura-v2/Sacos+de+cimento/CP-III-32.png",
    CP_III_40:
      "https://lia-labv.s3.sa-east-1.amazonaws.com/praticas/p02-finura-v2/Sacos+de+cimento/CP-III-40.png",
    CP_IV_25:
      "https://lia-labv.s3.sa-east-1.amazonaws.com/praticas/p02-finura-v2/Sacos+de+cimento/CP-IV-25.png",
    CP_IV_32:
      "https://lia-labv.s3.sa-east-1.amazonaws.com/praticas/p02-finura-v2/Sacos+de+cimento/CP-IV-32.png",
    CP_IV_40:
      "https://lia-labv.s3.sa-east-1.amazonaws.com/praticas/p02-finura-v2/Sacos+de+cimento/CP-IV-40.png",
    CP_V_ARI:
      "https://lia-labv.s3.sa-east-1.amazonaws.com/praticas/p02-finura-v2/Sacos+de+cimento/CP-V-ARI.png",
    shell1:
      "https://lia-labv.s3.sa-east-1.amazonaws.com/praticas/p02-finura-v2/Concha/Concha+vazia+.png",
    shell2:
      "https://lia-labv.s3.sa-east-1.amazonaws.com/praticas/p02-finura-v2/Concha+cheia+2D-8.png",
    shell3:
      "https://lia-labv.s3.sa-east-1.amazonaws.com/praticas/p02-finura-v2/Concha+cheia+1D-8.png",
  },
};

// load openning resources
if (typeof introOptions !== "undefined") {
  Object.keys(introOptions.resources).forEach((id) => {
    options.resources[id] = introOptions.resources[id];
  });
}

// load footer resources
if (typeof footerOptions !== "undefined") {
  Object.keys(footerOptions.resources).forEach((id) => {
    options.resources[id] = footerOptions.resources[id];
  });
}

// carregar prototypes dos grãos
if (typeof grainOptions !== "undefined") {
  Object.keys(grainOptions.resources).forEach((id) => {
    options.resources[id] = grainOptions.resources[id];
  });
}

// carregar prototype persona
if (typeof personaOptions !== "undefined") {
  Object.keys(personaOptions.resources).forEach((id) => {
    options.resources[id] = personaOptions.resources[id];
  });
}

const createObjects = (app, resources) => {
  let allObjects = {};

  const tack1 = new PIXI.Sprite(resources.tack.texture);
  tack1.zIndex = 10;
  tack1.alpha = 0;
  configureObject2(app, tack1, 0.8, 400, 300);
  allObjects.tack1 = tack1;

  //---------------------------------------------------------
  //                  PERSONAGEM
  //---------------------------------------------------------
  const optionsPersona = {
    x: 400,
    y: 320,
    zIndex: -11,
    scale: 1.3,
    persona: "engineer",
    direction: "standing",
    headDirection: "ahead",
    texture: 3,
  };
  const persona = new CreatePersona(app, resources, optionsPersona);
  persona.x += 100;
  persona.configureDialogues({ x: 220, y: 120, zIndex: -12 });
  allObjects.persona = persona;

  const optionsPersona2 = {
    x: 1270,
    y: 300,
    zIndex: 10,
    scale: 1.2,
    persona: "engineer",
    direction: "diagonal",
    headDirection: "ahead",
    texture: 2,
  };
  const persona2 = new CreatePersona(app, resources, optionsPersona2);
  persona2.configureDialogues({ x: 1320, y: 240, zIndex: 9 });
  allObjects.persona2 = persona2;
  //---------------------------------------------------------

  // Plano cartesiano
  // const cartesiano = new PIXI.Sprite(resources.cartesiano.texture);
  // cartesiano.zIndex = -100;
  // configureObject(app, cartesiano, 800, 600, 400, 300);
  // cartesiano.alpha = 0.2;
  // allObjects.cartesiano = cartesiano;

  // Fundo dos textos que recebem o valor de pessagem de cada elemento
  const backgroundValues = new PIXI.Graphics();
  backgroundValues.beginFill(0xffffff, 1);
  backgroundValues.drawRoundedRect(565, 20, 150, 80, 16);
  backgroundValues.endFill();
  app.stage.addChild(backgroundValues);

  const styleTextValues = new PIXI.TextStyle({
    fontSize: 16,
    fill: 0x000000,
    align: "center",
  });

  const textValueTitle = new PIXI.Text("Peso em g", styleTextValues);
  textValueTitle.x = 600;
  textValueTitle.y = 25;
  textValueTitle.scale.set(1);
  app.stage.addChild(textValueTitle);
  allObjects.textValueTitle = textValueTitle;

  const textValueLens = new PIXI.Text("Vidro relógio: --:--", styleTextValues);
  textValueLens.x = 570;
  textValueLens.y = 50;
  textValueLens.scale.set(1);
  app.stage.addChild(textValueLens);
  allObjects.textValueLens = textValueLens;

  const textValueBecker = new PIXI.Text("Becker: --:--", styleTextValues);
  textValueBecker.x = 570;
  textValueBecker.y = 70;
  textValueBecker.scale.set(1);
  app.stage.addChild(textValueBecker);
  allObjects.textValueBecker = textValueBecker;

  const containerTextValuesItens = new PIXI.Container();
  configureObject(app, containerTextValuesItens, 0, 0, 0, 0);
  containerTextValuesItens.addChild(textValueLens, textValueBecker);
  allObjects.containerTextValuesItens = containerTextValuesItens;
  //-------------------------------------------------------

  // Criando a superficie onde os objetos ficaram.
  const surface = new PIXI.Sprite(resources.surface.texture);
  surface.zIndex = -10;
  configureObject2(app, surface, 0.25, 400, 535);
  allObjects.surface = surface;
  allObjects.surface.id = "surface";

  // Criando a superficie onde os objetos ficaram.
  const surface2 = new PIXI.Sprite(resources.surface.texture);
  surface2.zIndex = -10;
  configureObject2(app, surface2, 0.29, 1200, 700, false, false);
  allObjects.surface2 = surface2;
  allObjects.surface2.id = "surface2";

  const options = {
    type: "sand",
    size: "type1",
    x: 200,
    y: 120,
    finalY: 300,
    widthStart: 40,
    widthEnd: 40,
    heightStart: 40,
    heightEnd: 0,
    density: 1000,
    duration: 1.5,
    proximity: 3,
    visibleStart: false,
    visibleEnd: true,
  };
  const grains = new CreateGrains(app, resources, options);
  grains.zIndex = 1;
  allObjects.grains = grains;

  const staticBotton = new PIXI.Sprite(resources.staticBotton.texture);
  configureObject2(app, staticBotton, 0.4, 350, 370);
  staticBotton.zIndex = -2;
  allObjects.staticBotton = staticBotton;

  const colorProgressBar = new PIXI.Sprite(resources.colorProgressBar.texture);
  configureObject(app, colorProgressBar, 14, 17, 1007, 49);
  allObjects.colorProgressBar = colorProgressBar;

  const layoutBar = new PIXI.Sprite(resources.layoutBar.texture);
  configureObject(app, layoutBar, 466, 25, 1220, 49);
  allObjects.layoutBar = layoutBar;

  const styleTextBar = new PIXI.TextStyle({
    fontFamily: "DS-DIGI",
    fontSize: 16,
    fill: 0xffffff,
    align: "center",
    fontStyle: "bold",
  });

  const textBar = new PIXI.Text("0%", styleTextBar);
  textBar.x = 1415;
  textBar.y = 45;
  textBar.scale.set(1);
  app.stage.addChild(textBar);
  allObjects.textBar = textBar;

  const textBarClear = new PIXI.Text("");
  textBarClear.x = 1000;
  textBarClear.y = 10;
  textBarClear.scale.set(0.6);
  app.stage.addChild(textBarClear);
  allObjects.textBarClear = textBarClear;

  const tableProfile1 = new PIXI.Sprite(resources.tableProfile1.texture);
  configureObject2(app, tableProfile1, 1.26, 1200, 450);
  allObjects.tableProfile1 = tableProfile1;

  //bloco invisivel para posicionar melhor o objeto dentro da balança
  const invisibleBlock2 = new PIXI.Sprite(resources.invisibleBlock.texture);
  configureObject(app, invisibleBlock2, 100, 100, 350, 345);
  allObjects.invisibleBlock2 = invisibleBlock2;

  //Partes individuais da balança para sobreposição de objetos
  const balance_part1 = new PIXI.Sprite(resources.balance_part1.texture);
  balance_part1.zIndex = 1;
  configureObject2(app, balance_part1, 0.7, 200, 310);

  const balance_part2 = new PIXI.Sprite(resources.balance_part2.texture);
  configureObject2(app, balance_part2, 0.7, 200, 310);

  const displayStyle = new PIXI.TextStyle({
    fontFamily: "DS-DIGI",
    fontSize: 16,
    fill: 0x000000,
    align: "center",
    fontStyle: "bold",
  });

  //display do cronometro
  const TextChronometer = new PIXI.Text("00:00", displayStyle);
  TextChronometer.zIndex = 1;
  configureObject2(app, TextChronometer, 0.9, 740, 336, false);
  allObjects.TextChronometer = TextChronometer;

  //display da balança
  const TextBalance = new PIXI.Text("00:00", displayStyle);
  configureObject(app, TextBalance, 40, 15, 190, 380, true);
  allObjects.TextBalance = TextBalance;

  //bloco invisivel para posicionar melhor o objeto dentro da balança
  const invisibleBlock = new PIXI.Sprite(resources.invisibleBlock.texture);
  configureObject(app, invisibleBlock, 60, 60, 200, 320);
  allObjects.invisibleBlock = invisibleBlock;

  const containerBalance = new PIXI.Container();
  containerBalance.zIndex = -1;
  configureObject(app, containerBalance, 0, 0, 0, 0);
  containerBalance.addChild(balance_part2, invisibleBlock, TextBalance);
  allObjects.containerBalance = containerBalance;

  // criando interface para comportar as ferramentas da prática.
  //-----------------------------------------------------------
  const buttonMenuItens = new PIXI.Sprite(resources.menuItens.texture);
  configureObject(app, buttonMenuItens, 45, 45, 500, 100, true);
  allObjects.buttonMenuItens = buttonMenuItens;
  allObjects.buttonMenuItens.alpha = 0.9;

  const backgroudMenuItens = new PIXI.Sprite(
    resources.backgroudMenuItens.texture
  );
  configureObject(app, backgroudMenuItens, 300, 500, 680, 320);
  allObjects.backgroudMenuItens = backgroudMenuItens;
  allObjects.backgroudMenuItens.alpha = 0.9;

  const containerMenuItens = new PIXI.Container();
  configureObject(app, containerMenuItens, 0, 0, 270, 0);
  containerMenuItens.zIndex = 100;
  containerMenuItens.addChild(
    allObjects.buttonMenuItens,
    allObjects.backgroudMenuItens
  );
  allObjects.containerMenuItens = containerMenuItens;
  //-----------------------------------------------------------

  // criando interface para comportar os cimentos existentes na prática
  //------------------------------------------------------------------

  const containerMenuCements = new PIXI.Container();
  containerMenuCements.zIndex = 20;
  containerMenuCements.x = -270;
  app.stage.addChild(containerMenuCements);
  allObjects.containerMenuCements = containerMenuCements;

  const backgroudMenuCements = new PIXI.Sprite(
    resources.backgroudMenuItens.texture
  );
  configureObject(app, backgroudMenuCements, -300, 570, 120, 284);
  backgroudMenuCements.alpha = 0.9;
  allObjects.backgroudMenuCements = backgroudMenuCements;

  const bottonMenuCements = new PIXI.Sprite(
    resources.bottonMenuCements.texture
  );
  configureObject(app, bottonMenuCements, 45, 45, 300, 100, true);
  allObjects.bottonMenuCements = bottonMenuCements;

  containerMenuCements.addChild(backgroudMenuCements, bottonMenuCements);

  //------------------------------------------------------------------
  //------------------------------------------------------------------

  //------------------------------------------------------------------
  //             criação dos cimentos com suas classes
  //------------------------------------------------------------------

  const CP_I_25 = new PIXI.Sprite(resources.CP_I_25.texture);
  configureObject2(app, CP_I_25, 0.1, 50, 30, true, true);
  CP_I_25.id = "CP_I_25";
  CP_I_25.type = "cement";
  CP_I_25.value = randomNumber(20, 60);
  allObjects.CP_I_25 = CP_I_25;
  allObjects.CP_I_25.initial = formatObject(CP_I_25, 0.1, 50, 30, true, true);

  const CP_I_32 = new PIXI.Sprite(resources.CP_I_32.texture);
  configureObject2(app, CP_I_32, 0.1, 130, 30, true, true);
  CP_I_32.id = "CP_I_32";
  CP_I_32.type = "cement";
  CP_I_32.value = randomNumber(20, 60);
  allObjects.CP_I_32 = CP_I_32;
  allObjects.CP_I_32.initial = formatObject(CP_I_32, 0.1, 130, 30, true, true);

  const CP_I_40 = new PIXI.Sprite(resources.CP_I_40.texture);
  configureObject2(app, CP_I_40, 0.1, 210, 30, true, true);
  CP_I_40.id = "CP_I_40";
  CP_I_40.type = "cement";
  CP_I_40.value = randomNumber(20, 60);
  allObjects.CP_I_40 = CP_I_40;
  allObjects.CP_I_40.initial = formatObject(CP_I_40, 0.1, 210, 30, true, true);

  // const CP_I_S_25 = new PIXI.Sprite(resources.CP_I_S_25.texture);
  // configureObject2(app, CP_I_S_25, 0.1, 50, 100, true, true);
  // CP_I_S_25.id = 'CP_I_S_25'
  // CP_I_S_25.type = 'cement'
  // CP_I_S_25.value = randomNumber(20, 60);
  // allObjects.CP_I_S_25 = CP_I_S_25;
  // allObjects.CP_I_S_25.initial = formatObject(CP_I_S_25, 0.1, 50, 100, true, true);

  // const CP_I_S_32 = new PIXI.Sprite(resources.CP_I_S_32.texture);
  // configureObject2(app, CP_I_S_32, 0.1, 130, 100, true, true);
  // CP_I_S_32.id = 'CP_I_S_32'
  // CP_I_S_32.type = 'cement'
  // CP_I_S_32.value = randomNumber(20, 60);
  // allObjects.CP_I_S_32 = CP_I_S_32;
  // allObjects.CP_I_S_32.initial = formatObject(CP_I_S_32, 0.1, 130, 100, true, true);

  // const CP_I_S_40 = new PIXI.Sprite(resources.CP_I_S_40.texture);
  // configureObject2(app, CP_I_S_40, 0.1, 210, 100, true, true);
  // CP_I_S_40.id = 'CP_I_S_40'
  // CP_I_S_40.type = 'cement'
  // CP_I_S_40.value = randomNumber(20, 60);
  // allObjects.CP_I_S_40 = CP_I_S_40;
  // allObjects.CP_I_S_40.initial = formatObject(CP_I_S_40, 0.1, 210, 100, true, true);

  const CP_II_E_25 = new PIXI.Sprite(resources.CP_II_E_25.texture);
  configureObject2(app, CP_II_E_25, 0.1, 50, 100, true, true);
  CP_II_E_25.id = "CP_II_E_25";
  CP_II_E_25.type = "cement";
  CP_II_E_25.value = randomNumber(20, 60);
  allObjects.CP_II_E_25 = CP_II_E_25;
  allObjects.CP_II_E_25.initial = formatObject(
    CP_II_E_25,
    0.1,
    50,
    100,
    true,
    true
  );

  const CP_II_E_32 = new PIXI.Sprite(resources.CP_II_E_32.texture);
  configureObject2(app, CP_II_E_32, 0.1, 130, 100, true, true);
  CP_II_E_32.id = "CP_II_E_32";
  CP_II_E_32.type = "cement";
  CP_II_E_32.value = randomNumber(20, 60);
  allObjects.CP_II_E_32 = CP_II_E_32;
  allObjects.CP_II_E_32.initial = formatObject(
    CP_II_E_32,
    0.1,
    130,
    100,
    true,
    true
  );

  const CP_II_E_40 = new PIXI.Sprite(resources.CP_II_E_40.texture);
  configureObject2(app, CP_II_E_40, 0.1, 210, 100, true, true);
  CP_II_E_40.id = "CP_II_E_40";
  CP_II_E_40.type = "cement";
  CP_II_E_40.value = randomNumber(20, 60);
  allObjects.CP_II_E_40 = CP_II_E_40;
  allObjects.CP_II_E_40.initial = formatObject(
    CP_II_E_40,
    0.1,
    210,
    100,
    true,
    true
  );

  const CP_II_F_25 = new PIXI.Sprite(resources.CP_II_F_25.texture);
  configureObject2(app, CP_II_F_25, 0.1, 50, 170, true, true);
  CP_II_F_25.id = "CP_II_F_25";
  CP_II_F_25.type = "cement";
  CP_II_F_25.value = randomNumber(20, 60);
  allObjects.CP_II_F_25 = CP_II_F_25;
  allObjects.CP_II_F_25.initial = formatObject(
    CP_II_F_25,
    0.1,
    50,
    170,
    true,
    true
  );

  const CP_II_F_32 = new PIXI.Sprite(resources.CP_II_F_32.texture);
  configureObject2(app, CP_II_F_32, 0.1, 130, 170, true, true);
  CP_II_F_32.id = "CP_II_F_32";
  CP_II_F_32.type = "cement";
  CP_II_F_32.value = randomNumber(20, 60);
  allObjects.CP_II_F_32 = CP_II_F_32;
  allObjects.CP_II_F_32.initial = formatObject(
    CP_II_F_32,
    0.1,
    130,
    170,
    true,
    true
  );

  const CP_II_F_40 = new PIXI.Sprite(resources.CP_II_F_40.texture);
  configureObject2(app, CP_II_F_40, 0.1, 210, 170, true, true);
  CP_II_F_40.id = "CP_II_F_40";
  CP_II_F_40.type = "cement";
  CP_II_F_40.value = randomNumber(20, 60);
  allObjects.CP_II_F_40 = CP_II_F_40;
  allObjects.CP_II_F_40.initial = formatObject(
    CP_II_F_40,
    0.1,
    210,
    170,
    true,
    true
  );

  const CP_II_Z_25 = new PIXI.Sprite(resources.CP_II_Z_25.texture);
  configureObject2(app, CP_II_Z_25, 0.1, 50, 240, true, true);
  CP_II_Z_25.id = "CP_II_Z_25";
  CP_II_Z_25.type = "cement";
  CP_II_Z_25.value = randomNumber(20, 60);
  allObjects.CP_II_Z_25 = CP_II_Z_25;
  allObjects.CP_II_Z_25.initial = formatObject(
    CP_II_Z_25,
    0.1,
    50,
    240,
    true,
    true
  );

  const CP_II_Z_32 = new PIXI.Sprite(resources.CP_II_Z_32.texture);
  configureObject2(app, CP_II_Z_32, 0.1, 130, 240, true, true);
  CP_II_Z_32.id = "CP_II_Z_32";
  CP_II_Z_32.type = "cement";
  CP_II_Z_32.value = randomNumber(20, 60);
  allObjects.CP_II_Z_32 = CP_II_Z_32;
  allObjects.CP_II_Z_32.initial = formatObject(
    CP_II_Z_32,
    0.1,
    130,
    240,
    true,
    true
  );

  const CP_II_Z_40 = new PIXI.Sprite(resources.CP_II_Z_40.texture);
  configureObject2(app, CP_II_Z_40, 0.1, 210, 240, true, true);
  CP_II_Z_40.id = "CP_II_Z_40";
  CP_II_Z_40.type = "cement";
  CP_II_Z_40.value = randomNumber(20, 60);
  allObjects.CP_II_Z_40 = CP_II_Z_40;
  allObjects.CP_II_Z_40.initial = formatObject(
    CP_II_Z_40,
    0.1,
    210,
    240,
    true,
    true
  );

  const CP_III_25 = new PIXI.Sprite(resources.CP_III_25.texture);
  configureObject2(app, CP_III_25, 0.1, 50, 310, true, true);
  CP_III_25.id = "CP_III_25";
  CP_III_25.type = "cement";
  CP_III_25.value = randomNumber(20, 60);
  allObjects.CP_III_25 = CP_III_25;
  allObjects.CP_III_25.initial = formatObject(
    CP_III_25,
    0.1,
    50,
    310,
    true,
    true
  );

  const CP_III_32 = new PIXI.Sprite(resources.CP_III_32.texture);
  configureObject2(app, CP_III_32, 0.1, 130, 310, true, true);
  CP_III_32.id = "CP_III_32";
  CP_III_32.type = "cement";
  CP_III_32.value = randomNumber(20, 60);
  allObjects.CP_III_32 = CP_III_32;
  allObjects.CP_III_32.initial = formatObject(
    CP_III_32,
    0.1,
    130,
    310,
    true,
    true
  );

  const CP_III_40 = new PIXI.Sprite(resources.CP_III_40.texture);
  configureObject2(app, CP_III_40, 0.1, 210, 310, true, true);
  CP_III_40.id = "CP_III_40";
  CP_III_40.type = "cement";
  CP_III_40.value = randomNumber(20, 60);
  allObjects.CP_III_40 = CP_III_40;
  allObjects.CP_III_40.initial = formatObject(
    CP_III_40,
    0.1,
    210,
    310,
    true,
    true
  );

  const CP_IV_25 = new PIXI.Sprite(resources.CP_IV_25.texture);
  configureObject2(app, CP_IV_25, 0.1, 50, 380, true, true);
  CP_IV_25.id = "CP_IV_25";
  CP_IV_25.type = "cement";
  CP_IV_25.value = randomNumber(20, 60);
  allObjects.CP_IV_25 = CP_IV_25;
  allObjects.CP_IV_25.initial = formatObject(
    CP_IV_25,
    0.1,
    50,
    380,
    true,
    true
  );

  const CP_IV_32 = new PIXI.Sprite(resources.CP_IV_32.texture);
  configureObject2(app, CP_IV_32, 0.1, 130, 380, true, true);
  CP_IV_32.id = "CP_IV_32";
  CP_IV_32.type = "cement";
  CP_IV_32.value = randomNumber(20, 60);
  allObjects.CP_IV_32 = CP_IV_32;
  allObjects.CP_IV_32.initial = formatObject(
    CP_IV_32,
    0.1,
    130,
    380,
    true,
    true
  );

  const CP_IV_40 = new PIXI.Sprite(resources.CP_IV_40.texture);
  configureObject2(app, CP_IV_40, 0.1, 210, 380, true, true);
  CP_IV_40.id = "CP_IV_40";
  CP_IV_40.type = "cement";
  CP_IV_40.value = randomNumber(20, 60);
  allObjects.CP_IV_40 = CP_IV_40;
  allObjects.CP_IV_40.initial = formatObject(
    CP_IV_40,
    0.1,
    210,
    380,
    true,
    true
  );

  const CP_V_ARI = new PIXI.Sprite(resources.CP_V_ARI.texture);
  configureObject2(app, CP_V_ARI, 0.1, 50, 450, true, true);
  CP_V_ARI.id = "CP_V_ARI";
  CP_V_ARI.type = "cement";
  CP_V_ARI.value = randomNumber(20, 60);
  allObjects.CP_V_ARI = CP_V_ARI;
  allObjects.CP_V_ARI.initial = formatObject(
    CP_V_ARI,
    0.1,
    50,
    450,
    true,
    true
  );

  // INSERINDO TODOS OS CIMENTOS NO CONTAINER DE MENU/ABA
  containerMenuCements.addChild(
    CP_I_25,
    CP_I_32,
    CP_I_40,
    // CP_I_S_25,
    // CP_I_S_32,
    // CP_I_S_40,
    CP_II_E_25,
    CP_II_E_32,
    CP_II_E_40,
    CP_II_F_25,
    CP_II_F_32,
    CP_II_F_40,
    CP_II_Z_25,
    CP_II_Z_32,
    CP_II_Z_40,
    CP_III_25,
    CP_III_32,
    CP_III_40,
    CP_IV_25,
    CP_IV_32,
    CP_IV_40,
    CP_V_ARI
  );

  // array para atribuição e testes dos cimentos
  let arrayCements = [];
  arrayCements.push(
    CP_I_25,
    CP_I_32,
    CP_I_40,
    // CP_I_S_25,
    // CP_I_S_32,
    // CP_I_S_40,
    CP_II_E_25,
    CP_II_E_32,
    CP_II_E_40,
    CP_II_F_25,
    CP_II_F_32,
    CP_II_F_40,
    CP_II_Z_25,
    CP_II_Z_32,
    CP_II_Z_40,
    CP_III_25,
    CP_III_32,
    CP_III_40,
    CP_IV_25,
    CP_IV_32,
    CP_IV_40,
    CP_V_ARI
  );
  allObjects.arrayCements = arrayCements;

  const maskCement = new PIXI.Sprite(resources.maskCement.texture);
  configureObject2(app, maskCement, 0.3, 0, 0);
  allObjects.maskCement = maskCement;

  const containerCementForBecker = new PIXI.Container();
  configureObject(app, containerCementForBecker, 0, 0, 500, 310);
  allObjects.containerCementForBecker = containerCementForBecker;

  //------------------------------------------------------------------
  //------------------------------------------------------------------

  const shell = new PIXI.Sprite(resources.shell1.texture);
  configureObject2(app, shell, 0.15, 640, 360);
  shell.zIndex = -1;
  allObjects.shell = shell;

  // parte individuais do becker para sobreposição de elementos dentro
  const becker_part1 = new PIXI.Sprite(resources.becker_part1.texture);
  configureObject2(app, becker_part1, 0.2, 0, 0);
  allObjects.becker_part1 = becker_part1;
  const becker_part2 = new PIXI.Sprite(resources.becker_part2.texture);
  configureObject2(app, becker_part2, 0.2, 0, 0);
  allObjects.becker_part2 = becker_part2;

  const becker = new PIXI.Container();
  configureObject(app, becker, 0, 0, 640, 240);
  becker.addChild(becker_part1, becker_part2);
  allObjects.becker = becker;
  allObjects.becker.flagUnic = true;
  allObjects.becker.value = randomNumber(3, 7);

  const timer = new PIXI.Sprite(resources.timer.texture);
  configureObject2(app, timer, 0.5, 740, 360, true);
  allObjects.timer = timer;

  const bottonSieve = new PIXI.Sprite(resources.bottonSieve.texture);
  configureObject2(app, bottonSieve, 1.2, 1133, 330, true);
  allObjects.bottonSieve = bottonSieve;

  const topSieve = new PIXI.Sprite(resources.topSieve.texture);
  configureObject2(app, topSieve, 1.2, 1133, 300, true);
  allObjects.topSieve = topSieve;

  // criando flanela com partes separadas inseridas no container para efeito ao mover.
  const flannel_part1 = new PIXI.Sprite(resources.flannel_part1.texture);
  configureObject2(app, flannel_part1, 0.3, 0, 0);
  const flannel_part2 = new PIXI.Sprite(resources.flannel_part2.texture);
  configureObject2(app, flannel_part2, 0.3, 0, 7);
  const flannel = new PIXI.Container();
  configureObject(app, flannel, 50, 100, 640, 120, true);
  flannel.addChild(flannel_part2, flannel_part1);
  allObjects.flannel = flannel;
  allObjects.flannel_part1 = flannel_part1;
  allObjects.flannel_part2 = flannel_part2;

  const stick = new PIXI.Sprite(resources.stick.texture);
  configureObject2(app, stick, 0.4, 740, 240, true);
  allObjects.stick = stick;

  const brush = new PIXI.Sprite(resources.brush.texture);
  configureObject2(app, brush, 0.08, 740, 120, true);
  brush.name = "brush";
  allObjects.brush = brush;

  const lens1 = new PIXI.Sprite(resources.lens1.texture);
  configureObject2(app, lens1, 0.2, 640, 360, true);
  allObjects.lens1 = lens1;
  allObjects.lens1.name = "lens1";
  allObjects.lens1.flag = false;
  allObjects.lens1.value = randomNumber(3, 5);

  const cover = new PIXI.Sprite(resources.cover.texture);
  cover.zIndex = 2;
  configureObject2(app, cover, 0.35, 740, 480, true);
  allObjects.cover = cover;

  // definção de quantidade de grão criados e de forma aleatoria em determinada area
  //--------------------------------------------------------------------------------
  const containerGrainBrush = new PIXI.Container();
  app.stage.addChild(containerGrainBrush);
  allObjects.containerGrainBrush = containerGrainBrush;
  // controlador da posição dos grãos gerados aleatoriamente.
  containerGrainBrush.x = 1070;
  containerGrainBrush.y = 283;
  containerGrainBrush.zIndex = 1;

  const arryGrainsBrush = [];
  for (let i = 0; i < 300; i++) {
    createGrainsBrush(
      Math.floor(Math.random() * 135),
      Math.floor(Math.random() * 100),
      arryGrainsBrush
    );
  }
  allObjects.arryGrainsBrush = arryGrainsBrush;

  const arryGrainsBrush2 = [];
  for (let i = 0; i < 300; i++) {
    createGrainsBrush(
      Math.floor(Math.random() * 135),
      Math.floor(Math.random() * 100),
      arryGrainsBrush2
    );
  }
  allObjects.arryGrainsBrush2 = arryGrainsBrush2;

  const arryGrainsBrush3 = [];
  for (let i = 0; i < 100; i++) {
    createGrainsBrush(
      Math.floor(Math.random() * 135),
      Math.floor(Math.random() * 100),
      arryGrainsBrush3
    );
  }
  allObjects.arryGrainsBrush3 = arryGrainsBrush3;

  function createGrainsBrush(x, y, array) {
    const remainingGrains = new PIXI.Sprite(resources.grain.texture);
    remainingGrains.alpha = 0;
    remainingGrains.scale.set(0.01);
    remainingGrains.x = x;
    remainingGrains.y = y;
    array.push(remainingGrains);
    containerGrainBrush.addChild(remainingGrains);
  }
  //--------------------------------------------------------------------------------

  // definção de quantidade de grão criados e de forma aleatoria em determinada area
  //--------------------------------------------------------------------------------
  const containerGrainFlannel = new PIXI.Container();
  app.stage.addChild(containerGrainFlannel);
  allObjects.containerGrainFlannel = containerGrainFlannel;
  // controlador da posição dos grãos gerados aleatoriamente.
  containerGrainFlannel.x = 1070;
  containerGrainFlannel.y = 283;
  containerGrainFlannel.zIndex = 1;

  const arryGrainsFlannel = [];
  for (let i = 0; i < 100; i++) {
    createGrainsFlannel(
      Math.floor(Math.random() * 135),
      Math.floor(Math.random() * 100),
      arryGrainsFlannel
    );
  }
  allObjects.arryGrainsFlannel = arryGrainsFlannel;

  const arryGrainsFlannel2 = [];
  for (let i = 0; i < 100; i++) {
    createGrainsFlannel(
      Math.floor(Math.random() * 135),
      Math.floor(Math.random() * 100),
      arryGrainsFlannel2
    );
  }

  allObjects.arryGrainsFlannel2 = arryGrainsFlannel2;

  const arryGrainsFlannel3 = [];
  for (let i = 0; i < 60; i++) {
    createGrainsFlannel(
      Math.floor(Math.random() * 135),
      Math.floor(Math.random() * 100),
      arryGrainsFlannel3
    );
  }
  allObjects.arryGrainsFlannel3 = arryGrainsFlannel3;

  function createGrainsFlannel(x, y, array) {
    const remainingGrains = new PIXI.Sprite(resources.grain.texture);
    remainingGrains.anchor.set(0.5);
    remainingGrains.alpha = 0;
    remainingGrains.scale.set(0.01);
    remainingGrains.x = x;
    remainingGrains.y = y;
    array.push(remainingGrains);
    containerGrainFlannel.addChild(remainingGrains);
  }
  //--------------------------------------------------------------------------------

  // definção de quantidade de grão criados e de forma aleatoria em determinada area
  //--------------------------------------------------------------------------------
  const containerGrains1 = new PIXI.Container();
  app.stage.addChild(containerGrains1);
  allObjects.containerGrains1 = containerGrains1;
  // controlador da posição dos grãos gerados aleatoriamente.
  containerGrains1.zIndex = 1;
  containerGrains1.x = 1070;
  containerGrains1.y = 250;

  const arrayGrains1 = [];
  for (let i = 0; i < 300; i++) {
    createGrains(
      Math.floor(Math.random() * 135),
      Math.floor(Math.random() * 100),
      arrayGrains1
    );
  }
  allObjects.arrayGrains1 = arrayGrains1;

  const arrayGrains2 = [];
  for (let i = 0; i < 300; i++) {
    createGrains(
      Math.floor(Math.random() * 135),
      Math.floor(Math.random() * 100),
      arrayGrains2
    );
  }
  arrayGrains2.forEach((object) => (object.visible = true));
  allObjects.arrayGrains2 = arrayGrains2;

  const arrayGrains3 = [];
  for (let i = 0; i < 300; i++) {
    createGrains(
      Math.floor(Math.random() * 135),
      Math.floor(Math.random() * 100),
      arrayGrains3
    );
  }
  arrayGrains3.forEach((object) => (object.visible = true));
  allObjects.arrayGrains3 = arrayGrains3;

  function createGrains(x, y, array) {
    const remainingGrains = new PIXI.Sprite(resources.grain.texture);
    remainingGrains.anchor.set(0.5);
    remainingGrains.visible = true;
    remainingGrains.scale.set(0.01);
    remainingGrains.x = x;
    remainingGrains.y = y;
    array.push(remainingGrains);
    containerGrains1.addChild(remainingGrains);
  }
  //--------------------------------------------------------------------------------

  const sieve_75 = new PIXI.Sprite(resources.sieve75.texture);
  configureObject2(app, sieve_75, 0.4, 640, 480, true);
  allObjects.sieve_75 = sieve_75;
  allObjects.sieve_75.id = "s2";
  allObjects.sieve_75.type = "sieve";
  allObjects.sieve_75.initial = formatObject(
    sieve_75,
    0.4,
    640,
    480,
    true,
    true
  );

  // adicionanco os itens ao container do menu de itens
  allObjects.containerMenuItens.addChild(
    sieve_75,
    flannel,
    brush,
    becker,
    stick,
    lens1,
    timer,
    cover,
    TextChronometer
  );

  // Container onde irá ficar os objetos para peneiramento
  const containerScreening = new PIXI.Container();
  configureObject(app, containerScreening, 0, 0, 0, 0, true);
  allObjects.containerScreening = containerScreening;

  const button = new PIXI.Sprite(resources.button.texture);
  configureObject(app, button, 90, 80, 40, 40);
  button.alpha = 0;
  allObjects.button = button;

  //--------------------------------------------------------------------------------
  //                       CHECAR SE VARREU O FUNDO DA PENEIRA
  //--------------------------------------------------------------------------------

  const okCheck0 = new PIXI.Sprite(resources.okCheck.texture);
  configureObject2(app, okCheck0, 0.25, 1010, 85);
  okCheck0.alpha = 0;
  allObjects.okCheck0 = okCheck0;

  const okCheck1 = new PIXI.Sprite(resources.okCheck.texture);
  configureObject2(app, okCheck1, 0.25, 1010, 120);
  okCheck1.alpha = 0;
  allObjects.okCheck1 = okCheck1;

  const okCheck2 = new PIXI.Sprite(resources.okCheck.texture);
  okCheck2.alpha = 0;
  configureObject2(app, okCheck2, 0.25, 1010, 155);
  allObjects.okCheck2 = okCheck2;

  const checkStick = new PIXI.Sprite(resources.checkStick.texture);
  checkStick.alpha = 0;
  configureObject2(app, checkStick, 0.26, 1067, 85);
  allObjects.checkStick = checkStick;

  const checkBrush = new PIXI.Sprite(resources.checkBrush.texture);
  checkBrush.alpha = 0;
  configureObject2(app, checkBrush, 0.2, 1057, 120);
  allObjects.checkBrush = checkBrush;

  const checkflannel = new PIXI.Sprite(resources.checkflannel.texture);
  checkflannel.alpha = 0;
  configureObject2(app, checkflannel, 0.2, 1057, 155);
  allObjects.checkflannel = checkflannel;

  //-------------------------------------------------------------------------------------------
  //-------------------------------------------------------------------------------------------
  //                            LOCAL DE CRIAÇÃO DE TEXTO
  //-------------------------------------------------------------------------------------------
  //-------------------------------------------------------------------------------------------

  //fonte utilizada para todos os textos ao passar o mouse
  const styleOver = new PIXI.TextStyle({
    fontFamily: "sans-serif",
    fontSize: 16,
    fill: 0x363636,
    align: "center",
    fontStyle: "bold",
  });

  const textTimer = new PIXI.Text(texts.over.timer, styleOver);
  configureObject2(app, textTimer, 1, 740, 410, false, true);
  allObjects.textTimer = textTimer;

  const textBrush = new PIXI.Text(texts.over.brush, styleOver);
  configureObject2(app, textBrush, 1, 740, 170, false, true);
  allObjects.textBrush = textBrush;

  const textFlannel = new PIXI.Text(texts.over.flannel, styleOver);
  configureObject2(app, textFlannel, 1, 640, 170, false, true);
  allObjects.textFlannel = textFlannel;

  const textBecker = new PIXI.Text(texts.over.becker, styleOver);
  configureObject2(app, textBecker, 1, 640, 300, false, true);
  allObjects.textBecker = textBecker;

  const textStick = new PIXI.Text(texts.over.stick, styleOver);
  configureObject2(app, textStick, 1, 740, 300, false, true);
  allObjects.textStick = textStick;

  const textLens1 = new PIXI.Text(texts.over.lens1, styleOver);
  configureObject2(app, textLens1, 1, 640, 410, false, true);
  allObjects.textLens1 = textLens1;

  const textCover = new PIXI.Text(texts.over.cover, styleOver);
  configureObject2(app, textCover, 1, 740, 530, false, true);
  allObjects.textCover = textCover;

  const textTopSieve = new PIXI.Text(texts.over.topSieve, styleOver);
  configureObject2(app, textTopSieve, 1, 640, 530, false, true);
  allObjects.textTopSieve = textTopSieve;

  const textCP_I_25 = new PIXI.Text(texts.over.textCP_I_25, styleOver);
  configureObject2(app, textCP_I_25, 1, 50, 67, false, true);
  allObjects.textCP_I_25 = textCP_I_25;

  const textCP_I_32 = new PIXI.Text(texts.over.textCP_I_32, styleOver);
  configureObject2(app, textCP_I_32, 1, 130, 67, false, true);
  allObjects.textCP_I_32 = textCP_I_32;

  const textCP_I_40 = new PIXI.Text(texts.over.textCP_I_40, styleOver);
  configureObject2(app, textCP_I_40, 1, 210, 67, false, true);
  allObjects.textCP_I_40 = textCP_I_40;

  // const textCP_I_S_25 = new PIXI.Text(texts.over.textCP_I_S_25, styleOver);
  // configureObject2(app, textCP_I_S_25, 1, 50, 137, false, true);
  // allObjects.textCP_I_S_25 = textCP_I_S_25;

  // const textCP_I_S_32 = new PIXI.Text(texts.over.textCP_I_S_32, styleOver);
  // configureObject2(app, textCP_I_S_32, 1, 130, 137, false, true);
  // allObjects.textCP_I_S_32 = textCP_I_S_32;

  // const textCP_I_S_40 = new PIXI.Text(texts.over.textCP_I_S_40, styleOver);
  // configureObject2(app, textCP_I_S_40, 1, 210, 137, false, true);
  // allObjects.textCP_I_S_40 = textCP_I_S_40;

  const textCP_II_E_25 = new PIXI.Text(texts.over.textCP_II_E_25, styleOver);
  configureObject2(app, textCP_II_E_25, 1, 50, 137, false, true);
  allObjects.textCP_II_E_25 = textCP_II_E_25;

  const textCP_II_E_32 = new PIXI.Text(texts.over.textCP_II_E_32, styleOver);
  configureObject2(app, textCP_II_E_32, 1, 130, 137, false, true);
  allObjects.textCP_II_E_32 = textCP_II_E_32;

  const textCP_II_E_40 = new PIXI.Text(texts.over.textCP_II_E_40, styleOver);
  configureObject2(app, textCP_II_E_40, 1, 210, 137, false, true);
  allObjects.textCP_II_E_40 = textCP_II_E_40;

  const textCP_II_F_25 = new PIXI.Text(texts.over.textCP_II_F_25, styleOver);
  configureObject2(app, textCP_II_F_25, 1, 50, 207, false, true);
  allObjects.textCP_II_F_25 = textCP_II_F_25;

  const textCP_II_F_32 = new PIXI.Text(texts.over.textCP_II_F_32, styleOver);
  configureObject2(app, textCP_II_F_32, 1, 130, 207, false, true);
  allObjects.textCP_II_F_32 = textCP_II_F_32;

  const textCP_II_F_40 = new PIXI.Text(texts.over.textCP_II_F_40, styleOver);
  configureObject2(app, textCP_II_F_40, 1, 210, 207, false, true);
  allObjects.textCP_II_F_40 = textCP_II_F_40;

  const textCP_II_Z_25 = new PIXI.Text(texts.over.textCP_II_Z_25, styleOver);
  configureObject2(app, textCP_II_Z_25, 1, 50, 277, false, true);
  allObjects.textCP_II_Z_25 = textCP_II_Z_25;

  const textCP_II_Z_32 = new PIXI.Text(texts.over.textCP_II_Z_32, styleOver);
  configureObject2(app, textCP_II_Z_32, 1, 130, 277, false, true);
  allObjects.textCP_II_Z_32 = textCP_II_Z_32;

  const textCP_II_Z_40 = new PIXI.Text(texts.over.textCP_II_Z_40, styleOver);
  configureObject2(app, textCP_II_Z_40, 1, 210, 277, false, true);
  allObjects.textCP_II_Z_40 = textCP_II_Z_40;

  const textCP_III_25 = new PIXI.Text(texts.over.textCP_III_25, styleOver);
  configureObject2(app, textCP_III_25, 1, 50, 347, false, true);
  allObjects.textCP_III_25 = textCP_III_25;

  const textCP_III_32 = new PIXI.Text(texts.over.textCP_III_32, styleOver);
  configureObject2(app, textCP_III_32, 1, 130, 347, false, true);
  allObjects.textCP_III_32 = textCP_III_32;

  const textCP_III_40 = new PIXI.Text(texts.over.textCP_III_40, styleOver);
  configureObject2(app, textCP_III_40, 1, 210, 347, false, true);
  allObjects.textCP_III_40 = textCP_III_40;

  const textCP_IV_25 = new PIXI.Text(texts.over.textCP_IV_25, styleOver);
  configureObject2(app, textCP_IV_25, 1, 50, 417, false, true);
  allObjects.textCP_IV_25 = textCP_IV_25;

  const textCP_IV_32 = new PIXI.Text(texts.over.textCP_IV_32, styleOver);
  configureObject2(app, textCP_IV_32, 1, 130, 417, false, true);
  allObjects.textCP_IV_32 = textCP_IV_32;

  const textCP_IV_40 = new PIXI.Text(texts.over.textCP_IV_40, styleOver);
  configureObject2(app, textCP_IV_40, 1, 210, 417, false, true);
  allObjects.textCP_IV_40 = textCP_IV_40;

  const textCP_V_ARI = new PIXI.Text(texts.over.textCP_V_ARI, styleOver);
  configureObject2(app, textCP_V_ARI, 1, 50, 487, false, true);
  allObjects.textCP_V_ARI = textCP_V_ARI;

  const graphics = new PIXI.Graphics();
  graphics.beginFill(0xf5fffa);
  //                x   y   widh heigth
  graphics.drawRect(10, 60, 240, 15);
  graphics.drawRect(10, 130, 240, 15);
  graphics.drawRect(10, 200, 240, 15);
  graphics.drawRect(10, 270, 240, 15);
  graphics.drawRect(10, 340, 240, 15);
  graphics.drawRect(10, 410, 240, 15);
  graphics.drawRect(10, 480, 240, 15);

  graphics.endFill();

  app.stage.addChild(graphics);

  containerMenuCements.addChild(
    graphics,
    textCP_I_25,
    textCP_I_32,
    textCP_I_40,
    // textCP_I_S_25,
    // textCP_I_S_32,
    // textCP_I_S_40,
    textCP_II_E_25,
    textCP_II_E_32,
    textCP_II_E_40,
    textCP_II_F_25,
    textCP_II_F_32,
    textCP_II_F_40,
    textCP_II_Z_25,
    textCP_II_Z_32,
    textCP_II_Z_40,
    textCP_III_25,
    textCP_III_32,
    textCP_III_40,
    textCP_IV_25,
    textCP_IV_32,
    textCP_IV_40,
    textCP_V_ARI
  );

  // irá receber todos os textos de objetos no bandeja de itens
  containerMenuItens.addChild(
    textTimer,
    textBecker,
    textStick,
    textCover,
    textFlannel,
    textTopSieve,
    textLens1,
    textBrush
  );
  //-------------------------------------------------------------------------------------------

  const buttonReload = new PIXI.Sprite(resources.button.texture);
  configureObject2(app, buttonReload, 0.5, 400, 300, false);
  buttonReload.on("pointerdown", () => {
    location.reload();
  });
  buttonReload.alpha = 0;
  buttonReload.zIndex = 100;
  allObjects.buttonReload = buttonReload;

  //fonte utilizada para todos os textos ao passar o mouse
  const styleReload = new PIXI.TextStyle({
    fontFamily: "sans-serif",
    fontSize: 16,
    fill: 0x363636,
    align: "center",
    fontStyle: "bold",
  });
  const textButtonReload = new PIXI.Text(
    "Peso final inválido de acordo com a norma.\nClique no botão para reiniciar o teste.",
    styleReload
  );
  textButtonReload.zIndex = 100;
  textButtonReload.alpha = 0;
  configureObject2(app, textButtonReload, 1, 400, 370);
  allObjects.textButtonReload = textButtonReload;

  const backgroudButtonReload = new PIXI.Graphics();
  backgroudButtonReload.zIndex = 99;
  backgroudButtonReload.alpha = 0;
  backgroudButtonReload.beginFill(0xf5fffa);
  //                             x   y   widh heigth
  backgroudButtonReload.drawRect(225, 352, 350, 40);
  app.stage.addChild(backgroudButtonReload);
  allObjects.backgroudButtonReload = backgroudButtonReload;

  return allObjects;
};

module.exports = {
  options,
  createObjects,
};

},{"./functions":2,"./texts":5}],4:[function(require,module,exports){
// const PIXI = require('pixi.js');

const setup = (options, onReady) => {
    const settings = {
        width: options.width,
        height: options.height,
        backgroundColor: options.backgroundColor,
        antialias: true
    }

    let app;
    PIXI.settings.FAIL_IF_MAJOR_PERFORMANCE_CAVEAT = false;

    // WebGL support condition
    if(PIXI.utils.isWebGLSupported()){
        app = new PIXI.Application(settings);
    }else{
        settings.forceCanvas = true;
        app = new PIXI.Application(settings);
    }


    const fontsToLoad = [];
    options.fontFamilies.forEach(fontFamily => {
        const font = new FontFaceObserver(fontFamily);
        fontsToLoad.push(font);
    });


    document.querySelector(options.targetSelector).appendChild(app.view);
    
    PixiPlugin.registerPIXI(PIXI);

    const pixiLoader = new PIXI.Loader();
    Object.keys(options.resources).forEach(id => {
        pixiLoader.add(id, options.resources[id]);
    })

    Promise.all(
        fontsToLoad.map(font => font.load())
    ).then(() => {
        pixiLoader.load((_,pixiResources)=>{
            onReady(app,pixiResources)
        });
    });
    
    // teste de zIndex atenção caso tenha que remover esse atributo
    app.stage.sortableChildren = true;
}

module.exports = setup;
},{}],5:[function(require,module,exports){
module.exports={
    "footer" : {
        "title": "Finura do cimento", 
        "version": 1.0,
        "year": 2022,
        "collaborators": {
            "Desenvolvedores": "Jailson Junior, Maurício Alves, Emerson José, Thiago Nascimento, Angélica Martiniano, David Mateus, Mateus Sobrenome, Alexandre Sobrenome",
            "Professor conteudista": "Iury Sousa",
            "Ilustradores": "Ana Carolina",
            "Gerente": "Heloisa Pimentel, Adilson Da Silva",
            "afsdhjk": "dfahsjgfhasdj"
        }
    },

    "over": {
        "timer": "Cronômetro",
        "brush": "Pincel",
        "flannel":"Flanela",
        "becker":"balde",
        "stick":"Bastão",
        "lens1":"Lente",
        "cover":"Tampa",
        "topSieve":"Peneira",
        "bottonSieve":"Fundo",
        "textCP_I_25":"CP I 25",
        "textCP_I_32":"CP I 32",
        "textCP_I_40":"CP I 40",
        "textCP_I_S_25":"CP I S 25",
        "textCP_I_S_32":"CP I S 32",
        "textCP_I_S_40":"CP I S 40",
        "textCP_II_E_25":"CP II E 25",
        "textCP_II_E_32":"CP II E 32",
        "textCP_II_E_40":"CP II E 40",
        "textCP_II_F_25":"CP II F 25",
        "textCP_II_F_32":"CP II F 32",
        "textCP_II_F_40":"CP II F 40",
        "textCP_II_Z_25":"CP II Z 25",
        "textCP_II_Z_32":"CP II Z 32",
        "textCP_II_Z_40":"CP II Z 40",
        "textCP_III_25":"CP III 25",
        "textCP_III_32":"CP III 30",
        "textCP_III_40":"CP III 40",
        "textCP_IV_25":"CP IV 25",
        "textCP_IV_32":"CP IV 32",
        "textCP_IV_40":"CP IV 40",
        "textCP_V_ARI":"CP V ARI"      
    }
}
},{}]},{},[1]);
