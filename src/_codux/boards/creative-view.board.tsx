import React from 'react'
import { createBoard } from '@wixc3/react-board';
import Entity from '../../../components/layout/Entity';


const entity = {
    title: "test",
    instagram: "@test",
    website: "test.de",
    tags: ["test", "foo", "bar"]
};

export default createBoard({
    name: 'Entity View',
    Board: () => <div>
        <Entity entity={entity as any} />
    </div>,
    isSnippet: true,
    environmentProps: {
        canvasWidth: 612
    }
});
