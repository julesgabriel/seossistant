const config= {
    content: [
        "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
        "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
        "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    ],
    daisyui: {
        themes: [
            {
                mytheme: {
                    "primary": "#FFD700",      // Jaune Principal
                    "secondary": "#FFF8DC",    // Jaune Clair
                    "accent": "#FFB700",       // Jaune Foncé
                    "neutral": "#D3D3D3",      // Gris Moyen
                    "base": "#f5f5f4",     // Blanc
                    "info": "#FFF8DC",         // Jaune Clair
                    "success": "#00ff00",      // Couleur par défaut
                    "warning": "#FFD700",      // Jaune Principal
                    "error": "#ff0000",        // Couleur par défaut
                    "light-gray": "#F0F0F0",   // Gris Clair
                    "dark-gray": "#A9A9A9",    // Gris Foncé
                    "black": "#000000"     // Noir
                },
            },
        ],
    },
    plugins: [
        require('daisyui'),
    ]
};
export default config;
