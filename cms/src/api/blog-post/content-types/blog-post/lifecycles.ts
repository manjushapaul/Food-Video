
export default {
    async beforeCreate(event) {
        const { data } = event.params;
        if (data.Featured === true) {
            // Set Featured: false for all other blog posts
            await strapi.db.query('api::blog-post.blog-post').updateMany({
                where: {
                    Featured: true,
                },
                data: { Featured: false },
            });
        }
    },

    async beforeUpdate(event) {
        const { data, where } = event.params;
        if (data.Featured === true) {
            // Set Featured: false for all other blog posts
            await strapi.db.query('api::blog-post.blog-post').updateMany({
                where: {
                    Featured: true,
                    id: { $ne: where.id }
                },
                data: { Featured: false },
            });
        }
    },
};
