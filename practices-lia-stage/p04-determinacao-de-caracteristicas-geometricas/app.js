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
const setup = require('./setup-v3');
const {options, createObjects} = require('./objects');
const texts = require('./texts');

const {
    randomNumber,
    randomFloatNumber,
    configureObject,
} = require('./functions');


// MAIN

(function main() {
    setup(options, (app, resources) => {

        const timeline = gsap.timeline();
        const gsapMain = timeline;
        const timelineControl = () => timeline.paused(!timeline.paused());
    
        const mainTimeline = () => {
    
          const timeline = gsapMain;
          // timeline.add(intro(app, resources));
          timeline.add(footer(app, resources, texts));
      
    
          return timeline;
        };

        /* CREATE ITEMS SCOPE */
        const allObjects = createObjects(app, resources);
        const {
          persona,
        } = allObjects;
    
        function insertDialogue(text, pause = false) {
    
          const insert = gsap.timeline();
          insert.to(dialogBox, {
            pixi: {
              visible: true,
            }
          }, 0);
          insert.set(textDialogue, {
            pixi: {
              text: text,
            }
          }, 0);
    
          if (pause) {
            insert.to(nextButton, { pixi: { visible: true } });
    
            insert.call(timelineControl);
    
            insert.to(nextButton, { pixi: { visible: false } });
          }
    
          return insert;
        }
    
        function removeDialogue() {
          let remove = gsap.timeline();
    
          remove.to(textDialogue, {
            pixi: {
              text: "",
            }
          }, 0);
          remove.to(dialogBox, {
            pixi: {
              visible: false,
            }
          }, 0);
    
          return remove;
        }
    
        const textCharacter = new PIXI.TextStyle({
          fontFamily: "Roboto",
          wordWrap: true,
          wordWrapWidth: 250,
          fontSize: 16,
          fill: 0x000000,
          backgroundColor: 0xffffff,
        });
    
        function initialPosition() {
          const durationAction = 0.4;
          const delayT = 0;
          const initial = timeline;
    
          //remove a introdução de texto
          backgroundIntro.visible = false;
          introButton.visible = false;
          textIntro.visible = false;
    
          // remove interaction in the container pachymeter
          pachymeterContainer.interactive = false;
          pachymeterContainer.buttonMode = false;
          pachymeter.part.interactive = false;
          pachymeter.part.buttonMode = false;
      
          initial.to(ruler, {
            pixi: {
              x: 670
            }
          });
    
          // call measure
          initial.to(measure, {
            pixi: {
              x: 500,
            },
            duration: durationAction,
            delay: delayT,
          });
    
          initial.to(defletometro, {
            pixi: {
              x: 590
            }
          });
    
          initial.to(square, {
            pixi: {
              x: 550
            }
          });
          
    
          initial.to(pachymeterContainer,{
            pixi: {
              x: 440
            }
          })
    
          // call block
          initial.to(block, {
            pixi: {
              x: 200,
            },
            duration: durationAction,
            delay: delayT,
          });
    
          return initial;
        }
    
        let flagBriks = true;
        let mediaBlocks = [];
        function onStep0() {
    
          const controlTime = timeline;
          const remove = gsap.timeline();
    
          textStep0.visible = true;
    
          // Drop elements
          remove.to(textDialogue, {
            pixi: { visible: false }
          },0);
          remove.to(square, {
            pixi: { x: -400 }
          },0);
          remove.to(nextButton, {
            visible: false
          },0);
          remove.to(dialogBox, {
            pixi: { visible: false }
          },0);
          remove.to(block, {
            pixi: { x: -400 }
          },0);
          remove.to(pachymeterContainer, {
            pixi: { x: -400 }
          },0);
          remove.to(measure, {
            pixi: { x: -400 }
          },0);
          remove.to(defletometro, {
            pixi: { x: -400 }
          },0);
          remove.to(table1, {
            pixi: { x: -400 }
          },0);
    
          controlTime.to( board,{
            pixi: {
                x: 140,
                width: 320,
                visible: true
            },
            duration: 1,
            delay: 0,
          },1);
    
          // keep
          controlTime.to(table_horizon, {
            delay: 1
          });
    
          // posicionando os objetos 
          controlTime.to(table_horizon, {
            pixi: {
              x: 400,
            }
          });
    
          controlTime.to(ruler, {
            pixi: {
              x: 700,
              y: 500,
              width: 200,
              height: 190,
            }
          });
    
          controlTime.to(Bricks,{
            pixi: { x: -140}
          });
        
          if (flagBriks){
    
            controlTime.call(() => {
            // Create a 13 grid of blocks in .X
            for (let i = 0; i < 13; i++) {
              const faceBlock = new PIXI.Sprite(resources.faceBlock.texture);
              faceBlock.width = 400;
              faceBlock.height = 400;
              faceBlock.x = i * 54.9;
              faceBlock.y = -700;
              
              controlTime.to(faceBlock, {
                pixi: {
                  y: -15
                }
              })
              
              Bricks.addChild(faceBlock);
            }
    
            controlTime.to(ruler, {
              pixi: {
                x: 785,
                y: 395,
                width: 60,
                height: 50
              }
            });
    
            controlTime.to(scaleRuler, {
              pixi: {
                x: 440
              },
              duration: 1.5
            });
    
            rulerFlag = false;
            
          
            controlTime.to(scaleRuler, {
              pixi: {
                x: 2000
              },
              delay: 1,
              duration: 1.1
            });
            
            controlTime.call(()=>{
    
              if(mediaBlocks[1] === undefined){
                mediaBlocks[1] = {id: 1, valor: randomFloatNumber(241.8, 252.2)};
                texts.mediaBlocks.valor1 = "Comprimento total dos 13\nblocos nas dimenssões\n\n- Comprimento: " + mediaBlocks[1].valor+"cm";
                // text1 step0
                const infoBoard = new PIXI.Text(texts.mediaBlocks.valor1, textCharacter);
                infoBoard.x = 40;
                infoBoard.y= 15;
                textStep0.addChild(infoBoard);
                infoBoard.visible = true;
              }
            });
    
            controlTime.to(Bricks, {
              pixi: {
                x: 2000
              },
              delay: 2,
              duration: 2,
            });
    
          });
    
          controlTime.call(() => {
            // Create a 13 grid of blocks in .X
            for (let i = 0; i < 13; i++) {
              signal1 = true;
              const block_top = new PIXI.Sprite(resources.block_frente.texture);
              block_top.width = 25; // 25, 50
              block_top.height = 50;
              block_top.angle = -90;
              block_top.x = i * 50.9;
              block_top.y = -700;
              controlTime.to(block_top, {
                pixi: {
                  y: 110
                }
              })
              
              block_topContainer.addChild(block_top);
            }
    
            controlTime.to(scaleRuler, {
              pixi: {
                x: 440
              },
              duration: 1.5
            });
    
            controlTime.to(scaleRuler, {
              pixi: {
                x: 2000
              },
              delay: 1,
              duration: 1.1
            });
    
            controlTime.call(()=>{
              if(mediaBlocks[2] === undefined){
                mediaBlocks[2] = {id: 2, valor: randomFloatNumber(241.8, 252.2)};
    
                texts.mediaBlocks.valor2 = ("- Altura: "+ mediaBlocks[2].valor+ "cm");
                // text2 step0
                const infoBoard = new PIXI.Text(texts.mediaBlocks.valor2, textCharacter);
                infoBoard.x = 40;
                infoBoard.y= 116;
                textStep0.addChild(infoBoard);
                infoBoard.visible = true; 
              }
            });
    
            controlTime.to(block_topContainer, {
              pixi: {
                x: 2000
              }, 
              delay: 2,
              duration: 2,
            });
          });
          
          
          controlTime.call(() => {
            // Create a 13 grid of blocks in .X
            for (let i = 0; i < 13; i++) {
              const block_frente = new PIXI.Sprite(resources.block_frente.texture);
              block_frente.width = 25;
              block_frente.height = 50;
              block_frente.x = i * 26;
              block_frente.y = -700;
              
              controlTime.to(block_frente, {
                pixi: {
                  y: 160
                }
              })
              
              block_frenteContainer.addChild(block_frente);
            }
    
            controlTime.to(scaleRuler, {
              pixi: {
                x: 800
              },
              duration: 1.5
            });
    
            controlTime.to(scaleRuler, {
              pixi: {
                x: 2000
              },
              delay: 1,
              duration: 1.1
            });
    
            // inserir text
            controlTime.call(()=>{
              if(mediaBlocks[3] === undefined){
                mediaBlocks[3] = {id: 3, valor: randomFloatNumber(111.8, 122.2)};
    
                texts.mediaBlocks.valor3 = "- Largura: " + mediaBlocks[3].valor +"cm";
                // text3 step0
                const infoBoard = new PIXI.Text(texts.mediaBlocks.valor3, textCharacter);
                infoBoard.x = 40;
                infoBoard.y= 157;
                textStep0.addChild(infoBoard);
                infoBoard.visible = true; 
              }
            });
    
            controlTime.to(block_frenteContainer, {
              pixi: {
                x: 2000
              }
            });
    
    
    
            controlTime.to(backButton, { visible: true });
          });
          
        }
    
    
          return controlTime;
        }
    
        let flagApp = true;
        const onBlock = () =>{
    
          const measureBlock = () => {
            const controlTime = timeline;
            const duration = 1;
            const delay = 1;
    
            // chamada da função para que o valor iniciado seja igual ao do indice do objeto
            onArrowRight();
    
            // ajusta o indicador/texto para a proporção e local correto
            controlTime.call(()=>{
              textIndicador.x = 160;
              textIndicador.y = 350;
              textIndicador.visible = true;
              indicadorStyle.fontSize = 20;
            });
    
            controlTime.call(()=>{
                return block.interactive = false, block.buttonMode = false;
            });
    
            controlTime.to(measure, {
              pixi: {
                x: 283,
                y: 425,
                angle: -30.7
              },
              duration: duration,
              delay: delay
            });
    
            controlTime.to(measure, {
              pixi: {  
                x: 205,
                y: 474,
                angle: 26.7
              },
              duration: duration,
              delay: delay
            });
    
            controlTime.to(measure, {
              pixi: {
                x: 245,
                y: 378,
                angle: -90
              },
              duration: duration,
              delay: delay
            });
    
            controlTime.to(measure, {
              pixi: {
                x: 570,
                y: 465,
                angle: 0
              },
              duration: duration,
              delay: delay
            });
    
    
            // ajuste de proporção do container
            // de efieto para transição de blocos
            containerEfects.visible = true;
            containerEfects.x = -200;
            containerEfects.y = 42;
            b1.width = 100;
            b1.height = 130;
            b2.width = 100;
            b2.height = 130;
            b3.width = 100;
            b3.height = 130;
    
            controlTime.to(buttonScale, {visible: true});
    
            return controlTime;
          };
    
          if(flagApp){
            const time = gsap.timeline();
            time.call(measureBlock);
            // Zoomin de 3 vezes a escala da tela com a posição no eixo X e Y.
            time.to(app.stage,{x: -200,  y: -1000, duration: 1}, 0);
            time.to(app.stage.scale,{x: 3,  y:3 , duration: 1}, 0);
    
            return time, flagApp = false;
          } else {
            const time = gsap.timeline();
            // ao clicar novamente a tela voltará para a porporção original
            // e todos os itens do bloco irão sumir.
            time.call(()=>{
              block.interactive = false;
              block.buttonMode = false;
              textIndicador.visible = false;
              showscale.visible = false;
              buttonScale.visible = false;
              measure1.visible = false;
              measure2.visible = false;
              measure3.visible = false; 
              arrowContainer.visible = false;
              flagShowScale = true;
    
              // inseri o texto após os 13 blocos
              textDialogue.text = texts.speak2;
              nextButton.visible = true;
    
              // posiciona o papel no local antes de tirar o zoom
              board.x = 150;
              board.width = 350;
              board.visible = true;
    
              measure.x = 500;
              measure.y = 465;
              measure.width = 170;
              measure.height = 20;
            });
    
            // Alteração da escala e proporção da tela para a original (1)
            time.to(app.stage,{x: 0,  y: 0, duration: 1}, 0);
            time.to(app.stage.scale,{x: 1,  y: 1, duration: 1}, 0);
            
    
            return time, flagApp = true;
          }
        };
    
        let constSave = 0;
        function onStep1(){
          const controlTime = gsap.timeline();
          const remove = gsap.timeline();
    
          
          remove.call(() => {
            textStep1.visible = true;
            containerEfects.visible = false;
            save.visible = true;
          },0);
    
          // Drop elements
          remove.to(ruler, {
            pixi: { x: -400 }
          },0);
          remove.to(square, {
            pixi: { x: -400 }
          },0);
          remove.to(measure, {
            pixi: { x: -400 }
          },0);
          remove.to(textDialogue, {
            pixi: { visible: false }
          },0);
          remove.to(nextButton, {
            visible: false
          },0);
          remove.to(dialogBox, {
            pixi: { visible: false }
          },0);
          remove.to(defletometro, {
            pixi: { x: -400 }
          },0);
          remove.to(table1, {
            pixi: { x: -400 }
          },0);
          remove.to( block,{
             pixi: {
                x: -400,
             }
          },0);
    
          // exibe o backgroud, tijolo de frente e as funções do paquímetro
          controlTime.call(() => {
    
            const time = gsap.timeline(); 
    
            time.to(backgroundTable,{
              pixi: {
                x: 400,
                visible: true
              }
            },0);
    
            time.to(block_frente, {
              pixi: {
                x: 400,
                visible: true
              }
            },0);
    
            time.to(ToolbarContainer, {
              pixi: {
                x: 0,
              }
            },0);
    
            pachymeterContainer.interactive = true;
            pachymeterContainer.buttonMode = true;
            pachymeter.part.interactive = true;
            pachymeter.part.buttonMode = true;
    
            return time;
          });
    
          // Aumeta a escala do paquímetro e suas partes ajustanda a proporção
          controlTime.call(() => {
            const time = gsap.timeline();
    
            proportion = 0.5
            time.to(pachymeter,{
              pixi: {
                width: 500,
                height: 170
              }
            },0);
    
            time.to(pachymeter.part,{
              pixi: {
                x: -150,
                y: 5,
                width: 500 * 0.295,
                height: 170 - 12,
              }
            },0);
    
            time.to(pachymeter.part.text,{
              pixi: {
                x: -150,
                y: -31,
              },
              style:{
                fontFamily: "DS-DIGI",
                fontSize: 32,
                fill: 0xffffff,
                align: "center",
              }
            },0);
    
            time.to(board,{
              pixi:{x: 130,
                    visible: true
                    }
            },0);
    
            time.to(inter1,{visible: true, x: 100},0);
            time.to(inter2,{visible: true, x: 100},0);
            time.to(exter1,{visible: true, x: 100},0);
            time.to(exter2,{visible: true, x: 100},0);
            time.to(textStep1,{x: -55},0);
    
            return time;
          });
          
          
          return controlTime, remove; 
        }
    
        function onstep2() {
    
          const controlTime = gsap.timeline();
          const remove = gsap.timeline();
    
          textDialogue.visible = false;
          textStep2.visible = true;

          // block.texture = resources.newBlock.texture;
          // b3.texture = resources.newBlock.texture;
    
          // chamada de função para que o primeiro 
          // bloco já seja como os valores aleatorios 
          setTimeout(()=>{},2000);
          onArrowRightDelfectometro();
          // remove elements 
          remove.to(ruler, {pixi: { x: -400 }},0);
          remove.to(measure, {pixi: { x: -400 }},0);
          remove.to(pachymeterContainer, {pixi: { x: -400 }},0);
          remove.to(textDialogue, {visible: false},0);
          remove.to(nextButton, {visible: false},0);
          remove.to(table1, {pixi: { x: -400 }},0);
          remove.to(square, {pixi: { x: -400 }},0);
          remove.to(dialogBox, {pixi: { x: -400, visible: false }},0);
          remove.to(dialogBox, {pixi: { x: 650, visible: false }},1);
          
          controlTime.call(() => {
            const time = gsap.timeline();
    
            time.to(backgroundTable,{
              pixi: {
                x: 400,
                visible: true
              }
            },0);
    
            time.to(defletometro, {
              pixi: {
                x: 540,
                y: 280,
                width: 710,
                height: 480,
              }
            },0);
    
            time.to(block,{
              pixi:{
                x: 530,
                y: 388,
                width: 330,
                height: 400,
                angle: -122,
              },duration: 0.5
            },0);
    
            board.y = 250;
            time.to( board,{
              pixi: {
                  x: 130,
                  width: 320,
                  visible: true
              },
              duration: 1,
              delay: 0,
            },0);
    
            time.to(pointer, { visible: true });
    
            return time;
          });
    
          controlTime.call( () => {
            // ajusta o indicador para a proporção e local correto
            textIndicador.x = 440;
            textIndicador.y = 100;
            textIndicador.visible = true;
            indicadorStyle.fontSize = 40;
    
            rightArrow.visible = true; 
          });
    
          return controlTime, remove;
        }
    
        function onStep3(){
          const controlTime = gsap.timeline();
          const remove = gsap.timeline();
    
          rightArrowFront.visible = true;
          textStep3.visible = true;
          onArrowRightSquare();
    
          // Drop elements
          remove.to(ruler, {pixi: { x: -400 }},0);
          remove.to(measure, {pixi: { x: -400 }},0);
          remove.to(textDialogue, {pixi: { visible: false }},0);
          remove.to(nextButton, {visible: false},0);
          remove.to(dialogBox, {pixi: { visible: false }},0);
          remove.to(defletometro, {pixi: { x: -400 }},0);
          remove.to(table1, {pixi: { x: -400 }},0);
          remove.to( block,{pixi: {x: -400,}},0);
          remove.to( pachymeterContainer,{pixi: { x: -400,}},0);
    
          // exibe o backgroud, tijolo de frenre e as funções do paquímetro
          controlTime.call(() => {
    
            const time = gsap.timeline(); 
    
            time.to(backgroundTable,{
              pixi: {
                x: 400,
                visible: true
              }
            },0);
    
            time.to(block_frente, {
              pixi: {
                width: 200,
                height:400,
                x: 400,
                visible: true
              }
            },0);
           
    
            time.to(square,{
              pixi:{
                width:240,
                height:480,
                angle: 0,
                x: 455,
                y:320,
                visible: true 
              }
            },0);
            
            board.y = 240;
            time.to( board,{
              pixi: {
                  x: 130,
                  width: 320,
                  visible: true
              },
              duration: 1,
              delay: 0,
            },0);
    
           
            return time;
          });
        
        }

        // setTimeout(()=>{onBackButton()},2000)
        let contSwap = 0;// deve ser zero para seguir as steps da prática
        function swapFunction(){
    
          nextButton.interactive = false;
          setTimeout(()=>{nextButton.interactive=true},1000);

          if(contSwap === 0 ){
            console.log(3);
            dialogBox.height = 150;
            dialogBox.y = 100;
            nextButton.y = 150;
            setTimeout(()=>{textDialogue.text = texts.speak3},1500);
            nextButton.off('pointerdown');
            nextButton.on('pointerdown', onStep0);
          }
          if(contSwap === 1 ){
            console.log(4);
            dialogBox.height = 160;
            dialogBox.y = 100;
            nextButton.y = 150;
            setTimeout(()=>{textDialogue.text = texts.speak4},1500);
            nextButton.off('pointerdown');
            nextButton.on('pointerdown', onStep1);
          }
          if(contSwap === 2 ){
            console.log(5);
            dialogBox.height = 220;
            dialogBox.y = 130;
            nextButton.y = 210;
            setTimeout(()=>{textDialogue.text = texts.speak5},1500);
            nextButton.off('pointerdown');
            nextButton.on('pointerdown', onstep2);
          }
          if(contSwap === 3 ){
            console.log(6);
            dialogBox.height = 160;
            dialogBox.y = 100;
            nextButton.y = 150;
            setTimeout(()=>{textDialogue.text = texts.speak6},1500);
            nextButton.off('pointerdown');
            nextButton.on('pointerdown', onStep3);
          }
          if(contSwap === 4 ){
            console.log(7);
            dialogBox.height = 180;
            dialogBox.y = 110;
            nextButton.y = 170;
            setTimeout(()=>{textIntro.text = texts.speak7});
            textIntro.visible = true;
            backgroundIntro.visible = true;
            introButton.visible = true;
            introButton.off('pointerdown');
            introButton.on('pointerdown', infoValue);
    
            // Manipulando todas as informações de texto no container para layout da tela.
            infoContainer.addChild(textonBlock, textStep0, textStep1, textStep2, textStep3);
            
          }
          
          // adiciona um para que a proxima vez entre em outro se atribuindo outra função ao mesmo butão.
          contSwap++;
        }
    
    
        function onBackButton() {
    
          block.texture = resources.block.texture
          block.angle = -122;

          textDialogue.text = '';

          const controlTime = gsap.timeline();  

          //chama a função que troca as funcionalidades do botão próximo
          swapFunction();
    
          measure.visible = true;
          scaleRuler.x = 2000;
      
          controlTime.call(() => { 
            backButton.visible = false;
            block_frente.visible = false;
            pointer.visible = false;
            rightArrow.visible = false;
            textDialogue.visible = true;
            textonBlock.visible = false;
            textStep0.visible = false;
            textStep1.visible = false;
            textStep2.visible = false;
            textStep3.visible = false;
            save.visible = false;
            textIndicador.visible = false;
            block.visible = true;
          });
          
          // remove itens step1 
          controlTime.call(() => {
    
            const time = gsap.timeline(); 
    
            time.to(board,{x:-400},0);
            time.to(textStep1,{x:-400},0);
    
            time.to(backgroundTable,{
              pixi: {
                x: 2000,
                visible: true
              }
            },0);
    
            time.to(block_frente, {
              pixi: {
                x: 2000,
                visible: true
              }
            },0);
    
            time.to(ToolbarContainer, {
              pixi: {
                x: 400,
              }
            },0);
    
            return time;
          });
    
          // posiciona o paquímetro na mesa como na initialPosition
          pachymeter.part.text.visible = false;
          controlTime.call(() => {
            const time = gsap.timeline();
            pachymeterContainer.interactive = false;
            pachymeterContainer.buttonMode = false;
            pachymeter.part.interactive = false;
            pachymeter.part.buttonMode = false;
    
            proportion = 1.7
            time.to(pachymeter,{
              pixi: {
                width: 150,
                height: 50
              }
            },0);
    
            time.to(pachymeterContainer, { 
              pixi: {
                angle: 0
              }
            });
    
            time.to(pachymeter.part,{
              pixi: {
                x: -45,
                y: pachymeter.y,
                width: 150 * 0.295,
                height: 50,
              }
            },0);
            
            time.to(pachymeter.part.text,{
              pixi: {
                x: -45,//pachymeter.part.x,
                y: pachymeter.y - 11,
              },
              style:{
                fontFamily: "DS-DIGI",
                fontSize: 16,
                fill: 0xffffff,
                align: "center",
              },text: "0",
            },0);  
    
            time.to(pachymeter.part.text,{
              pixi:{visible:true}
            });
            
            return time;
          });
    
          // remove table horizon
          controlTime.to(table_horizon, { pixi: { x: 2000 } }, 0);
    
          // call table 1
          controlTime.to(table1, { pixi: { x: 400 } }, 1);
    
          // call ruler
          controlTime.to(ruler, {
            pixi: {
              x: 670,
              y: 450,
              width: 60,
              height: 50
            }
          },1);
    
          // call pachymeter
          controlTime.to(pachymeterContainer, {
            pixi: {
              x: 440,
              y: 440, 
            }
          },1);
    
          // call block
          controlTime.to(block, {
            pixi: {
              x: 200,
              y: 430,
              width: 100,
              height: 130
            },
          },1);
    
          // call defletometro
          controlTime.to(defletometro, {
            pixi: {
              x: 590,
              y: 415,
              width: 220,
              height: 140
            },
          },1);
    
          // call measure
          controlTime.to(measure, {
            pixi: {
              width: 170,
              height: 20,
              x: 500,
              y: 465,
            },
          },1);
    
          controlTime.to(square, {
            pixi: {
              width: 60,
              height: 120,
              x: 550,
              y: 460,
              angle:-90,
            },
          },1);
    
          // call dialogbox
          controlTime.to(dialogBox, {
            pixi: {
                    x: 650,
                    visible: true,
                  },
            }, 1);
    
          // call textdialogue
          controlTime.to(textDialogue, {
            pixi:{ 
                x: 535,
                y: 40,
                visible: true,
              },
          }, 1);
    
          // call nextButton
          controlTime.to(nextButton, {
            pixi: {
              visible: true,
            },
          }, 1);
    
          return controlTime;
        }
    
        // create table1
        const table1 = new PIXI.Sprite(resources.table1.texture);
        configureObject(app, table1, 700, 500, 400, 650);
    
        // create table horizon
        const table_horizon = new PIXI.Sprite(resources.table_horizon.texture);
        configureObject(app, table_horizon, 800, 300, 2000, 500);
    
        // create backgroud in table pachymeter
        const backgroundTable = new PIXI.Sprite(resources.backgroundTable.texture);
        backgroundTable.visible = false;
        configureObject(app, backgroundTable, 800, 600, 2000, 300);
        
        const square = new PIXI.Sprite(resources.square.texture);
        configureObject(app,square,60,120,-550,460);
        square.angle= -90;
    
        //create block 
        const block = new PIXI.Sprite(resources.block.texture);
        block.angle = -122;
        block.interactive = true;
        block.buttonMode = true;
        block.on('pointerdown', onBlock);
        configureObject(app, block, 100, 130, -500, 430);
    
        const b1 = new PIXI.Sprite(resources.block.texture);
        b1.angle = -122;
        configureObject(app, b1, 330, 400, -400, 388 );
        
        const b2 = new PIXI.Sprite(resources.block.texture);
        b2.angle = -122;
        configureObject(app, b2, 330, 400, 400, 388 );
        
        const b3 = new PIXI.Sprite(resources.block.texture);
        b3.angle = -122;
        configureObject(app, b3, 330, 400, 1200, 388 );
     
        const containerEfects = new PIXI.Container();
        configureObject(app, containerEfects,0, 0, 0, 0);
        containerEfects.addChild(b1, b2, b3);
        containerEfects.visible = false;
    
        const f1 = new PIXI.Sprite(resources.block_frente.texture);
        configureObject(app, f1, 200, 400, -400, 300 );
        
        const f2 = new PIXI.Sprite(resources.block_frente.texture);
        configureObject(app, f2, 200, 400, 400, 300 );
    
        const f3 = new PIXI.Sprite(resources.block_frente.texture);
        configureObject(app, f3, 200, 400, 1200, 300 );
     
        const containerEfectsFront = new PIXI.Container();
        configureObject(app, containerEfectsFront,0, 0, 0, 0);
        containerEfectsFront.addChild(f1, f2, f3);
        containerEfectsFront.visible = false;
    
        // mostra as medidas do bloco
        const showscale = new PIXI.Sprite(resources.showscale.texture);
        configureObject(app, showscale, 150, 110, 200, 435);
        showscale.visible = false;
        showscale.angle = -2;
    
        // objeto para guardar valores de medidas do bloco como comprimeto, largurae altura.
        let valueBlock = [];
    
        const buttonScale = new PIXI.Sprite(resources.buttonScale.texture);
        configureObject(app, buttonScale, 30, 15, 90, 350);
        buttonScale.interactive = true;
        buttonScale.buttonMode = true;
        buttonScale.visible = false;
        let flagShowScale = true;
        buttonScale.on('pointerdown', () => {
          if (flagShowScale) {
            showscale.visible = true;
            measure1.visible = true;
            measure2.visible = true;
            measure3.visible = true;
            arrowContainer.visible = true;
            flagShowScale = false;
    
          }else {
            showscale.visible = false;
            measure1.visible = false;
            measure2.visible = false;
            measure3.visible = false;     
            flagShowScale = true; 
          }
        });
    
        // container das setas do onblock
        const arrowContainer = new PIXI.Container();
        configureObject(app, arrowContainer, 0, 0, 0, 0);
    
    
        const measure1 = new PIXI.Text(texts.text1.measure1, textCharacter);
        configureObject(app,measure1, 20, 9, 131, 418.5);
        measure1.visible = false;
    
        const measure2 = new PIXI.Text(texts.text2.measure2, textCharacter);
        configureObject(app,measure2, 20, 9, 165, 470);
        measure2.visible = false;
    
        const measure3 = new PIXI.Text(texts.text3.measure3, textCharacter);
        configureObject(app,measure3, 20, 9, 260, 417);
        measure3.visible = false;
    
    
    
    
    
        const defletometro = new PIXI.Sprite(resources.defletometro.texture);
        configureObject(app, defletometro, 220, 140, -500, 415); 
    
        const pointer = new PIXI.Sprite(resources.pointer.texture);
        configureObject(app, pointer, 30, 30, 533, 255);
        pointer.visible = false;
    
    
      
        //create scale
        const measure = new PIXI.Sprite(resources.measure.texture);
        configureObject(app, measure, 170, 20, -500, 465);
    
        //Criando bloco com os furos para a frente.
        const block_frente = new PIXI.Sprite(resources.block_frente.texture);
        block_frente.visible = false;
        configureObject(app, block_frente, 200, 400, 2000, 300);
    
        // card the step0 
        const board = new PIXI.Sprite(resources.board.texture);
        configureObject(app, board, 290, 300, -500, 150);
    
        // texto indicador na parte superior do bloco
        const indicadorStyle = new PIXI.TextStyle({
          fontFamily: "Roboto",
          wordWrap: true,
          wordWrapWidth: 230,
          fontSize: 20,
          fill: 0xffffff,
          backgroundColor: 0xffffff,
          align: "center",
        });
    
        texts.indicador = "teste";      
        const textIndicador = new PIXI.Text(texts.indicador, indicadorStyle);
        textIndicador.x = 400;
        textIndicador.y = 300;
        textIndicador.visible = false;
        app.stage.addChild(textIndicador);
    
       
        // Container text step0 
        const textonBlock = new PIXI.Container();
        configureObject(app, textonBlock, 0, 0, 0, 0,);
        
        // Container text step0 
        const textStep0 = new PIXI.Container();
        configureObject(app, textStep0, 0, 0, 10, 0,);
        
        // create container from blocks
        const Bricks = new PIXI.Container();
        Bricks.width = 100;
        Bricks.height = 100;
        Bricks.x = -140;
        Bricks.y = 200;
        app.stage.addChild(Bricks);
    
        const block_topContainer = new PIXI.Container();
        block_topContainer.width = 100;
        block_topContainer.height = 100;
        block_topContainer.x = 40;
        block_topContainer.y = 300;
        app.stage.addChild(block_topContainer);
    
        const block_frenteContainer = new PIXI.Container();
        block_frenteContainer.width = 100;
        block_frenteContainer.height = 100;
        block_frenteContainer.x = 400;
        block_frenteContainer.y = 200;
        app.stage.addChild(block_frenteContainer);
    
    
        //creat scaleRuler
        const scaleRuler = new PIXI.Sprite(resources.scaleRuler.texture);
        configureObject(app, scaleRuler, 800, 5, 2000, 410);
    
    
        
        // texto da step 1 
        const textStep1 = new PIXI.Container();
        configureObject(app, textStep1, 0, 0, -70, 0);
    
        // Paquímetro será inserido aqui!!!

        const pachymeterStyle = new PIXI.TextStyle({
          fontFamily: "DS-DIGI",
          fontSize: 16,
          fill: 0xffffff,
          align: "center",
        });
    
        //create pachymeter
        const pachymeter = new PIXI.Sprite(resources.pachymeter1.texture);
        configureObject(app, pachymeter, 150, 50, 0, 0);
        // pachymeter.measureBaseX = -50;
        // pachymeter.measureBaseY = 230.5;
      
        //movel part:
        const pachymeterPart = new PIXI.Sprite(resources.pachymeter2.texture);
        configureObject(
            app,
            pachymeterPart,
            pachymeter.width * 0.295,
            pachymeter.height,
            pachymeter.x - 50,
            pachymeter.y
        );
    
        pachymeter.part = pachymeterPart;
        pachymeter.use = (interactivity = true) => {
            if (interactivity) {
                pachymeter.part.interactive = true;
                pachymeter.part.buttonMode = true;
            } else {
                pachymeter.part.interactive = false;
                pachymeter.part.buttonMode = false;
            }
        };
        pachymeter.use();
      
      const pachymeterDisplayText = new PIXI.Text(0, pachymeterStyle);
      pachymeterDisplayText.x = pachymeter.part.x;
      pachymeterDisplayText.y = pachymeter.part.y - 11;
      pachymeterDisplayText.anchor.set(0.5, 0.5);
      pachymeterDisplayText.visible = true;
      app.stage.addChild(pachymeterDisplayText);
      pachymeter.part.text = pachymeterDisplayText;
  
      const pachymeterContainer = new PIXI.Container();
      configureObject(app, pachymeterContainer, 20, 20, -500, 440);
  
      pachymeterContainer.addChild(pachymeter, pachymeter.part, pachymeter.part.text);
      
      //create scale
      const ruler = new PIXI.Sprite(resources.ruler.texture);
      configureObject(app, ruler, 60, 50, -500, 450);
          
      function onDragStart(event) {
          // store a reference to the data
          // the reason for this is because of multitouch
          // we want to track the movement of this particular touch
          this.data = event.data;
          this.dragging = true;
      }
      
      function onDragEnd() {
          this.alpha = 1;
          this.dragging = false;
          // set the interaction data to null
          this.data = null;
      }
      
      function onDragMove() {
          if (this.dragging) {
              const newPosition = this.data.getLocalPosition(this.parent);
              this.x = newPosition.x;
              this.y = newPosition.y;
          }
      }
      
      pachymeter.part
      .on("pointerdown", onDragStartPachymeter)
      .on("pointerup", onDragEndPachymeter)
      .on("pointerupoutside", onDragEndPachymeter)
      .on("pointermove", onDragMovePachymeter);
  
  
        // Function called when the pachymeter is dragged.
        function onDragStartPachymeter(event) {
          this.data = event.data;
          this.dragging = true;
      }
  
  
        //function called when the pachymeter is dropped
        function onDragEndPachymeter() {
          pachymeter.part.dragging = false;
          pachymeter.part.data = null;
      }
      
  
        let proportion = 1.17;
        function onDragMovePachymeter() {
  
          pachymeter.measureBaseX = pachymeter.x - (pachymeter.width*0.294);
          
          const time = gsap.timeline();
          if (pachymeter.part.dragging) {
              const newPosition = pachymeter.part.data.getLocalPosition(
                  pachymeter.part.parent
              );
  
              // checks if the pachymeter is in horizontal position and if the position is valid
              if (
                pachymeter.angle == 0 &&
                newPosition.x > (pachymeter.x - (pachymeter.width * 0.294)) &&
                newPosition.x < (pachymeter.x + ((pachymeter.width * 0.294)))
              ) {
                  pachymeter.part.x = newPosition.x;
                  pachymeter.part.text.x = newPosition.x;
                  time.set(pachymeter.part.text, {
                      pixi: {
                          text: (
                              (newPosition.x - pachymeter.measureBaseX) * proportion
                          ).toFixed(0),
                      },
                  });
                  // checks if the pachymeter is in vertical position and if the position is valid
              } else if (
                  pachymeter.angle != 0 &&
                  newPosition.y > pachymeter.y - 50 &&
                  newPosition.y < pachymeter.y + 80
              ) {
                  pachymeter.part.y = newPosition.y;
                  pachymeter.part.text.y = newPosition.y;
  
                  time.set(pachymeter.part.text, {
                      pixi: {
                          text: (
                              (newPosition.y - initialY) *
                              proportion
                          ).toFixed(0),
                      },
                  });
              }
          }
      }
  
      texts.pachymeter.inter1 = "Obtenha as medidas com\npaquímetro:\n\n- Interna vertical: ";
      const inter1 = new PIXI.Text(texts.pachymeter.inter1, textCharacter);
      inter1.x = -500;
      inter1.y = 37;
      inter1.visible = false;
      textStep1.addChild(inter1);
  
      texts.pachymeter.inter2 = "- Interna horizontal: ";
      const inter2 = new PIXI.Text(texts.pachymeter.inter2, textCharacter);
      inter2.x = -500;
      inter2.y = 137;
      inter2.visible = false;
      textStep1.addChild(inter2);
  
      texts.pachymeter.exter2 = "- Externa horizontal: ";
      const exter2 = new PIXI.Text(texts.pachymeter.exter2, textCharacter);
      exter2.x = -500;
      exter2.y = 179; 
      exter2.visible = false;
      textStep1.addChild(exter2);
      
      texts.pachymeter.exter1 = "- Externa vertical: ";
      const exter1 = new PIXI.Text(texts.pachymeter.exter1, textCharacter);
      exter1.x = -500;
      exter1.y = 221;
      exter1.visible = false;
      textStep1.addChild(exter1);
    
  
      const save = new PIXI.Sprite(resources.saveButton.texture);
      configureObject(app, save, 60, 30, 400, 20);
      save.interactive = true;
      save.buttonMode = true;
      save.visible = false;
      save.on('pointerdown',    ()=> {
        constSave++;
        if(constSave === 1){
          inter1.visible = true;
          texts.pachymeter.inter1 = "Obtenha as medidas através\ndo paquímetro:\n\n- Interna vertical: " + pachymeter.part.text.text;
          inter1.text = texts.pachymeter.inter1;
        }
        if(constSave === 2){
          inter2.visible = true;
          texts.pachymeter.inter2 = "- Interna horizontal: " + pachymeter.part.text.text;
          inter2.text = texts.pachymeter.inter2;
        }
        if(constSave === 3){
          exter2.visible = true;
          texts.pachymeter.exter2 = "- Externa horizontal: " + pachymeter.part.text.text;
          exter2.text = texts.pachymeter.exter2;
        }
        if(constSave === 4){
          exter1.visible = true;
          texts.pachymeter.exter1 = "- Externa vertical: " + pachymeter.part.text.text;
          exter1.text = texts.pachymeter.exter1;
          timeline.to(backButton,{visible: true, delay: 1})
        } else {
          cont = 0;
        }
      });
        
      const textStep2 = new PIXI.Container();
      configureObject(app, textStep2, 0, 0, -10, 100);
  
      const textStep3 = new PIXI.Container();
      configureObject(app, textStep3, 0, 0, -10, 90);
  
      //create dialog box
      const dialogBox = new PIXI.Sprite(resources.dialogBox.texture);
      configureObject(app, dialogBox, 270, 170, 650, 100);
      dialogBox.visible = true;
  
      // dialogue text
      const textDialogue = new PIXI.Text("", textCharacter);
      position(app, textDialogue, 535, 40);
      app.stage.addChild(textDialogue);
      textDialogue.text = texts.speak1;
  
      // complet next button
      const nextButton = new PIXI.Sprite(resources.nextButton.texture);
      configureObject(app, nextButton, 60, 30, 740, 160, true);// dimensão e local do butão 60, 30, 740, 190
      nextButton.visible = false;
      nextButton.on('pointerdown', onBackButton);
  
      const dialogueContainer = new PIXI.Container();
      configureObject(app, dialogueContainer, 0, 0, 0, 0);
      dialogueContainer.addChild(dialogBox, textDialogue, nextButton);
  
      //create back button mode
      const backButton = new PIXI.Sprite(resources.backButton.texture);
      configureObject(app, backButton, 60, 30, 400, 20);
      backButton.visible = false;
      backButton.interactive = true;
      backButton.buttonMode = true;
      backButton.on('pointerdown', onBackButton);
    
      const onArrowRightSquare = () => {
  
        rightArrowFront.interactive = false;
        setTimeout(()=>{rightArrowFront.interactive = true},1000);

        contBlockFront++
        if ( contBlockFront >= 1 &&  contBlockFront <= 13 ){
          const time = gsap.timeline();
  
          // indicador irá receber o valor do contador atual.
          textIndicador.text = `Bloco ( ${contBlockFront} )`;
          textIndicador.visible = true;
          textIndicador.x = 330;
          textIndicador.y = 25;
  
          // ajusta a escala do container
          time.call(() => {
            block_frente.visible = false;
            // f1.width = 200;
            // f1.height = 400;
            // f2.width = 200;
            // f2.height = 400;
            // f3.width = 200;
            // f3.height = 400;
          });



          if ( contBlockFront != 1) {
            time.to(containerEfectsFront,{pixi:{x: -800, visible: true,}});
          
            time.call(() => {
              containerEfectsFront.visible = false;
              block_frente.visible = true;
            });
  
            time.to(containerEfectsFront,{pixi:{x: 0}});
          }
  
          if(arrayBlockFront[ contBlockFront] === undefined){
  
            arrayBlockFront[ contBlockFront] = {id:  contBlockFront, valor: randomFloatNumber(-0.4, 0.4)};
  
            if ( arrayBlockFront[ contBlockFront].valor > 0){ pointer.angle = 10;}
            if (arrayBlockFront[ contBlockFront].valor < 0) { pointer.angle = -10; }
            if (arrayBlockFront[ contBlockFront].valor < 0.1 && arrayBlockFront[ contBlockFront].valor > - 0.1 ) { pointer.angle = 0; }
  

            if (arrayBlockFront[ contBlockFront].valor > 0.2) {
              f3.texture = resources.blockL.texture;
              f3.scale.set(0.9);
              f3.y = 260;

              gsap.to(square,{x: 502})
  
              block_frente.texture = resources.blockL.texture;
              block_frente.scale.set(0.9);
              block_frente.y = 260;
            } else if (arrayBlockFront[ contBlockFront].valor < -0.2) {
              f3.texture = resources.blockR.texture;
              f3.scale.set(0.9);
              f3.y = 260;
  
              gsap.to(square,{x: 502})

              block_frente.texture = resources.blockR.texture;
              block_frente.scale.set(0.9);
              block_frente.y = 260;
            } else {
              block_frente.texture = resources.block_frente.texture;
              block_frente.scale.set(1.1);
              block_frente.y = 300;

              gsap.to(square,{x: 455})

              f3.texture = resources.block_frente.texture;
              f3.scale.set(1.1);
              f3.y = 300;
            }



            if( contBlockFront === 1){ 
              texts.squareBlocks.b1 = "Bloco 1 esquadro: " + arrayBlockFront[ contBlockFront].valor + "mm";      
              const infoBoard = new PIXI.Text(texts.squareBlocks.b1, textCharacter);
              infoBoard.x = 50;
              infoBoard.y = 15;
              textStep3.addChild(infoBoard);
            };
            if( contBlockFront === 2){ 
              texts.squareBlocks.b2 = "Bloco 2 esquadro: " + arrayBlockFront[ contBlockFront].valor+ "mm";     
              const infoBoard = new PIXI.Text(texts.squareBlocks.b2, textCharacter);
              infoBoard.x = 50;
              infoBoard.y = 35;
              textStep3.addChild(infoBoard);
            };
            if( contBlockFront === 3){
              texts.squareBlocks.b3 = "Bloco 3 esquadro: " + arrayBlockFront[ contBlockFront].valor+ "mm"; 
              const infoBoard = new PIXI.Text(texts.squareBlocks.b3, textCharacter);
              infoBoard.x = 50;
              infoBoard.y = 56;
              textStep3.addChild(infoBoard);
            };
            if( contBlockFront === 4){ 
              texts.squareBlocks.b4 = "Bloco 4 esquadro: " + arrayBlockFront[ contBlockFront].valor+ "mm"; 
              const infoBoard = new PIXI.Text(texts.squareBlocks.b4, textCharacter);
              infoBoard.x = 50;
              infoBoard.y = 78;
              textStep3.addChild(infoBoard);
            };
            if( contBlockFront === 5){ 
              texts.squareBlocks.b5 = "Bloco 5 esquadro: " + arrayBlockFront[ contBlockFront].valor+ "mm";
              const infoBoard = new PIXI.Text(texts.squareBlocks.b5, textCharacter);
              infoBoard.x = 50;
              infoBoard.y = 98;
              textStep3.addChild(infoBoard);
            };
            if( contBlockFront === 6){ 
              texts.squareBlocks.b6 = "Bloco 6 esquadro: " + arrayBlockFront[ contBlockFront].valor+ "mm"; 
              const infoBoard = new PIXI.Text(texts.squareBlocks.b6, textCharacter);
              infoBoard.x = 50;
              infoBoard.y = 118;
              textStep3.addChild(infoBoard);
            };
            if( contBlockFront === 7){ 
              texts.squareBlocks.b7 = "Bloco 7 esquadro: " + arrayBlockFront[ contBlockFront].valor+ "mm";
              const infoBoard = new PIXI.Text(texts.squareBlocks.b7, textCharacter);
              infoBoard.x = 50;
              infoBoard.y = 138;
              textStep3.addChild(infoBoard);
            };
            if( contBlockFront === 8){ 
              texts.squareBlocks.b8 = "Bloco 8 esquadro: " + arrayBlockFront[ contBlockFront].valor + "mm";
              const infoBoard = new PIXI.Text(texts.squareBlocks.b8, textCharacter);
              infoBoard.x = 50;
              infoBoard.y = 158;
              textStep3.addChild(infoBoard);
            };
            if( contBlockFront === 9){ 
              texts.squareBlocks.b9 = "Bloco 9 esquadro: " + arrayBlockFront[ contBlockFront].valor+ "mm";
              const infoBoard = new PIXI.Text(texts.squareBlocks.b9, textCharacter);
              infoBoard.x = 50;
              infoBoard.y = 178;
              textStep3.addChild(infoBoard);
            };
            if( contBlockFront === 10){ 
              texts.squareBlocks.b10 = "Bloco 10 esquadro: " + arrayBlockFront[ contBlockFront].valor + "mm";
              const infoBoard = new PIXI.Text(texts.squareBlocks.b10, textCharacter);
              infoBoard.x = 50;
              infoBoard.y = 199;
              textStep3.addChild(infoBoard);
            };
            if( contBlockFront === 11){ 
              texts.squareBlocks.b11 = "Bloco 11 esquadro: " + arrayBlockFront[ contBlockFront].valor+ "mm";
              const infoBoard = new PIXI.Text(texts.squareBlocks.b11, textCharacter);
              infoBoard.x = 50;
              infoBoard.y = 220;
              textStep3.addChild(infoBoard);
            };
            if( contBlockFront === 12){ 
              texts.squareBlocks.b12 = "Bloco 12 esquadro: " + arrayBlockFront[ contBlockFront].valor+ "mm";
              const infoBoard = new PIXI.Text(texts.squareBlocks.b12, textCharacter);
              infoBoard.x = 50;
              infoBoard.y = 240;
              textStep3.addChild(infoBoard);
            };
            if( contBlockFront === 13){ 
              texts.squareBlocks.b13 = "Bloco 13 esquadro: " + arrayBlockFront[ contBlockFront].valor + "mm"; 
              const infoBoard = new PIXI.Text(texts.squareBlocks.b13, textCharacter);
              infoBoard.x = 50;
              infoBoard.y = 260;
              textStep3.addChild(infoBoard);
  
              rightArrowFront.visible = false;
              time.to(backButton, {visible: true});
            };
          }else{
            if ( arrayBlockFront[ contBlockFront].valor > 0){ pointer.angle = 10;}
            if (arrayBlockFront[ contBlockFront].valor < 0) { pointer.angle = -10; }
            if (arrayBlockFront[ contBlockFront].valor < 0.1 && arrayBlockFront[ contBlockFront].valor > - 0.1 ) { pointer.angle = 0; }
          }
  
        return time;
        } if ( contBlockFront < 1) {
            contBlockFront = 1;
        }
  
      };
      
      let arrayBlock = [];
      let cont = 0;
      const rightArrow = new PIXI.Sprite(resources.rightArrow.texture);
      configureObject(app, rightArrow, 70, 70, 750, 450);
      rightArrow.interactive = true;
      rightArrow.buttonMode = true;
      rightArrow.visible = false;
      const onArrowRightDelfectometro = () => {
  
        rightArrow.interactive = false;
        setTimeout(()=>{rightArrow.interactive = true}, 1000)

        cont++
        if (cont >= 1 && cont <= 13 ){
          const time = gsap.timeline();
  
          // indicador irá receber o valor do contador atual.
          textIndicador.text = `Bloco ( ${cont} )`;
  
          // ajusta a escala do container
          time.call(() => {
            containerEfects.visible = true;
            block.visible = false;
            containerEfects.x = 130;
            containerEfects.y = 0;
            // b1.width = 330;
            // b1.height = 400;
            // b2.width = 330;
            // b2.height = 400;
          });
          
          if (cont != 1) {
            time.to(containerEfects,{
              pixi:{
                x: -670
              }
            });
          
            time.call(() => {
              containerEfects.visible = false;
              block.visible = true;
            });
  
            time.to(containerEfects,{
              pixi:{
                x: 0
              }
            });
          }
  
  
          if(arrayBlock[cont] === undefined){
  
            arrayBlock[cont] = {id: cont, valor: randomFloatNumber(-0.4, 0.4)};
  
            if ( arrayBlock[cont].valor > 0){ 
              pointer.angle = 10;

              block.texture = resources.blockConcavo.texture;
              block.scale.set(0.9);
              block.angle = 0;
              block.y = 555;

              b3.texture = resources.blockConcavo.texture;
              b3.scale.set(0.9);
              b3.angle = 0;
              b3.y = 555;

              b2.texture = resources.blockConcavo.texture;
              b2.scale.set(0.9);
              b2.angle = 0;
              b2.y = 555;

              b1.texture = resources.blockConcavo.texture;
              b1.scale.set(0.9);
              b1.angle = 0;
              b1.y = 555;
            }
            if (arrayBlock[cont].valor < 0) { 
              pointer.angle = -10; 

              block.texture = resources.blockConvexo.texture;
              block.scale.set(0.9);
              block.angle = 0;
              block.y = 565;

              b3.texture = resources.blockConvexo.texture;
              b3.scale.set(0.9);
              b3.angle = 0;              
              b3.y = 565;

              b2.texture = resources.blockConvexo.texture;
              b2.scale.set(0.9);
              b2.angle = 0;              
              b2.y = 565;

              b1.texture = resources.blockConvexo.texture;
              b1.scale.set(0.9);
              b1.angle = 0;              
              b1.y = 565;
            }
            if (arrayBlock[cont].valor < 0.1 && arrayBlock[cont].valor > - 0.1 ) {
               pointer.angle = 0; 

               block.texture = resources.newBlock.texture;
               block.scale.set(0.9);
               block.angle = 0;
               block.y = 560;

               b3.texture = resources.newBlock.texture; 
               b3.scale.set(0.9);
               b3.angle = 0;
               b3.y = 560; 

               b2.texture = resources.newBlock.texture; 
               b2.scale.set(0.9);
               b2.angle = 0;
               b2.y = 560; 
            
               b1.texture = resources.newBlock.texture; 
               b1.scale.set(0.9);
               b1.angle = 0;
               b1.y = 560; 
              }
  
  
            if(cont === 1){ 
              texts.deflectBlocks.b1 = "Bloco 1 deflectometro: " + arrayBlock[cont].valor;      
              const infoBoard = new PIXI.Text(texts.deflectBlocks.b1, textCharacter);
              infoBoard.x = 50;
              infoBoard.y = 15;
              textStep2.addChild(infoBoard);
            };
            if(cont === 2){ 
              texts.deflectBlocks.b2 = "Bloco 2 deflectometro: " + arrayBlock[cont].valor;     
              const infoBoard = new PIXI.Text(texts.deflectBlocks.b2, textCharacter);
              infoBoard.x = 50;
              infoBoard.y = 35;
              textStep2.addChild(infoBoard);
            };
            if(cont === 3){
              texts.deflectBlocks.b3 = "Bloco 3 deflectometro: " + arrayBlock[cont].valor; 
              const infoBoard = new PIXI.Text(texts.deflectBlocks.b3, textCharacter);
              infoBoard.x = 50;
              infoBoard.y = 56;
              textStep2.addChild(infoBoard);
            };
            if(cont === 4){ 
              texts.deflectBlocks.b4 = "Bloco 4 deflectometro: " + arrayBlock[cont].valor; 
              const infoBoard = new PIXI.Text(texts.deflectBlocks.b4, textCharacter);
              infoBoard.x = 50;
              infoBoard.y = 78;
              textStep2.addChild(infoBoard);
            };
            if(cont === 5){ 
              texts.deflectBlocks.b5 = "Bloco 5 deflectometro: " + arrayBlock[cont].valor;
              const infoBoard = new PIXI.Text(texts.deflectBlocks.b5, textCharacter);
              infoBoard.x = 50;
              infoBoard.y = 98;
              textStep2.addChild(infoBoard);
            };
            if(cont === 6){ 
              texts.deflectBlocks.b6 = "Bloco 6 deflectometro: " + arrayBlock[cont].valor; 
              const infoBoard = new PIXI.Text(texts.deflectBlocks.b6, textCharacter);
              infoBoard.x = 50;
              infoBoard.y = 118;
              textStep2.addChild(infoBoard);
            };
            if(cont === 7){ 
              texts.deflectBlocks.b7 = "Bloco 7 deflectometro: " + arrayBlock[cont].valor;
              const infoBoard = new PIXI.Text(texts.deflectBlocks.b7, textCharacter);
              infoBoard.x = 50;
              infoBoard.y = 138;
              textStep2.addChild(infoBoard);
            };
            if(cont === 8){ 
              texts.deflectBlocks.b8 = "Bloco 8 deflectometro: " + arrayBlock[cont].valor;
              const infoBoard = new PIXI.Text(texts.deflectBlocks.b8, textCharacter);
              infoBoard.x = 50;
              infoBoard.y = 158;
              textStep2.addChild(infoBoard);
            };
            if(cont === 9){ 
              texts.deflectBlocks.b9 = "Bloco 9 deflectometro: " + arrayBlock[cont].valor;
              const infoBoard = new PIXI.Text(texts.deflectBlocks.b9, textCharacter);
              infoBoard.x = 50;
              infoBoard.y = 178;
              textStep2.addChild(infoBoard);
            };
            if(cont === 10){ 
              texts.deflectBlocks.b10 = "Bloco 10 deflectometro: " + arrayBlock[cont].valor;
              const infoBoard = new PIXI.Text(texts.deflectBlocks.b10, textCharacter);
              infoBoard.x = 50;
              infoBoard.y = 199;
              textStep2.addChild(infoBoard);
            };
            if(cont === 11){ 
              texts.deflectBlocks.b11 = "Bloco 11 deflectometro: " + arrayBlock[cont].valor;
              const infoBoard = new PIXI.Text(texts.deflectBlocks.b11, textCharacter);
              infoBoard.x = 50;
              infoBoard.y = 220;
              textStep2.addChild(infoBoard);
            };
            if(cont === 12){ 
              texts.deflectBlocks.b12 = "Bloco 12 deflectometro: " + arrayBlock[cont].valor;
              const infoBoard = new PIXI.Text(texts.deflectBlocks.b12, textCharacter);
              infoBoard.x = 50;
              infoBoard.y = 240;
              textStep2.addChild(infoBoard);
            };
            if(cont === 13){ 
              texts.deflectBlocks.b13 = "Bloco 13 deflectometro: " + arrayBlock[cont].valor; 
              const infoBoard = new PIXI.Text(texts.deflectBlocks.b13, textCharacter);
              infoBoard.x = 50;
              infoBoard.y = 260;
              textStep2.addChild(infoBoard);
  
              rightArrow.visible = false;
              time.to(backButton, {visible: true});
            };
          }else{
            if ( arrayBlock[cont].valor > 0){ pointer.angle = 10;}
            if (arrayBlock[cont].valor < 0) { pointer.angle = -10; }
            if (arrayBlock[cont].valor < 0.1 && arrayBlock[cont].valor > - 0.1 ) { pointer.angle = 0; }
          }
  
        return time;
        } if (cont < 1) {
          cont = 1;
        }
  
      };
      rightArrow.on('pointerdown', onArrowRightDelfectometro);
  
      // Função para passar o na mesa
      function onArrowRight() {
  
        rightArrowBlock.interactive = false;
        setTimeout(()=>{rightArrowBlock.interactive = true},1500);

        if (contArrow >= 1 && contArrow <= 13){
  
          const time = gsap.timeline();
  
          // condição para que o efeito de transição  de blocos não  seja feito
          if (contArrow != 1){
              time.call(() => {
                containerEfects.visible = true;
                block.visible = false;
              });
              
              time.to(containerEfects,{
                pixi:{
                  x: -1000
                }
              });
            
              time.call(() => {
                containerEfects.visible = false;
                block.visible = true;
              });
  
              time.to(containerEfects,{
                pixi:{
                  x: -200
                }
              });
              }
  
          if(valueBlock[contArrow] === undefined){
            valueBlock[contArrow] = {id: contArrow, comprimento: randomFloatNumber(18.6, 19.4), largura: randomFloatNumber(8.6, 9.4), altura: randomFloatNumber(18.6, 19.4)};        
            
            // indicador irá receber o valor do contador atual.
            textIndicador.text = `Bloco ( ${contArrow} )`;
  
            if(contArrow === 1){ 
              texts.measure.b1 = `Bloco 1 C: ${valueBlock[contArrow].comprimento} L: ${valueBlock[contArrow].largura} A: ${valueBlock[contArrow].altura}`;      
              const infoBoard = new PIXI.Text(texts.measure.b1, textCharacter);
              measure1.text = valueBlock[contArrow].comprimento + 'cm';
              measure2.text = valueBlock[contArrow].largura + 'cm';
              measure3.text = valueBlock[contArrow].altura + 'cm';
              infoBoard.x = 50;
              infoBoard.y = 15;
              textonBlock.addChild(infoBoard);
            };
            if(contArrow === 2){ 
              texts.measure.b2 = `Bloco 2 C: ${valueBlock[contArrow].comprimento} L: ${valueBlock[contArrow].largura} A: ${valueBlock[contArrow].altura}`     
              const infoBoard = new PIXI.Text(texts.measure.b2, textCharacter);
              measure1.text = valueBlock[contArrow].comprimento + 'cm';
              measure2.text = valueBlock[contArrow].largura + 'cm';
              measure3.text = valueBlock[contArrow].altura + 'cm';
              infoBoard.x = 50;
              infoBoard.y = 35;
              textonBlock.addChild(infoBoard);
            };
            if(contArrow === 3){
              texts.measure.b3 = `Bloco 3 C: ${valueBlock[contArrow].comprimento} L: ${valueBlock[contArrow].largura} A: ${valueBlock[contArrow].altura}` 
              const infoBoard = new PIXI.Text(texts.measure.b3, textCharacter);
              measure1.text = valueBlock[contArrow].comprimento + 'cm';
              measure2.text = valueBlock[contArrow].largura + 'cm';
              measure3.text = valueBlock[contArrow].altura + 'cm';
              infoBoard.x = 50;
              infoBoard.y = 56;
              textonBlock.addChild(infoBoard);
            };
            if(contArrow === 4){ 
              texts.measure.b4 = `Bloco 4 C: ${valueBlock[contArrow].comprimento} L: ${valueBlock[contArrow].largura} A: ${valueBlock[contArrow].altura}` 
              const infoBoard = new PIXI.Text(texts.measure.b4, textCharacter);
              measure1.text = valueBlock[contArrow].comprimento + 'cm';
              measure2.text = valueBlock[contArrow].largura + 'cm';
              measure3.text = valueBlock[contArrow].altura + 'cm';
              infoBoard.x = 50;
              infoBoard.y = 78;
              textonBlock.addChild(infoBoard);
            };
            if(contArrow === 5){ 
              texts.measure.b5 = `Bloco 5 C: ${valueBlock[contArrow].comprimento} L: ${valueBlock[contArrow].largura} A: ${valueBlock[contArrow].altura}`
              const infoBoard = new PIXI.Text(texts.measure.b5, textCharacter);
              measure1.text = valueBlock[contArrow].comprimento + 'cm';
              measure2.text = valueBlock[contArrow].largura + 'cm';
              measure3.text = valueBlock[contArrow].altura + 'cm';
              infoBoard.x = 50;
              infoBoard.y = 98;
              textonBlock.addChild(infoBoard);
            };
            if(contArrow === 6){ 
              texts.measure.b6 = `Bloco 6 C: ${valueBlock[contArrow].comprimento} L: ${valueBlock[contArrow].largura} A: ${valueBlock[contArrow].altura}` 
              const infoBoard = new PIXI.Text(texts.measure.b6, textCharacter);
              measure1.text = valueBlock[contArrow].comprimento + 'cm';
              measure2.text = valueBlock[contArrow].largura + 'cm';
              measure3.text = valueBlock[contArrow].altura + 'cm';
              infoBoard.x = 50;
              infoBoard.y = 118;
              textonBlock.addChild(infoBoard);
            };
            if(contArrow === 7){ 
              texts.measure.b7 = `Bloco 7 C: ${valueBlock[contArrow].comprimento} L: ${valueBlock[contArrow].largura} A: ${valueBlock[contArrow].altura}`
              const infoBoard = new PIXI.Text(texts.measure.b7, textCharacter);
              measure1.text = valueBlock[contArrow].comprimento + 'cm';
              measure2.text = valueBlock[contArrow].largura + 'cm';
              measure3.text = valueBlock[contArrow].altura + 'cm';
              infoBoard.x = 50;
              infoBoard.y = 138;
              textonBlock.addChild(infoBoard);
            };
            if(contArrow === 8){ 
              texts.measure.b8 = `Bloco 8 C: ${valueBlock[contArrow].comprimento} L: ${valueBlock[contArrow].largura} A: ${valueBlock[contArrow].altura}`
              const infoBoard = new PIXI.Text(texts.measure.b8, textCharacter);
              measure1.text = valueBlock[contArrow].comprimento + 'cm';
              measure2.text = valueBlock[contArrow].largura + 'cm';
              measure3.text = valueBlock[contArrow].altura + 'cm';
              infoBoard.x = 50;
              infoBoard.y = 158;
              textonBlock.addChild(infoBoard);
            };
            if(contArrow === 9){ 
              texts.measure.b9 = `Bloco 9 C: ${valueBlock[contArrow].comprimento} L: ${valueBlock[contArrow].largura} A: ${valueBlock[contArrow].altura}`
              const infoBoard = new PIXI.Text(texts.measure.b9, textCharacter);
              measure1.text = valueBlock[contArrow].comprimento + 'cm';
              measure2.text = valueBlock[contArrow].largura + 'cm';
              measure3.text = valueBlock[contArrow].altura + 'cm';
              infoBoard.x = 50;
              infoBoard.y = 178;
              textonBlock.addChild(infoBoard);
            };
            if(contArrow === 10){ 
              texts.measure.b10 = `Bloco10 C: ${valueBlock[contArrow].comprimento} L: ${valueBlock[contArrow].largura} A: ${valueBlock[contArrow].altura}`;
              const infoBoard = new PIXI.Text(texts.measure.b10, textCharacter);
              measure1.text = valueBlock[contArrow].comprimento + 'cm';
              measure2.text = valueBlock[contArrow].largura + 'cm';
              measure3.text = valueBlock[contArrow].altura + 'cm';
              infoBoard.x = 50;
              infoBoard.y = 199;
              textonBlock.addChild(infoBoard);
            };
            if(contArrow === 11){ 
              texts.measure.b11 = `Bloco11 C: ${valueBlock[contArrow].comprimento} L: ${valueBlock[contArrow].largura} A: ${valueBlock[contArrow].altura}`;
              const infoBoard = new PIXI.Text(texts.measure.b11, textCharacter);
              measure1.text = valueBlock[contArrow].comprimento + 'cm';
              measure2.text = valueBlock[contArrow].largura + 'cm';
              measure3.text = valueBlock[contArrow].altura + 'cm';
              infoBoard.x = 50;
              infoBoard.y = 220;
              textonBlock.addChild(infoBoard);
            };
            if(contArrow === 12){ 
              texts.measure.b12 = `Bloco12 C: ${valueBlock[contArrow].comprimento} L: ${valueBlock[contArrow].largura} A: ${valueBlock[contArrow].altura}`;
              const infoBoard = new PIXI.Text(texts.measure.b12, textCharacter);
              measure1.text = valueBlock[contArrow].comprimento + 'cm';
              measure2.text = valueBlock[contArrow].largura + 'cm';
              measure3.text = valueBlock[contArrow].altura + 'cm';
              infoBoard.x = 50;
              infoBoard.y = 240;
              textonBlock.addChild(infoBoard);
            };
            if(contArrow === 13){ 
              texts.measure.b13 = `Bloco13 C: ${valueBlock[contArrow].comprimento} L: ${valueBlock[contArrow].largura} A: ${valueBlock[contArrow].altura}`; 
              const infoBoard = new PIXI.Text(texts.measure.b13, textCharacter);
              measure1.text = valueBlock[contArrow].comprimento + 'cm';
              measure2.text = valueBlock[contArrow].largura + 'cm';
              measure3.text = valueBlock[contArrow].altura + 'cm';
              infoBoard.x = 50;
              infoBoard.y = 260;
              textonBlock.addChild(infoBoard);
  
              /*  Devolve a interatividade do bloco 
                  apois os 13 blocos serem avaliados. */
              block.interactive = true;
              block.buttonMode = true;
  
              rightArrowBlock.visible = false;
  
            };
          } else {
            measure1.text = valueBlock[contArrow].comprimento + 'cm';
            measure2.text = valueBlock[contArrow].largura + 'cm';
            measure3.text = valueBlock[contArrow].altura + 'cm';   
          }
  
          return time,  contArrow++;
        } if (contArrow <= 1) {
          return contArrow = 1;
        }
  
      }
      
      // contador para indentificar e anotar qual bloco esta sendo avaliado.
      let contArrow = 1;
      const rightArrowBlock = new PIXI.Sprite(resources.rightArrow.texture);
      rightArrowBlock.interactive = true;
      rightArrowBlock.buttonMode = true;
      rightArrowBlock.on('pointerdown', onArrowRight);
      configureObject(app, rightArrowBlock,25, 25, 300, 425);
  
      arrowContainer.addChild(rightArrowBlock);
      arrowContainer.visible = false;
  
      let arrayBlockFront = [];
      let  contBlockFront = 0;
      const rightArrowFront = new PIXI.Sprite(resources.rightArrow.texture);
      rightArrowFront.interactive = true;
      rightArrowFront.buttonMode = true;
      rightArrowFront.on("pointerdown",onArrowRightSquare)
      configureObject(app, rightArrowFront, 70, 70, 750, 450);
      rightArrowFront.visible = false;
  
      // backgroud para quando clicar ficar escuro
      const lightBackground = new PIXI.Sprite(resources.lightBackground.texture);
      configureObject(app, lightBackground, 210, 90, 695, 45);
      const moveBackground = new PIXI.Sprite(resources.darkBackground.texture);
      configureObject(app, moveBackground, 70, 90, 625, 45);
      moveBackground.visible = false;
      const rotationBackground = new PIXI.Sprite(resources.darkBackground.texture);
      configureObject(app, rotationBackground, 70, 90, 695, 45);
      rotationBackground.visible = false;
      const horizonBackground = new PIXI.Sprite(resources.darkBackground.texture);
      configureObject(app, horizonBackground, 70, 90, 765, 45);
      horizonBackground.visible = false;
  
      // barra de indicadores de uso do paquímetro 
      const toolPachymeter = new PIXI.Sprite(resources.toolPachymeter.texture);
      configureObject(app, toolPachymeter, 300, 90, 650, 45);
  
      // Botões invisíveis na frente de cada icone
  
      let flagmove = true;
      let rotationFlag = true;
      const onMove = () => {
        if(flagmove && rotationFlag){
          pachymeterContainer.interactive = true;
          pachymeterContainer.buttonMode =true;
          pachymeterContainer
          .on('pointerdown', onDragStart)
          .on('pointerup', onDragEnd)
          .on('pointerupoutside', onDragEnd)
          .on('pointermove', onDragMove);
  
          pachymeter.part
          .off("pointerdown", onDragStartPachymeter)
          .off("pointerup", onDragEndPachymeter)
          .off("pointerupoutside", onDragEndPachymeter)
          .off("pointermove", onDragMovePachymeter);
  
          moveBackground.visible = true;
          horizonBackground.visible = false;
          
          return flagmove = false;
        }else {
          pachymeter.part
          .on("pointerdown", onDragStartPachymeter)
          .on("pointerup", onDragEndPachymeter)
          .on("pointerupoutside", onDragEndPachymeter)
          .on("pointermove", onDragMovePachymeter);
          
          horizonBackground.visible = true;
          moveBackground.visible = false;
  
          pachymeterContainer.interactive = false;
          pachymeterContainer.buttonMode = false;
          return flagmove = true;
        }
      }
  
      const moveClick = new PIXI.Sprite(resources.backgroundInvible.texture);
      configureObject(app, moveClick, 70, 90, 625, 45);
      moveClick.interactive = true;
      moveClick.buttonMode = true;
      moveClick.on("pointerdown",() =>{
        rotationFlag = true;
        onMove();
      });
  
      const rotationClick = new PIXI.Sprite(resources.backgroundInvible.texture);
      configureObject(app, rotationClick, 70, 90, 695, 45);
      rotationClick.interactive = true;
      rotationClick.buttonMode = true;
      let flagAngle = true;
      rotationClick.on('pointerdown', () => {
        const time = gsap.timeline();
        if (flagAngle) {
          time.to(pachymeterContainer, {
            pixi: {
              angle: 90
            }
          });
  
          time.to(rotationBackground,{
            pixi: {
              visible: true
            },
          });
          return time, flagAngle = false;
        } else {
          time.to(pachymeterContainer, {
            pixi: {
              angle: 0
            }
          });
  
          time.to(rotationBackground,{
            pixi: {
              visible: false
            },
          });
          return time, flagAngle = true;
        }
        
      });
  
      const horizonClick = new PIXI.Sprite(resources.backgroundInvible.texture);
      configureObject(app, horizonClick, 70, 90, 765, 45);
      horizonClick.interactive = true;
      horizonClick.buttonMode = true;
      horizonClick.on('pointerdown', () => {
        rotationFlag = false;
        onMove();
      });
      
      const ToolbarContainer = new PIXI.Container();
      configureObject(app, ToolbarContainer, 0, 0, 400, 0,);
      ToolbarContainer.addChild(lightBackground,
                                moveBackground,
                                rotationBackground,
                                horizonBackground,
                                toolPachymeter,
                                moveClick,
                                rotationClick,
                                horizonClick
      );
  
  
  
      // criação de card botão e texto inicial chamando logo em seguida initalposition
      const backgroundIntro = new PIXI.Sprite(resources.backgroundIntro.texture);
      configureObject(app, backgroundIntro, 800, 600, 400, 300);
  
      const introButton = new PIXI.Sprite(resources.introButton.texture);
      introButton.interactive = true;
      introButton.buttonMode = true;
      introButton.on('pointerdown', initialPosition);
      configureObject(app, introButton, 60, 30, 600, 470);
      
      const textIntroStyle = new PIXI.TextStyle({
        fontFamily: "Roboto",
        wordWrap: true,
        wordWrapWidth: 530,
        fontSize: 20,
        fill: 0xffffff,
        background: 0x000000,
      });
  
      const textIntro = new PIXI.Text(texts.intro, textIntroStyle);
      position(app, textIntro, 400, 250);
  
      // background onde os valores iram ser exibidos
      const  infoBackgroud = new PIXI.Sprite(resources.infoBackground.texture);
      configureObject(app, infoBackgroud, 800, 600, 400, 300);
      infoBackgroud.visible = false;
  
      const infoContainer = new PIXI.Container();
      configureObject(app, infoContainer, 0, 0, 0, 0);
  
      const infoValue = () =>{
        infoBackgroud.visible = true;
        
        // Exibe a seta para a direita nas informações finais
        rightInfo.visible = true;
  
        // controla a fonte dos caracteres 
        textCharacter.fontSize = 16;
        
        textonBlock.visible = true;
        textonBlock.x = -20;
        textonBlock.y = 100;
        
        textStep0.visible = true;
        textStep0.x = 260;
        textStep0.y = 100;
        
        textStep1.visible = true;
        textStep1.x = 470;
        textStep1.y = 70;
        
        textStep2.visible = true;
        textStep2.x = 800;
        textStep2.y = 100;
        
        textStep3.visible = true;
        textStep3.x = 1070;
        textStep3.y = 100;
        
      };
  
      const rightInfo = new PIXI.Sprite(resources.rightArrow.texture);
      configureObject(app, rightInfo, 50, 50, 750, 480, true);
      rightInfo.visible = false;
      rightInfo.on('pointerdown', () => {
  
        rightInfo.visible = false;
        leftInfo.visible = true;
  
        const time = gsap.timeline();
        time.to(infoContainer, {
          pixi: {
            x: -800
          }
        });
      });    
      
      const leftInfo = new PIXI.Sprite(resources.leftArrow.texture);
      configureObject(app, leftInfo, 50, 50, 750, 480, true);
      leftInfo.visible = false;
      leftInfo.on('pointerdown', () => {
        
        leftInfo.visible = false;
        rightInfo.visible = true;
  
        const time = gsap.timeline();
        time.to(infoContainer, {
          pixi: {
            x: 0
          }
        });
      });    
      
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

module.exports = {
    randomNumber,
    randomFloatNumber,
    configureObject,
}
},{}],3:[function(require,module,exports){
//const {introOptions} = require('./intro');
//const {footerOptions} = require('./footer');
const {configureObject} = require('./functions');
// const PIXI = require('pixi.js');
// const texts = require('./texts');


const options = {
    width: 800,
    height: 600,
    backgroundColor: 0x7193bc,
    targetSelector: "#animation",
    fontFamilies: ["Roboto", "DS-DIGI"],
    resources: {
        newBlock: "https://lia-labv.s3.sa-east-1.amazonaws.com/praticas/p04-dimensao-tijolo/tijolos+atualizados/01.png",
        blockConvexo: "https://lia-labv.s3.sa-east-1.amazonaws.com/praticas/p04-dimensao-tijolo/tijolos+atualizados/02.png",
        blockConcavo: "https://lia-labv.s3.sa-east-1.amazonaws.com/praticas/p04-dimensao-tijolo/tijolos+atualizados/03.png",
        blockFire: "https://lia-labv.s3.sa-east-1.amazonaws.com/praticas/p04-dimensao-tijolo/tijolos+atualizados/04.png",
        blockCrak: "https://lia-labv.s3.sa-east-1.amazonaws.com/praticas/p04-dimensao-tijolo/tijolos+atualizados/05.png",

        blockL: "https://lia-labv.s3.sa-east-1.amazonaws.com/praticas/p04-dimensao-tijolo/Nova+pasta+(2)/01.png",
        blockR: "https://lia-labv.s3.sa-east-1.amazonaws.com/praticas/p04-dimensao-tijolo/Nova+pasta+(2)/2.png",

        infoBackground: "https://lia-labv.s3.sa-east-1.amazonaws.com/praticas/p04-dimensao-tijolo/backgroud+informa%C3%A7%C3%B5es.png",
        backgroundIntro: "https://lia-labv.s3.sa-east-1.amazonaws.com/praticas/p04-dimensao-tijolo/background+intro.png",
        introButton: "https://lia-labv.s3.sa-east-1.amazonaws.com/praticas/p04-dimensao-tijolo/intro+button.png",
        
        block: "https://lia-labv.s3.sa-east-1.amazonaws.com/praticas/p04-dimensao-tijolo/tijolo+Emerson.png",
        board: "https://lia-labv.s3.sa-east-1.amazonaws.com/praticas/p04-dimensao-tijolo/Folha+de+caderno.png",
        table1: "https://lia-labv.s3.sa-east-1.amazonaws.com/praticas/p04-dimensao-tijolo/table1.png",
        table_horizon: "https://lia-labv.s3.sa-east-1.amazonaws.com/praticas/p04-dimensao-tijolo/Mesa+orizontal+.png",
        buttonScale: "https://lia-labv.s3.sa-east-1.amazonaws.com/praticas/p04-dimensao-tijolo/bot%C3%A3o+medidas.png",
        nextButton: "https://lia-labv.s3.sa-east-1.amazonaws.com/praticas/p04-dimensao-tijolo/BOT%C3%83O+DE+PR%C3%93XIMO.png",
        backButton: "https://lia-labv.s3.sa-east-1.amazonaws.com/praticas/p04-dimensao-tijolo/botao_voltar_certo.png",
        dialogBox: "https://lia-labv.s3.sa-east-1.amazonaws.com/praticas/p04-dimensao-tijolo/dialogBox.png",
        measure: "https://lia-labv.s3.sa-east-1.amazonaws.com/praticas/p04-dimensao-tijolo/R%C3%A9gua.png",
        ruler: "https://lia-labv.s3.sa-east-1.amazonaws.com/praticas/p04-dimensao-tijolo/Trena.png",
        scaleRuler: "https://lia-labv.s3.sa-east-1.amazonaws.com/praticas/p04-dimensao-tijolo/Regua+da+trena++(1).png",
        defletometro: "https://lia-labv.s3.sa-east-1.amazonaws.com/praticas/p04-dimensao-tijolo/Defletrometro+01+.png",
        faceBlock: "https://lia-labv.s3.sa-east-1.amazonaws.com/praticas/p04-dimensao-tijolo/face+tijolo.png",
        pointer: "https://lia-labv.s3.sa-east-1.amazonaws.com/praticas/p04-dimensao-tijolo/Ponteiro.png",
        block_frente: "https://lia-labv.s3.sa-east-1.amazonaws.com/praticas/p04-dimensao-tijolo/Tijolo+2d.png",
        block_top: "https://lia-labv.s3.sa-east-1.amazonaws.com/praticas/p04-dimensao-tijolo/Tijolo+2d+sima+.png",
        square: "https://lia-labv.s3.sa-east-1.amazonaws.com/praticas/p04-dimensao-tijolo/Esquadro+angulo+90%C2%B0.png",
        backgroundTable: "https://lia-labv.s3.sa-east-1.amazonaws.com/praticas/p04-dimensao-tijolo/backgroud.png",
        
        showscale: "https://lia-labv.s3.sa-east-1.amazonaws.com/praticas/p04-dimensao-tijolo/show+medidas.png",
        pachymeter1:"https://lia-labv.s3.sa-east-1.amazonaws.com/praticas/p04-dimensao-tijolo/Paquimetro+parte+1.png",
        pachymeter2:"https://lia-labv.s3.sa-east-1.amazonaws.com/praticas/p04-dimensao-tijolo/paquimetro+parte+2.png",
        toolPachymeter: "https://lia-labv.s3.sa-east-1.amazonaws.com/praticas/p04-dimensao-tijolo/Icone+.png",
        saveButton: "https://lia-labv.s3.sa-east-1.amazonaws.com/praticas/p04-dimensao-tijolo/save+button.png",
        backgroundInvible: "https://lia-labv.s3.sa-east-1.amazonaws.com/praticas/p04-dimensao-tijolo/Fundo+invisivel.png",
        lightBackground: "https://lia-labv.s3.sa-east-1.amazonaws.com/praticas/p04-dimensao-tijolo/Fundo+claro+.png",
        darkBackground: "https://lia-labv.s3.sa-east-1.amazonaws.com/praticas/p04-dimensao-tijolo/Fundo+escuro+.png",
        rightArrow: "https://lia-labv.s3.sa-east-1.amazonaws.com/praticas/p04-dimensao-tijolo/Direita+.png",
        leftArrow: "https://lia-labv.s3.sa-east-1.amazonaws.com/praticas/p04-dimensao-tijolo/Esquerda+.png",
    }
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

// inserindo persona
if (typeof personaOptions !== "undefined") { Object.keys(personaOptions.resources).forEach((id) => { options.resources[id] = personaOptions.resources[id]; }); }

const createObjects = (app, resources) => {
    let allObjects = {};

    const options = { 
        x: 400, //(opcional)
        y: 400, //(opcional)
        zIndex: 1, //(opcional),
        scale: 1.5, //(opcional)
        persona: 'engineer', //(obrigatório)
        direction: 'standing' , //(obrigatório)
        headDirection: 'ahead', //(obrigatório)
        texture: 0 //(obrigatório)
    }

    const persona = new CreatePersona(app, resources, options)
    allObjects.persona = persona;
    
    return allObjects
}


module.exports = {
    options,
    createObjects,
};
},{"./functions":2}],4:[function(require,module,exports){
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
}

module.exports = setup;
},{}],5:[function(require,module,exports){
module.exports={
    "footer" : {
        "title": "Determinacão de características geométricas", 
        "version": 1.0,
        "year": 2022,
        "collaborators": {
            "Desenvolvedores": "Jailson Junior, Maurício Alves, Emerson José, Thiago Nascimento, Angélica Martiniano, David Mateus, Mateus Sobrenome, Alexandre Sobrenome",
            "Professor conteudista": "Iury Sousa",
            "Ilustradores": "Ana Carolina",
            "Gerente": "Heloisa Pimentel, Adilson Da Silva",
            "afsdhjk": "Anotação"
        }
    },
        "intro": "Ensaio de determinações de características geométricas do\n               bloco cerâmicos não estruturais vazados\n\n\n\n\n\nEnsaio de determinações de características geométricas do bloco cerâmicos não estruturais Vamos iniciar o ensaio para verificação das características geométricas dimensionais para os Blocos Cerâmicos não estruturais para vedação conforme a NBR 15270-1/2: 2017.",
        "speak1": "Iniciando as medições:\n\nprimeiro faremos a verificação das dimensões de largura, comprimento e altura de 13 blocos de forma individual ao clicar no bloco que está sobre a mesa.",
        "speak2": "Veja que os valores são dados em:\n\nC - comprimento;\nL - largura;\nA - Altura.",
        "speak3": "Agora como forma comparativa de resultados, conforme a norma, iremos fazer a medição média pelo agrupamento dos 13 blocos nas 3 dimensões",
        "speak4": "Um fator importante para a qualidade dos blocos são as espessuras das paredes externas e dos septos, assim iremos fazer a medição com o uso do paquímetro.",
        "speak5": "A planeza das faces do bloco podem influenciar na qualidade executiva, assim iremos conferir se atendem aos parâmetros técnicos com o uso do defletómetro, importante dizer que medições com resultados positivos são apresentadas como côncavo e negativa como convexo.",
        "speak6": "Outro resultado que afeta a qualidade executiva é o esquadro dos blocos, iremos com o uso de um esquadro de mão realizar as medições.",
        "speak7": "Agora, com os dados coletados elabore um relatório de ensaio, indicando:\n\n- Dimensões individuais;\n- Dimensões média;\n- Espessuras;\n- Deflexão;\n- Esquadro.\n\nOs resultados alcançados deve ser comparados com os resultados determinados normativamente, escreva um parecer se a amostra foi aprovada ou reprovada, justificando cada um dos parâmetros analisados.",
        
        "indicador": " ",
        
        "text1": {
            "measure1": "19cm"
        },
        "text2": {
            "measure2": "9cm"
        },
        "text3": {
            "measure3": "19cm"
        },
        "measure": {
            "b1": "",
            "b2": "",
            "b3": "",
            "b4": "",
            "b5": "",
            "b6": "",
            "b7": "",
            "b8": "",
            "b9": "",
            "b10": "",
            "b11": "",
            "b12": "",
            "b13": ""
        },
        "mediaBlocks": {
            "valor1": "",
            "valor2": "",
            "valor3": ""
        },
        "pachymeter": {
            "inter1": "",
            "inter2": "",
            "exter1": "",
            "exter2": ""
        },
        "deflectBlocks": {
            "b1": "",
            "b2": "",
            "b3": "",
            "b4": "",
            "b5": "",
            "b6": "",
            "b7": "",
            "b8": "",
            "b9": "",
            "b10": "",
            "b11": "",
            "b12": "",
            "b13": ""
        },
        "squareBlocks": {
            "b1": "",
            "b2": "",
            "b3": "",
            "b4": "",
            "b5": "",
            "b6": "",
            "b7": "",
            "b8": "",
            "b9": "",
            "b10": "",
            "b11": "",
            "b12": "",
            "b13": ""
        }
    
}
},{}]},{},[1]);
