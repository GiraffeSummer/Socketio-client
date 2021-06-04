<script>
	import { io } from "socket.io-client";
	import { createEventDispatcher } from "svelte";
	import { NeuDB } from "./NeuDB.js";
	const db = new NeuDB({
		selectedEvent: "message",
		singleBox: true,
		eventHistory: [],
		connectionHistory: [],
		currentConnection: "",
		isVolatile: false,
		messageObject: { test: { value: "test" } },
	});

	const dispatch = createEventDispatcher();
	const mainMenuBar = false;
	import {
		messages,
		connected,
		changeConnected,
		ChangeCounter,
		setSocket,
		receivedCounter,
		history,
		SocketErrors,
		socket,
		isVolatile,
		connecting,
		data,
	} from "./store.js";

	$data = db.get();
	$isVolatile = db.get("isVolatile");
	$history = db.get("eventHistory");

	let SingleBox = $data.singleBox;

	import Nav from "./components/Nav.svelte";
	import { JSONEditor } from "svelte-jsoneditor";
	import JsonReader from "./components/JsonReader.svelte";
	import SingleReader from "./components/SingleReader.svelte";

	let jsonEditorValue = db.get("messageObject") || {
		test: {
			value1: 1,
			values: "test",
		},
	};
	let eventFilter = "";

	const onConnect = (evt) => {
		if ($connecting) {
			onDisconnect(evt);
			$connecting = false;
			$connected = false;
		} else {
			$connecting = true;
			const { uri } = evt.detail;
			console.log("Connect", uri);
			setSocket(io(uri));

			SocketErrors((evt) => {
				console.log(evt);
				if ($connecting) {
					alert("Disconnected");
				}
				socket.disconnect();
				$connecting = false;
				$connected = false;
				setSocket(undefined);
			});

			socket.on("connect", () => {
				$connecting = false;
				socket.onAny((event, data) => {
					ChangeCounter(1);
					messages.update((old) => {
						return [
							{ number: $receivedCounter, event, data },
							...old,
						];
					});
				});

				db.push("connectionHistory", uri);
				db.set("currentConnection", uri);
				$connected = true;
			});
			socket.on("disconnect", () => {
				$connected = false;
			});
		}
	};
	const onDisconnect = (evt) => {
		const { uri } = evt.detail;
		console.log("Disconnect", uri);
		socket.disconnect();
		$connected = false;
		setSocket(undefined);
	};
	const sendMsg = (evt) => {
		const { event } = evt.detail;
		db.set("messageObject", jsonEditorValue);
		console.log(db.get());
		console.log("Send: ", event, $isVolatile);
		if ($isVolatile) {
			socket.volatile.emit(event, jsonEditorValue);
		} else {
			socket.emit(event, jsonEditorValue);
		}
		db.push("eventHistory", event);
	};
	$: filteredMessages =
		$messages.filter((m) => {
			if (eventFilter != "") {
				return m.event === eventFilter.trim();
			} else return true;
		}) || []; //make sure it's an array

	isVolatile.subscribe((v) => {
		db.set("isVolatile", v);
	});
	const jsonSave = () => {
		db.set("messageObject", jsonEditorValue);
	};
	const saveSingleBox = () => {
		db.set("singleBox", !SingleBox);
	};
</script>

<main>
	<Nav
		on:connect={onConnect}
		on:disconnect={onDisconnect}
		on:send={sendMsg}
	/>
	{#if $connected}
		<JSONEditor bind:json={jsonEditorValue} onChange={jsonSave} />
		<div id="receivedData">
			<h3 class="subtitle is-3">Received</h3>
			<div name="receivedControls" class="columns">
				<div class="column">
					<label>
						<input
							type="checkbox"
							bind:checked={SingleBox}
							on:click={saveSingleBox}
						/> Single box
					</label>
				</div>
				<div class="column">
					<button
						class="is-info"
						on:click={() => {
							$messages = [];
							$receivedCounter = 0;
						}}>delete</button
					>
				</div>
				<div class="column">
					<label for="eventName">filter event:</label>
					<!-- svelte-ignore a11y-no-onchange -->
					<select id="events" bind:value={eventFilter}>
						<option value="">NONE</option>
						{#each $history as item}
							<option value={item}>{item}</option>
						{/each}
					</select>
				</div>
				<div class="column" />
				<div class="column" />
			</div>
			{#if SingleBox}
				<SingleReader bind:json={filteredMessages} />
			{:else}
				{#each filteredMessages as message}
					<JsonReader {message} {mainMenuBar} />
				{:else}
					<p>Nothing received yet</p>
				{/each}
			{/if}
		</div>
	{:else}
		<div class="tile">
			<h2>You are not connected to anything yet.</h2>
		</div>
	{/if}
</main>

<style>
</style>
