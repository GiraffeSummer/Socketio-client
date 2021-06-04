<script>
    import { JSONEditor } from "svelte-jsoneditor";
    const mainMenuBar = false;
    export let json;
</script>

<JSONEditor bind:json {mainMenuBar} />
