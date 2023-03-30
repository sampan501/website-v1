import React, { useState, useEffect, useRef } from 'react';
import { useStaticQuery, graphql } from 'gatsby';
import { CSSTransition } from 'react-transition-group';
import styled from 'styled-components';
import { srConfig } from '@config';
import { KEY_CODES } from '@utils';
import sr from '@utils/sr';
import { usePrefersReducedMotion } from '@hooks';
import { Projects, Papers, Presentations } from '@components';

const StyledWorksSection = styled.section`
  .inner {
    position: relative;
  }
`;

const StyledTabList = styled.ul`
  ${({ theme }) => theme.mixins.flexCenter};
  display: flex;
  position: relative;
  z-index: 3;
  width: 100%;
  padding: 0;
  margin: 0;
  margin-bottom: 30px;
  list-style: none;
  height: var(--tab-height);

  @media (max-width: 600px) {
    display: flex;
    overflow-x: auto;
    width: calc(100% + 100px);
    margin-left: -50px;
    margin-bottom: 30px;
  }
  @media (max-width: 480px) {
    width: calc(100% + 50px);
    padding-left: 25px;
    margin-left: -25px;
  }

  li {
    &:first-of-type {
      @media (max-width: 600px) {
        margin-left: 50px;
      }
      @media (max-width: 480px) {
        margin-left: 25px;
      }
    }
    &:last-of-type {
      @media (max-width: 600px) {
        padding-right: 50px;
      }
      @media (max-width: 480px) {
        padding-right: 25px;
      }
    }
  }
`;

const StyledTabButton = styled.button`
  ${({ theme }) => theme.mixins.link};
  ${({ theme }) => theme.mixins.flexCenter};
  align-items: center;
  width: 100%;
  min-width: auto;
  height: var(--tab-height);
  padding: 0 20px 2px;
  background-color: transparent;
  color: ${({ isActive }) => (isActive ? 'var(--green)' : 'var(--slate)')};
  border-bottom: 3px solid ${({ isActive }) => (isActive ? 'var(--green)' : 'var(--navy)')};
  font-size: var(--fz-xxl);
  text-align: center;
  white-space: nowrap;
  font-weight: 600;
  height: 50px;

  @media (max-width: 768px) {
    padding: 0 15px 2px;
    font-size: var(--fz-xxl);
    border-bottom: 3px solid ${({ isActive }) => (isActive ? 'var(--green)' : 'var(--navy)')};
  }
  @media (max-width: 600px) {
    ${({ theme }) => theme.mixins.flexCenter};
    padding: 0 15px;
    border-left: 0;
    text-align: center;
    min-width: auto;
  }

  &:hover,
  &:focus {
    background-color: var(--light-navy);
  }
`;

const StyledHighlight = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  z-index: 10;
  width: 2px;
  height: var(--tab-height);
  border-radius: var(--border-radius);
  background: var(--green);
  transform: translateY(calc(${({ activeTabId }) => activeTabId} * var(--tab-height)));
  transition: transform 0.25s cubic-bezier(0.645, 0.045, 0.355, 1);
  transition-delay: 0.1s;

  @media (max-width: 600px) {
    top: auto;
    bottom: 0;
    width: 100%;
    max-width: var(--tab-width);
    height: 2px;
    margin-left: 50px;
    transform: translateX(calc(${({ activeTabId }) => activeTabId} * var(--tab-width)));
  }
  @media (max-width: 480px) {
    margin-left: 25px;
  }
`;

const StyledTabPanels = styled.div`
  position: relative;
  width: 100%;
  margin-left: 20px;

  @media (max-width: 600px) {
    margin-left: 0;
  }
`;

const StyledTabPanel = styled.div`
  width: 100%;
  height: auto;

  h3 {
    margin-bottom: 2px;
    font-size: var(--fz-xxl);
    font-weight: 500;
    line-height: 1.3;

    .company {
      color: var(--green);
    }
  }

  .range {
    margin-bottom: 25px;
    color: var(--light-slate);
    font-family: var(--font-mono);
    font-size: var(--fz-xs);
  }
