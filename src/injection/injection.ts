import browser from "webextension-polyfill";
import {FactorChangeMessage, PopupMessage, SmartSoundMessage} from "../interfaces/messaging";
import {factor_key, smart_sound_is_on_key} from "../interfaces/keys";
import SmartSoundWorker from "./smartSoundWorker";
import PlaybackController from "./playbackController";

let smartSoundWorker = new SmartSoundWorker();
let factor = 1.0;
let storage_request_is_done = false;

// Onload
window.addEventListener("load", function () {
    console.log("onload");
    let playbackController = new PlaybackController(
        document.querySelectorAll("video")[0]
    );
    smartSoundWorker.changeVideoSource(playbackController);

    browser.runtime.onMessage.addListener(message => {
        message = PopupMessage.fromJSON(message);
        if (!storage_request_is_done) return;

        if (message instanceof FactorChangeMessage) {

        } else if (message instanceof SmartSoundMessage) {
            if(message.newIsOnVal) smartSoundWorker.startWorker();
            else smartSoundWorker.stopWorker();
        }
    });

    browser.storage.local.get([factor_key, smart_sound_is_on_key]).then(value => {
        storage_request_is_done = true;
        if (value.hasOwnProperty(factor_key)) {
            factor = value[factor_key];

        }
        if (value.hasOwnProperty(smart_sound_is_on_key)) {
            if(value[smart_sound_is_on_key])
                smartSoundWorker.startWorker();
        }
    });
});