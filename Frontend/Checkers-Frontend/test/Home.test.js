/**
 * @vitest-enviroment
 */

import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import router from './utils/router/router.js'
import App from '../src/App.vue'
import Home from '../src/views/Home.vue'
import Lobbies from '../src/views/Lobbies.vue'

const wrapper = mount(App, {
    global: {
        plugins: [router]
    }
})
const home = mount(Home, {
    global: {
        plugins: [router]
    }
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
        console.log(router)
        //expect(wrapper.findComponent(Lobbies).exists()).toBeTruthy()
    })
})
