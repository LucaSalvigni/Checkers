/**
 * @vitest-enviroment
 */

import { describe, it, expect, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import router from './utils/router/router.js'
import Home from '../src/views/Home.vue'
import Lobbies from '../src/views/Lobbies.vue'

const home = mount(Home, {
    global: {
        plugins: [router]
    }
})

const lobbies = mount(Lobbies)

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

        const spy = vi.spyOn(home.vm, 'buttonClick').mockImplementation(() => {})
        await home.find('label').trigger('click')
        expect(spy).toHaveBeenCalled()
    })
})
