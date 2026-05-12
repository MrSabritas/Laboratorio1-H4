import React, { useState } from 'react';

const ColorHarmonizer: React.FC = () => {
  const [hue, setHue] = useState<number>(180);

  const getHarmonies = (h: number) => {
    return [
      { type: 'Base', val: `hsl(${h}, 70%, 50%)` },
      { type: 'Complementario', val: `hsl(${(h + 180) % 360}, 70%, 50%)` },
      { type: 'Triada A', val: `hsl(${(h + 120) % 360}, 70%, 50%)` },
      { type: 'Triada B', val: `hsl(${(h + 240) % 360}, 70%, 50%)` },
    ];
  };

  const harmonies = getHarmonies(hue);

  return (
    <section className="section-container">
      <h2>Objeto 2D - Interactivo</h2>
      
      <div className="slider-container">
        <label>Matiz (Hue): {hue}°</label>
        <input
          type="range"
          min="0"
          max="360"
          value={hue}
          onChange={(e) => setHue(Number(e.target.value))}
        />
      </div>

      <div 
        className="main-object-2d" 
        style={{ 
          background: `linear-gradient(135deg, ${harmonies[0].val}, ${harmonies[2].val}, ${harmonies[1].val}, ${harmonies[3].val})`,
          borderRadius: '30px',
          boxShadow: `0 10px 25px rgba(0,0,0,0.3)`
        }}
      />

      <div className="harmonies-grid">
        {harmonies.map((c) => (
          <div key={c.type} className="color-card" style={{ backgroundColor: c.val }}>
            <span className="type">{c.type}</span>
            <span className="val">{c.val}</span>
          </div>
        ))}
      </div>
    </section>
  );
};

export default ColorHarmonizer;
