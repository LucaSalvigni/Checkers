/**
 * @vitest-enviroment
 */

import { describe, it, expect, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import SocketIO from "socket.io-client"
import Profile from '../src/views/Profile.vue'
import store from '../src/store/index.js'
import DataInfo from '../src/components/profileComponents/DataInfo.vue'
import MatchInfo from '../src/components/profileComponents/MatchInfo.vue'
import AudioPlayer from './utils/AudioPlayer'
import router from './utils/router/router'

const mockAudio = new AudioPlayer('ciao.mp3')
const wrapper = mount(Profile, {
    global: {
        plugins: [store]
    },
    attachTo: document.body,
    data() {
        return {
            socket: SocketIO("http://localhost:3030")
        }
    },
})

describe('Profile Mount Test', () => {
    it('should mount Profile', () => {
       expect(wrapper.exists()).toBeTruthy()
    })
})

describe('Profile Contain Test', ()=> {
    it('should contain', ()=> {
        expect(wrapper.find('img').exists()).toBeTruthy()

        expect(wrapper.find('h2.username').exists()).toBeTruthy()

        expect(wrapper.find('.stars').exists()).toBeTruthy()

        expect(wrapper.find('.first_last').exists()).toBeTruthy()

        expect(wrapper.find('.profile-info').exists()).toBeTruthy()

        expect(wrapper.find('#dataInfo').exists()).toBeTruthy()

        expect(wrapper.find('#matchInfo').exists()).toBeTruthy()

        expect(wrapper.findComponent(DataInfo).exists()).toBeTruthy()

        expect(wrapper.findComponent(MatchInfo).exists()).toBeFalsy()
    })
})

describe('Profile data Test', () => {
    it('setData test', async () => {
        await wrapper.setData({
            avatar: "http://daisyui.com/tailwind-css-component-profile-1@40w.png",
            first_last_name: "First Last",
            username: "Username",
            tabName: "Info",
            stars: "Stars",
        })

        expect(wrapper.vm.avatar).toBe('http://daisyui.com/tailwind-css-component-profile-1@40w.png')

        expect(wrapper.vm.first_last_name).toBe('First Last')

        expect(wrapper.vm.username).toBe('Username')

        expect(wrapper.vm.tabName).toBe('Info')

        expect(wrapper.vm.stars).toBe('Stars')

        expect(wrapper.find('h2.username').element.getAttribute('innerText')).toBe('Username')
        expect(wrapper.find('p.stars').element.getAttribute('innerText')).toBe('Stars')
        expect(wrapper.find('p.first_last').element.getAttribute('innerText')).toBe('First Last')

    })
})

describe('DataInfo set Data Test', () => {
    it('should set', async () => {
        const wrapper = mount(DataInfo, {
            global: {
                plugins: [router, store]
            },
            attachTo: document.body,
            data() {
                return {
                    buttonSound: mockAudio,      
                }
            },
        })

        await wrapper.setData({
            first_name: "Luca",
            last_name: "Rossi",
            mail: "test2@test2.com",
            username: "User",
        })

        expect(wrapper.find('.username').exists()).toBeTruthy()
        expect(wrapper.find('.first_name').exists()).toBeTruthy()
        expect(wrapper.find('.last_name').exists()).toBeTruthy()
        expect(wrapper.find('.mail').exists()).toBeTruthy()
        expect(wrapper.find('#load-image').exists()).toBeTruthy()

        expect(wrapper.vm.first_name).toBe('Luca')
        expect(wrapper.vm.last_name).toBe('Rossi')
        expect(wrapper.vm.mail).toBe('test2@test2.com')
        expect(wrapper.vm.username).toBe('User')

        await wrapper.vm.close()
        await wrapper.vm.save_profile()
        await wrapper.find('#load-image').trigger('input')

        const spyUpload = vi.spyOn(wrapper.vm, 'uploadImage').mockImplementation(() => {})
        await wrapper.find('#load-image').trigger('input')
        expect(spyUpload).toHaveBeenCalled()

        await wrapper.find('.save').trigger('click')

        const spyClose = vi.spyOn(wrapper.vm, 'close').mockImplementation(() => {})
        await wrapper.find('.close').trigger('click')
        expect(spyClose).toHaveBeenCalled()
    })
})

describe('MathInfo Test', () => {
    it('should work', async () => {
        const wrapper = mount(MatchInfo, {
            attachTo: document.body,
            data() {
                return {
                    buttonSound: mockAudio,
                    perPage: 1,
                    history: [
                        {
                            white: 'newtest@newtest.com',
                            black: 'test2@test2.com',
                            winner: 'newtest@newtest.com'
                        },
                        {
                            white: 'newtest@newtest.com',
                            black: 'test2@test2.com',
                            winner: 'newtest@newtest.com'
                        },
                    ]
                }
            },
        })

        expect(wrapper.vm.perPage).toBe(1)

        expect(wrapper.find('table').exists()).toBeTruthy()
        expect(wrapper.find('thead').exists()).toBeTruthy()
        expect(wrapper.find('tbody').exists()).toBeTruthy()
        expect(wrapper.find('tr').exists()).toBeTruthy()
        expect(wrapper.find('th').exists()).toBeTruthy()

        await wrapper.find('.next').trigger('click')
        await wrapper.find('.previous').trigger('click')

        const spyNext = vi.spyOn(wrapper.vm, 'nextPage').mockImplementation(() => {})
        const spyPrevious = vi.spyOn(wrapper.vm, 'previousPage').mockImplementation(() => {})

        await wrapper.find('.next').trigger('click')
        expect(spyNext).toHaveBeenCalled()
        
        await wrapper.find('.previous').trigger('click')
        expect(spyPrevious).toHaveBeenCalled()
    })
})

describe('Profile trigger test', async () => {
    await wrapper.setData({ buttonSound: mockAudio })

    it('should trigger', async () => {
        await wrapper.vm.buttonClick(mockAudio)
        
        expect(wrapper.vm.tabName).toBe('Info')
        
        await wrapper.vm.matchInfo()
        expect(wrapper.vm.tabName).toBe('Match History')

        await wrapper.vm.dataInfo()
        expect(wrapper.vm.tabName).toBe('User Info')

        const spySound = vi.spyOn(wrapper.vm, 'buttonClick').mockImplementation(() => {})
        const spyData = vi.spyOn(wrapper.vm, 'dataInfo').mockImplementation(() => {})
        const spyMatch = vi.spyOn(wrapper.vm, 'matchInfo').mockImplementation(() => {})

        await wrapper.vm.buttonClick(mockAudio)
        expect(spySound).toHaveBeenCalled()
        
        await wrapper.find('#dataInfo').trigger('click')
        expect(spyData).toHaveBeenCalled()
        expect(spySound).toHaveBeenCalled()
        expect(wrapper.vm.tabName).toBe('User Info')
        
        await wrapper.find('#matchInfo').trigger('click')
        expect(spyMatch).toHaveBeenCalled()
        expect(spySound).toHaveBeenCalled()
    })
})