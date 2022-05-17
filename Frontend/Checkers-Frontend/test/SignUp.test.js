/**
 * @vitest-enviroment
 */

import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import SignUp from '../src/views/SignUp.vue'

const wrapper = mount(SignUp)

describe('SignUp Mount Test', ()=> {
    it('should mount', () => {
        const wrapper = mount(SignUp)
    })
})

describe('SignUp Contain Test', ()=> {
    it('should contain', ()=> {

        expect(wrapper.find('h1').exists()).toBeTruthy()

        expect(wrapper.find('.username').exists()).toBeTruthy()

        expect(wrapper.find('.firstName').exists()).toBeTruthy()

        expect(wrapper.find('.lastName').exists()).toBeTruthy()

        expect(wrapper.find('.mail').exists()).toBeTruthy()

        expect(wrapper.find('.password').exists()).toBeTruthy()

        expect(wrapper.find('.confirmPassword').exists()).toBeTruthy()

        expect(wrapper.find('.signup-btn').exists()).toBeTruthy()
    })
})
 
describe('SignUp Inputs Test', ()=> {
    it('value checks', async ()=> {

        const usernameInput = wrapper.find('.username')
        await usernameInput.setValue('username')
        expect(wrapper.find('.username').element.value).toBe('username')

        const firstNameInput = wrapper.find('.firstName')
        await firstNameInput.setValue('firstName')
        expect(wrapper.find('.firstName').element.value).toBe('firstName')

        const lastNameInput = wrapper.find('.lastName')
        await lastNameInput.setValue('lastName')
        expect(wrapper.find('.lastName').element.value).toBe('lastName')

        const mailInput = wrapper.find('.mail')
        await mailInput.setValue('value')
        expect(wrapper.find('.mail').element.value).toBe('value')

        const passwordInput = wrapper.find('.password')
        await passwordInput.setValue('pass')
        expect(wrapper.find('.password').element.value).toBe('pass')

        const confirmPasswordInput = wrapper.find('.confirmPassword')
        await confirmPasswordInput.setValue('confPass')
        expect(wrapper.find('.confirmPassword').element.value).toBe('confPass')
    })
})