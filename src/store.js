import { writable } from 'svelte/store';
import { io } from "socket.io-client";


export const messages = writable([]);
export const history = writable([]);
export const connected = writable(false)
export const receivedCounter = writable(0)
export let isVolatile = writable(false);

export let connecting = writable(false);
export let socket;

export let data = writable({});


export function changeConnected(val = false) {
    connected.update(o => {
        return val;
    })
}

export function SocketErrors(cb) {
    const errorFunction = (evt) => {
        if (typeof cb === 'function')
            cb(evt);
    }

    //socket.on("error", errorFunction);
    socket.on("connect_failed", errorFunction);
    socket.on("connect_error", errorFunction);
}

export function ChangeCounter(mod) {
    receivedCounter.update(o => {
        return o + mod;
    })
}
export const setSocket = (soc) => { socket = soc; }