/**
 * @vitest-enviroment
 */

import { describe, it, expect, vi } from 'vitest'
import { flushPromises, mount } from '@vue/test-utils'
import router from './utils/router/router.js'
import store from '../src/store/index.js'
import Home from '../src/views/Home.vue'
import Lobbies from '../src/views/Lobbies.vue'
import AudioPlayer from './utils/AudioPlayer'
import SocketIO from "socket.io-client"

const mockAudio = new AudioPlayer('ciao.mp3')
const home = mount(Home, {
    global: {
        plugins: [router, store]
    },
    attachTo: document.body,
    data() {
        return {
            buttonSound: mockAudio,
            socket: SocketIO("http://localhost:3030")
        }
    },
})

const lobbies = mount(Lobbies, {
    attachTo: document.body,
    data() {
        return {
            buttonSound: mockAudio,
            socket: SocketIO("http://localhost:3030"),
        }
    },
})

describe('Home mount test', ()=> {
    it('should mount', () => {
        expect(home.exists()).toBeTruthy()
    })
})

describe('Home Contain Test', ()=> {
    it('should contain', ()=> {

        expect(home.find('.main-logo').exists()).toBeTruthy()

        expect(home.find('#create-lobby-modal').exists()).toBeTruthy()

        expect(home.find('#friends-modal').exists()).toBeTruthy()

        expect(home.find('.dropdown').exists()).toBeTruthy()
    })
})

describe('Home Click Test', ()=> {
    it('should trigger events', async ()=> {
        await home.vm.lobbyOpened(router)
        await router.isReady()
        expect(lobbies.exists()).toBeTruthy()
        
        await home.vm.buttonClick(mockAudio)

        const spy = vi.spyOn(home.vm, 'buttonClick').mockImplementation(() => {})
        const spyLobbies = vi.spyOn(home.vm, 'lobbyOpened').mockImplementation(() => {})

        await home.find('label.create-lobby').trigger('click')
        expect(spy).toHaveBeenCalled()
        spy.mockClear()

        await home.find('label.cancel-create').trigger('click')
        expect(spy).toHaveBeenCalled()
        spy.mockClear()

        await home.find('label.invite-player').trigger('click')
        expect(spy).toHaveBeenCalled()
        spy.mockClear()

        await home.find('label.cancel-invite').trigger('click')
        expect(spy).toHaveBeenCalled()
        spy.mockClear()

        await home.find('label.drop-create-lobby').trigger('click')
        expect(spy).toHaveBeenCalled()
        spy.mockClear()

        await home.find('div.drop-div').trigger('click')
        expect(spy).toHaveBeenCalled()
        spy.mockClear()

        await home.find('label.drop-cancel-create').trigger('click')
        expect(spy).toHaveBeenCalled()
        spy.mockClear()

        await home.find('label.drop-invite-player').trigger('click')
        expect(spy).toHaveBeenCalled()
        spy.mockClear()

        await home.find('label.drop-cancel-invite').trigger('click')
        expect(spy).toHaveBeenCalled()
        spy.mockClear()

        await home.find('label.check-lobbies').trigger('click')
        expect(spyLobbies).toHaveBeenCalled()
        spyLobbies.mockClear()

        await home.find('label.drop-check-lobbies').trigger('click')
        expect(spyLobbies).toHaveBeenCalled()
        spyLobbies.mockClear()

        await home.vm.invitePlayer()
        router.push("/")
        await router.isReady()
        await home.vm.lobbyOpened()
        router.push("/")
        await router.isReady()
        await home.vm.startingMatch()
        router.push("/")
        await router.isReady()

        store.commit("setToken", "token");
        await home.vm.invitePlayer()
        await flushPromises()
        await home.vm.lobbyOpened()
        await flushPromises()
        router.push("/")
        await router.isReady()
        await home.vm.startingMatch()
    })
})

describe('Lobbies Trigger Test', () => {
    it('should work', async () => {
        await lobbies.vm.joinLobby(1)

        await lobbies.setData({ lobbies: ["Mario"] })

        await lobbies.vm.joinLobby(1)
    })
})
