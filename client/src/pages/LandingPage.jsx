import { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import '../App.css'

function LandingPage() {
    const { t, i18n } = useTranslation();
    const [farms, setFarms] = useState([])
    const [filteredFarms, setFilteredFarms] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)
    const [searchTerm, setSearchTerm] = useState('')
    const [userLocation, setUserLocation] = useState(null)
    const [selectedProduct, setSelectedProduct] = useState(null)
    const [allProducts, setAllProducts] = useState([])

    useEffect(() => {
        // 1. Get User Location
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    setUserLocation({
                        lat: position.coords.latitude,
                        lon: position.coords.longitude
                    });
                },
                (err) => console.log("Location access denied or error:", err)
            );
        }
        fetchFarms();
    }, [])

    // 2. Extract unique products when farms load
    useEffect(() => {
        if (farms.length > 0) {
            const products = new Set();
            farms.forEach(farm => {
                if (farm.products) {
                    farm.products.split(',').forEach(p => products.add(p.trim()));
                }
            });
            setAllProducts(Array.from(products).sort());
        }
    }, [farms]);

    // 3. Filtering & Sorting Logic
    useEffect(() => {
        let result = [...farms];

        // Search Filter
        if (searchTerm) {
            const term = searchTerm.toLowerCase();
            result = result.filter(farm =>
                farm.name.toLowerCase().includes(term) ||
                (farm.location && farm.location.toLowerCase().includes(term)) ||
                (farm.products && farm.products.toLowerCase().includes(term))
            );
        }

        // Product Chip Filter
        if (selectedProduct) {
            result = result.filter(farm =>
                farm.products && farm.products.includes(selectedProduct)
            );
        }

        // Location Sorting (if user location exists)
        if (userLocation) {
            result.forEach(farm => {
                if (farm.latitude && farm.longitude) {
                    farm.distance = calculateDistance(userLocation.lat, userLocation.lon, farm.latitude, farm.longitude);
                } else {
                    farm.distance = Infinity;
                }
            });
            result.sort((a, b) => a.distance - b.distance);
        } else {
            // Default sort by name if no location
            result.sort((a, b) => a.name.localeCompare(b.name));
        }

        setFilteredFarms(result);
    }, [searchTerm, farms, userLocation, selectedProduct]);

    // Haversine Formula for distance in km
    const calculateDistance = (lat1, lon1, lat2, lon2) => {
        const R = 6371; // Radius of the earth in km
        const dLat = deg2rad(lat2 - lat1);
        const dLon = deg2rad(lon2 - lon1);
        const a =
            Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) *
            Math.sin(dLon / 2) * Math.sin(dLon / 2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        return R * c; // Distance in km
    };

    const deg2rad = (deg) => {
        return deg * (Math.PI / 180)
    }

    const fetchFarms = () => {
        fetch('/api/farms')
            .then(res => {
                if (!res.ok) {
                    throw new Error('Network response was not ok');
                }
                return res.json();
            })
            .then(data => {
                setFarms(data)
                setLoading(false)
            })
            .catch(err => {
                console.error("Error:", err)
                setError(t('list.error'))
                setLoading(false)
            })
    }

    const changeLanguage = (lng) => {
        i18n.changeLanguage(lng);
    };

    // Helper to translate a comma-separated string of products
    const translateProducts = (productString) => {
        if (!productString) return "";
        return productString.split(',').map(p => {
            const key = p.trim().toLowerCase();
            const translation = t(`productNames.${key}`);
            return translation !== `productNames.${key}` ? translation : p.trim();
        }).join(', ');
    };

    const translateProductKey = (product) => {
        const key = product.toLowerCase();
        const translation = t(`productNames.${key}`);
        return translation !== `productNames.${key}` ? translation : product;
    }

    return (
        <div className="app-root">
            {/* Header / Nav */}
            <nav className="landing-nav">
                <Link to="/login">Login</Link>
                <div style={{ display: 'flex' }}>
                    <button onClick={() => changeLanguage('fi')} style={{ marginRight: '5px', padding: '5px', background: 'rgba(255,255,255,0.2)', border: 'none', color: 'white', borderRadius: '4px', cursor: 'pointer', fontWeight: i18n.language === 'fi' ? 'bold' : 'normal' }}>FI</button>
                    <button onClick={() => changeLanguage('sv')} style={{ marginRight: '5px', padding: '5px', background: 'rgba(255,255,255,0.2)', border: 'none', color: 'white', borderRadius: '4px', cursor: 'pointer', fontWeight: i18n.language === 'sv' ? 'bold' : 'normal' }}>SV</button>
                    <button onClick={() => changeLanguage('en')} style={{ padding: '5px', background: 'rgba(255,255,255,0.2)', border: 'none', color: 'white', borderRadius: '4px', cursor: 'pointer', fontWeight: i18n.language === 'en' ? 'bold' : 'normal' }}>EN</button>
                </div>
            </nav>

            {/* Hero Section */}
            <div className="hero">
                <div className="hero-content">
                    <h1>{t('hero.title')}</h1>
                    <p>{t('hero.subtitle')}</p>
                    <button className="cta-button" onClick={() => document.getElementById('farm-list').scrollIntoView({ behavior: 'smooth' })}>
                        {t('hero.cta')}
                    </button>
                </div>
            </div>

            {/* Search Section */}
            <div className="search-section">
                {/* Product Filter Chips */}
                {allProducts.length > 0 && (
                    <div className="filter-chips">
                        <span style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--color-text-light)', marginRight: '0.5rem' }}>
                            {t('filters.products')}
                        </span>
                        <button
                            className={`filter-chip ${selectedProduct === null ? 'active' : ''}`}
                            onClick={() => setSelectedProduct(null)}
                        >
                            {t('filters.all')}
                        </button>
                        {allProducts.slice(0, 6).map(product => (
                            <button
                                key={product}
                                className={`filter-chip ${selectedProduct === product ? 'active' : ''}`}
                                onClick={() => setSelectedProduct(selectedProduct === product ? null : product)}
                            >
                                {translateProductKey(product)}
                            </button>
                        ))}
                    </div>
                )}
            </div>

            <main className="container" id="farm-list">
                {loading && <div className="loading">{t('list.loading')}</div>}
                {error && <div className="error">{error}</div>}

                {/* Farm Listing */}
                <div className="farm-grid">
                    {filteredFarms.length > 0 ? (
                        filteredFarms.map(farm => (
                            <div key={farm.id} className="farm-card">
                                <div className="card-header">
                                    <h2>{farm.name}</h2>
                                    <div className="location">
                                        <span>📍</span> {farm.location}
                                        {farm.distance && farm.distance !== Infinity && (
                                            <span className="distance-badge">
                                                {t('location.distance', { km: farm.distance.toFixed(1) })}
                                            </span>
                                        )}
                                    </div>
                                </div>

                                <div className="description">{farm.description || t('card.noDescription')}</div>

                                <div className="products-container">
                                    <div className="products-label">{t('card.productsLabel')}</div>
                                    <div className="products">
                                        {translateProducts(farm.products)}
                                    </div>
                                </div>
                            </div>
                        ))
                    ) : (
                        !loading && <p style={{ gridColumn: '1/-1', textAlign: 'center', fontSize: '1.2rem', color: 'var(--color-text-light)' }}>{t('list.noResults')}</p>
                    )}
                </div>
            </main>

            <footer style={{ textAlign: 'center', padding: '2rem', color: 'var(--color-text-light)', marginTop: '4rem', borderTop: '1px solid var(--color-border)' }}>
                <p>&copy; {new Date().getFullYear()} {t('footer.copyright')}</p>
            </footer>
        </div>
    )
}

export default LandingPage;
