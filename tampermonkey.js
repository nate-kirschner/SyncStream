// ==UserScript==
// @name         Nate and Anna Watch TV!
// @namespace    http://tampermonkey.net/
// @version      2025-08-22
// @description  Sync HBO Max between parties
// @author       Nate Kirschner
// @match        https://play.hbomax.com/video/watch/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=tampermonkey.net
// @grant        GM_log
// ==/UserScript==

(function () {
  "use strict";

  const WEB_SOCKET_URL = "ws://localhost:8080";
  const PLAY_BUTTON_QUERY = '[aria-label="Play"]';
  const PAUSE_BUTTON_QUERY = '[aria-label="Pause"]';
  const PLAY_MSG = "play";
  const PAUSE_MSG = "pause";

  let ws = new WebSocket(WEB_SOCKET_URL);

  ws.onopen = () => {
    console.log("ws open");
  };

  ws.onmessage = (msg) => {
    const { playButton, pauseButton } = getControlButtons();

    if (msg.data === PLAY_MSG && playButton !== null) {
      playButton.click();
    } else if (msg.data === PAUSE_MSG && pauseButton !== null) {
      pauseButton.click();
    }
  };

  addEventListener("keyup", (e) => {
    if (e?.keyCode === 32 || e.key === " " || e.key === "Spacebar") {
      e.preventDefault();

      const { playButton, pauseButton } = getControlButtons();

      if (pauseButton === null) {
        ws.send(PAUSE_MSG);
      } else {
        ws.send(PLAY_MSG);
      }
    }
  });

  function getControlButtons() {
    return {
      playButton: document.querySelector(PLAY_BUTTON_QUERY),
      pauseButton: document.querySelector(PAUSE_BUTTON_QUERY),
    };
  }
})();
