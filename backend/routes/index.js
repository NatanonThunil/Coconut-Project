import newsRoutes from './news.js';
import eventsRoutes from './events.js';
import footersRoutes from './footers.js';
import achievementsRoutes from './achievements.js';
import employeesRoutes from './employees.js';
import e from 'express';
// import newsRoutes from './news.js';
export default [
    { path: '/news', handler: newsRoutes },
    { path: '/events', handler: eventsRoutes },
    { path: '/footers', handler: footersRoutes },
    { path: '/achievements', handler: achievementsRoutes },
    {path: '/employees', handler: employeesRoutes },
    // { path: '/news', handler: newsRoutes },
];
