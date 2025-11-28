import { useState } from 'react';
import './App.css';

function App() {
  const [country, setCountry] = useState('');
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setResult(null);

    try {
      const res = await fetch('http://localhost:5000/api/check-tax', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          country,
          amount: Number(amount),
          description,
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Server error');
      }

      const data = await res.json();
      setResult(data);
    } catch (err) {
      setError(err.message || 'Greška.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-container">
      <div className="app-root">
        {/* gornji “navbar” */}
        <header className="top-bar">
          <div className="top-bar-left">
            <span className="logo-dot" />
            <span className="top-title">SheepAI · Compliance Prototype</span>
          </div>
          <div className="top-bar-right">
            <span className="top-pill">Team FFOS</span>
            <span className="top-pill secondary">Hackathon prep</span>
          </div>
        </header>

        {/* glavna kartica */}
        <main className="app-card">
          <section className="app-header">
            <span className="badge">Prototype</span>
            <h1>Mini Tax Compliance Checker</h1>
            <p>
              Unesi osnovne podatke o transakciji i dobiješ brzu procjenu rizika
              koju kasnije možeš proširiti pravim AI-em i AML/CFT pravilima.
            </p>
          </section>

          {/* layout: lijevo forma, desno rezultat */}
          <section className="app-layout">
            <div className="app-left">
              <h2 className="panel-title">Unos transakcije</h2>
              <form className="app-form" onSubmit={handleSubmit}>
                <div className="form-group">
                  <label>Država</label>
                  <input
                    type="text"
                    placeholder="npr. Germany"
                    value={country}
                    onChange={(e) => setCountry(e.target.value)}
                  />
                </div>

                <div className="form-group">
                  <label>Iznos</label>
                  <input
                    type="number"
                    placeholder="npr. 15000"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                  />
                </div>

                <div className="form-group">
                  <label>Opis transakcije</label>
                  <textarea
                    rows={3}
                    placeholder="Kratko opiši transakciju..."
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                  />
                </div>

                {error && <p className="error-text">{error}</p>}

                <button className="primary-btn" type="submit" disabled={loading}>
                  {loading ? 'Provjeravam…' : 'Provjeri rizik'}
                </button>
              </form>
            </div>

            <div className="app-right">
              {result ? (
                <section className="result-card">
                  <div className="result-header">
                    <div>
                      <h2>Rezultat procjene</h2>
                      <p className="result-subtitle">
                        Demo evaluacija – ovdje kasnije ide AI objašnjenje i
                        ML/TF indikatori.
                      </p>
                    </div>
                    <span className={`pill pill-${result.risk || 'low'}`}>
                      {result.risk?.toUpperCase() || 'LOW'}
                    </span>
                  </div>

                  <div className="result-grid">
                    <div>
                      <h3>Osnovni podaci</h3>
                      <p>
                        <strong>Država:</strong> {result.country}
                      </p>
                      <p>
                        <strong>Iznos:</strong> {result.amount}
                      </p>
                      <p>
                        <strong>Opis:</strong> {result.description}
                      </p>
                    </div>

                    <div>
                      <h3>Napomene sustava</h3>
                      <ul>
                        {result.notes?.map((n, i) => (
                          <li key={i}>{n}</li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  <p className="footer-hint">
                    Ovo je demo s ručnom logikom – na hackathonu ovdje ide
                    pravi AI output i compliance engine.
                  </p>
                </section>
              ) : (
                <section className="result-card placeholder">
                  <div className="result-header">
                    <div>
                      <h2>Analiza transakcije</h2>
                      <p className="result-subtitle">
                        Kad uneseš podatke i klikneš <strong>Provjeri rizik</strong>,
                        ovdje će se prikazati procjena rizika i napomene.
                      </p>
                    </div>
                  </div>
                  <p className="placeholder-note">
                    Idealno mjesto za AI sažetak, indikatore pranja novca /
                    financiranja terorizma i preporučene EDD korake.
                  </p>
                </section>
              )}
            </div>
          </section>
        </main>
      </div>
    </div>
  );
}

export default App;
