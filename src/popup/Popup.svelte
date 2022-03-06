<script lang="ts">
    import IconButton from "@smui/icon-button"
    import { Icon } from "@smui/fab/dist";
    import browser from "webextension-polyfill"

    let factor = 1.0, factor_obtained = false;
    const factor_delta = 0.1;

    function onFactorChange(){
        browser.storage.local.set({
            [key]: factor
        });
    }

    const key = "factor";
    browser.storage.local.get(key).then(value => {
        factor_obtained = true;
        if(!value.hasOwnProperty(key)) return;
        factor = value[key];
    });

    $: if (factor && factor_obtained) onFactorChange();
</script>

<div class="popup">
    <IconButton class="material-icons button" size="button"
                on:click={() => factor -= factor_delta}>
        history_toggle_off
    </IconButton>
    <p class="text">{factor.toFixed(1)}x</p>
    <IconButton class="material-icons button" size="button"
                on:click={() => factor += factor_delta}>
        speed
    </IconButton>
</div>

<style>
    .popup{
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