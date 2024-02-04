import React from 'react'
import { createBoard } from '@wixc3/react-board';
import EntityRow from '../../../components/layout/components/EntityRow';
import Entity_module from '../../../styles/Entity.module.scss';

let entity = {
    title: "ajz",
    instagram: "test",
    website: "https://abc.de/",
    tags: ["test", "test"],
}

export default createBoard({
    name: 'Artist View',
    Board: () => <div className={Entity_module.background}>
        <EntityRow entity={entity} /></div>,
    isSnippet: true,
    environmentProps: {
        canvasWidth: 1050,
        canvasHeight: 210,
        windowHeight: 1129
    }
});