`;

const Works = () => {
  const [activeTabId, setActiveTabId] = useState(0);
  const [tabFocus, setTabFocus] = useState(null);
  const tabs = useRef([]);
  const revealContainer = useRef(null);
  const prefersReducedMotion = usePrefersReducedMotion();

  useEffect(() => {
    if (prefersReducedMotion) {
      return;
    }

    sr.reveal(revealContainer.current, srConfig());
  }, []);

  const focusTab = () => {
    if (tabs.current[tabFocus]) {
      tabs.current[tabFocus].focus();
      return;
    }
    // If we're at the end, go to the start
    if (tabFocus >= tabs.current.length) {
      setTabFocus(0);
    }
    // If we're at the start, move to the end
    if (tabFocus < 0) {
      setTabFocus(tabs.current.length - 1);
    }
  };

  // Only re-run the effect if tabFocus changes
  useEffect(() => focusTab(), [tabFocus]);

  // Focus on tabs when using up & down arrow keys
  const onKeyDown = e => {
    switch (e.key) {
      case KEY_CODES.ARROW_UP: {
        e.preventDefault();
        setTabFocus(tabFocus - 1);
        break;
      }

      case KEY_CODES.ARROW_DOWN: {
        e.preventDefault();
        setTabFocus(tabFocus + 1);
        break;
      }

      default: {
        break;
      }
    }
  };

  return (
    <StyledWorksSection id="works" ref={revealContainer}>
      <div className="inner">
        <StyledTabList role="tablist" aria-label="Work tabs" onKeyDown={e => onKeyPressed(e)}>
            <li key={0}>
                <StyledTabButton
                isActive={activeTabId === 0}
                onClick={() => setActiveTabId(0)}
                ref={el => (tabs.current[0] = el)}
                id={`tab-${0}`}
                role="tab"
                aria-selected={activeTabId === 0 ? true : false}
                aria-controls={`panel-${0}`}
                tabIndex={activeTabId === 0 ? '0' : '-1'}>
                <span>Papers</span>
                </StyledTabButton>
            </li>
            <li key={1}>
                <StyledTabButton
                isActive={activeTabId === 1}
                onClick={() => setActiveTabId(1)}
                ref={el => (tabs.current[1] = el)}
                id={`tab-${1}`}
                role="tab"
                aria-selected={activeTabId === 1 ? true : false}
                aria-controls={`panel-${1}`}
                tabIndex={activeTabId === 1 ? '0' : '-1'}>
                <span>Presentations</span>
                </StyledTabButton>
            </li>
            <li key={2}>
                <StyledTabButton
                  isActive={activeTabId === 2}
                  onClick={() => setActiveTabId(2)}
                  ref={el => (tabs.current[2] = el)}
                  id={`tab-${2}`}
                  role="tab"
                  aria-selected={activeTabId === 2 ? true : false}
                  aria-controls={`panel-${2}`}
                  tabIndex={activeTabId === 2 ? '0' : '-1'}>
                  <span>Software</span>
                </StyledTabButton>
            </li>
        </StyledTabList>

        <StyledTabPanel
          key={0}
          isActive={activeTabId === 0}
          id={`panel-${0}`}
          role="tabpanel"
          aria-labelledby={`tab-${0}`}
          tabIndex={activeTabId === 0 ? '0' : '-1'}
          hidden={activeTabId !== 0}>
          <Papers />
          </StyledTabPanel>
        <StyledTabPanel
          key={1}
          isActive={activeTabId === 1}
          id={`panel-${1}`}
          role="tabpanel"
          aria-labelledby={`tab-${1}`}
          tabIndex={activeTabId === 1 ? '0' : '-1'}
          hidden={activeTabId !== 1}>
          <Presentations />
        </StyledTabPanel>
        <StyledTabPanel
          key={2}
          isActive={activeTabId === 2}
          id={`panel-${2}`}
          role="tabpanel"
          aria-labelledby={`tab-${2}`}
          tabIndex={activeTabId === 2 ? '0' : '-1'}
          hidden={activeTabId !== 2}>
          <Projects />
        </StyledTabPanel>
      </div>
    </StyledWorksSection>
  );
};

export default Works;
