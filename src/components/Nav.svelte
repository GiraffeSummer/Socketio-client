<script>
    import { createEventDispatcher } from "svelte";
    import {
        connected,
        connecting,
        changeConnected,
        history,
        isVolatile,
        data,
    } from "../store.js";
    const dispatch = createEventDispatcher();

    let connUri = $data.currentConnection || "http://localhost:3000";
    let eventValue = $data.selectedEvent || "message";

    const connect = () => {
        dispatch("connect", { uri: connUri });
    };
    const disconnect = () => {
        dispatch("disconnect", { uri: connUri });
    };
    const send = () => {
        addHistory();
        dispatch("send", { event: eventValue });
    };
    const addHistory = () => {
        history.update((items) => {
            if (!items.includes(eventValue)) {
                return [eventValue, ...items];
            } else return [...items];
        });
    };
    const toggleVolatile = () => {
        $isVolatile = !$isVolatile;
    };

    addHistory();
</script>

<div class="topMenu">
    <div class="columns">
        <div class="column">
            <label for="connect_URI">Connect URI</label>
            <input
                disabled={$connected || $connecting}
                id="connect_URI"
                type="text"
                class="input {$connected === true ? 'is-success' : 'is-link'}"
                placeholder="url"
                bind:value={connUri}
            />
        </div>
        <div class="column">
            <label for="eventName">Event</label>
            <input
                id="eventName"
                class="input is-info"
                bind:value={eventValue}
                list="events"
            />
            <datalist id="events" on:blur={addHistory}>
                {#each $history as item}
                    <option value={item} />
                {/each}
            </datalist>
        </div>

        <div class="column">
            {#if $connected}
                <button
                    class="button is-danger"
                    on:click={disconnect}
                    title="disconnect"
                    ><img
                        src="icons/unlink.png"
                        alt="disconnect"
                    />Disconnect</button
                >
            {:else}
                <button
                    class="button {$connecting ? 'is-warning' : 'is-primary'}"
                    on:click={connect}
                    title="connect"
                    ><img
                        src={$connecting
                            ? "icons/unlink.png"
                            : "icons/link.png"}
                        alt="connect"
                    />{$connecting ? "Cancel" : "Connect"}
                    <div class="ring {$connecting ? 'loading-ring' : ''}" />
                </button>
            {/if}
        </div>
        <div class="column">
            {#if $connected}
                <button
                    class="button is-primary"
                    id="SendBtn"
                    on:click={send}
                    title="send"
                    ><img src="icons/Save32.png" alt="send" />Send</button
                ><br />
                <label for="volatileCheck">Volatile</label>
                <input
                    id="volatileCheck"
                    type="checkbox"
                    on:click={toggleVolatile}
                />
            {/if}
        </div>
    </div>
</div>
