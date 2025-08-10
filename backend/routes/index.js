import newsRoutes from './news.js';
import eventsRoutes from './events.js';
import footersRoutes from './footers.js';
import achievementsRoutes from './achievements.js';
import employeesRoutes from './employees.js';
import coconutsRoutes from './coconuts.js';
import faqsRoutes from './faqs.js';
import expertsRoutes from './experts.js';
// import newsRoutes from './news.js';
export default [
    { path: '/news', handler: newsRoutes },
    { path: '/events', handler: eventsRoutes },
    { path: '/footers', handler: footersRoutes },
    { path: '/achievements', handler: achievementsRoutes },
    {path: '/employees', handler: employeesRoutes },
    {path: '/faqs', handler: faqsRoutes },
    {path: '/coconuts', handler: coconutsRoutes },
    {path: '/experts', handler: expertsRoutes },
    // { path: '/news', handler: newsRoutes },
];
