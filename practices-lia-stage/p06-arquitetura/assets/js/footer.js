const footerOptions = {
  resources: {
    infoButton:
      "https://lia-labv.s3.sa-east-1.amazonaws.com/praticas/_general/infoWhite.png",
    footerButton:
      "https://lia-labv.s3.sa-east-1.amazonaws.com/praticas/p04-dimensao-tijolo/INFO.png",
    creditBox:
      "https://lia-labv.s3.sa-east-1.amazonaws.com/praticas/_general/op%C3%A7%C3%A3o+de+caixa+de+texto.png",
    logo: "https://lia-labv.s3.sa-east-1.amazonaws.com/praticas/_general/logoLia.png",
    esctButton:
      "https://lia-labv.s3.sa-east-1.amazonaws.com/praticas/_general/bot%C3%A3o+vermelho+fechar.png",
    dialogBox:
      "https://lia-labv.s3.sa-east-1.amazonaws.com/praticas/_general/caixa+de+texto.png",
    maoClique:
      "https://lia-labv.s3.sa-east-1.amazonaws.com/praticas/_general/footer+icons/mao+de+clique.png",
    menu: "https://lia-labv.s3.sa-east-1.amazonaws.com/praticas/_general/footer+icons/menu+hamburguer.png",
    ocultar:
      "https://lia-labv.s3.sa-east-1.amazonaws.com/praticas/_general/footer+icons/ocultar.png",
    proximo:
      "https://lia-labv.s3.sa-east-1.amazonaws.com/praticas/_general/footer+icons/proximo.png",
    voltar:
      "https://lia-labv.s3.sa-east-1.amazonaws.com/praticas/_general/footer+icons/voltar.png",
    telaCheia:
      "https://lia-labv.s3.sa-east-1.amazonaws.com/praticas/_general/footer+icons/tela+cheia.png",
  },
};

const verifyJson = (footerTexts) => {
  if (typeof footerTexts.title == "undefined") return true;
  else if (typeof footerTexts.version == "undefined") return true;
  else if (typeof footerTexts.year == "undefined") return true;
  else if (typeof footerTexts.collaborators == "undefined") return true;
};

const configureCredits = (app, texts) => {
  const creditTitle = new ConfigureText(app, texts.footer.title, {
    x: 213,
    y: 130,
    visible: false,
    style: {
      fontFamily: "calibri",
      fontSize: 19,
      fontStyle: "bolder",
      fill: "0x000000",
      wordWrap: true,
    },
  });
  creditTitle.anchor.set(0, 0);
  creditTitle.zIndex = 999999;

  const creditVersion = new ConfigureText(
    app,
    "Versão " + texts.footer.version,
    {
      x: 245,
      y: 165,
      visible: false,
      style: {
        fontFamily: "Calibri",
        fontSize: 14,
        fill: "0x000000",
      },
    }
  );
  creditVersion.zIndex = 999999;

  const creditCompany = new ConfigureText(
    app,
    "Laboratório de Inovação Acadêmica(LIA)",
    {
      x: 343,
      y: 200,
      visible: false,
      style: {
        fontFamily: "Calibri",
        fontSize: 16,
        fill: "0x000000",
      },
    }
  );
  creditCompany.zIndex = 999999;

  const creditYear = new ConfigureText(
    app,
    "Copyright - Todos os direitos reservados\n" +
      texts.footer.year +
      "– Grupo Ser Educacional",
    {
      x: 310,
      y: 230,
      visible: false,
      style: {
        fontFamily: "Calibri",
        fontSize: 12,
        fill: "0x000000",
      },
    }
  );
  creditYear.zIndex = 999999;

  const creditCredits = new ConfigureText(app, "Créditos", {
    x: 244,
    y: 280,
    visible: false,
    style: {
      fontFamily: "Calibri",
      fontSize: 17,
      fill: "000000",
      fontStyle: "bolder",
    },
  });
  creditCredits.zIndex = 999999;

  let creditCollaborators = {};
  Object.keys(texts.footer.collaborators).forEach((key, index) => {
    const creditCollaboratorLeft = new ConfigureText(app, key + ":", {
      x: 215,
      y: 300 + 40 * index,
      visible: false,
      style: {
        fontFamily: "Calibri",
        fontStyle: "bolder",
        fontSize: 13,
        fill: "0x000000",
        wordWrap: true,
        wordWrapWidth: 140,
        lineHeight: 14,
      },
    });
    creditCollaboratorLeft.anchor.set(0, 0);
    creditCollaboratorLeft.zIndex = 999999;

    const creditCollaboratorsNames = new ConfigureText(
      app,
      texts.footer.collaborators[key],
      {
        x: 215 + (creditCollaboratorLeft.width + 5),
        y: 300 + 40 * index,
        visible: false,
        style: {
          fontFamily: "Calibri",
          fontSize: 13,
          fill: "0x000000",
          wordWrap: true,
          wordWrapWidth: 380 - creditCollaboratorLeft.width,
          lineHeight: 14,
        },
      }
    );
    creditCollaboratorsNames.anchor.set(0, 0);
    creditCollaboratorsNames.zIndex = 999999;

    creditCollaborators[key] = [
      creditCollaboratorLeft,
      creditCollaboratorsNames,
    ];
  });

  return {
    creditTitle: creditTitle,
    creditVersion: creditVersion,
    creditCompany: creditCompany,
    creditYear: creditYear,
    creditCredits: creditCredits,
    creditCollaborators: creditCollaborators,
  };
};

