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
const { options, createObjects,  } = require('./objects');
const texts = require('./texts');

//MAIN
(function main() {
    setup(options, (app, resources) => {
        /* MAIN TIMELINE */
        const mainTimeline = () => {
            const timeline = gsap.timeline();
            //timeline.add(intro(app, resources));
            timeline.add(footer(app, resources, texts));
            timeline.add(initialPosition());

            return timeline;
        };

        /* CREATE ITEMS SCOPE */
        const allObjects = createObjects(app, resources);

        // initial position, first timeline.
        function initialPosition() {
            const initial = gsap.timeline({
                delay: 1,
            });

            /* initial position code */

            return initial;
        }

        // calling mainTimeline
        mainTimeline();
    });
})();

},{"./objects":3,"./setup-v3":4,"./texts":5}],2:[function(require,module,exports){
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

const configureBoardTexts = ( app, object, scale, x, y, moveItem = false, visible = true) => {
    position(app, object, x, y);
    object.scale.set(scale);
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
    ConfigureText,
    configureBoardTexts,
}
},{}],3:[function(require,module,exports){
const {
	configureObject,
	ConfigureText
} = require("./functions");
const texts = require("./texts");

const options = {
	width: 800,
	height: 600,
	backgroundColor: 0x7193bc,
	targetSelector: "#animation",
	fontFamilies: ["Roboto", "DS-DIGI"],
	resources: {
		//MESA
		table: "https://lia-labv.s3.sa-east-1.amazonaws.com/praticas/p01-granulometria-v2/mesa.png",

		//PECAS 3D
		object1_3dMetal:
			"https://lia-labv.s3.sa-east-1.amazonaws.com/praticas/p07-paquimetro/Pe%C3%A7as/Pratica+paqu%C3%ADmetro+pe%C3%A7as/1Metal/3-8.png",
		object2_3dMetal:
			"https://lia-labv.s3.sa-east-1.amazonaws.com/praticas/p07-paquimetro/Pe%C3%A7as/Pratica+paqu%C3%ADmetro+pe%C3%A7as/2Metal/1-8.png",
		object3_3dMetal:
			"https://lia-labv.s3.sa-east-1.amazonaws.com/praticas/p07-paquimetro/Pe%C3%A7as/Pratica+paqu%C3%ADmetro+pe%C3%A7as/3Metal/1-8.png",
		object4_3dMetal:
			"https://lia-labv.s3.sa-east-1.amazonaws.com/praticas/p07-paquimetro/Pe%C3%A7as/Pratica+paqu%C3%ADmetro+pe%C3%A7as/4Metal/1-8.png",

		//BOTÕES
		enablePachymeterUseButton:
			"https://lia-labv.s3.sa-east-1.amazonaws.com/praticas/p07-paquimetro/Bot%C3%B5es/Habilitar+medi%C3%A7%C3%A3o+(v2).png",
		disablePachymeterUseButton:
			"https://lia-labv.s3.sa-east-1.amazonaws.com/praticas/p07-paquimetro/Bot%C3%B5es/Habilitar+movimenta%C3%A7%C3%A3o+(v2).png",
		rotatePachymeterButton:
			"https://lia-labv.s3.sa-east-1.amazonaws.com/praticas/p07-paquimetro/Bot%C3%B5es/Rotacionar+paqu%C3%ADmetro+(v2).png",
		returnValuesButton:
			"https://lia-labv.s3.sa-east-1.amazonaws.com/praticas/p07-paquimetro/Bot%C3%B5es/Mostrar+resultado+(V3).png",
		returnTable:
			"https://lia-labv.s3.sa-east-1.amazonaws.com/praticas/p07-paquimetro/Bot%C3%B5es/Voltar+aos+materiais+(new).png",
		closeButton:
			"https://lia-labv.s3.sa-east-1.amazonaws.com/praticas/p07-paquimetro/Bot%C3%B5es/Fechar+01+(1).png",

		//PECAS 2D
		object1_2dMetalUpperView:
			"https://lia-labv.s3.sa-east-1.amazonaws.com/praticas/p07-paquimetro/Pe%C3%A7as/Pratica+paqu%C3%ADmetro+pe%C3%A7as/1Metal/Artboard+4-8.png",
		object1_2dMetalSideView:
			"https://lia-labv.s3.sa-east-1.amazonaws.com/praticas/p07-paquimetro/Pe%C3%A7as/Pratica+paqu%C3%ADmetro+pe%C3%A7as/1Metal/Artboard+3-8.png",

		object2_2dMetalUpperView:
			"https://lia-labv.s3.sa-east-1.amazonaws.com/praticas/p07-paquimetro/Pe%C3%A7as/Pratica+paqu%C3%ADmetro+pe%C3%A7as/2Metal/2-8.png",
		object2_2dMetalSideView:
			"https://lia-labv.s3.sa-east-1.amazonaws.com/praticas/p07-paquimetro/Pe%C3%A7as/Pratica+paqu%C3%ADmetro+pe%C3%A7as/2Metal/3-8.png",

		object3_2dMetalUpperView:
			"https://lia-labv.s3.sa-east-1.amazonaws.com/praticas/p07-paquimetro/Pe%C3%A7as/Pratica+paqu%C3%ADmetro+pe%C3%A7as/3Metal/2-8.png",
		object3_2dMetalSideView:
			"https://lia-labv.s3.sa-east-1.amazonaws.com/praticas/p07-paquimetro/Pe%C3%A7as/Pratica+paqu%C3%ADmetro+pe%C3%A7as/3Metal/3-8.png",

		object4_2dMetalUpperView:
			"https://lia-labv.s3.sa-east-1.amazonaws.com/praticas/p07-paquimetro/Pe%C3%A7as/Pratica+paqu%C3%ADmetro+pe%C3%A7as/4Metal/3-8.png",
		object4_2dMetalSideView:
			"https://lia-labv.s3.sa-east-1.amazonaws.com/praticas/p07-paquimetro/Pe%C3%A7as/Pratica+paqu%C3%ADmetro+pe%C3%A7as/4Metal/2-8.png",

		//FUNDO PECA 3D
		back: "https://lia-labv.s3.sa-east-1.amazonaws.com/praticas/p07-paquimetro/fundo_peca3D/Artboard+1-8.png",

		//TABELA DE RESULTADOS
		resultsTable:
			"https://lia-labv.s3.sa-east-1.amazonaws.com/praticas/p07-paquimetro/Bot%C3%B5es/Tabela+(new).png",
	},
};

try {
	const addOptions = [
		pachymeterOptions,
		introOptions,
		footerOptions,
		personaOptions,
	];
	addOptions.forEach((option) => {
		Object.keys(option.resources).forEach((id) => {
			options.resources[id] = option.resources[id];
		});
	});
} catch (e) {
	console.log(e.message);
}

// esconde objetos
const hideNotUsedObjects = (objects) => {
	const move = gsap.timeline();
	objects.forEach((object) => {
		object.selected
			? move.to(
					object,
					{ pixi: { x: 100, y: 100, height: 40, width: 40 } },
					0
			  )
			: move.to(object, { pixi: { visible : false }, duration: 2 }, 0);
	});

	return move;
};

// mostra objetos
const showObjects = (objects) => {
	const move = gsap.timeline();
	objects.forEach((object) => {
		if (object.selected) {
			object.selected = false; //deseleciona
			object.interactive = true; // voltam pra seus lugares com a interatividade
			move.to(
				object,
				{
					pixi: {
						x: object.initialX,
						y: object.initialY,
						height: 75,
						width: 75,
					},
				},
				0
			); //atuaaliza o x e y de cada objeto do array na sua posicao inicial
			move.to([object.sideView, object.upperView], {
				visible: false,
				interactive: true,
				height: 80,
				width: 80,
			});
			move.to([object.sideView], {
				x: object.sideView.initialX,
				y: object.sideView.initialY,
			});
			move.to([object.upperView], {
				x: object.upperView.initialX,
				y: object.upperView.initialY,
			});
		} else {
			move.to(
				object,
				{
					pixi: { visible: true },
					duration: 1,
				},
				0
			);
		}
	});
};

//FUNCAO MOVE OBJETO 2D PARA MEDICAO OCULTANDO OS DEMAIS
const moveToRamdom = (
	object2dSelected,
	obeject2dNotSelected,
	referentObject3d
) => {
	const move = gsap.timeline();
	move.to(object2dSelected, {
		pixi: { x: 400, y: 350 },
		delay: 0.5,
		duration: 1,
	});
	obeject2dNotSelected.visible = false;
	referentObject3d.visible = true;
	console.log(
		(valueRamdom = object2dSelected.height = randomFloatNumber(80, 200)),
		"altura"
	);
	console.log(
		(object2dSelected.width = randomFloatNumber(80, 200)),
		"largura"
	);
	object2dSelected.interactive = false; //true podemos  gerar infinitos valores com a mesma peca selecionada
}; // false necessita selecionar novamente o objeto 3d na tela inicial para gerar novos parametros para a vista 2d selecionada

const moveToRamdomSymmetric = (
	object2dSelected,
	obeject2dNotSelected,
	referentObject3d
) => {
	const move = gsap.timeline();
	move.to(object2dSelected, {
		pixi: { x: 400, y: 350 },
		delay: 0.5,
		duration: 1,
	});
	obeject2dNotSelected.visible = false;
	referentObject3d.visible = true;
	console.log(
		(valueRamdom = object2dSelected.height = randomFloatNumber(80, 200)),
		"altura"
	);
	console.log((object2dSelected.width = valueRamdom), "largura");
	object2dSelected.interactive = false;
};

const createObjects = (app, resources) => {
	let allObjects = {};

	//config persona
	//PERSONA
	const optionsCharacter = {
		width: 550,
		x: 670,
		y: 450,
		zIndex: -0,
		persona: "engineer",
		direction: "standing",
		headDirection: "ahead",
		texture: 0,
	};

	const persona = new CreatePersona(app, resources, optionsCharacter);
	// persona.configureDialogues({ zIndex: 10})
	allObjects.persona = persona;

	//MESA
	const table = PIXI.Sprite.from(resources.table.texture);
	configureObject(app, table, 650, 360, 400, 650);
	table.initialX = table.x;
	table.initialY = table.y;
	allObjects.table = table;

	//peca 4 2d metal vista lateral
	const back = PIXI.Sprite.from(resources.back.texture);
	configureObject(
		app,
		back,
		110,
		110,
		100,
		100,
		(interactive = true),
		(visible = false)
	);
	back.initialX = back.x;
	back.initialY = back.y;
	allObjects.back = back;

	//peca 1 3d metal
	const object1_3dMetal = PIXI.Sprite.from(resources.object1_3dMetal.texture);
	configureObject(
		app,
		object1_3dMetal,
		75,
		75,
		180,
		480,
		(interactive = true),
		(visible = true)
	);
	object1_3dMetal.initialX = object1_3dMetal.x;
	object1_3dMetal.initialY = object1_3dMetal.y;
	allObjects.object1_3dMetal = object1_3dMetal;

	//peca 2 3d metal objetct2_3dMetal
	const object2_3dMetal = PIXI.Sprite.from(resources.object2_3dMetal.texture);
	configureObject(
		app,
		object2_3dMetal,
		75,
		75,
		330,
		480,
		(interactive = true),
		(visible = true)
	);
	object2_3dMetal.initialX = object2_3dMetal.x;
	object2_3dMetal.initialY = object2_3dMetal.y;
	allObjects.object2_3dMetal = object2_3dMetal;

	//peca 3 3d metal object3_3dMetal
	const object3_3dMetal = PIXI.Sprite.from(resources.object3_3dMetal.texture);
	configureObject(
		app,
		object3_3dMetal,
		75,
		75,
		480,
		480,
		(interactive = true),
		(visible = true)
	);
	object3_3dMetal.initialX = object3_3dMetal.x;
	object3_3dMetal.initialY = object3_3dMetal.y;
	allObjects.object3_3dMetal = object3_3dMetal;

	//peca 4 3d metal object4_3dMetal
	const object4_3dMetal = PIXI.Sprite.from(resources.object4_3dMetal.texture);
	configureObject(
		app,
		object4_3dMetal,
		75,
		75,
		630,
		480,
		(interactive = true),
		(visible = true)
	);
	object4_3dMetal.initialX = object4_3dMetal.x;
	object4_3dMetal.initialY = object4_3dMetal.y;
	allObjects.object4_3dMetal = object4_3dMetal;

	//peca 1 2d metal vista superior
	const object1_2dMetalUpperView = PIXI.Sprite.from(
		resources.object1_2dMetalUpperView.texture
	);
	configureObject(
		app,
		object1_2dMetalUpperView,
		80,
		80,
		100,
		200,
		(interactive = true),
		(visible = false)
	);
	object1_2dMetalUpperView.initialX = object1_2dMetalUpperView.x;
	object1_2dMetalUpperView.initialY = object1_2dMetalUpperView.y;
	object1_3dMetal.upperView = object1_2dMetalUpperView; // adiciona ponteiro para upperView
	allObjects.object1_2dMetalUpperView = object1_2dMetalUpperView;

	//peca 1 2d metal vista lateral
	const object1_2dMetalSideView = PIXI.Sprite.from(
		resources.object1_2dMetalSideView.texture
	);
	configureObject(
		app,
		object1_2dMetalSideView,
		80,
		80,
		100,
		300,
		(interactive = true),
		(visible = false)
	);
	object1_2dMetalSideView.initialX = object1_2dMetalSideView.x;
	object1_2dMetalSideView.initialY = object1_2dMetalSideView.y; //cria atributo initialY para salvar o valor inicial que o objeto foi criado
	object1_3dMetal.sideView = object1_2dMetalSideView;
	allObjects.object1_2dMetalSideView = object1_2dMetalSideView;

	//peca 2 2d metal vista superior
	const object2_2dMetalUpperView = PIXI.Sprite.from(
		resources.object2_2dMetalUpperView.texture
	);
	configureObject(
		app,
		object2_2dMetalUpperView,
		80,
		80,
		100,
		200,
		(interactive = true),
		(visible = false)
	);
	object2_2dMetalUpperView.initialX = object2_2dMetalUpperView.x;
	object2_2dMetalUpperView.initialY = object2_2dMetalUpperView.y;
	object2_3dMetal.upperView = object2_2dMetalUpperView;
	allObjects.object2_2dMetalUpperView = object2_2dMetalUpperView;

	//peca 2 2d metal vista lateral
	const object2_2dMetalSideView = PIXI.Sprite.from(
		resources.object2_2dMetalSideView.texture
	);
	configureObject(
		app,
		object2_2dMetalSideView,
		80,
		80,
		100,
		300,
		(interactive = true),
		(visible = false)
	);
	object2_2dMetalSideView.initialX = object2_2dMetalSideView.x;
	object2_2dMetalSideView.initialY = object2_2dMetalSideView.y;
	object2_3dMetal.sideView = object2_2dMetalSideView;
	allObjects.object2_2dMetalSideView = object2_2dMetalSideView;

	//peca 3 2d metal vista superior
	const object3_2dMetalUpperView = PIXI.Sprite.from(
		resources.object3_2dMetalUpperView.texture
	);
	configureObject(
		app,
		object3_2dMetalUpperView,
		80,
		80,
		100,
		200,
		(interactive = true),
		(visible = false)
	);
	object3_2dMetalUpperView.initialX = object3_2dMetalUpperView.x;
	object3_2dMetalUpperView.initialY = object3_2dMetalUpperView.y;
	object3_3dMetal.upperView = object3_2dMetalUpperView;
	allObjects.object3_2dMetalUpperView = object3_2dMetalUpperView;

	//peca 3 2d metal vista lateral
	const object3_2dMetalSideView = PIXI.Sprite.from(
		resources.object3_2dMetalSideView.texture
	);
	configureObject(
		app,
		object3_2dMetalSideView,
		80,
		80,
		100,
		300,
		(interactive = true),
		(visible = false)
	);
	object3_2dMetalSideView.initialX = object3_2dMetalSideView.x;
	object3_2dMetalSideView.initialY = object3_2dMetalSideView.y;
	object3_3dMetal.sideView = object3_2dMetalSideView;
	allObjects.object3_2dMetalSideView = object3_2dMetalSideView;

	// PECA 4 2D VISTA SUPERIOR
	const object4_2dMetalUpperView = PIXI.Sprite.from(
		resources.object4_2dMetalUpperView.texture
	);
	configureObject(
		app,
		object4_2dMetalUpperView,
		80,
		80,
		100,
		200,
		(interactive = true),
		(visible = false)
	);
	object4_2dMetalUpperView.initialX = object4_2dMetalUpperView.x;
	object4_2dMetalUpperView.initialY = object4_2dMetalUpperView.y;
	object4_3dMetal.upperView = object4_2dMetalUpperView;
	allObjects.object4_2dMetalUpperView = object4_2dMetalUpperView;

	//peca 4 2d metal vista lateral
	const object4_2dMetalSideView = PIXI.Sprite.from(
		resources.object4_2dMetalSideView.texture
	);
	configureObject(
		app,
		object4_2dMetalSideView,
		80,
		80,
		100,
		300,
		(interactive = true),
		(visible = false)
	);
	object4_2dMetalSideView.initialX = object4_2dMetalSideView.x;
	object4_2dMetalSideView.initialY = object4_2dMetalSideView.y;
	object4_3dMetal.sideView = object4_2dMetalSideView;
	allObjects.object4_2dMetalSideView = object4_2dMetalSideView;

	// cria paquimetro
	const pachymeter = new CreatePachymeter(app, resources, {
		x: 1000,
		y: 300,
		scale: 2,
	});
	pachymeter.initialX = pachymeter.x;
	pachymeter.initialY = pachymeter.y;
	allObjects.pachymeter = pachymeter;

	//ARRAY DE OBJETOS 3D
	const arrayObjects3d = [
		object1_3dMetal,
		object2_3dMetal,
		object3_3dMetal,
		object4_3dMetal,
	];

	// array com todos os objetos que serão utilizados dentro da função hide e show
	// objetos em 3d, input, back

	//SELECIONAR OBJETO 3D
	arrayObjects3d.forEach((object3d) => {
		object3d.on("pointerdown", () => {
			if (object3d === object1_3dMetal) {
				//colocar em uma funcao
				object3d.selected = true;
				const move = gsap.timeline();
				move.add(hideNotUsedObjects(arrayObjects3d));
				move.to([buttonsContainer, back, input], { visible: true });
				move.to(pachymeter, { pixi: { x: 400, y: 200 } }, 2);

				object1_2dMetalSideView.visible = true;
				object1_2dMetalUpperView.visible = true;
				object1_3dMetal.interactive = false;

				//CENTRALIZA VISTA 2D E GERA VALOR ALEATORIO DA PECA
				object1_2dMetalUpperView.on("pointerdown", () => {
					moveToRamdom(
						object1_2dMetalUpperView,
						object1_2dMetalSideView,
						object1_3dMetal
					);
					faceSelect = object1_2dMetalUpperView;
					input.disabled = false;
				});
				object1_2dMetalSideView.on("pointerdown", () => {
					moveToRamdom(
						object1_2dMetalSideView,
						object1_2dMetalUpperView,
						object1_3dMetal
					);
					faceSelect = object1_2dMetalSideView;
					input.disabled = false;
				});

				//FUNCAO QUE HABILITA VER OS 2 OBJETOS 2D DESSE 3D,CRIAR ANTES OS OBJETOS 2D NA SEGUNDA PAGINA
				//AQUI TRABALHA COM A VISIBILIDADE/INTERATIVIDADE
			} else if (object3d === object2_3dMetal) {
				object3d.selected = true;
				const move = gsap.timeline();
				move.add(hideNotUsedObjects(arrayObjects3d));
				move.to([buttonsContainer, back, input], { visible: true });
				move.to(pachymeter, { pixi: { x: 400, y: 200 } }, 2);

				object2_2dMetalSideView.visible = true;
				object2_2dMetalUpperView.visible = true;
				object2_3dMetal.interactive = false;

				//CENTRALIZA VISTA 2D E GERA VALOR ALEATORIO DA PECA
				object2_2dMetalUpperView.on("pointerdown", () => {
					moveToRamdom(
						object2_2dMetalUpperView,
						object2_2dMetalSideView,
						object2_3dMetal
					);
					input.disabled = false;
					faceSelect = object2_2dMetalUpperView;
				});
				object2_2dMetalSideView.on("pointerdown", () => {
					moveToRamdom(
						object2_2dMetalSideView,
						object2_2dMetalUpperView,
						object2_3dMetal
					);
					input.disabled = false;
					faceSelect = object2_2dMetalSideView;
				});
			} else if (object3d === object3_3dMetal) {
				object3d.selected = true;
				const move = gsap.timeline();
				move.add(hideNotUsedObjects(arrayObjects3d));
				move.to([buttonsContainer, back, input], { visible: true });
				move.to(pachymeter, { pixi: { x: 400, y: 200 } }, 2);

				object3_2dMetalSideView.visible = true;
				object3_2dMetalUpperView.visible = true;
				object3_3dMetal.interactive = false;

				object3_2dMetalUpperView.on("pointerdown", () => {
					moveToRamdom(
						object3_2dMetalUpperView,
						object3_2dMetalSideView,
						object3_3dMetal
					);
					input.disabled = false;
					faceSelect = object3_2dMetalUpperView;
				});

				object3_2dMetalSideView.on("pointerdown", () => {
					moveToRamdom(
						object3_2dMetalSideView,
						object3_2dMetalUpperView,
						object3_3dMetal
					);
					input.disabled = false;
					faceSelect = object3_2dMetalSideView;
				});
			} else if (object3d === object4_3dMetal) {
				object3d.selected = true;
				const move = gsap.timeline();
				move.add(hideNotUsedObjects(arrayObjects3d));
				move.to([buttonsContainer, back, input], { visible: true });
				move.to(pachymeter, { pixi: { x: 400, y: 200 } }, 2);
				object4_2dMetalSideView.visible = true;
				object4_2dMetalUpperView.visible = true;
				object4_3dMetal.interactive = false;

				object4_2dMetalUpperView.on("pointerdown", () => {
					moveToRamdomSymmetric(
						object4_2dMetalUpperView,
						object4_2dMetalSideView,
						object4_3dMetal
					);
					input.disabled = false;
					faceSelect = object4_2dMetalUpperView;
				});

				object4_2dMetalSideView.on("pointerdown", () => {
					moveToRamdom(
						object4_2dMetalSideView,
						object4_2dMetalUpperView,
						object4_3dMetal
					);
					input.disabled = false;
					faceSelect = object4_2dMetalSideView;
				});
			}
		});
	});

	// valores medidos

	// cria botões (substituir por botões)
	const buttonsContainer = new PIXI.Container();
	buttonsContainer.visible = false;
	app.stage.addChild(buttonsContainer);

	const buttonsX = 720;
	const buttonsY = 55;

	// botão para habilitar uso do paquímetro
	const enablePachymeterUseButton = PIXI.Sprite.from(
		resources.enablePachymeterUseButton.texture
	);
	configureObject(
		app,
		enablePachymeterUseButton,
		100,
		40,
		buttonsX,
		buttonsY,
		true,
		true
	);

	enablePachymeterUseButton.on("pointerdown", () => {
		pachymeter.enableUse();
		pachymeter.disableMove();
	});
	buttonsContainer.addChild(enablePachymeterUseButton);

	// botão para habilitar movimento do paquímetro
	const disablePachymeterUseButton = PIXI.Sprite.from(
		resources.disablePachymeterUseButton.texture
	);
	configureObject(
		app,
		disablePachymeterUseButton,
		100,
		40,
		buttonsX,
		buttonsY * 2,
		true,
		true
	);

	disablePachymeterUseButton.on("pointerdown", () => {
		pachymeter.disableUse();
		pachymeter.enableMove();
	});
	buttonsContainer.addChild(disablePachymeterUseButton);

	// botão para rotacionar o paquímetro
	const rotatePachymeterButton = PIXI.Sprite.from(
		resources.rotatePachymeterButton.texture
	);
	configureObject(
		app,
		rotatePachymeterButton,
		100,
		40,
		buttonsX,
		buttonsY * 3,
		true,
		true
	);

	rotatePachymeterButton.on("pointerdown", () => {
		pachymeter.setAngle(pachymeter.angle === 0 ? 90 : 0);
	});
	buttonsContainer.addChild(rotatePachymeterButton);

	const resultsTable = PIXI.Sprite.from(resources.resultsTable.texture);
	configureObject(
		app,
		resultsTable,
		340,
		400,
		200,
		230,
		(interactive = false),
		(visible = false)
	);
	resultsTable.zIndex = 15;

	const closeButton = PIXI.Sprite.from(resources.closeButton.texture);
	configureObject(
		app,
		closeButton,
		25,
		12,
		resultsTable.x * 1.9,
		resultsTable.y / 6,
		(interactive = true),
		(visible = false)
	);
	closeButton.zIndex = 16;

	// INSERIR VALOR DA MEDIÇÃO
	const input = new TextInput({
		input: {
			fontSize: "20pt",
			padding: "14px",
			width: "200px",
			color: "#26272E",
		},
		box: {
			default: {
				fill: 0xe8e9f3,
				rounded: 16,
				stroke: { color: 0xcbcee0, width: 4 },
			},
			focused: {
				fill: 0xe1e3ee,
				rounded: 16,
				stroke: { color: 0xabafc6, width: 4 },
			},
			disabled: { fill: 0xdbdbdb, rounded: 16 },
		},
	});

	input.x = 300;
	input.y = 20;
	input.visible = false;
	input.zIndex = 10;
	input.placeholder = "Digite o valor";
	input.restrict = "0-9";
	input.disabled = true;
	app.stage.addChild(input);

	//ARRAY VALORES DA TABELA

	let value = 0;

	let faceSelect = null;

	input.on("keyup", (key) => {
		if (key == 13) {
			// checa se a tecla pressionada é enter
			// object.selected == 'true'
			// SALVA VALORES DE INPUT
			value = input.text;
			input.text = "";

			faceSelect.text.text = value;
			if (value == pachymeter.getValue()) {
				faceSelect.text.style.fill = 0x00ff00;
			} else {
				faceSelect.text.style.fill = 0xff0000;
			}
		}
	});

	const boardBackground = new PIXI.Graphics();
	boardBackground.beginFill(0x000000);
	boardBackground.drawRect(0, 0, 800, 600);
	boardBackground.endFill();
	boardBackground.alpha = 0.9;
	boardBackground.zIndex = 13;
	boardBackground.visible = false;
	app.stage.addChild(boardBackground);

	//CRIANDO TEXTO
	const textStyleTable = new PIXI.TextStyle({
		fontFamily: "Tahoma",
		fontSize: 20,
		fill: 0xffffff,
		align: "left",
	});
	const textOptions = {
		style: {
			fontFamily: "Tahoma",
			fontSize: 20,
			fill: 0xffffff,
			align: "left"
		}
	}

	// TEXTO 01
	const A1 = new ConfigureText(app, "", {...textOptions, x:195, y: 150});
	object1_2dMetalUpperView.text = A1;
	A1.zIndex = 17;
	A1.visible = false;

	// TEXTO 02
	const A2 = new ConfigureText(app, "", {...textOptions, x:300, y: 150});
	object1_2dMetalSideView.text = A2;
	A2.zIndex = 17;
	A2.visible = false;

	// TEXTO 03
	const A3 = new ConfigureText(app, "", {...textOptions, x:195, y: 220});
	object2_2dMetalUpperView.text = A3;
	A3.zIndex = 17;
	A3.visible = false;

	// TEXTO 04
	const A4 = new ConfigureText(app, "", {...textOptions, x:300, y: 220});
	object2_2dMetalSideView.text = A4;
	A4.zIndex = 17;
	A4.visible = false;

	// TEXTO 05
	const A5 = new ConfigureText(app, "", {...textOptions, x:195, y: 305});
	object3_2dMetalUpperView.text = A5;
	A5.zIndex = 17;
	A5.visible = false;

	// TEXTO 06
	const A6 = new ConfigureText(app, "", {...textOptions, x:300, y: 305});
	object3_2dMetalSideView.text = A6;
	A6.zIndex = 17;
	A6.visible = false;

	// TEXTO 07
	const A7 = new ConfigureText(app, "", {...textOptions, x:195, y: 375});
	object4_2dMetalUpperView.text = A7;
	A7.zIndex = 17;
	A7.visible = false;

	// TEXTO 08
	const A8 = new ConfigureText(app, "", {...textOptions, x:300, y: 375});
	object4_2dMetalSideView.text = A8;
	A8.zIndex = 17;
	A8.visible = false;

	// botão para retornar o valor do paquímetro
	const returnValuesButton = PIXI.Sprite.from(
		resources.returnValuesButton.texture
	);
	configureObject(
		app,
		returnValuesButton,
		100,
		40,
		buttonsX,
		buttonsY * 4,
		true,
		true
	);

	returnValuesButton.on("pointerdown", () => {
		input.disabled = true;
		const results = gsap.timeline();
		results.set(
			[
				resultsTable,
				closeButton,
				A1,
				A2,
				A3,
				A4,
				A5,
				A6,
				A7,
				A8,
				boardBackground,
			],
			{
				pixi: {
					visible: true,
				},
			}
		);
		results.set(
			[
				enablePachymeterUseButton,
				disablePachymeterUseButton,
				rotatePachymeterButton,
				returnValuesButton,
			],
			{ interactive: false }
		);
		arrayObjects3d.forEach((object) => {
			if (object.selected) {
				results.set([object, object.sideView, object.upperView], {
					interactive: false,
				});
			}
		});
	});
	buttonsContainer.addChild(returnValuesButton);

	closeButton.on("pointerdown", () => {
		input.disabled = false;
		const remove = gsap.timeline();
		remove.set(
			[
				resultsTable,
				closeButton,
				A1,
				A2,
				A3,
				A4,
				A5,
				A6,
				A7,
				A8,
				boardBackground,
			],
			{
				pixi: {
					visible: false,
				},
			}
		);
		remove.set(
			[
				enablePachymeterUseButton,
				disablePachymeterUseButton,
				rotatePachymeterButton,
				returnValuesButton,
			],
			{ interactive: true }
		);
		arrayObjects3d.forEach((object) => {
			if (object.selected) {
				remove.set([object, object.sideView, object.upperView], {
					interactive: true,
				});
			}
		});
	});

	//BOTAO DE RESET, RESTAURA TODOS OBJETOS PARA SUAS POSICOES INICIAIS
	back.on("pointerdown", () => {
		const move = gsap.timeline();
		move.add(showObjects(arrayObjects3d));
		move.to([buttonsContainer, back, input], { visible: false });
		move.to(pachymeter, {
			pixi: { x: pachymeter.initialX, y: pachymeter.initialY },
		});
	});

	return allObjects;
};

module.exports = {
	options,
	createObjects,
};

},{"./functions":2,"./texts":5}],4:[function(require,module,exports){
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

    app.stage.sortableChildren = true
}

module.exports = setup;
},{}],5:[function(require,module,exports){
module.exports={
    "footer" : {
        "credits": "\n\nIury Sousa, Jailson Junior, Maurício Alves, Emerson José, Thiago Nascimento, Angélica Martiniano, Ana Carolina, Heloisa Pimentel, Adilson Da Silva\n\nCopyright ©\n\nDesenvolvido pelo Laboratório de Inovações acadêmicas - Grupo Ser Educacional. Todos os direitos reservados."
    }
}
},{}]},{},[1]);
