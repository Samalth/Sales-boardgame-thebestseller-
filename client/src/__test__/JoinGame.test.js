import React from 'react';
import '@testing-library/jest-dom'
import {render, screen, fireEvent} from "@testing-library/react";
import {I18nextProvider} from "react-i18next";
import i18next from "i18next";
import i18n from './i18nTest' // !IMPORTANT! USED IN THE VIRTUAL RENDER
import {BrowserRouter, useNavigate} from "react-router-dom";
import {JoinGame} from "../JoinGame/JoinGame";

/*jest.mock('react-router-dom' , () => ({
        useNavigate:jest.fn()
    }
))

jest.mock('../client' , () => ({
    socket: {
        on: jest.fn(),
        emit: jest.fn()
    }
}))*/

describe('JoinGame component', () => {
    beforeEach(() => {
        render(
            <I18nextProvider i18n={i18next}>
                <BrowserRouter>
                    <JoinGame/>
                </BrowserRouter>
            </I18nextProvider>
        )
    })

    test('updates gamePin input', () => {
        const input = screen.getByPlaceholderText('Enter room code')
        fireEvent.change(input, {target: {value: '1234'}})
        expect(input.value).toBe('1234')
    })

    test('updates username input', () => {
        const input = screen.getByPlaceholderText('Enter username')
        fireEvent.change(input, {target: {value: 'TestUser'}})
        expect(input.value).toBe('TestUser')
    })

    test('updates strategy select', () => {
        const input = screen.getByDisplayValue('Pick a strategy')
        fireEvent.change(input, {target: {value: ''}})
        expect(input.value).toBe('')
    })

    test('clicking on back navigates to home', () => {
        const backButton = screen.getByText('Home')
        fireEvent.click(backButton)
        expect(window.location.pathname).toBe('/home')
    })

})