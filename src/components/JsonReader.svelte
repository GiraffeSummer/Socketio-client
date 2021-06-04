<script>
    import { JSONEditor } from "svelte-jsoneditor";
    export let message;
    export let mainMenuBar = false;
    let json = message.data;
</script>

<div>#{message.number} - {message.event}</div>
<JSONEditor bind:json {mainMenuBar} />
