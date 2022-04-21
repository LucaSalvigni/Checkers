/**
 * @vitest-enviroment
 */

import { describe, it, expect, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import router from './utils/router/router.js'
import App from '../src/App.vue'
import SideBar from '../src/components/sideBarComponents/SideBar.vue'
import SideBarLink from '../src/components/sideBarComponents/SideBarLink.vue'
import AudioPlayer from './utils/AudioPlayer';


describe('App Test', () => {
    it('should render child SibeBar and SideBarLink', () => {
        const wrapper = mount(App, {
            global: {
                plugins: [router]
            }
        })
        
        expect(wrapper.findComponent(SideBar).exists()).toBeTruthy()

        expect(wrapper.findComponent(SideBarLink).exists()).toBeTruthy()
    })
})

describe('SidebarLink Test', () => {
    const mockAudio = new AudioPlayer('ciao.mp3')
    it('should work', async () => {
        const wrapper = mount(SideBarLink, {
            props: {
                to: ""
            },
            global: {
                plugins: [router]
            }
        })

        await wrapper.setProps({ to: "/profile" })

        await wrapper.vm.buttonClick(mockAudio)

        const spy = vi.spyOn(wrapper.vm, 'buttonClick').mockImplementation(() => {})
        await wrapper.find('router-link').trigger('click')
        expect(spy).toHaveBeenCalled()
    })
})
