/**
 * @vitest-enviroment
 */

import { describe, it, expect, vi, beforeAll } from 'vitest'
import { mount } from '@vue/test-utils'
import SocketIO from "socket.io-client"
import router from './utils/router/router'
import store from '../src/store/'
import Login from '../src/views/LogIn.vue'
import AudioPlayer from './utils/AudioPlayer'

const mockAudio = new AudioPlayer('ciao.mp3')
const wrapper = mount(Login, {
    global: {
        plugins: [router, store]
    },
    attachTo: document.body,
    data() {
        return {
            buttonSound: mockAudio,
            socket: SocketIO("http://localhost:3030"),
        }
    },
})
 
describe('Login Mount Test', ()=> {
    it('should mount', () => {
        expect(wrapper.exists()).toBeTruthy()
    })
})

describe('Login Contain Test', ()=> {
    it('should contain', () => {
        expect(wrapper.find('h1').exists()).toBeTruthy()

        expect(wrapper.find('.mail').exists()).toBeTruthy()

        expect(wrapper.find('.password').exists()).toBeTruthy()

        expect(wrapper.find('.login-btn').exists()).toBeTruthy()

        expect(wrapper.find('.btn-link').exists()).toBeTruthy()
    })
})

describe('Login Inputs Test', ()=> {
    it('value checks', async () => {
        const mailInput = wrapper.find('.mail')
        await mailInput.setValue('value')
        expect(wrapper.find('.mail').element.value).toBe('value')

        const passwordInput = wrapper.find('.password')
        await passwordInput.setValue('pass')
        expect(wrapper.find('.password').element.value).toBe('pass')
    })
})

describe('Login check trigger', () => {
    it('should trigger', async () => {
        await wrapper.vm.buttonClick(mockAudio)

        const spy = vi.spyOn(wrapper.vm, 'buttonClick').mockImplementation(() => {})
        await wrapper.find('button').trigger('click')
        expect(spy).toHaveBeenCalledOnce()

        await wrapper.find('.mail').setValue("")
        await wrapper.find('.password').setValue("")
        await wrapper.vm.login()

        await wrapper.find('.mail').setValue("test2@test2.com")
        await wrapper.find('.password').setValue("TestonE97!")
        await wrapper.vm.login()

        await wrapper.vm.close()
    })
})