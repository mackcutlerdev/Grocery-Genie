// pages/SourcesPage.js
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
                                JavaScript library for building user interfaces<br />
                                <a href="https://react.dev/" target="_blank" rel="noopener noreferrer">
                                    https://react.dev/
                                </a>
                            </li>

                            <li className="list-group-item">
                                <strong>React Router</strong><br />
                                Client-side routing for React applications<br />
                                <a href="https://reactrouter.com/" target="_blank" rel="noopener noreferrer">
                                    https://reactrouter.com/
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
                                CSS framework for styling and responsive design<br />
                                <a href="https://getbootstrap.com/" target="_blank" rel="noopener noreferrer">
                                    https://getbootstrap.com/
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
                                <strong>Tokenization approach for ingredient matching</strong><br />
                                My friend from Unix class (and I took it last semester) helped me with the regex tokenization to solve the "salt" vs "unsalted butter" matching problem<br />
                                Uses <code>/[^a-z]+/</code> regex to split ingredient names into tokens, even tho I hate regex
                            </li>

                            <li className="list-group-item">
                                <strong>Express REST API patterns</strong><br />
                                Course materials and documentation for building CRUD endpoints<br />
                                <a href="https://expressjs.com/en/starter/basic-routing.html" target="_blank" rel="noopener noreferrer">
                                    Express.js Routing Documentation
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