import React from 'react';
import '@testing-library/jest-dom'
import {render, screen, fireEvent} from "@testing-library/react";
import {I18nextProvider} from "react-i18next";
import {HomeScreen} from "../HomeScreen/HomeScreen";
import i18next from "i18next";
import i18n from './i18nTest' // USED IN THE RENDER
import {BrowserRouter} from "react-router-dom";
jest.mock('../Assets/den_flag.png', () => 'den_flag.png');
jest.mock('../Assets/uk_flag.png', () => 'uk_flag.png');
jest.mock('../Assets/nl_flag.png', () => 'nl_flag.png');


describe('HomeScreen component', () => {
    beforeEach(() => {
        render(
            <I18nextProvider i18n={i18next}>
                <BrowserRouter>
                    <HomeScreen/>
                </BrowserRouter>
            </I18nextProvider>
        )
    })

    test('renders logo gif', () => {
        const logoGif = screen.getByAltText("Logo");
        expect(logoGif).toBeInTheDocument();
        expect(logoGif).toHaveAttribute('src', '/Logo.gif');
    })

    test('clicking on join game button navigates to /joinGame', () => {
        const joinButton = screen.getByText('Join game');
        fireEvent.click(joinButton);
        expect(window.location.pathname).toBe('/joinGame');
    })

    test('clicking on create game button navigates to /configuration', () => {
        const createButton = screen.getByText('Create game');
        fireEvent.click(createButton);
        expect(window.location.pathname).toBe('/configuration');
    })

    test('clicking on q button opens new tab with pdf', () => {
        const qButton = screen.getByText('?');
        fireEvent.click(qButton);
    })
})