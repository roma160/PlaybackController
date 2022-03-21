<script lang="ts">
    import { MaterialApp, Slider } from "svelte-materialify/src";
    import Fab from "./Fab.svelte";
    import {
        mdiChevronDown, mdiChevronDoubleLeft, mdiChevronDoubleRight,
        mdiMinus, mdiCarSpeedLimiter
    } from "@mdi/js";
    import { slide } from 'svelte/transition'
    import { factor_key, smart_sound_is_on_key } from "../interfaces/keys";
    import { FactorChangeMessage, SmartSoundMessage, PopupMessage } from "../interfaces/messaging";
    import browser from "webextension-polyfill"

    let factor = 1.0;
    const factor_delta = 0.1;

    let settings_opened = false, smart_sound_is_on = false;

    let smartSoundButtonPath = mdiMinus;

    const sliderSubdivisions = 1000;
    let smartSoundGap, smartSoundMultiplier;

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


    // Events :
    function onFactorChange(factorDelta: number): void{
        if(!storage_request_is_done) return;
        factor += factorDelta;
        sendMessageToActiveTab(new FactorChangeMessage(factor));
        browser.storage.local.set({[factor_key]: factor});
    }

    function onSmartSoundFlip(): void{
        if(!storage_request_is_done) return;
        smart_sound_is_on = !smart_sound_is_on;
        smartSoundButtonPath = smart_sound_is_on ? mdiCarSpeedLimiter : mdiMinus;
        sendMessageToActiveTab(new SmartSoundMessage(smart_sound_is_on));
        browser.storage.local.set({[smart_sound_is_on_key]: smart_sound_is_on});
    }
</script>

<MaterialApp theme="dark">
    <div class="root">
        <div class="controls-row">
            <Fab path={smartSoundButtonPath} on:click={onSmartSoundFlip}/>
            <Fab path={mdiChevronDoubleLeft} on:click={() => onFactorChange(-factor_delta)}/>
            <p class="speed_text">{factor.toFixed(1)}x</p>
            <Fab path={mdiChevronDoubleRight} on:click={() => onFactorChange(factor_delta)}/>
            <Fab path={mdiChevronDown} on:click={() => settings_opened = !settings_opened}/>
        </div>

        {#if settings_opened}
            <div class="settings-row" transition:slide="{{duration: 200}}">
                <Slider bind:value={smartSoundGap}/>
                <Slider min={0} max={sliderSubdivisions} bind:value={smartSoundMultiplier}>
                    {(smartSoundMultiplier/sliderSubdivisions).toFixed(2)}
                </Slider>
            </div>
        {/if}
    </div>
</MaterialApp>

<style lang="scss">
    @use "src/theme/variables" as variables;

    .root{
        display: flex;
        background-color: #383838;
        width: 300px;
        justify-content: center;
        flex-direction: column;
    }

    .controls-row{
        display: flex;
        flex-direction: row;
        align-items: center;
        padding-bottom: 6px;
        padding-left: 8px;
        padding-right: 8px;
        margin: 0 -(variables.$elements_spacing);
        width: min-content;
        align-self: center;
    }

    .settings-row{
      margin: 0 10px;
    }

    .speed_text{
        margin: 0 2*(variables.$elements_spacing);
        font-family: "Roboto Medium", sans-serif;
        font-size: 11pt;
        align-self: center;
    }
</style>