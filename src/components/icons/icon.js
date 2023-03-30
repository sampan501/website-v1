import React from 'react';
import PropTypes from 'prop-types';
import {
  IconBookmark,
  IconCodepen,
  IconExternal,
  IconFolder,
  IconFork,
  IconGitHub,
  IconInstagram,
  IconLinkedin,
  IconLoader,
  IconLogo,
  IconStar,
  IconTwitter,
  IconScholar,
  IconarXiv,
  IconDOI,
  IconOral,
  IconPaper,
  IconPoster,
  IconCode,
} from '@components/icons';

const Icon = ({ name }) => {
  switch (name) {
    case 'Bookmark':
      return <IconBookmark />;
    case 'Codepen':
      return <IconCodepen />;
    case 'External':
      return <IconExternal />;
    case 'Folder':
      return <IconFolder />;
    case 'Fork':
      return <IconFork />;
    case 'GitHub':
      return <IconGitHub />;
    case 'Instagram':
      return <IconInstagram />;
    case 'Linkedin':
      return <IconLinkedin />;
    case 'Loader':
      return <IconLoader />;
    case 'Logo':
      return <IconLogo />;
    case 'Star':
      return <IconStar />;
    case 'Twitter':
      return <IconTwitter />;
    case 'Scholar':
      return <IconScholar />;
    case 'arXiv':
      return <IconarXiv />;
    case 'DOI':
      return <IconDOI />;
    case 'Oral':
      return <IconOral />;
    case 'Paper':
      return <IconPaper />;
    case 'Poster':
      return <IconPoster />;
    case 'Code':
      return <IconCode />;
    default:
      return <IconExternal />;
  }
};

Icon.propTypes = {
  name: PropTypes.string.isRequired,
};

export default Icon;
