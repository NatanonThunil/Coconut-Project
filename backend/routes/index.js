import newsRoutes from './news.js';
import eventsRoutes from './events.js';
import footersRoutes from './footers.js';
// import newsRoutes from './news.js';
export default [
    { path: '/news', handler: newsRoutes },
    { path: '/events', handler: eventsRoutes },
    { path: '/footers', handler: footersRoutes },
    // { path: '/news', handler: newsRoutes },
];
