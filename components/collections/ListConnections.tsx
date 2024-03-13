import React from 'react';
import styles from './ListConnections.module.scss';
import Link from '../base/Link';

interface ConnectionsProps {
    connections: string[];
}

const Connections: React.FC<ConnectionsProps> = ({ connections }) => {
    return (
        <div className={styles.connectionsContainer}>
            {(typeof connections === 'string' ? [connections] : connections).map((connection, index) => (
                <Link key={index} name={connection.replace(/[\[\]"]+/g, "")}>
                    {connection.replace(/[\[\]"]+/g, "")}
                </Link>
            ))}
        </div>
    );
};

export default Connections;