const footer = (app, resources, texts) => {
  if (verifyJson(texts.footer))
    return console.log("FOOTER: json footer missing something");

  //Função responsavel por mostar todos os elementos da pagina de credito
  function credit() {
    creditBox.visible = true;
    logoLia.visible = true;
    creditTitle.visible = true;
    creditVersion.visible = true;
    creditCompany.visible = true;
    creditYear.visible = true;
    creditCredits.visible = true;
    Object.keys(creditCollaborators).forEach((key) => {
      creditCollaborators[key][0].visible = true;
      creditCollaborators[key][1].visible = true;
    });
    escCredit.visible = true;
    footerBox.visible = false;
    footerButton.visible = false;
    creditBackground.visible = true;
  }
  // Faz com que a caixa de credito seja fechada
  function esc() {
    creditTitle.visible = false;
    creditBox.visible = false;
    logoLia.visible = false;
    escCredit.visible = false;
    creditBackground.visible = false;
    creditTitle.visible = false;
    creditVersion.visible = false;
    creditCompany.visible = false;
    creditYear.visible = false;
    Object.keys(creditCollaborators).forEach((key) => {
      creditCollaborators[key][0].visible = false;
      creditCollaborators[key][1].visible = false;
    });

    creditCredits.visible = false;
  }

  //cria um "footer" na parte inferior da animação
  const footerBackground = new PIXI.Graphics();
  footerBackground.beginFill(0x192c4c);
  footerBackground.lineStyle(5, 0x192c4c);
  footerBackground.drawRect(-4000, 570, 8000, 4000);
  app.stage.addChild(footerBackground);
  footerBackground.visible = false;

  //cria a sprite da caixa de credito
  const creditBackground = new PIXI.Graphics();
  creditBackground.beginFill(0x050a30);
  creditBackground.lineStyle(5, 0x000000);
  creditBackground.drawRect(-800, -600, 4000, 4000);
  app.stage.addChild(creditBackground);
  creditBackground.visible = false;

  const creditBox = new PIXI.Sprite(resources.creditBox.texture);
  configureObject(app, creditBox, 500, 500, 430, 300);
  creditBox.visible = false;

  const backButton = new PIXI.Sprite(resources.voltar.texture);
  configureObject(app, backButton, 28, 28, 50, 585, true, true);
  backButton.on("pointerdown", () => {
    window.history.back();
  });

  const nextButton = new PIXI.Sprite(resources.proximo.texture);
  configureObject(app, nextButton, 28, 28, 100, 585, true, true);
  nextButton.on("pointerdown", () => {
    window.history.next();
  });

  const fullScreen = new PIXI.Sprite(resources.telaCheia.texture);
  configureObject(app, fullScreen, 28, 28, 150, 585, true, true);
  fullScreen.on("pointerdown", toggleFullScreen);

  function toggleFullScreen() {
    if (
      !document.fullscreenElement && // alternative standard method
      !document.mozFullScreenElement &&
      !document.webkitFullscreenElement &&
      !document.msFullscreenElement
    ) {
      // current working methods
      if (document.documentElement.requestFullscreen) {
        document.documentElement.requestFullscreen();
      } else if (document.documentElement.msRequestFullscreen) {
        document.documentElement.msRequestFullscreen();
      } else if (document.documentElement.mozRequestFullScreen) {
        document.documentElement.mozRequestFullScreen();
      } else if (document.documentElement.webkitRequestFullscreen) {
        document.documentElement.webkitRequestFullscreen(
          Element.ALLOW_KEYBOARD_INPUT
        );
      }
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      } else if (document.msExitFullscreen) {
        document.msExitFullscreen();
      } else if (document.mozCancelFullScreen) {
        document.mozCancelFullScreen();
      } else if (document.webkitExitFullscreen) {
        document.webkitExitFullscreen();
      }
    }
  }

  const hide = new PIXI.Sprite(resources.ocultar.texture);
  configureObject(app, hide, 28, 28, 200, 585, true, true);
  hide.on("pointerdown", () => {});

  //cria o botão da logo do lia no footer
  const logoFooter = new PIXI.Sprite(resources.menu.texture);
  configureObject(app, logoFooter, 28, 28, 770, 585);
  logoFooter.interactive = true;
  logoFooter.buttonMode = true;
  logoFooter.on("pointerdown", credit);
  logoFooter.visible = false;

  //cria caixa onde vai ficar o botão informações
  const footerBox = new PIXI.Sprite(resources.dialogBox.texture);
  configureObject(app, footerBox, 130, 70, 700, 530);
  footerBox.visible = false;

  //cria o botão de informações
  const footerButton = new PIXI.Sprite(resources.footerButton.texture);
  configureObject(app, footerButton, 60, 30, 700, 525);
  footerButton.interactive = true;
  footerButton.buttonMode = true;
  footerButton.visible = false;
  footerButton.on("pointerdown", credit);

  //Cria o botão de esc que fica dentro do card de creditos
  const escCredit = new PIXI.Sprite(resources.esctButton.texture);
  configureObject(app, escCredit, 28, 28, 220, 100);
  escCredit.interactive = true;
  escCredit.buttonMode = true;
  escCredit.on("pointerdown", esc);
  escCredit.visible = false;

  const logoLia = new PIXI.Sprite(resources.logo.texture);
  configureObject(app, logoLia, 70, 70, 600, 490);
  logoLia.visible = false;

  const backgrounVoidLeft = new PIXI.Graphics();
  backgrounVoidLeft.beginFill(0x192c4c);
  backgrounVoidLeft.lineStyle(5, 0x192c4c);
  backgrounVoidLeft.drawRect(1100, -4000, 8000, 8000);
  app.stage.addChild(backgrounVoidLeft);

  const backgrounVoidRight = new PIXI.Graphics();
  backgrounVoidRight.beginFill(0x192c4c);
  backgrounVoidRight.lineStyle(5, 0x192c4c);
  backgrounVoidRight.drawRect(-8290, -4000, 8000, 8000);
  app.stage.addChild(backgrounVoidRight);

  const backgrounVoidTop = new PIXI.Graphics();
  backgrounVoidTop.beginFill(0x192c4c);
  backgrounVoidTop.lineStyle(5, 0x192c4c);
  backgrounVoidTop.drawRect(-8290, -8090, 16000, 8000);
  app.stage.addChild(backgrounVoidTop);

  // Container para aumentar o eixo z
  const footerComponetes = new PIXI.Container();
  configureObject(app, footerComponetes, 0, 0, 0, 0);
  footerComponetes.addChild(
    footerBackground,
    creditBackground,
    creditBox,
    backButton,
    nextButton,
    fullScreen,
    hide,
    logoFooter,
    footerBox,
    footerButton,
    escCredit,
    logoLia,
    backgrounVoidLeft,
    backgrounVoidRight,
    backgrounVoidTop
  );
  footerComponetes.zIndex = 99999;

  // Container para manipulação da barra funcional do footer
  const footerContext = new PIXI.Container();
  configureObject(app, footerContext, 0, 0, 0, 0);
  footerContext.addChild(
    footerBackground,
    backButton,
    nextButton,
    fullScreen,
    hide,
    logoFooter
  );

  // insere e configura cada elemento dos creditos
  const {
    creditTitle,
    creditVersion,
    creditCompany,
    creditYear,
    creditCollaborators,
    creditCredits,
  } = configureCredits(app, texts);

  function showFooter() {
    const showFooter = gsap.timeline();

    showFooter.to([footerBackground, logoFooter], {
      visible: true,
    });

    return showFooter;
  }

  return showFooter;
};
