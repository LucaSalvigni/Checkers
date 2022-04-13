/**
 * @vitest-enviroment
 */

import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import Home from '../src/views/Home.vue'

const wrapper = mount(Home)

describe('Home mount test', ()=> {
    it('should mount', () => {
        expect(wrapper.exists()).toBeTruthy()
    })
})

describe('Home Contain Test', ()=> {
    it('should contain', ()=> {

        expect(wrapper.find('.main-logo').exists()).toBeTruthy()

        expect(wrapper.find('#create-lobby-modal').exists()).toBeTruthy()

        expect(wrapper.find('#friends-modal').exists()).toBeTruthy()

        expect(wrapper.find('.dropdown').exists()).toBeTruthy()
    })
})

describe('Home Click Test', ()=> {
    it('should trigger events', async ()=> {

        const lobbyButton = wrapper.find('#btn-menu')
        expect(lobbyButton.exists()).toBeTruthy()
        await lobbyButton.trigger('click')
    })
})
