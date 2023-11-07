type TruncateProps = {
    text: string;
    threshold: number;
};

const Truncate: React.FC<TruncateProps> = ({ text, threshold }) => {
    const truncatedText = text.length > threshold ? `${text.substring(0, threshold)}...` : text;

    return <p>{truncatedText}</p>;
};

export default Truncate;
