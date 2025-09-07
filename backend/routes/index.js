import newsRoutes from './news.js';
import eventsRoutes from './events.js';
import footersRoutes from './footers.js';
import achievementsRoutes from './achievements.js';
import employeesRoutes from './employees.js';
import coconutsRoutes from './coconuts.js';
import faqsRoutes from './faqs.js';
import expertsRoutes from './experts.js';
import herobarsRoutes from './herobars.js';
import tagsRoutes from './tags.js';
import pdfUploadRoutes from './pdf-upload.js';
import membersRoutes from './menbers.js'; 
import pestsRoutes from './pests.js';
import chainValuesRoutes from './chian_values.js';
import servicesRoutes from './services.js';
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
    {path: '/herobars', handler: herobarsRoutes },
    {path: '/tags', handler: tagsRoutes },
    {path: '/pdf-upload', handler: pdfUploadRoutes },
    {path: '/members', handler: membersRoutes },
    {path: '/pests', handler: pestsRoutes },
    {path: '/chain-values', handler: chainValuesRoutes },
    {path: '/services', handler: servicesRoutes },
    // { path: '/news', handler: newsRoutes },
];
