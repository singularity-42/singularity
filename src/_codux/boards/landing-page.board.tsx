import React from 'react'
import { createBoard } from '@wixc3/react-board';
import Page from '../../../app/page';

export default createBoard({
    name: 'Landing Page',
    Board: () => <div>
        <Page />
    </div>,
    isSnippet: true,
});
