import { MdAdd, MdConnectingAirports, MdGroups, MdOutlineCalendarMonth, MdOutlineEditNote, MdPages, MdPerson, MdTableRows, MdViewCarousel } from "react-icons/md";

const dateRegex = /(\d{1,2})\.(\d{1,2})\.(\d{2,4})/;
const costRegex = /(\d{1,2})€/;
const tagRegex = /#(\w+)/;
const timeRegex = /(\d{1,2})(doors|close)/;
const connectionRegex = /(\[\[.*?\]\]|.*?\|\[\[.*?\]\])/;

export const FILTER_REGEX: { [key: string]: RegExp } = {
    date: dateRegex,
    cost: costRegex,
    time: timeRegex,
    tag: tagRegex,
    connection: connectionRegex,
};

export enum CategoryType {
    Collaboration = "collaborations",
    Collective = "collectives",
    Creative = "creatives",
    Concept = "concepts",
    Change = "changes",
}

export enum ViewType {
  CardsCalender = "Calender",
  CardsColumn = "Column",
  CardsCarousel = "Carousel",
  // CardsConnections = "Connection",
}

export const VIEW_ICONS: { [key: string]: JSX.Element } = {
    [ViewType.CardsCalender]: <MdOutlineCalendarMonth />,
    [ViewType.CardsColumn]: <MdTableRows />,
    [ViewType.CardsCarousel]: <MdViewCarousel />,
};

export const CATEGORY_ICONS: { [key: string]: JSX.Element } = {
    collaborations: <MdOutlineCalendarMonth />,
    collectives: <MdGroups />,
    creatives: <MdPerson />,
    concepts: <MdPages />,
    // changes: <MdOutlineEditNote />,
};

import { MdWeb } from 'react-icons/md';
import { FaHashtag, FaSearch, 
    FaEnvelope,
    FaMapMarkerAlt,
    FaPhone,
    FaInstagram,
    FaYoutube,
    FaSoundcloud,
    FaSpotify,
    FaBandcamp,
    FaTelegramPlane,
    FaTwitter,
    FaFacebook } from "react-icons/fa";
import { IoTimeSharp } from "react-icons/io5";
import { BiSolidNetworkChart } from "react-icons/bi";
import { IoMdPricetag } from "react-icons/io";

export const FILTER_ICONS: { [key: string]: JSX.Element } = {
    costs: <IoMdPricetag />,
    time: <IoTimeSharp />,
    concepts: <FaHashtag />,
    connections: <BiSolidNetworkChart />,
};

export enum SocialMedia {
    website = 'website',
    mail = 'mail',
    address = 'address',
    tel = 'tel',
    instagram = 'instagram',
    youtube = 'youtube',
    soundcloud = 'soundcloud',
    spotify = 'spotify',
    facebook = 'facebook',
    bandcamp = 'bandcamp',
    telegram = 'telegram',
    twitter = 'twitter',
    add = 'add',
}

export const SOCIAL_MEDIA_ICONS: { [key in SocialMedia]: JSX.Element } = {
    [SocialMedia.website]: <MdWeb />,
    [SocialMedia.mail]: <FaEnvelope />,
    [SocialMedia.address]: <FaMapMarkerAlt />,
    [SocialMedia.tel]: <FaPhone />,
    [SocialMedia.instagram]: <FaInstagram />,
    [SocialMedia.youtube]: <FaYoutube />,
    [SocialMedia.soundcloud]: <FaSoundcloud />,
    [SocialMedia.spotify]: <FaSpotify />,
    [SocialMedia.facebook]: <FaFacebook />,
    [SocialMedia.bandcamp]: <FaBandcamp />,
    [SocialMedia.telegram]: <FaTelegramPlane />,
    [SocialMedia.twitter]: <FaTwitter />,
    [SocialMedia.add]: <MdAdd />
};

export const CATEGORY_DESCRIPTIONS: { [key: string]: string } = {
    collaborations: "Veranstaltungen, die durch kreative Konzepte entstehen.",
    collectives: "Gruppen, die gemeinsam inspirierende Inhalte erstellen.",
    creatives: "Inhaltsschöpfer, die ihre Vorstellungskraft in die Tat umsetzen.",
    concepts: "Ideen, die unseren Content formen.",
    // changes: "Veränderungen mit Geschichte.",
};

export const SITE_METADATA = {
    title: "Singularity",
    description: "The Singularity is a collection of creative, concepts, collectives, and collaborations.",
    abstract: "The Singularity is a collection of creative, concepts, collectives, and collaborations.",
    keywords: ["Singularity", "Creative", "Concepts", "Collectives", "Collaborations", "Chemnitz"],
    applicationName: "Singularity",
    authors: [
        {
            name: "Singularity",
            url: "https://singularity.2n40.eu",
        },
        {
            name: "Drumni",
            url: "https://github.com/drumni",
        },
    ],
    robots: "index, follow",
};