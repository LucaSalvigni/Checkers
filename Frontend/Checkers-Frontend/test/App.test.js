/**
 * @vitest-enviroment
 */

import { describe, it, expect, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import router from './utils/router/router.js'
import store from '../src/store/index.js'
import App from '../src/App.vue'
import SideBar from '../src/components/sideBarComponents/SideBar.vue'
import SideBarLink from '../src/components/sideBarComponents/SideBarLink.vue'
import AudioPlayer from './utils/AudioPlayer'

const wrapper = mount(App, {
    global: {
        plugins: [router, store]
    }
})

describe('App Test', () => {
    it('should render child SibeBar and SideBarLink', () => {
        expect(wrapper.findComponent(SideBar).exists()).toBeTruthy()

        expect(wrapper.findComponent(SideBarLink).exists()).toBeTruthy()
    })
})

describe('App trigger Test', () => {

    it('should work', async () => {
        const spyAccept = vi.spyOn(wrapper.vm, 'accept').mockImplementation(() => {})
        const spyDecline = vi.spyOn(wrapper.vm, 'decline').mockImplementation(() => {})
        const spyClose = vi.spyOn(wrapper.vm, 'close').mockImplementation(() => {})
        const spyCheck = vi.spyOn(wrapper.vm, 'checkInvite').mockImplementation(() => {})
        
        await wrapper.vm.accept()
        expect(spyAccept).toHaveBeenCalled()
        spyAccept.mockClear()

        await wrapper.find('.decline').trigger('click')
        expect(spyDecline).toHaveBeenCalled()
        spyDecline.mockClear()

        await wrapper.find('.close').trigger('click')
        expect(spyClose).toHaveBeenCalled()
        spyClose.mockClear()

        await wrapper.vm.checkInvite()
        expect(spyCheck).toHaveBeenCalled()
        spyCheck.mockClear()
    })
})

describe('SidebarLink Test', () => {
    const mockAudio = new AudioPlayer('ciao.mp3')
    it('should work', async () => {
        const sideBar = mount(SideBar, {
            global: {
                plugins: [router]
            },
            props: {
                invites: ["test@test.com"]
            },
            data() {
                return {
                    buttonSound: mockAudio,
                }
            },
        })

        expect(sideBar.exists()).toBeTruthy()

        await sideBar.vm.checkInvite("test@test.com", 0)
    })
})

describe('SidebarLink Test', () => {
    const mockAudio = new AudioPlayer('ciao.mp3')
    it('should work', async () => {
        const link = mount(SideBarLink, {
            props: {
                to: ""
            },
            global: {
                plugins: [router]
            }
        })

        await link.setProps({ to: "/login" })

        await link.vm.buttonClick(mockAudio)

        const spy = vi.spyOn(link.vm, 'buttonClick').mockImplementation(() => {})
        await link.find('a').trigger('click')
        expect(spy).toHaveBeenCalled()
    })
})
