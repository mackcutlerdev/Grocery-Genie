// Dependencies
import React, { Fragment } from 'react';

function SourcesPage()
{
    return (
        <Fragment>
            <div className="container py-3">
                <h1 className="mb-4">Sources</h1>

                {/* Code & Libraries */}
                <div className="card mb-4">
                    <div className="card-body">
                        <h2 className="h4 card-title">Main big stuff</h2>
                        <ul className="list-group list-group-flush mt-3">
                            <li className="list-group-item">
                                <strong>React</strong><br />
                                Used a lot of them, before I realized I needed specific pages<br />
                                <a href="https://react.dev/reference/react/hooks" target="_blank" rel="noopener noreferrer">
                                    https://react.dev/reference/react/hooks
                                </a>
                            </li>

                            <li className="list-group-item">
                                <strong>React Router</strong><br />
                               React Router V5, cause we used that in class so I needed old docs for it, also didn't realize I needed to cite so here's the whole page<br />
                                <a href="https://v5.reactrouter.com/web/api/Hooks" target="_blank" rel="noopener noreferrer">
                                    https://v5.reactrouter.com/web/api/Hooks
                                </a>
                                <a href="https://www.youtube.com/watch?v=TNhaISOUy6Q" target="_blank" rel="noopener noreferrer">
                                    YouTube Fireship!
                                </a>
                            </li>

                            <li className="list-group-item">
                                <strong>Express.js</strong><br />
                                Backend web framework for Node.js<br />
                                <a href="https://expressjs.com/" target="_blank" rel="noopener noreferrer">
                                    https://expressjs.com/
                                </a>
                            </li>

                            <li className="list-group-item">
                                <strong>Bootstrap 5</strong><br />
                                Mainly used for buttons, cards, and forms<br />
                                <a href="https://getbootstrap.com/docs/5.3/forms/overview/" target="_blank" rel="noopener noreferrer">
                                    Forms
                                </a>
                                <a href="https://getbootstrap.com/docs/5.0/components/card/" target="_blank" rel="noopener noreferrer">
                                    Cards
                                </a>
                                <a href="https://getbootstrap.com/docs/5.3/components/buttons/" target="_blank" rel="noopener noreferrer">
                                    Buttons
                                </a>
                            </li>
                        </ul>
                    </div>
                </div>

                {/* Specififc stuff */}
                <div className="card mb-4">
                    <div className="card-body">
                        <h2 className="h4 card-title">Specific stuff</h2>
                        <ul className="list-group list-group-flush mt-3">
                            <li className="list-group-item">
                                <strong>React useState with prevState</strong><br />
                                Learned how to use functional setState to avoid stale state issues<br />
                                <a href="https://stackoverflow.com/questions/55823296/reactjs-prevstate-in-the-new-usestate-react-hook" target="_blank" rel="noopener noreferrer">
                                    Stack Overflow: ReactJS prevState in useState hook
                                </a>
                            </li>

                            <li className="list-group-item">
                                <strong>JavaScript Set.has() performance</strong><br />
                                Learned that Set.has() is O(1) compared to Array.indexOf() O(n) for faster ingredient matching<br />
                                <a href="https://stackoverflow.com/questions/55057200/is-the-set-has-method-o1-and-array-indexof-on" target="_blank" rel="noopener noreferrer">
                                    Stack Overflow: Is Set.has() O(1) and Array.indexOf() O(n)?
                                </a>
                            </li>

                            <li className="list-group-item">
                                <strong>Array.every() method</strong><br />
                                Used to check if all recipe ingredients are available in pantry<br />
                                <a href="https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/every" target="_blank" rel="noopener noreferrer">
                                    MDN Web Docs: Array.prototype.every()
                                </a>
                            </li>

                            <li className="list-group-item">
                                <strong>RegEx: Tokenization approach for ingredient matching</strong><br />
                                My friend from Unix class (and I took it last semester) helped me with the regex tokenization to solve the "salt" vs "unsalted butter" matching problem<br />
                                Uses <code>/[^a-z]+/</code> regex to split ingredient names into tokens, even tho I hate regex <br/>
                                <a href="https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/RegExp" target="_blank" rel="noopener noreferrer">
                                    MDN: RegEx
                                </a>
                            </li>

                            <li className="list-group-item">
                                <strong>Express REST API patterns</strong><br />
                                Course materials and documentation for building CRUD endpoints<br />
                                <a href="https://expressjs.com/en/guide/using-middleware.html" target="_blank" rel="noopener noreferrer">
                                    Express.js Routing Documentation
                                </a>
                            </li>

                            <li className="list-group-item">
                                <strong>Render serving static files in build</strong><br />
                                When trying to serve my app on Render<br />
                                <a href="https://stackoverflow.com/questions/53308128/problem-serving-static-files-with-express" target="_blank" rel="noopener noreferrer">
                                    Stack Overflow: Serving Static Files
                                </a>
                            </li>

                            <li className="list-group-item">
                                <strong>URLSearchParams</strong><br />
                                So I could open a specific part of the page <br/>
                                <a href="https://www.youtube.com/watch?v=KUN0Vkn207k">
                                    YouTube Azul Coding
                                </a>
                            </li>

                            <li className="list-group-item">
                                <strong>Prop Drilling</strong><br />
                                This one seems obvious as it's for the general react archietecture <br/>
                                However it's also used for the controlled inputs and forms, which is in the same link <br/>
                                <a href="https://react.dev/learn/sharing-state-between-components" target="_blank" rel="noopener noreferrer">
                                    React: State Sharing
                                </a><br/>
                                <a href="https://www.youtube.com/watch?v=O6P86uwfdR0" target="_blank" rel="noopener noreferrer">
                                    YouTube useState
                                </a>
                            </li>

                            <li className="list-group-item">
                                <strong>Controlled Inputs & Forms</strong><br />
                                So I could open a specific part of the page <br/>
                                <a href="https://www.youtube.com/watch?v=KUN0Vkn207k">
                                    YouTube Azul Coding
                                </a>
                            </li>

                            <li className="list-group-item">
                                <strong>Mapping</strong><br />
                                I needed to figure out how to map for my many lists and rendering them dynamically<br/>
                                <a href="https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/map">
                                    MDN: .map()
                                </a>
                            </li>
                        </ul>
                    </div>
                </div>

                {/* Images & Assets */}
                <div className="card mb-5">
                    <div className="card-body">
                        <h2 className="h4 card-title">Images & Assets</h2>
                        <p className="card-text">
                            The only image currently is the favicon, which was made by my girlfriend, but I can't link her cause she doesn't post anywhere.
                        </p>
                    </div>
                </div>
            </div>
        </Fragment>
    );
}

export default SourcesPage;