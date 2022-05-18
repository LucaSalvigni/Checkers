/**
 * @vitest-enviroment
 */

import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import { routes } from '../src/router/index'
import { createRouter, createWebHistory } from 'vue-router'
import App from '../src/App.vue'
// import LeaderBoard from '../src/views/LeaderBoard.vue'

var app = null
const router = createRouter({
    history: createWebHistory(),
    routes: routes,
})

describe('LeaderBoard Mount Test', () => {
    it('Should mount LeaderBoard', async () => {
        await router.push('/')

        // After this line, router is ready
        await router.isReady()

        app = mount(App, {
            global: {
                plugins: [router]
            }
        })
        //await app.find('.leaderboard').trigger('click')
        //await flushPromises()
        //expect(app.findComponent(LeaderBoard).exists()).toBeTruthy()
        console.log(app.html())
        expect(app.find('router-view').exists()).toBeTruthy()
    })
})

/* describe('LeaderBoard Contain Test', ()=> {
    it('should contain', ()=> {

        expect(app.find('h1').exists()).toBeTruthy()

        expect(app.find('table').exists()).toBeTruthy()

        expect(app.find('thead').exists()).toBeTruthy()

        expect(app.find('tbody').exists()).toBeTruthy()

        expect(app.find('tr').exists()).toBeTruthy()

        expect(app.find('th').exists()).toBeTruthy()

        expect(app.find('td').exists()).toBeTruthy()
    })
}) */
 