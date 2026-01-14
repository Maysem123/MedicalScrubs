/**
 * Données des produits - Calots médicaux
 * Base de données locale utilisant les vraies images du dossier assets
 */

const PRODUCTS = [
    {
        id: 1,
        name: "Calot Médical Floral Élégant",
        slug: "calot-floral-elegant",
        category: "Calots Fantaisie",
        price: 25,
        oldPrice: null,
        description: "Calot médical élégant avec motif floral délicat, parfait pour apporter une touche de fraîcheur et de féminité à votre tenue professionnelle. Conçu pour un confort optimal durant les longues heures de travail.",
        features: [
            "Tissu 100% coton respirant",
            "Élastique ajustable à l'arrière",
            "Lavable en machine à 60°C",
            "Séchage rapide",
            "Taille unique ajustable"
        ],
        image: "assets/images/calots/calot-1.jpeg",
        images: ["assets/images/calots/calot-1.jpeg"],
        badge: "Populaire",
        inStock: true,
        featured: true
    },
    {
        id: 2,
        name: "Calot Médical Motifs Tendance",
        slug: "calot-motifs-tendance",
        category: "Calots Fantaisie",
        price: 25,
        oldPrice: null,
        description: "Calot médical avec motifs modernes et tendance. Idéal pour les professionnels de santé souhaitant allier style et fonctionnalité au quotidien.",
        features: [
            "Tissu polyester-coton durable",
            "Coupe ajustée confortable",
            "Résistant aux lavages fréquents",
            "Couleurs stables",
            "Taille unique"
        ],
        image: "assets/images/calots/calot-2.jpeg",
        images: ["assets/images/calots/calot-2.jpeg"],
        badge: "Promo",
        inStock: true,
        featured: true
    },
    {
        id: 3,
        name: "Calot Chirurgical Classique",
        slug: "calot-chirurgical-classique",
        category: "Calots Chirurgicaux",
        price: 25,
        oldPrice: null,
        description: "Calot chirurgical au design classique et professionnel. Parfait pour les blocs opératoires et tous les environnements de soins où l'hygiène est primordiale.",
        features: [
            "Tissu anti-microbien",
            "Absorption optimale de la transpiration",
            "Bandeau absorbant intégré",
            "Attaches ajustables",
            "Certifié pour usage médical"
        ],
        image: "assets/images/calots/calot-3.jpeg",
        images: ["assets/images/calots/calot-3.jpeg"],
        badge: null,
        inStock: true,
        featured: true
    },
    {
        id: 4,
        name: "Calot Médical Design Original",
        slug: "calot-design-original",
        category: "Calots Fantaisie",
        price: 25,
        oldPrice: null,
        description: "Calot médical au design original et coloré, parfait pour apporter de la bonne humeur dans les services de soins, notamment en pédiatrie.",
        features: [
            "Design original et amusant",
            "Tissu doux et confortable",
            "Idéal pour la pédiatrie",
            "Lavable à 40°C",
            "Taille unique ajustable"
        ],
        image: "assets/images/calots/calot-4.jpeg",
        images: ["assets/images/calots/calot-4.jpeg"],
        badge: "Nouveau",
        inStock: true,
        featured: true
    }
];

/**
 * Catégories de produits
 */
const CATEGORIES = [
    { id: "all", name: "Tous les produits", slug: "tous" },
    { id: "fantaisie", name: "Calots Fantaisie", slug: "fantaisie" },
    { id: "chirurgicaux", name: "Calots Chirurgicaux", slug: "chirurgicaux" }
];

/**
 * Informations de la boutique
 */
const STORE_INFO = {
    name: "myhygia",
    tagline: "Calots & Bonnets Médicaux de Qualité",
    description: "Votre spécialiste en calots et bonnets médicaux de qualité pour les professionnels de santé.",
    email: "contact@myhygia.tn",
    phone: "+216 96 025 340",
    whatsapp: "21696025340",
    instagram: "https://www.instagram.com/myhygia/",
    facebook: "https://www.facebook.com/profile.php?id=61580909522665",
    address: "Tunisie",
    currency: "DT",
    currencySymbol: "DT",
    shipping: 7,
    freeShippingThreshold: 100
};

/**
 * Fonctions utilitaires pour les produits
 */
function getProductById(id) {
    return PRODUCTS.find(p => p.id === parseInt(id));
}

function getProductBySlug(slug) {
    return PRODUCTS.find(p => p.slug === slug);
}

function getFeaturedProducts() {
    return PRODUCTS.filter(p => p.featured);
}

function getProductsByCategory(category) {
    if (category === 'all' || category === 'tous') {
        return PRODUCTS;
    }
    return PRODUCTS.filter(p => p.category.toLowerCase().includes(category.toLowerCase()));
}

function formatPrice(price) {
    return `${price} ${STORE_INFO.currencySymbol}`;
}

// Export pour utilisation dans d'autres modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { PRODUCTS, CATEGORIES, STORE_INFO, getProductById, getProductBySlug, getFeaturedProducts, getProductsByCategory, formatPrice };
}
