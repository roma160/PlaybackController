<script lang="ts">
    import { Button, Icon } from "svelte-materialify/src";
    export let path;
    let klass;
    export { klass as class };
</script>

<Button on:click class="custom-fab {klass}" fab size="x-small" text ripple={{
    spreadingDuration: '.2s'
}}>
    <Icon path={path}/>
</Button>

<style lang="scss">
    @use "src/theme/variables" as variables;

    /* Workaround to prevent svelte from removing this class */
    :global.custom-fab{
        margin: variables.$elements_spacing;
    }
</style>