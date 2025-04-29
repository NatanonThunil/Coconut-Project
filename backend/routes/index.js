import newsRoutes from './news.js';
import eventsRoutes from './events.js';
// import newsRoutes from './news.js';
// import newsRoutes from './news.js';
export default [
    { path: '/news', handler: newsRoutes },
    { path: '/events', handler: eventsRoutes },
    // { path: '/news', handler: newsRoutes },
    // { path: '/news', handler: newsRoutes },
];
