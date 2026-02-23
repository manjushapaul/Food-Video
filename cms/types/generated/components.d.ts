import type { Schema, Struct } from '@strapi/strapi';

export interface AboutGuestStatsStatItem extends Struct.ComponentSchema {
  collectionName: 'components_about_guest_stats_stat_items';
  info: {
    description: 'Number and short label (e.g. 3, Locations)';
    displayName: 'Stat Item';
    icon: 'hashtag';
  };
  attributes: {
    Label: Schema.Attribute.String & Schema.Attribute.Required;
    Order: Schema.Attribute.Integer & Schema.Attribute.DefaultTo<0>;
    Value: Schema.Attribute.String & Schema.Attribute.Required;
  };
}

export interface AboutVideoFeaturesAboutVideoFeature
  extends Struct.ComponentSchema {
  collectionName: 'components_about_video_features_about_video_features';
  info: {
    description: 'Feature card for about page (icon, title, description)';
    displayName: 'About Video Feature';
    icon: 'star';
  };
  attributes: {
    Description: Schema.Attribute.Text;
    Icon: Schema.Attribute.Media<'images' | 'files' | 'videos' | 'audios'>;
    Order: Schema.Attribute.Integer & Schema.Attribute.DefaultTo<0>;
    Title: Schema.Attribute.String & Schema.Attribute.Required;
  };
}

export interface DeliveryFeaturesDeliveryFeature
  extends Struct.ComponentSchema {
  collectionName: 'components_delivery_features_delivery_features';
  info: {
    description: 'A feature item with icon and text (e.g. Delivery within 30 minutes)';
    displayName: 'Delivery Feature';
    icon: 'bulletList';
  };
  attributes: {
    Icon: Schema.Attribute.Media<'images' | 'files' | 'videos' | 'audios'>;
    Order: Schema.Attribute.Integer & Schema.Attribute.DefaultTo<0>;
    Text: Schema.Attribute.String & Schema.Attribute.Required;
  };
}

export interface FooterFooterInstagramItem extends Struct.ComponentSchema {
  collectionName: 'components_footer_footer_instagram_items';
  info: {
    displayName: 'Footer Instagram Item';
    icon: 'picture';
  };
  attributes: {
    Image: Schema.Attribute.Media<'images'>;
    Link: Schema.Attribute.String;
    Order: Schema.Attribute.Integer & Schema.Attribute.DefaultTo<0>;
  };
}

export interface FooterFooterNavLink extends Struct.ComponentSchema {
  collectionName: 'components_footer_footer_nav_links';
  info: {
    displayName: 'Footer Nav Link';
    icon: 'link';
  };
  attributes: {
    Href: Schema.Attribute.String & Schema.Attribute.Required;
    Label: Schema.Attribute.String & Schema.Attribute.Required;
    Order: Schema.Attribute.Integer & Schema.Attribute.DefaultTo<0>;
  };
}

export interface FooterFooterSocialLink extends Struct.ComponentSchema {
  collectionName: 'components_footer_footer_social_links';
  info: {
    displayName: 'Footer Social Link';
    icon: 'twitter';
  };
  attributes: {
    Href: Schema.Attribute.String & Schema.Attribute.Required;
    Icon: Schema.Attribute.Enumeration<
      ['twitter', 'facebook', 'instagram', 'github']
    > &
      Schema.Attribute.Required;
    Order: Schema.Attribute.Integer & Schema.Attribute.DefaultTo<0>;
  };
}

export interface MenuIconIconLogo extends Struct.ComponentSchema {
  collectionName: 'components_menu_icon_icon_logos';
  info: {
    displayName: 'IconLogo';
  };
  attributes: {
    Icon: Schema.Attribute.Media<'images' | 'files' | 'videos' | 'audios'>;
  };
}

export interface NavigationNavLink extends Struct.ComponentSchema {
  collectionName: 'components_navigation_nav_links';
  info: {
    description: 'A navigation menu link';
    displayName: 'Nav Link';
    icon: 'link';
  };
  attributes: {
    Href: Schema.Attribute.String & Schema.Attribute.Required;
    Label: Schema.Attribute.String & Schema.Attribute.Required;
    Order: Schema.Attribute.Integer & Schema.Attribute.DefaultTo<0>;
  };
}

export interface RestaurantDishes extends Struct.ComponentSchema {
  collectionName: 'components_restaurant_dishes';
  info: {
    displayName: 'dishes';
  };
  attributes: {
    Category: Schema.Attribute.Enumeration<
      ['All', 'Breakfast', 'Main Dishes', 'Drinks', 'Desserts']
    >;
    Description: Schema.Attribute.Text & Schema.Attribute.Required;
    Image: Schema.Attribute.Media<'images' | 'files' | 'videos' | 'audios'> &
      Schema.Attribute.Required;
    Name: Schema.Attribute.String & Schema.Attribute.Required;
    Price: Schema.Attribute.Decimal & Schema.Attribute.Required;
  };
}

export interface RestaurantMenuItems extends Struct.ComponentSchema {
  collectionName: 'components_restaurant_menu_items';
  info: {
    displayName: 'MenuItems';
  };
  attributes: {
    Category: Schema.Attribute.Enumeration<
      ['All', 'Breakfast', 'Main Dishes', 'Drinks', 'Desserts']
    >;
    Description: Schema.Attribute.String;
    Dish: Schema.Attribute.String;
    Image: Schema.Attribute.Media<'images' | 'files' | 'videos' | 'audios'>;
    Price: Schema.Attribute.Decimal;
  };
}

export interface SignatureDishesSignatureDish extends Struct.ComponentSchema {
  collectionName: 'components_signature_dishes_signature_dishes';
  info: {
    description: 'A dish in the signature dishes slider';
    displayName: 'Signature Dish';
    icon: 'dish';
  };
  attributes: {
    Description: Schema.Attribute.Text;
    Image: Schema.Attribute.Media<'images' | 'files' | 'videos' | 'audios'>;
    Name: Schema.Attribute.String & Schema.Attribute.Required;
    Order: Schema.Attribute.Integer & Schema.Attribute.DefaultTo<0>;
    Subtitle: Schema.Attribute.String;
  };
}

declare module '@strapi/strapi' {
  export module Public {
    export interface ComponentSchemas {
      'about-guest-stats.stat-item': AboutGuestStatsStatItem;
      'about-video-features.about-video-feature': AboutVideoFeaturesAboutVideoFeature;
      'delivery-features.delivery-feature': DeliveryFeaturesDeliveryFeature;
      'footer.footer-instagram-item': FooterFooterInstagramItem;
      'footer.footer-nav-link': FooterFooterNavLink;
      'footer.footer-social-link': FooterFooterSocialLink;
      'menu-icon.icon-logo': MenuIconIconLogo;
      'navigation.nav-link': NavigationNavLink;
      'restaurant.dishes': RestaurantDishes;
      'restaurant.menu-items': RestaurantMenuItems;
      'signature-dishes.signature-dish': SignatureDishesSignatureDish;
    }
  }
}
