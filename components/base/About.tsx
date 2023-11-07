import React from 'react';
import './About.module.scss';

interface AboutProps {
    name: string;
    role: string;
    bio: string;
    skills: string[];
    email: string
}

const About: React.FC<AboutProps> = ({
    name,
    role,
    bio,
    skills,
    email,
}) => {
    return (
        <div className="about">
            <header>
                <h1>About</h1>
            </header>
            <main>
                <section className="bio">
                    <p>{bio}</p>
                </section>
                <section className="skills">
                    <h2>Skills</h2>
                    <ul>
                        {skills.map((skill, index) => (
                            <li key={index}>{skill}</li>
                        ))}
                    </ul>
                </section>
                <section className="contact">
                    <h2>Contact</h2>
                    <p>Email: {email}</p>
                </section>
            </main>
        </div>
    );
};

export default About;
