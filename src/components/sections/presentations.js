import React, { useState, useEffect, useRef } from 'react';
import { Link, useStaticQuery, graphql } from 'gatsby';
import { CSSTransition, TransitionGroup } from 'react-transition-group';
import styled from 'styled-components';
import { srConfig } from '@config';
import sr from '@utils/sr';
import { Icon } from '@components/icons';
import { usePrefersReducedMotion } from '@hooks';

const StyledPresentationsSection = styled.section`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 10px;

  h2 {
    font-size: clamp(24px, 5vw, var(--fz-heading));
  }

  .archive-link {
    font-family: var(--font-mono);
    font-size: var(--fz-sm);
    &:after {
      bottom: 0.1em;
    }
  }

  .presentations-grid {
    ${({ theme }) => theme.mixins.resetList};
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
    grid-gap: 15px;
    position: relative;
    margin-top: 50px;

    @media (max-width: 1080px) {
      grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
    }
  }

  .more-button {
    ${({ theme }) => theme.mixins.button};
    margin: 80px auto 0;
  }

  footer {
    ${({ theme }) => theme.mixins.flexBetween};
    width: 100%;
    margin-top: 20px;
  }
`;

const StyledPresentation = styled.li`
  position: relative;
  cursor: default;
  transition: var(--transition);

  @media (prefers-reduced-motion: no-preference) {
    &:hover,
    &:focus-within {
      .presentation-inner {
        transform: translateY(-7px);
      }
    }
  }

  a {
    position: relative;
    z-index: 1;
  }

  .presentation-inner {
    ${({ theme }) => theme.mixins.boxShadow};
    ${({ theme }) => theme.mixins.flexBetween};
    flex-direction: column;
    align-items: flex-start;
    position: relative;
    height: 100%;
    padding: 2rem 1.75rem;
    border-radius: var(--border-radius);
    background-color: var(--light-navy);
    transition: var(--transition);
  }

  .presentation-top {
    ${({ theme }) => theme.mixins.flexBetween};
    margin-bottom: 35px;

    .presentation {
      color: var(--green);
      svg {
        width: 40px;
        height: 40px;
      }
    }

    .presentation-links {
      display: flex;
      align-items: center;
      margin-right: -10px;
      color: var(--light-slate);

      a {
        ${({ theme }) => theme.mixins.flexCenter};
        padding: 5px 7px;

        &.external {
          svg {
            width: 22px;
            height: 22px;
            margin-top: -4px;
          }
        }

        svg {
          width: 20px;
          height: 20px;
        }
      }
    }
  }

  .presentation-title {
    margin: 0 0 10px;
    color: var(--lightest-slate);
    font-size: var(--fz-xxl);

    a {
      position: static;

      &:before {
        content: '';
        display: block;
        position: absolute;
        z-index: 0;
        width: 100%;
        height: 100%;
        top: 0;
        left: 0;
      }
    }
  }

  .presentation-description {
    color: var(--light-slate);
    font-size: 17px;

    a {
      ${({ theme }) => theme.mixins.inlineLink};
    }
  }

  .presentation__footer {
    color: var(--light-slate);
    font-family: var(--font-mono);
    font-size: var(--fz-xxs);
  }

  .presentation-tech-list {
    display: flex;
    align-items: flex-end;
    flex-grow: 1;
    flex-wrap: wrap;
    padding: 0;
    margin: 20px 0 0 0;
    list-style: none;

    li {
      font-family: var(--font-mono);
      font-size: var(--fz-xxs);
      line-height: 1.75;

      &:not(:last-of-type) {
        margin-right: 15px;
      }
    }
  }
`;

const Presentations = () => {
  const data = useStaticQuery(graphql`
    query {
      presentations: allMarkdownRemark(
        filter: {
          fileAbsolutePath: { regex: "/presentations/" }
          frontmatter: { showInPresentations: { ne: false } }
        }
        sort: { fields: [frontmatter___date], order: DESC }
      ) {
        edges {
          node {
            frontmatter {
              title
              tech
              github
              external
              date
              conference
              type
            }
            html
          }
        }
      }
    }
  `);

  const [showMore, setShowMore] = useState(false);
  const revealTitle = useRef(null);
  const revealArchiveLink = useRef(null);
  const revealPresentations = useRef([]);
  const prefersReducedMotion = usePrefersReducedMotion();

  useEffect(() => {
    if (prefersReducedMotion) {
      return;
    }

    // sr.reveal(revealTitle.current, srConfig());
    // sr.reveal(revealArchiveLink.current, srConfig());
    revealPresentations.current.forEach((ref, i) => sr.reveal(ref, srConfig(i * 100)));
  }, []);

  const GRID_LIMIT = 6;
  const presentations = data.presentations.edges.filter(({ node }) => node);
  const firstSix = presentations.slice(0, GRID_LIMIT);
  const presentationsToShow = showMore ? presentations : firstSix;

  const presentationInner = node => {
    const { frontmatter, html } = node;
    const { github, external, title, type, date, conference } = frontmatter;
    const formattedDate = new Date(date).getFullYear();

    return (
      <div className="presentation-inner">
        <header>
          <div className="presentation-top">
            <div className="presentation">
              {type == "Poster" ? <Icon name="Poster" /> : <Icon name="Oral" />}
            </div>
            <div className="presentation-links">
              {github && (
                <a href={github} aria-label="GitHub Link" rel="noopener noreferrer" target="_blank">
                  <Icon name="GitHub" />
                </a>
              )}
              {external && (
                <a
                  href={external}
                  aria-label="External Link"
                  className="external"
                  rel="noopener noreferrer"
                  target="_blank">
                  <Icon name="External" />
                </a>
              )}
            </div>
          </div>

          <h3 className="presentation-title">
            <a href={external} rel="noopener noreferrer" target="_blank">
              {title.length > 100 ? title.substring(0, 100) + "..." : title}
            </a>
          </h3>

          <div className="presentation-description" dangerouslySetInnerHTML={{ __html: html }} />
        </header>

        <footer>
          <span className="presentation__footer">{conference}</span>
          <span className="presentation__footer">{formattedDate}</span>
        </footer>
      </div>
    );
  };

  return (
    <StyledPresentationsSection>
      <Link className="inline-link archive-link" to="/presentations" ref={revealArchiveLink}>
        view the archive
      </Link>

      <ul className="presentations-grid">
        {prefersReducedMotion ? (
          <>
            {presentationsToShow &&
              presentationsToShow.map(({ node }, i) => (
                <StyledPresentation key={i}>{presentationInner(node)}</StyledPresentation>
              ))}
          </>
        ) : (
          <TransitionGroup component={null}>
            {presentationsToShow &&
              presentationsToShow.map(({ node }, i) => (
                <CSSTransition
                  key={i}
                  classNames="fadeup"
                  timeout={i >= GRID_LIMIT ? (i - GRID_LIMIT) * 300 : 300}
                  exit={false}>
                  <StyledPresentation
                    key={i}>
                    {presentationInner(node)}
                  </StyledPresentation>
                </CSSTransition>
              ))}
          </TransitionGroup>
        )}
      </ul>

      <button className="more-button" onClick={() => setShowMore(!showMore)}>
        Show {showMore ? 'Less' : 'More'}
      </button>
    </StyledPresentationsSection>
  );
};

export default Presentations;
