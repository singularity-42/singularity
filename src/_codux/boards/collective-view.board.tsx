import React from 'react'
import { createBoard } from '@wixc3/react-board';
import Entity from '../../../components/layout/Entity';
import Entity_module from '../../../styles/Entity.module.scss';

let entity = {
    title: "hello",
    instagram: "test",
    website: "https://abc.de/",
    tags: ["test", "test"],
}

export default createBoard({
    name: 'Collective View',
    Board: () => <div className={Entity_module.background}>
        <Entity entity={entity} /></div>,
    isSnippet: true,
    environmentProps: {
        canvasWidth: 1050
    }
});
