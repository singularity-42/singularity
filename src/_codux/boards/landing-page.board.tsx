import React from 'react'
import { createBoard } from '@wixc3/react-board';
import Page from '../../../app/page';
import Layout from '../../../app/layout';

export default createBoard({
    name: 'Landing Page',
    Board: () => <div>
        <Page />
        <Layout />
    </div>,
    isSnippet: true,
});
