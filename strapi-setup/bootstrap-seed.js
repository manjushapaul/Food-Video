/**
 * Strapi v5 bootstrap seed – IT services landing (Hero, Features, Testimonials).
 * Copy this into your Strapi project's src/index.js bootstrap, or run the logic
 * after Strapi has started (e.g. in a one-off script with strapi instance).
 *
 * Usage in src/index.js:
 *   const { seedIfEmpty } = require('./path/to/strapi-setup/bootstrap-seed.js');
 *   module.exports = { bootstrap({ strapi }) { return seedIfEmpty(strapi); } };
 */

const heroData = {
  title: 'Transform Your Business with Modern IT Solutions',
  subtitle:
    'We deliver end-to-end technology services—cloud, security, and digital transformation—so you can focus on growth.',
  cta: 'Get started',
  ctaLink: '#contact',
};

const featuresData = [
  {
    title: 'Cloud & Infrastructure',
    desc: 'Migrate and manage workloads on AWS, Azure, or GCP. We design for scale, security, and cost efficiency.',
    order: 1,
  },
  {
    title: 'Cybersecurity',
    desc: 'Protect your data and systems with assessments, monitoring, and compliance-ready security practices.',
    order: 2,
  },
  {
    title: 'Software Development',
    desc: 'Custom web and mobile applications built with modern stacks, agile delivery, and clear roadmaps.',
    order: 3,
  },
  {
    title: 'DevOps & CI/CD',
    desc: 'Automate pipelines, containerize with Docker/Kubernetes, and ship faster with reliable deployments.',
    order: 4,
  },
  {
    title: 'IT Consulting',
    desc: 'Strategy, architecture reviews, and technology selection to align IT with your business goals.',
    order: 5,
  },
];

const testimonialsData = [
  {
    quote:
      'Their team delivered our cloud migration on time and under budget. We now have a scalable, secure infrastructure that supports our growth.',
    author: 'Sarah Chen',
    role: 'CTO',
    company: 'TechFlow Inc.',
    order: 1,
  },
  {
    quote:
      'Outstanding security assessment and remediation. They helped us achieve compliance and gave us peace of mind.',
    author: 'James Mitchell',
    role: 'VP of Operations',
    company: 'HealthFirst',
    order: 2,
  },
  {
    quote:
      'From strategy to implementation, they understood our needs. The new platform has transformed how we serve our customers.',
    author: 'Priya Sharma',
    role: 'Director of Digital',
    company: 'Retail Plus',
    order: 3,
  },
  {
    quote:
      'Professional, responsive, and technically excellent. Our DevOps maturity improved dramatically in just a few months.',
    author: 'Michael Torres',
    role: 'Engineering Lead',
    company: 'ScaleUp Labs',
    order: 4,
  },
  {
    quote:
      'We needed a partner who could handle both infrastructure and application development. They delivered on both.',
    author: 'Emily Watson',
    role: 'Head of Product',
    company: 'Nexus Solutions',
    order: 5,
  },
];

async function seedIfEmpty(strapi) {
  const heroUid = 'api::hero.hero';
  const featureUid = 'api::feature.feature';
  const testimonialUid = 'api::testimonial.testimonial';

  try {
    // Hero (single type): create if none exists
    const existingHero = await strapi.documents(heroUid).findMany({ limit: 1 });
    if (!existingHero || existingHero.length === 0) {
      await strapi.documents(heroUid).create({ data: heroData });
      console.log('[seed] Hero created.');
    }

    // Features: create if none exist
    const existingFeatures = await strapi.documents(featureUid).findMany({ limit: 1 });
    if (!existingFeatures || existingFeatures.length === 0) {
      for (const data of featuresData) {
        await strapi.documents(featureUid).create({ data });
      }
      console.log('[seed] Features created:', featuresData.length);
    }

    // Testimonials: create if none exist
    const existingTestimonials = await strapi.documents(testimonialUid).findMany({ limit: 1 });
    if (!existingTestimonials || existingTestimonials.length === 0) {
      for (const data of testimonialsData) {
        await strapi.documents(testimonialUid).create({ data });
      }
      console.log('[seed] Testimonials created:', testimonialsData.length);
    }
  } catch (e) {
    console.error('[seed] Error:', e.message);
  }
}

module.exports = { seedIfEmpty, heroData, featuresData, testimonialsData };
