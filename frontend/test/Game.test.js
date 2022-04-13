import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import Game from '../src/views/Game.vue'
import CheckerBoard from '../src/components/boardComponents/CheckerBoard.vue'
import Cell from '../src/components/boardComponents/Cell.vue'
import Chat from '../src/components/boardComponents/Chat.vue'
import Player from '../src/components/boardComponents/Player.vue'

function createGrid() {
    let grid = [];
    var cell = 1;
    for (let i = 0; i < 10; i++) {
        let row = [];
        for (let j = 0; j < 10; j++) {
        if ((i + 1) % 2 == 0) {
            if ((j + 1) % 2 != 0) {
            row[j] = cell;
            cell++;
            } else {
            row[j] = 0;
            }
        } else {
            if ((j + 1) % 2 == 0) {
            row[j] = cell;
            cell++;
            } else {
            row[j] = 0;
            }
        }
        }
        grid.push(row);
    }
    return grid
}

describe('Game mount test', () => {
    it('should mount', () => {
        const wrapper = mount(Game)

        expect(wrapper.findComponent(CheckerBoard).exists()).toBeTruthy()

        expect(wrapper.findComponent(Chat).exists()).toBeTruthy()
    })
})

describe('Game Contain Test', ()=> {
    it('should contain', ()=> {
        const wrapper = mount(Game)

        expect(wrapper.find('.modal').exists()).toBeTruthy()

        expect(wrapper.find('#exit-game-msg').exists()).toBeTruthy()
    })
})

describe('CheckerBoard mount test', () => {
    it('should mount', async () => {
        const wrapper = mount(CheckerBoard)

        await wrapper.setData({
            board: createGrid()
        })
        
        expect(wrapper.findComponent(Cell).exists()).toBeTruthy()

        expect(wrapper.findComponent(Player).exists()).toBeTruthy()
    })
})

describe('Cell contain test', () => {
    it('should not contain', () => {
        const cell = mount(Cell, {
            cell: 0
        })
        expect(cell.find('img').exists()).toBeFalsy()
    })
})