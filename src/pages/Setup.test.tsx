import * as github from '../services/github';
import { AxiosError } from 'axios';

import { RenderResult, fireEvent, render, screen, waitFor } from '@testing-library/react-native';

import Setup from './Setup';
import { Alert } from 'react-native';

describe(Setup.name, () => {
    const mockProps = {} as any;

    describe('username validation', () => {
        let input: ReturnType<RenderResult['getByTestId']>;
        let button: ReturnType<RenderResult['getByTestId']>;

        beforeEach(() => {
            render(<Setup {...mockProps} />);
            input = screen.getByTestId('input');
            button = screen.getByTestId('button');
        });

        it('shows error if username is not on GitHub', async () => {
            const alertSpy = jest.spyOn(Alert, 'alert');
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
    });
});
