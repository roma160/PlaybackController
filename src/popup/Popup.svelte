<script lang="ts">
    import { MaterialApp, Slider } from "svelte-materialify/src";
    import Fab from "./Fab.svelte";
    import {
        mdiChevronDown, mdiChevronDoubleLeft, mdiChevronDoubleRight,
        mdiMinus, mdiCarSpeedLimiter
    } from "@mdi/js";
    import { slide } from 'svelte/transition'

    import {
        factor_key, smart_sound_is_on_key,
        smart_sound_gap_coefficient_key, smart_sound_multiplier_key
    } from "../interfaces/keys";
    import {
        PopupMessage, FactorChangeMessage, SmartSoundMessage,
        SmartSoundGap, SmartSoundMultiplier
    } from "../interfaces/messaging";
    import browser from "webextension-polyfill"
    import SmartSoundWorker from "../injection/smartSoundWorker";

    let factor = 1.0;
    const factor_delta = 0.1;

    let settings_opened = false, smart_sound_is_on = false;

    const sliderSubdivisions = 1000;
    let smartSoundGap, smartSoundMultiplier;

    // Onload
    let storage_request_is_done = false;
    browser.storage.local.get([
        factor_key, smart_sound_is_on_key,
        smart_sound_gap_coefficient_key, smart_sound_multiplier_key
    ]).then(value => {
        storage_request_is_done = true;
        if(value.hasOwnProperty(factor_key))
            factor = value[factor_key];
        if(value.hasOwnProperty(smart_sound_is_on_key))
            smart_sound_is_on = value[smart_sound_is_on_key];
        if(value.hasOwnProperty(smart_sound_gap_coefficient_key))
            smartSoundGap = value[smart_sound_gap_coefficient_key];
        if(value.hasOwnProperty(smart_sound_multiplier_key))
            smartSoundMultiplier = value[smart_sound_multiplier_key]
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
        sendMessageToActiveTab(new SmartSoundMessage(smart_sound_is_on));
        browser.storage.local.set({[smart_sound_is_on_key]: smart_sound_is_on});
    }
</script>

<MaterialApp theme="dark">
    <div class="root">
        <div class="controls-row">
            <Fab class="smart-sound-button" path={smart_sound_is_on ? mdiCarSpeedLimiter : mdiMinus} on:click={onSmartSoundFlip}/>
            <Fab path={mdiChevronDoubleLeft} on:click={() => onFactorChange(-factor_delta)}/>
            <p class="speed_text">{factor.toFixed(1)}x</p>
            <Fab path={mdiChevronDoubleRight} on:click={() => onFactorChange(factor_delta)}/>
            <Fab path={mdiChevronDown} on:click={() => settings_opened = !settings_opened}/>
        </div>

        {#if settings_opened}
            <div class="settings-row" transition:slide="{{duration: 200}}">
                <Slider min={0} max={sliderSubdivisions} bind:value={smartSoundGap}
                        on:update={() => sendMessageToActiveTab(new SmartSoundGap(smartSoundGap))}
                        on:change={() => {
                            sendMessageToActiveTab(new SmartSoundGap(smartSoundGap));
                            browser.storage.local.set({[smart_sound_gap_coefficient_key]: smartSoundGap});
                        }}
                >
                    {Math.round(SmartSoundWorker.getGapValue(smartSoundGap/sliderSubdivisions))}
                </Slider>
                <Slider min={0} max={sliderSubdivisions} bind:value={smartSoundMultiplier}>
                    {SmartSoundWorker.getMultiplierValue(smartSoundMultiplier/sliderSubdivisions).toFixed(2)}
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
    :global.smart-sound-button{
        margin-right: 30px !important;
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