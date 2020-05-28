export default (components = {}) => [
  {
    path: '/',
    exact: true,
    component: components.PHome
  },
  {
    path: '/about',
    exact: true,
    component: components.PAbout
  },
  {
    path: '/games/:gameId',
    exact: true,
    component: components.PGames
  },
  {
    path: '/control/:gameId',
    exact: true,
    component: components.PControl
  }
]
