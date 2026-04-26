import React, { Fragment } from 'react';

function SourcesPage()
{
    return (
        <Fragment>
            <div className="gg-panel active" id="panel-sources">

                <div className="gg-kicker" style={{ marginBottom: '10px' }}>Attribution</div>
                <div className="gg-panel-heading" style={{ marginBottom: '4px' }}>
                    <em>Sources</em>
                </div>
                <div className="gg-sub-heading" style={{ marginBottom: '28px' }}>
                    Libraries, references &amp; learning material
                </div>

                <div style={{ maxWidth: '740px', display: 'flex', flexDirection: 'column', gap: '14px' }}>

                    {/* Main libraries */}
                    <div className="gg-sources-card">
                        <div className="gg-sources-card-title">Main Libraries</div>

                        <div className="gg-sources-item">
                            <strong>React</strong><br />
                            Used hooks throughout. Referenced heavily before I figured out what pages actually needed.<br />
                            <a href="https://react.dev/reference/react/hooks" target="_blank" rel="noopener noreferrer">react.dev/reference/react/hooks</a>
                        </div>

                        <div className="gg-sources-item">
                            <strong>React Router v5</strong><br />
                            Used v5 since that's what we covered in class.<br />
                            <a href="https://v5.reactrouter.com/web/api/Hooks" target="_blank" rel="noopener noreferrer">v5.reactrouter.com</a>
                            {' · '}
                            <a href="https://www.youtube.com/watch?v=TNhaISOUy6Q" target="_blank" rel="noopener noreferrer">YouTube — Fireship</a>
                        </div>

                        <div className="gg-sources-item">
                            <strong>Express.js</strong><br />
                            Backend web framework for Node.js.<br />
                            <a href="https://expressjs.com/" target="_blank" rel="noopener noreferrer">expressjs.com</a>
                        </div>

                        <div className="gg-sources-item">
                            <strong>Bootstrap 5</strong><br />
                            Mainly used for buttons, cards, and forms.<br />
                            <a href="https://getbootstrap.com/docs/5.3/forms/overview/" target="_blank" rel="noopener noreferrer">Forms</a>
                            {' · '}
                            <a href="https://getbootstrap.com/docs/5.0/components/card/" target="_blank" rel="noopener noreferrer">Cards</a>
                            {' · '}
                            <a href="https://getbootstrap.com/docs/5.3/components/buttons/" target="_blank" rel="noopener noreferrer">Buttons</a>
                        </div>
                    </div>

                    {/* Specific references */}
                    <div className="gg-sources-card">
                        <div className="gg-sources-card-title">Specific References</div>

                        <div className="gg-sources-item">
                            <strong>React useState with prevState</strong><br />
                            Learned functional setState to avoid stale state issues.<br />
                            <a href="https://stackoverflow.com/questions/55823296/reactjs-prevstate-in-the-new-usestate-react-hook" target="_blank" rel="noopener noreferrer">Stack Overflow</a>
                        </div>

                        <div className="gg-sources-item">
                            <strong>JavaScript Set.has() performance</strong><br />
                            Set.has() is O(1) vs Array.indexOf() O(n) — used for faster ingredient matching.<br />
                            <a href="https://stackoverflow.com/questions/55057200/is-the-set-has-method-o1-and-array-indexof-on" target="_blank" rel="noopener noreferrer">Stack Overflow</a>
                        </div>

                        <div className="gg-sources-item">
                            <strong>Array.every()</strong><br />
                            Used to check if all recipe ingredients are available in pantry.<br />
                            <a href="https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/every" target="_blank" rel="noopener noreferrer">MDN — Array.prototype.every()</a>
                        </div>

                        <div className="gg-sources-item">
                            <strong>RegEx tokenization for ingredient matching</strong><br />
                            A friend from Unix class helped with regex tokenization to solve "salt" vs "unsalted butter". Uses{' '}
                            <code style={{ fontFamily: 'var(--f-mono)', fontSize: '12px', background: 'var(--bg-1)', padding: '2px 6px', borderRadius: '4px', color: 'var(--accent)' }}>/[^a-z]+/</code>{' '}
                            to split ingredient names into tokens.<br />
                            <a href="https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/RegExp" target="_blank" rel="noopener noreferrer">MDN — RegExp</a>
                        </div>

                        <div className="gg-sources-item">
                            <strong>Express REST API patterns</strong><br />
                            Course materials and documentation for building CRUD endpoints.<br />
                            <a href="https://expressjs.com/en/guide/using-middleware.html" target="_blank" rel="noopener noreferrer">Express.js Routing Docs</a>
                        </div>

                        <div className="gg-sources-item">
                            <strong>Render — serving static files</strong><br />
                            When deploying to Render.<br />
                            <a href="https://stackoverflow.com/questions/53308128/problem-serving-static-files-with-express" target="_blank" rel="noopener noreferrer">Stack Overflow</a>
                        </div>

                        <div className="gg-sources-item">
                            <strong>URLSearchParams</strong><br />
                            So I could open a specific recipe from the Home page.<br />
                            <a href="https://www.youtube.com/watch?v=KUN0Vkn207k" target="_blank" rel="noopener noreferrer">YouTube — Azul Coding</a>
                        </div>

                        <div className="gg-sources-item">
                            <strong>Prop Drilling &amp; Controlled Inputs</strong><br />
                            General React architecture — controlled inputs and forms.<br />
                            <a href="https://react.dev/learn/sharing-state-between-components" target="_blank" rel="noopener noreferrer">React — State Sharing</a>
                            {' · '}
                            <a href="https://www.youtube.com/watch?v=O6P86uwfdR0" target="_blank" rel="noopener noreferrer">YouTube — useState</a>
                        </div>

                        <div className="gg-sources-item">
                            <strong>Array.map()</strong><br />
                            Needed for dynamic list rendering throughout the app.<br />
                            <a href="https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/map" target="_blank" rel="noopener noreferrer">MDN — Array.prototype.map()</a>
                        </div>
                    </div>

                    {/* Assets */}
                    <div className="gg-sources-card">
                        <div className="gg-sources-card-title">Images &amp; Assets</div>
                        <div className="gg-sources-item">
                            The favicon was made by my girlfriend — she doesn't post anywhere so no link available.
                        </div>
                    </div>

                    <div className="gg-sources-card">
                        <div className="gg-sources-card-title">Other Learning Resources</div>
                        <div className="gg-sources-item">
                            <a href="https://bootstrap.build/app" target="_blank" rel="noopener noreferrer">Bootstrap Builder</a>
                        </div>
                        <div className="gg-sources-item">
                            <a href="https://icons.getbootstrap.com/?q=pencil" target="_blank" rel="noopener noreferrer">Bootstrap Icons</a>
                        </div>
                        <div className="gg-sources-item">
                            <a href="https://www.realtimecolors.com/?colors=e8845a-110c14-1a1018-3d2030-3a5c89&fonts=Inter-Inter" target="_blank" rel="noopener noreferrer">Color Pallette Viewer</a>
                        </div>
                        <div className="gg-sources-item">
                            <a href="https://bootstrapstudio.io/" target="_blank" rel="noopener noreferrer">Bootstrap Studio</a>
                        </div>
                        <div className="gg-sources-item">
                            <a href="https://cssgradient.io/" target="_blank" rel="noopener noreferrer">CSS Gradient</a>
                        </div>
                        <div className="gg-sources-item">
                            <a href="https://www.joshwcomeau.com/css/" target="_blank" rel="noopener noreferrer">Josh W. Comeau's CSS Guide: TONS OF HELP FOR CSS</a>
                        </div>
                        <div className="gg-sources-item">
                            <a href="https://medium.com/css-tutorials/css-spheres-aab1a341deb2" target="_blank" rel="noopener noreferrer">CSS Spheres Tutorial (FOR TEMP LOGO)</a>
                        </div>
                    </div>

                </div>
            </div>
        </Fragment>
    );
}

export default SourcesPage;