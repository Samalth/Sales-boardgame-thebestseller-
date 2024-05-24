import React from 'react';
import '@testing-library/jest-dom'
import {render, screen, fireEvent} from "@testing-library/react";
import {I18nextProvider} from "react-i18next";
import i18next from "i18next";
import i18n from './i18nTest' // !IMPORTANT! USED IN THE VIRTUAL RENDER
import {BrowserRouter} from "react-router-dom";
import {JoinGame} from "../JoinGame/JoinGame";


describe('JoinGame', () => {
    beforeEach(() => {
        render(
            <I18nextProvider i18n={i18next}>
                <BrowserRouter>
                    <JoinGame/>
                </BrowserRouter>
            </I18nextProvider>
        )
    })

})