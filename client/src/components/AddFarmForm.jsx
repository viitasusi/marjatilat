import { useState } from 'react';

function AddFarmForm({ onFarmAdded }) {
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [location, setLocation] = useState('');
    const [products, setProducts] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch('/api/farms', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ name, description, location, products }),
            });
            if (response.ok) {
                const newFarm = await response.json();
                onFarmAdded(newFarm);
                // Reset form
                setName('');
                setDescription('');
                setLocation('');
                setProducts('');
            } else {
                console.error('Failed to add farm');
            }
        } catch (error) {
            console.error('Error adding farm:', error);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="add-farm-form">
            <h3>Add New Farm</h3>

            <div>
                <label>Name</label>
                <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    placeholder="e.g. Sunny Mead Farm"
                />
            </div>

            <div>
                <label>Location</label>
                <input
                    type="text"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    required
                    placeholder="e.g. Porvoo"
                />
            </div>

            <div>
                <label>Products</label>
                <input
                    type="text"
                    value={products}
                    onChange={(e) => setProducts(e.target.value)}
                    placeholder="e.g. Eggs, Honey"
                />
            </div>

            <div style={{ gridColumn: '1 / -1' }}>
                <label>Description</label>
                <input
                    type="text"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Tell us about your farm..."
                />
            </div>

            <div style={{ gridColumn: '1 / -1', marginTop: '0.5rem' }}>
                <button type="submit">Add Farm</button>
            </div>
        </form>
    );
}

export default AddFarmForm;
