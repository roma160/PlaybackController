<script lang="ts">
    import IconButton from "@smui/icon-button"
    import { Icon } from "@smui/fab/dist";
    import browser, {tabs} from "webextension-polyfill"
    import { slide } from 'svelte/transition'
    import { factor_key, smart_sound_is_on_key } from "../interfaces/keys";
    import { FactorChangeMessage, SmartSoundMessage, PopupMessage } from "../interfaces/messaging";

    let factor = 1.0;
    const factor_delta = 0.1;

    let settings_opened = false, smart_sound_is_on = false;

    // Onload
    let storage_request_is_done = false;
    browser.storage.local.get([factor_key, smart_sound_is_on_key]).then(value => {
        storage_request_is_done = true;
        if(value.hasOwnProperty(factor_key))
            factor = value[factor_key];
        if(value.hasOwnProperty(smart_sound_is_on_key))
            smart_sound_is_on = value[smart_sound_is_on_key];
    });

    function sendMessageToActiveTab(message: PopupMessage){
        browser.tabs.query({active: true, currentWindow: true}).then(tabs =>
            browser.tabs.sendMessage(tabs[0].id, message.getJSON()));
    }

    function changeFactor(delta: number): void{
        if(!storage_request_is_done) return;
        factor += delta;
        sendMessageToActiveTab(new FactorChangeMessage(factor));
        browser.storage.local.set({[factor_key]: factor});
    }

    function flipSmartSound(): void{
        if(!storage_request_is_done) return;
        smart_sound_is_on = !smart_sound_is_on;
        sendMessageToActiveTab(new SmartSoundMessage(smart_sound_is_on));
        browser.storage.local.set({[smart_sound_is_on_key]: smart_sound_is_on});
    }
</script>

<div class="popup">
    <div class="buttons_row">
        <IconButton class="material-icons button" size="button"
                    on:click={() => settings_opened = !settings_opened}>
            expand_more
        </IconButton>
        <IconButton class="material-icons button" size="button"
                    on:click={() => changeFactor(-factor_delta)}>
            history_toggle_off
        </IconButton>
        <p class="text">{factor.toFixed(1)}x</p>
        <IconButton class="material-icons button" size="button"
                    on:click={() => changeFactor(factor_delta)}>
            speed
        </IconButton>
    </div>
    {#if settings_opened}
        <div class="settings" transition:slide="{{duration: 200}}">
            <IconButton class="button" size="button" pressed={smart_sound_is_on}
                        on:click={flipSmartSound}>
                <Icon class="material-icons">motion_photos_off</Icon>
                <Icon class="material-icons" on>playlist_add_circle</Icon>
            </IconButton>
        </div>
    {/if}
</div>

<style>
    .buttons_row{
        display: flex;
        flex-direction: row;
        align-items: center;
        padding-bottom: 6px;
        padding-left: 8px;
        padding-right: 8px;
    }

    .text{
        margin: 0 10px 4px;
        font-family: "Roboto Medium",sans-serif;
        font-size: 11pt;
    }
</style>