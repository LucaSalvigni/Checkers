/**
 * @vitest-enviroment
 */

import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import router from './utils/router/router.js'
import SocketIO from "socket.io-client"
import store from '../src/store/index.js'
import SignUp from '../src/views/SignUp.vue'
import AudioPlayer from './utils/AudioPlayer'

const mockAudio = new AudioPlayer('ciao.mp3')
const signUp = mount(SignUp, {
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

describe('SignUp Mount Test', ()=> {
    it('should mount', () => {
        expect(signUp.exists()).toBeTruthy()
    })
})

describe('SignUp Contain Test', ()=> {
    it('should contain', ()=> {

        expect(signUp.find('h1').exists()).toBeTruthy()

        expect(signUp.find('.username').exists()).toBeTruthy()

        expect(signUp.find('.firstName').exists()).toBeTruthy()

        expect(signUp.find('.lastName').exists()).toBeTruthy()

        expect(signUp.find('.mail').exists()).toBeTruthy()

        expect(signUp.find('.password').exists()).toBeTruthy()

        expect(signUp.find('.confirmPassword').exists()).toBeTruthy()

        expect(signUp.find('.signup-btn').exists()).toBeTruthy()
    })
})
 
describe('SignUp Inputs Test', ()=> {
    it('value checks', async ()=> {

        const usernameInput = signUp.find('.username')
        await usernameInput.setValue('username')
        expect(signUp.find('.username').element.value).toBe('username')

        const firstNameInput = signUp.find('.firstName')
        await firstNameInput.setValue('firstName')
        expect(signUp.find('.firstName').element.value).toBe('firstName')

        const lastNameInput = signUp.find('.lastName')
        await lastNameInput.setValue('lastName')
        expect(signUp.find('.lastName').element.value).toBe('lastName')

        const mailInput = signUp.find('.mail')
        await mailInput.setValue('value')
        expect(signUp.find('.mail').element.value).toBe('value')

        const passwordInput = signUp.find('.password')
        await passwordInput.setValue('pass')
        expect(signUp.find('.password').element.value).toBe('pass')

        const confirmPasswordInput = signUp.find('.confirmPassword')
        await confirmPasswordInput.setValue('confPass')
        expect(signUp.find('.confirmPassword').element.value).toBe('confPass')
    })
})

describe('SignUp trigger Test', () => {
    it('should work', async () => {
        await signUp.vm.signup()

        await signUp.vm.close()

        await signUp.find('.mail').setValue("test2@test2.com")
        await signUp.find('.password').setValue("TestonE97!")
        await signUp.find('.confirmPassword').setValue("TestonE97!")

        await signUp.vm.signup()

        await signUp.setData({ successfull: true})

        await signUp.vm.close()
    })
})