import * as github from '../services/github';
import * as usersAPI from '../services/users';
import { AxiosError } from 'axios';

import { RenderResult, fireEvent, render, screen, waitFor } from '@testing-library/react-native';

import Setup from './Setup';
import { Alert } from 'react-native';

describe(Setup.name, () => {
    const mockProps = {} as any;

    describe('username validation', () => {
        let input: ReturnType<RenderResult['getByTestId']>;
        let button: ReturnType<RenderResult['getByTestId']>;
        let alertSpy: jest.SpyInstance;

        beforeEach(() => {
            render(<Setup {...mockProps} />);
            input = screen.getByTestId('input');
            button = screen.getByTestId('button');
            alertSpy = jest.spyOn(Alert, 'alert');
        });

        it('shows error if username is not on GitHub', async () => {
            jest.spyOn(github, 'getUserInfo').mockRejectedValueOnce({
                isAxiosError: true,
                response: { status: 404 },
            } as AxiosError);

            fireEvent.changeText(input, 'foo');
            fireEvent.press(button);

            await waitFor(() => {
                expect(alertSpy).toHaveBeenCalledWith('There is no such username on GitHub.');
            });
        });

        describe('when username is on GitHub', () => {
            beforeEach(() => {
                jest.spyOn(github, 'getUserInfo').mockResolvedValue({});
            });

            it('POSTs user to API', async () => {
                let postUserSpy = jest.spyOn(usersAPI, 'postUser').mockResolvedValue({} as any);

                fireEvent.changeText(input, 'foo');
                fireEvent.press(button);

                await waitFor(() => {
                    expect(postUserSpy).toHaveBeenCalled();
                });
            });

            it('shows error when users API is unavailable', async () => {
                let postUserSpy = jest.spyOn(usersAPI, 'postUser').mockRejectedValue("Example Error");

                fireEvent.changeText(input, 'foo');
                fireEvent.press(button);

                await waitFor(() => {
                    expect(alertSpy).toHaveBeenCalledWith("Example Error");
                });
            });
        });
    });
});
