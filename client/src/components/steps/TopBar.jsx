import React from 'react'
import { useSelector } from 'react-redux'
import { generatePath, Link, useRouteMatch } from 'react-router-dom';
import { getAllPaths } from '../../redux/selectors/paths'
import TopLinks from '../layout/TopLinks';
import TopLinksWrapper from '../layout/TopLinksWrapper';

function TopBar() {
  const match = useRouteMatch();
  const path = match?.path;
  const pathId = match?.params?.pathId;

  const paths = useSelector(getAllPaths);
  const safePaths = Array.isArray(paths) ? paths : [];

  if (!path) return null;

  const createPath = (id) => generatePath(path, { pathId: id });

  const linksList = safePaths.map(p => ({
    name: p?.name ?? '',
    url: createPath(p?._id),
    id: p?._id
  }));

  if (!linksList.length) return null;

  return (
    <TopLinksWrapper>
      <TopLinks className="top-links-profile-nav" selected={pathId}>
        {linksList.map(link => (
          <Link className="profile-link" key={link.id} to={link.url} id={link.id}>
            {link.name}
          </Link>
        ))}
      </TopLinks>
    </TopLinksWrapper>
  );
}


export default TopBar;
